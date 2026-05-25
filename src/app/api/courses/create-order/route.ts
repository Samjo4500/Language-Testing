import { NextRequest, NextResponse } from 'next/server';
import { createPayPalOrder } from '@/lib/paypal';
import { getAuthUser } from '@/lib/auth-middleware';
import { COURSE_PRICES } from '@/lib/courses';
import { paymentLimiter } from '@/lib/rate-limit';

// POST /api/courses/create-order/ — Create PayPal order for course (AUTH REQUIRED)
export async function POST(request: NextRequest) {
  // Rate limit
  const limitError = paymentLimiter(request);
  if (limitError) return limitError;

  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'You must be logged in to create a payment.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { slug, currency = 'USD' } = body;

    // Validate slug and get server-side price
    const courseConfig = COURSE_PRICES[slug];
    if (!courseConfig) {
      return NextResponse.json(
        { error: 'Invalid course. Choose from: beginner, intermediate, advanced, bundle.' },
        { status: 400 }
      );
    }

    const amount = courseConfig.amount;
    const description = courseConfig.label;

    const order = await createPayPalOrder(amount, currency, description, `course-${slug}`);

    return NextResponse.json({
      orderID: order.id,
      status: order.status,
    });
  } catch (error) {
    console.error('Create course PayPal order error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment order. Please try again.' },
      { status: 500 }
    );
  }
}
