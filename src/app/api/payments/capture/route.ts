import { NextRequest, NextResponse } from 'next/server';
import { capturePayPalOrder, getPayPalMode } from '@/lib/paypal';
import { getAuthUser } from '@/lib/auth-middleware';
import { db } from '@/lib/db';
import { sendPaymentConfirmation } from '@/lib/email';

// Plan configuration: credits, expiry, display name
const PLAN_CONFIG: Record<string, { credits: number; planName: string; expiryDays: number | null }> = {
  single: { credits: 1, planName: 'Single Test', expiryDays: null },
  premium: { credits: 3, planName: 'Premium', expiryDays: 90 },
  pro: { credits: 6, planName: 'Pro', expiryDays: 90 },
};

export async function POST(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'You must be logged in to complete a payment.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { orderID, planType: requestedPlanType } = body;

    if (!orderID) {
      return NextResponse.json(
        { error: 'Order ID is required.' },
        { status: 400 }
      );
    }

    // Capture the payment via PayPal API
    const captureResult = await capturePayPalOrder(orderID);

    if (captureResult.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'Payment capture failed.', status: captureResult.status },
        { status: 400 }
      );
    }

    // Extract capture details
    const capture = captureResult.purchase_units[0]?.payments?.captures?.[0];
    const captureId = capture?.id || '';
    const amount = parseFloat(capture?.amount?.value || '0');
    const currency = capture?.amount?.currency_code || 'USD';

    // Determine plan type from request body or from PayPal custom_id / reference_id
    const planType = normalizePlanType(
      requestedPlanType ||
      captureResult.purchase_units[0]?.custom_id ||
      captureResult.purchase_units[0]?.reference_id ||
      'single'
    );

    const config = PLAN_CONFIG[planType] || PLAN_CONFIG.single;

    // Calculate plan expiry
    const planExpiresAt = config.expiryDays
      ? new Date(Date.now() + config.expiryDays * 24 * 60 * 60 * 1000)
      : null;

    // Determine the user's new plan level
    const planLevel = planType === 'pro' ? 'pro' : planType === 'premium' ? 'premium' : 'free';

    // Save payment to database
    const payment = await db.payment.create({
      data: {
        userId: user.userId,
        paypalOrderId: orderID,
        paypalCaptureId: captureId,
        amount,
        currency,
        status: 'completed',
        plan: planLevel,
        planType,
        testsIncluded: config.credits,
      },
    });

    // Update user: upgrade plan, add test credits, set expiry
    const dbUser = await db.user.findUnique({ where: { id: user.userId } });
    const currentCredits = dbUser?.testCredits || 0;

    await db.user.update({
      where: { id: user.userId },
      data: {
        plan: planLevel,
        testCredits: currentCredits + config.credits,
        ...(planExpiresAt ? { planExpiresAt } : {}),
      },
    });

    // Send payment confirmation email (fire-and-forget)
    if (dbUser) {
      sendPaymentConfirmation(
        dbUser.name || dbUser.email.split('@')[0],
        dbUser.email,
        config.planName,
        amount,
        captureId || orderID
      ).catch((err) => console.error('Payment confirmation email error:', err));
    }

    return NextResponse.json({
      success: true,
      payment: {
        id: payment.id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        plan: payment.plan,
        planType: payment.planType,
        testsIncluded: payment.testsIncluded,
      },
      message: `Payment completed successfully! Your account has been upgraded to ${config.planName} with ${config.credits} test credit${config.credits > 1 ? 's' : ''}.`,
    });
  } catch (error) {
    console.error('Capture payment error:', error);
    return NextResponse.json(
      { error: 'Failed to capture payment. Please contact support.' },
      { status: 500 }
    );
  }
}

/**
 * Normalize the plan type string to one of: "single", "premium", "pro"
 */
function normalizePlanType(raw: string): string {
  const lowered = raw.toLowerCase().trim();
  if (lowered === 'pro') return 'pro';
  if (lowered === 'premium') return 'premium';
  // Default to single for any unknown value
  return 'single';
}
