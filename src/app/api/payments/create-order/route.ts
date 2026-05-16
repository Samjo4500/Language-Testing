import { NextRequest, NextResponse } from 'next/server';
import { createPayPalOrder } from '@/lib/paypal';
import { getAuthUser } from '@/lib/auth-middleware';

// Plan pricing configuration
const PLAN_PRICES: Record<string, { amount: number; label: string }> = {
  single: { amount: 9.99, label: 'CEFR English Proficiency Test — Single Test' },
  premium: { amount: 19.99, label: 'CEFR English Proficiency Test — Premium Plan' },
  pro: { amount: 29.99, label: 'CEFR English Proficiency Test — Pro Plan' },
};

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
    const { planType = 'single', amount: customAmount, currency = 'USD' } = body;

    // Determine the amount from plan type, or use custom amount for backwards compat
    const planConfig = PLAN_PRICES[planType];
    const amount = customAmount || (planConfig ? planConfig.amount : 9.99);
    const description = planConfig ? planConfig.label : 'CEFR English Proficiency Test';

    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount.' },
        { status: 400 }
      );
    }

    const order = await createPayPalOrder(amount, currency, description, planType);

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
