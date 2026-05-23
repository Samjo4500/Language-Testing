import { NextRequest, NextResponse } from 'next/server';
import { capturePayPalOrder } from '@/lib/paypal';
import { getAuthUser, verifyTokenVersion } from '@/lib/auth-middleware';
import { db } from '@/lib/db';
import { generateTokens } from '@/lib/auth';
import { sendPaymentConfirmation, sendAdminNewPayment } from '@/lib/email';
import { setAuthCookies } from '@/lib/cookie-auth';
import { PLAN_CONFIG } from '@/lib/plans';
import { trackPurchaseServerSide } from '@/lib/analytics';
import { paymentLimiter } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  // Rate limit: 5 payment requests per minute per IP
  const limitError = paymentLimiter(request);
  if (limitError) return limitError;

  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'You must be logged in to complete a payment.' },
        { status: 401 }
      );
    }

    // Verify token version (rejects tokens issued before logout/password change)
    const versionError = await verifyTokenVersion(user);
    if (versionError) return versionError;

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

    // SECURITY: Verify the captured amount matches the expected price for the plan
    // This prevents attackers from creating a $0.01 PayPal order and capturing it with planType=pro
    const expectedAmount = config.expectedAmount;
    if (Math.abs(amount - expectedAmount) > 0.02) {
      console.error(`Amount mismatch: expected $${expectedAmount} for ${planType}, captured $${amount}. OrderID: ${orderID}`);
      return NextResponse.json(
        { error: 'Payment amount does not match the selected plan. Please contact support.' },
        { status: 400 }
      );
    }

    // Calculate plan expiry
    const planExpiresAt = config.expiryDays
      ? new Date(Date.now() + config.expiryDays * 24 * 60 * 60 * 1000)
      : null;

    // Determine the user's new plan level
    // single → premium (paid plan with certificate access), premium → premium, pro → pro
    const planLevel = planType === 'pro' ? 'pro' : 'premium';

    // Save payment and update user atomically in a transaction
    const { payment, dbUser } = await db.$transaction(async (tx) => {
      const payment = await tx.payment.create({
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

      const dbUser = await tx.user.update({
        where: { id: user.userId },
        data: {
          plan: planLevel,
          testCredits: { increment: config.credits },
          ...(planExpiresAt ? { planExpiresAt } : {}),
        },
      });

      return { payment, dbUser };
    });

    // Send payment confirmation email (fire-and-forget)
    if (dbUser) {
      sendPaymentConfirmation(
        dbUser.name || dbUser.email.split('@')[0],
        dbUser.email,
        config.planName,
        amount,
        captureId || orderID,
        dbUser.id
      ).catch((err) => console.error('Payment confirmation email error:', err));

      // Notify admin of new payment (fire-and-forget)
      sendAdminNewPayment(
        dbUser.name || dbUser.email.split('@')[0],
        dbUser.email,
        config.planName,
        amount,
        captureId || orderID
      ).catch((err) => console.error('Admin new payment email error:', err));
    }

    // Server-side purchase tracking via GA4 Measurement Protocol (fire-and-forget)
    // This ensures purchase events are captured even if ad-blockers prevent client-side JS
    const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    const gaApiSecret = process.env.GA_API_SECRET;
    if (gaMeasurementId && gaApiSecret) {
      trackPurchaseServerSide({
        measurementId: gaMeasurementId,
        apiSecret: gaApiSecret,
        clientId: `${user.userId}.${Date.now()}`,
        transactionId: captureId || orderID,
        value: amount,
        currency,
        planType,
        userId: user.userId,
      }).catch((err) => console.error('GA4 server-side purchase tracking error:', err));
    }

    // Generate new JWT tokens with updated plan so user gets premium access immediately
    // Without this, the old JWT still says plan='free' for up to 24 hours
    const tokens = generateTokens({
      userId: user.userId,
      email: user.email,
      plan: planLevel,
      role: user.role,
      tokenVersion: dbUser?.tokenVersion ?? user.tokenVersion,
    });

    const response = NextResponse.json({
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
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      message: `Payment completed successfully! Your account has been upgraded to ${config.planName} with ${config.credits} test credit${config.credits > 1 ? 's' : ''}.`,
    });
    setAuthCookies(response, tokens.accessToken, tokens.refreshToken);
    return response;
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
