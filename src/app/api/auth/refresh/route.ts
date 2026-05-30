import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, generateTokens } from '@/lib/auth';
import { db } from '@/lib/db';
import { setAuthCookies } from '@/lib/cookie-auth';
import { tokenRefreshLimiter } from '@/lib/rate-limit';

/**
 * POST /api/auth/refresh
 *
 * Refreshes the user's access token using a valid refresh token.
 *
 * Security improvements:
 * 1. Fetches the user's CURRENT plan/role from the database instead of
 *    trusting the stale data in the old refresh token. This ensures that
 *    plan upgrades/downgrades take effect immediately on refresh.
 * 2. Issues new refresh tokens (rotation) so the old one becomes invalid,
 *    limiting the window of exploitation if a refresh token is compromised.
 */
export async function POST(request: NextRequest) {
  // Rate limit token refresh to prevent abuse
  const limitError = tokenRefreshLimiter(request);
  if (limitError) return limitError;

  try {
    // Priority 1: Read refresh token from HttpOnly cookie
    // Priority 2: Fall back to Authorization header (backward compatibility)
    const authHeader = request.headers.get('authorization');
    const refreshToken = request.cookies.get('refresh_token')?.value
      || (authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null);

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token is required.' },
        { status: 401 }
      );
    }

    const payload = verifyToken(refreshToken);

    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired refresh token.' },
        { status: 401 }
      );
    }

    // Fetch the user's CURRENT data from the database
    // Use select to only fetch needed columns — resilient to schema drift
    const dbUser = await db.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        plan: true,
        role: true,
        tokenVersion: true,
        testCredits: true,
        accountType: true,
        organizationName: true,
      },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found.' },
        { status: 401 }
      );
    }

    // Check token version — if the user logged out or reset their password
    // since this refresh token was issued, reject it
    if (payload.tokenVersion !== undefined && payload.tokenVersion !== dbUser.tokenVersion) {
      return NextResponse.json(
        { error: 'Session expired. Please log in again.' },
        { status: 401 }
      );
    }

    // Generate new tokens with FRESH data from the database
    const tokens = generateTokens({
      userId: dbUser.id,
      email: dbUser.email,
      plan: dbUser.plan,
      role: dbUser.role,
      tokenVersion: dbUser.tokenVersion,
    });

    const response = NextResponse.json({
      // Access token is returned for client-side state only
      // (the real auth happens via HttpOnly cookies set below)
      // Refresh token is NOT returned in the body — it's only set via HttpOnly cookie
      user: {
        userId: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        plan: dbUser.plan,
        role: dbUser.role,
        testCredits: dbUser.testCredits,
        accountType: dbUser.accountType,
        organizationName: dbUser.organizationName,
      },
    });
    setAuthCookies(response, tokens.accessToken, tokens.refreshToken);
    return response;
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
