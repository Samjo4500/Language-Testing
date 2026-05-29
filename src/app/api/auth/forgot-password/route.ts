import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { send as sendBrandedPasswordReset } from '@/lib/email/templates/password-reset';
import { authLimiter } from '@/lib/rate-limit';
import { getJwtSecret } from '@/lib/auth';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  // Rate limit: 10 password reset requests per 15 minutes per IP
  const limitError = authLimiter(request);
  if (limitError) return limitError;

  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email address is required.' },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        message: 'If an account with that email exists, we have sent a password reset link.',
      });
    }

    // Generate a reset token (JWT with 1-hour expiry)
    const resetToken = jwt.sign(
      { userId: user.id, purpose: 'password_reset' },
      getJwtSecret(),
      { expiresIn: '1h' }
    );

    // Build the reset link
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://testcefr.com';
    const resetLink = `${appUrl}/reset-password?token=${resetToken}`;

    // Send the branded password reset email
    try {
      await sendBrandedPasswordReset(user.email, {
        firstName: user.name || 'there',
        resetUrl: resetLink,
      });
    } catch (err) {
      console.error('Password reset email send error:', err);
    }

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
