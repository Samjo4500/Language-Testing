import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, TokenPayload } from './auth';

export function getAuthUser(request: NextRequest): TokenPayload | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  if (!token || token === 'null' || token === 'undefined') {
    return null;
  }

  return verifyToken(token);
}

export function requireAuth(request: NextRequest): TokenPayload | NextResponse {
  const user = getAuthUser(request);
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized', message: 'You must be logged in to access this resource.' },
      { status: 401 }
    );
  }
  return user;
}

export function requirePremium(user: TokenPayload): NextResponse | null {
  if (user.plan !== 'premium' && user.plan !== 'pro') {
    return NextResponse.json(
      { error: 'Payment Required', message: 'You need a premium plan to access this feature. Please purchase a plan to continue.', code: 'PAYMENT_REQUIRED' },
      { status: 402 }
    );
  }
  return null;
}

export function requireAdmin(user: TokenPayload): NextResponse | null {
  if (user.role !== 'admin') {
    return NextResponse.json(
      { error: 'Forbidden', message: 'Admin access required.' },
      { status: 403 }
    );
  }
  return null;
}
