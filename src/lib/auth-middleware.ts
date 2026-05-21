import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, TokenPayload } from './auth';
import { db } from './db';

export function getAuthUser(request: NextRequest): TokenPayload | null {
  // Priority 1: HttpOnly cookie (secure, server-set)
  const cookieToken = request.cookies.get('access_token')?.value;
  if (cookieToken && cookieToken !== 'null' && cookieToken !== 'undefined') {
    const payload = verifyToken(cookieToken);
    if (payload) return payload;
  }

  // Priority 2: Authorization header (backward compatibility)
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    if (token && token !== 'null' && token !== 'undefined') {
      return verifyToken(token);
    }
  }

  return null;
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

/**
 * Verify that the token's tokenVersion matches the user's current tokenVersion in the database.
 * If they don't match, the token was issued before a logout/password change and should be rejected.
 *
 * This is an async check that should be used in security-critical routes:
 * - Assessment start/submit
 * - Payment capture
 * - Certificate generation
 * - Admin routes
 *
 * Returns null if the token is valid, or a NextResponse error if invalid.
 */
export async function verifyTokenVersion(user: TokenPayload): Promise<NextResponse | null> {
  if (!user.tokenVersion && user.tokenVersion !== 0) {
    // Token was issued before tokenVersion was added — allow it (backward compatibility)
    return null;
  }

  try {
    const dbUser = await db.user.findUnique({
      where: { id: user.userId },
      select: { tokenVersion: true },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found.' },
        { status: 401 }
      );
    }

    if (user.tokenVersion !== dbUser.tokenVersion) {
      // Token version mismatch — this token was issued before a logout/password reset
      return NextResponse.json(
        { error: 'Session expired. Please log in again.', code: 'TOKEN_VERSION_MISMATCH' },
        { status: 401 }
      );
    }

    return null; // Token is valid
  } catch {
    // DB error — FAIL CLOSED for security. If we can't verify the token version,
    // the token might have been invalidated (logout/password reset) and we must reject it.
    // This prevents invalidated tokens from being used when the database is temporarily unreachable.
    console.error('Failed to verify token version — rejecting token for security (fail-closed)');
    return NextResponse.json(
      { error: 'Unable to verify session. Please try again.', code: 'TOKEN_VERSION_CHECK_FAILED' },
      { status: 401 }
    );
  }
}
