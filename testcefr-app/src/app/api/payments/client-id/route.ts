import { NextResponse } from 'next/server';
import { getPayPalClientId } from '@/lib/paypal';

export async function GET() {
  try {
    const clientId = getPayPalClientId();
    if (!clientId) {
      return NextResponse.json(
        { error: 'PayPal Client ID is not configured.' },
        { status: 500 }
      );
    }
    return NextResponse.json({ clientId });
  } catch (error) {
    console.error('Get PayPal client ID error:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
