import { NextRequest, NextResponse } from 'next/server';
import { capturePayPalOrder, getPayPalMode } from '@/lib/paypal';
import { getAuthUser } from '@/lib/auth-middleware';
import { db } from '@/lib/db';

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
    const { orderID } = body;

    if (!orderID) {
      return NextResponse.json(
        { error: 'Order ID is required.' },
        { status: 400 }
      );
    }

    // Capture the payment via PayPal API
    // Backend dynamically switches Base URL based on PAYPAL_MODE
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

    // Save payment to database
    const payment = await db.payment.create({
      data: {
        userId: user.userId,
        paypalOrderId: orderID,
        paypalCaptureId: captureId,
        amount,
        currency,
        status: 'completed',
        plan: 'premium',
      },
    });

    // Upgrade user to premium
    await db.user.update({
      where: { id: user.userId },
      data: { plan: 'premium' },
    });

    return NextResponse.json({
      success: true,
      payment: {
        id: payment.id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        plan: payment.plan,
      },
      message: 'Payment completed successfully! Your account has been upgraded to Premium.',
    });
  } catch (error) {
    console.error('Capture payment error:', error);
    return NextResponse.json(
      { error: 'Failed to capture payment. Please contact support.' },
      { status: 500 }
    );
  }
}
