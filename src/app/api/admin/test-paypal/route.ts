import { NextRequest, NextResponse } from 'next/server';
import { getPayPalAccessToken, getPayPalMode } from '@/lib/paypal';
import { getAuthUser, requireAdmin } from '@/lib/auth-middleware';
import { adminLimiter } from '@/lib/rate-limit';

export async function GET(request: NextRequest) {
  // Rate limit: 60 requests per minute per IP
  const limitError = adminLimiter(request);
  if (limitError) return limitError;

  try {
    // Admin-only endpoint
    const authResult = getAuthUser(request);
    if (!authResult) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const adminCheck = requireAdmin(authResult);
    if (adminCheck) return adminCheck;

    const mode = getPayPalMode();
    const token = await getPayPalAccessToken();

    if (!token) {
      return NextResponse.json({
        status: 'error',
        message: 'Failed to obtain PayPal access token.',
        mode,
      }, { status: 500 });
    }

    return NextResponse.json({
      status: 'ok',
      message: `PayPal ${mode} mode connection is working.`,
      mode,
      tokenPrefix: token.substring(0, 10) + '...',
    });
  } catch (error) {
    console.error('PayPal test error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'PayPal connection test failed.',
      mode: getPayPalMode(),
    }, { status: 500 });
  }
}
