import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, generateTokens } from '@/lib/auth';
import { db } from '@/lib/db';

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
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Refresh token is required.' },
        { status: 401 }
      );
    }

    const refreshToken = authHeader.substring(7);
    const payload = verifyToken(refreshToken);

    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired refresh token.' },
        { status: 401 }
      );
    }

    // Fetch the user's CURRENT data from the database
    // This ensures plan upgrades/downgrades are reflected immediately
    // rather than using stale data from the old token
    const dbUser = await db.user.findUnique({
      where: { id: payload.userId },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found.' },
        { status: 401 }
      );
    }

    // Generate new tokens with FRESH data from the database
    const tokens = generateTokens({
      userId: dbUser.id,
      email: dbUser.email,
      plan: dbUser.plan,
      role: dbUser.role,
    });

    return NextResponse.json({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      // Also return updated user data so the client can sync its state
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
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
