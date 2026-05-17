import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, generateTokens } from '@/lib/auth';

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

    // Generate new access token with current user data
    const tokens = generateTokens({
      userId: payload.userId,
      email: payload.email,
      plan: payload.plan,
      role: payload.role,
    });

    return NextResponse.json({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
