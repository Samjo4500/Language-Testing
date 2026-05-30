import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendEmailVerification } from '@/lib/email';
import { getJwtSecret } from '@/lib/auth';
import { authLimiter } from '@/lib/rate-limit';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  // Rate limit: prevent abuse
  const limitError = authLimiter(request);
  if (limitError) return limitError;

  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required.' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true, email: true, name: true, emailVerified: true },
    });

    // Don't reveal whether user exists (security best practice)
    if (!user || user.emailVerified) {
      return NextResponse.json({
        success: true,
        message: 'If an account exists with that email and needs activation, a new activation link has been sent.',
      });
    }

    // Generate a new verification token
    const verificationToken = jwt.sign(
      { userId: user.id, purpose: 'email_verification' },
      getJwtSecret(),
      { expiresIn: '24h' }
    );

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://testcefr.com';
    const verificationLink = `${appUrl}/verify-email?token=${verificationToken}`;

    // Send verification email (fire-and-forget)
    sendEmailVerification(
      user.name || user.email.split('@')[0],
      user.email,
      verificationLink,
      user.id
    ).catch((err) => console.error('Resend activation email error:', err));

    return NextResponse.json({
      success: true,
      message: 'A new activation link has been sent to your email.',
    });
  } catch (error) {
    console.error('Resend activation error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}
