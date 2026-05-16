import { NextRequest, NextResponse } from 'next/server';
import { createPayPalOrder } from '@/lib/paypal';
import { getAuthUser } from '@/lib/auth-middleware';

export async function POST(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'You must be logged in to create a payment.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { amount = 9.99, currency = 'USD' } = body;

    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount.' },
        { status: 400 }
      );
    }

    const order = await createPayPalOrder(amount, currency);

    return NextResponse.json({
      orderID: order.id,
      status: order.status,
    });
  } catch (error) {
    console.error('Create PayPal order error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment order. Please try again.' },
      { status: 500 }
    );
  }
}
