import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { rateLimit, AUTH_LIMITS } from '@/lib/rate-limit';
import { sendPasswordReset } from '@/lib/email';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-me';

export async function POST(request: NextRequest) {
  // Rate limit: 5 forgot-password attempts per 15 minutes per IP
  const rl = rateLimit(request, 'forgot-password', AUTH_LIMITS);
  if (!rl.allowed) return rl.response!;

  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email address is required.' },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({ where: { email } });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        message: 'If an account with that email exists, we have sent a password reset link.',
      });
    }

    // Generate a reset token (JWT with 1-hour expiry)
    const resetToken = jwt.sign(
      { userId: user.id, purpose: 'password_reset' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Build the reset link
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://testcefr.com';
    const resetLink = `${appUrl}/reset-password?token=${resetToken}`;

    // Send the email
    await sendPasswordReset(user.name || user.email.split('@')[0], user.email, resetLink);

    return NextResponse.json({
      message: 'If an account with that email exists, we have sent a password reset link.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}
