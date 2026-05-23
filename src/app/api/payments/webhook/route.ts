import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import crypto from 'crypto';

/**
 * PayPal Webhook Handler
 *
 * Handles PayPal webhook events for payment disputes, refunds, and chargebacks.
 * When a buyer disputes a charge or receives a refund, this endpoint:
 * 1. Verifies the webhook signature to prevent spoofing
 * 2. Downgrades the user's plan back to 'free'
 * 3. Marks the payment as refunded
 *
 * To activate:
 * 1. Go to PayPal Developer Dashboard → My Apps & Sandboxes → Webhooks
 * 2. Subscribe to: PAYMENT.SALE.REFUNDED, PAYMENT.DISPUTE.CREATED, PAYMENT.CAPTURE.REFUNDED
 * 3. Set the webhook URL to: https://testcefr.com/api/payments/webhook
 * 4. Set PAYPAL_WEBHOOK_ID env var to the webhook ID from PayPal
 */

const PAYPAL_WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID || '';
const PAYPAL_MODE = process.env.PAYPAL_MODE || 'sandbox';

/**
 * Verify the PayPal webhook signature.
 * This prevents attackers from sending fake dispute/refund events.
 *
 * PayPal signature verification uses the transmission details + webhook ID + certificate.
 * For full production security, implement the full verification flow documented at:
 * https://developer.paypal.com/api/rest/webhooks/rest/#verify-webhook-signature
 */
async function verifyWebhookSignature(
  request: NextRequest,
  body: string,
): Promise<boolean> {
  // If no webhook ID configured, fail closed in production (security)
  // Only skip verification in development mode
  if (!PAYPAL_WEBHOOK_ID) {
    if (process.env.NODE_ENV === 'production') {
      console.error('PAYPAL_WEBHOOK_ID not set in production — rejecting webhook for security');
      return false;
    }
    console.warn('PAYPAL_WEBHOOK_ID not set in development — skipping webhook signature verification');
    return true;
  }

  const transmissionId = request.headers.get('paypal-transmission-id');
  const transmissionTime = request.headers.get('paypal-transmission-time');
  const certUrl = request.headers.get('paypal-cert-url');
  const authAlgo = request.headers.get('paypal-auth-algo');
  const actualSig = request.headers.get('paypal-transmission-sig');

  if (!transmissionId || !transmissionTime || !certUrl || !actualSig) {
    console.error('Missing PayPal webhook signature headers');
    return false;
  }

  // Validate certUrl to prevent SSRF attacks
  const allowedCertUrls = ['https://api.paypal.com/', 'https://api-m.paypal.com/', 'https://api.sandbox.paypal.com/', 'https://api-m.sandbox.paypal.com/'];
  if (!allowedCertUrls.some(url => certUrl!.startsWith(url))) {
    console.error('Invalid PayPal cert URL:', certUrl);
    return false;
  }

  try {
    // Step 1: Fetch the PayPal certificate
    const certResponse = await fetch(certUrl);
    if (!certResponse.ok) {
      console.error('Failed to fetch PayPal cert:', certResponse.status);
      return false;
    }
    const certPem = await certResponse.text();

    // Step 2: Construct the expected signature string
    // Format: transmission_id|transmission_time|webhook_id|crc32(body)
    const expectedSigString = `${transmissionId}|${transmissionTime}|${PAYPAL_WEBHOOK_ID}|${crc32(Buffer.from(body))}`;

    // Step 3: Verify the signature using the certificate
    const verifier = crypto.createVerify(authAlgo === 'SHA256' ? 'RSA-SHA256' : 'RSA-SHA1');
    verifier.update(expectedSigString);
    verifier.end();

    const sigBuffer = Buffer.from(actualSig, 'base64');
    return verifier.verify(certPem, sigBuffer);
  } catch (err) {
    console.error('Webhook signature verification error:', err);
    return false;
  }
}

/**
 * Simple CRC32 implementation for PayPal webhook verification.
 * PayPal uses CRC32 of the raw body as part of the signature string.
 */
function crc32(buf: Buffer): number {
  let crc = 0xFFFFFFFF;
  const table = new Int32Array(256);

  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }

  for (let i = 0; i < buf.length; i++) {
    crc = table[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
  }

  return (crc ^ 0xFFFFFFFF) >>> 0;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();

    // Verify the webhook signature
    const isValid = await verifyWebhookSignature(request, body);
    if (!isValid) {
      console.error('PayPal webhook signature verification failed');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Parse the event
    let event: any;
    try {
      event = JSON.parse(body);
    } catch {
      console.error('Failed to parse PayPal webhook body');
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const eventType = event.event_type;

    console.debug(`PayPal webhook received: ${eventType}`);

    // Handle refund events
    if (
      eventType === 'PAYMENT.SALE.REFUNDED' ||
      eventType === 'PAYMENT.CAPTURE.REFUNDED'
    ) {
      await handleRefund(event);
    }

    // Handle dispute events
    if (eventType === 'PAYMENT.DISPUTE.CREATED' || eventType === 'PAYMENT.DISPUTE.UPDATED') {
      await handleDispute(event);
    }

    // Always return 200 OK to acknowledge receipt (PayPal retries on non-200)
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('PayPal webhook processing error:', error);
    // Still return 200 to prevent PayPal from retrying unnecessarily
    return NextResponse.json({ received: true });
  }
}

/**
 * Handle a refund event — mark payment as refunded and downgrade the user.
 */
async function handleRefund(event: any) {
  try {
    const saleId = event.resource?.sale_id || event.resource?.id || '';
    const captureId = event.resource?.capture_id || event.resource?.id || '';
    const refundAmount = parseFloat(event.resource?.amount?.value || '0');

    // Find the payment by PayPal capture ID or order ID
    const payment = await db.payment.findFirst({
      where: {
        OR: [
          { paypalCaptureId: captureId },
          { paypalCaptureId: saleId },
          { paypalOrderId: saleId },
        ],
        status: 'completed',
      },
    });

    if (!payment) {
      console.warn(`No completed payment found for refund. Capture/Sale ID: ${captureId || saleId}`);
      return;
    }

    // Check if refund is partial (less than full payment amount)
    const isPartialRefund = refundAmount > 0 && refundAmount < payment.amount;

    if (isPartialRefund) {
      // For partial refunds, just mark the payment — don't downgrade
      await db.payment.update({
        where: { id: payment.id },
        data: {
          status: 'partially_refunded',
          updatedAt: new Date(),
        },
      });
      console.debug(`Partial refund processed for payment ${payment.id}: $${refundAmount} of $${payment.amount}`);
      return;
    }

    // Full refund — mark payment and downgrade user
    await db.$transaction(async (tx) => {
      // Update payment status
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: 'refunded',
          updatedAt: new Date(),
        },
      });

      // Downgrade user's plan to free
      await tx.user.update({
        where: { id: payment.userId },
        data: {
          plan: 'free',
          // Don't revoke test credits — they may have been earned through other means
          // But set plan expiry to now
          planExpiresAt: new Date(),
        },
      });
    });

    console.debug(`Full refund processed for payment ${payment.id}. User ${payment.userId} downgraded to free.`);
  } catch (error) {
    console.error('Error handling refund event:', error);
  }
}

/**
 * Handle a dispute event — mark payment as disputed and downgrade user.
 */
async function handleDispute(event: any) {
  try {
    const disputeId = event.resource?.dispute_id || event.resource?.id || '';
    const disputeStatus = event.resource?.status || '';

    // For created disputes, immediately downgrade to prevent continued access
    if (event.event_type === 'PAYMENT.DISPUTE.CREATED') {
      // Try to find the payment by the dispute's transaction ID
      const transactionId = event.resource?.disputed_transactions?.[0]?.item_id || '';

      const payment = await db.payment.findFirst({
        where: {
          OR: [
            { paypalCaptureId: transactionId },
            { paypalOrderId: transactionId },
          ],
          status: { in: ['completed', 'partially_refunded'] },
        },
      });

      if (!payment) {
        console.warn(`No payment found for dispute ${disputeId}. Transaction ID: ${transactionId}`);
        return;
      }

      // Mark as disputed and downgrade
      await db.$transaction(async (tx) => {
        await tx.payment.update({
          where: { id: payment.id },
          data: {
            status: 'disputed',
            updatedAt: new Date(),
          },
        });

        // Check if user has any other active (non-refunded) premium payments
        const activePayments = await tx.payment.count({
          where: {
            userId: payment.userId,
            status: 'completed',
            id: { not: payment.id },
          },
        });

        // Only downgrade if no other active payments exist
        if (activePayments === 0) {
          await tx.user.update({
            where: { id: payment.userId },
            data: {
              plan: 'free',
              planExpiresAt: new Date(),
            },
          });
        }
      });

      console.debug(`Dispute ${disputeId} processed for payment ${payment.id}. Status: ${disputeStatus}`);
    }
  } catch (error) {
    console.error('Error handling dispute event:', error);
  }
}
