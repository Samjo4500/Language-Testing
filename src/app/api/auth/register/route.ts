import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, generateTokens } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists.' },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    // Check if this is the first user — make them admin
    const userCount = await db.user.count();
    const role = userCount === 0 ? 'admin' : 'user';

    const user = await db.user.create({
      data: {
        email,
        name: name || null,
        passwordHash,
        plan: 'free',
        role,
      },
    });

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
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}
