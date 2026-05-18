import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, AUTH_LIMITS } from '@/lib/rate-limit';
import { db } from '@/lib/db';
import { verifyPassword, generateTokens } from '@/lib/auth';

export async function POST(request: NextRequest) {
  // Rate limit: 5 login attempts per 15 minutes per IP
  const rl = rateLimit(request, 'login', AUTH_LIMITS);
  if (!rl.allowed) return rl.response!;

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

    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      plan: user.plan,
      role: user.role,
    });

    return NextResponse.json({
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
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}
