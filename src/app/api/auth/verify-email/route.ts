import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';
import { authLimiter } from '@/lib/rate-limit';

const JWT_SECRET = process.env.JWT_SECRET || '';

interface VerifyTokenPayload {
  userId: string;
  purpose: string;
  iat: number;
  exp: number;
}

export async function POST(request: NextRequest) {
  // Rate limit: prevent brute-force of verification tokens
  const limitError = authLimiter(request);
  if (limitError) return limitError;

  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required.' },
        { status: 400 }
      );
    }

    // Verify the token
    let decoded: VerifyTokenPayload;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as VerifyTokenPayload;
    } catch {
      return NextResponse.json(
        { error: 'Invalid or expired verification token. Please request a new one.' },
        { status: 400 }
      );
    }

    // Ensure the token was intended for email verification
    if (decoded.purpose !== 'email_verification') {
      return NextResponse.json(
        { error: 'Invalid token purpose.' },
        { status: 400 }
      );
    }

    // Find the user
    const user = await db.user.findUnique({ where: { id: decoded.userId } });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found.' },
        { status: 404 }
      );
    }

    // Already verified
    if (user.emailVerified) {
      return NextResponse.json({
        message: 'Email is already verified.',
      });
    }

    // Mark email as verified
    await db.user.update({
      where: { id: user.id },
      data: { emailVerified: true },
    });

    return NextResponse.json({
      message: 'Email verified successfully.',
    });
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}
