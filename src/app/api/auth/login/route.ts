import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyPassword, generateTokens } from '@/lib/auth';
import { authLimiter } from '@/lib/rate-limit';
import { setAuthCookies } from '@/lib/cookie-auth';

export async function POST(request: NextRequest) {
  // Rate limit: 10 login attempts per 15 minutes per IP
  const limitError = authLimiter(request);
  if (limitError) return limitError;

  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // Check if user is suspended
    if (user.isSuspended) {
      return NextResponse.json(
        { error: 'Account suspended', message: 'Your account has been suspended. Please contact support.' },
        { status: 403 }
      );
    }

    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      plan: user.plan,
      role: user.role,
      tokenVersion: user.tokenVersion,
    });

    const response = NextResponse.json({
      user: {
        userId: user.id,
        email: user.email,
        name: user.name,
        plan: user.plan,
        role: user.role,
        accountType: user.accountType,
        organizationName: user.organizationName,
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
    setAuthCookies(response, tokens.accessToken, tokens.refreshToken);
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}
