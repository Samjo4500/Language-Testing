import { NextRequest, NextResponse } from 'next/server';
import { createPayPalOrder } from '@/lib/paypal';
import { getAuthUser } from '@/lib/auth-middleware';

// Plan pricing configuration
const PLAN_PRICES: Record<string, { amount: number; label: string }> = {
  single: { amount: 12.99, label: 'CEFR English Proficiency Test — Single Test' },
  premium: { amount: 29.99, label: 'CEFR English Proficiency Test — Premium Plan' },
  pro: { amount: 49.99, label: 'CEFR English Proficiency Test — Pro Plan' },
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
    const { planType, currency = 'USD' } = body;

    // Amount is ALWAYS determined server-side from plan type — NEVER trust client amounts
    const planConfig = PLAN_PRICES[planType];
    if (!planConfig) {
      return NextResponse.json(
        { error: 'Invalid plan type. Choose from: single, premium, pro.' },
        { status: 400 }
      );
    }
    const amount = planConfig.amount;
    const description = planConfig.label;

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
