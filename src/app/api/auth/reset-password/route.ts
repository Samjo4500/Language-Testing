import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, getJwtSecret } from '@/lib/auth';
import jwt from 'jsonwebtoken';

interface ResetTokenPayload {
  userId: string;
  purpose: string;
  iat: number;
  exp: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, newPassword } = body;

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: 'Token and new password are required.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long.' },
        { status: 400 }
      );
    }
    if (!/[A-Z]/.test(newPassword)) {
      return NextResponse.json(
        { error: 'Password must contain at least one uppercase letter.' },
        { status: 400 }
      );
    }
    if (!/[0-9]/.test(newPassword)) {
      return NextResponse.json(
        { error: 'Password must contain at least one number.' },
        { status: 400 }
      );
    }

    // Verify the reset token
    let decoded: ResetTokenPayload;
    try {
      decoded = jwt.verify(token, getJwtSecret()) as ResetTokenPayload;
    } catch {
      return NextResponse.json(
        { error: 'Invalid or expired reset token. Please request a new one.' },
        { status: 400 }
      );
    }

    // Ensure the token was intended for password reset
    if (decoded.purpose !== 'password_reset') {
      return NextResponse.json(
        { error: 'Invalid token purpose.' },
        { status: 400 }
      );
    }

    // Find the user — use select for schema drift resilience
    const user = await db.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, passwordResetAt: true },
    });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found.' },
        { status: 404 }
      );
    }

    // SECURITY: Check if this token was issued BEFORE the last password reset.
    // If the user already reset their password using a different/newer token,
    // this old token should no longer be valid.
    if (user.passwordResetAt) {
      const tokenIssuedAt = new Date(decoded.iat * 1000);
      if (tokenIssuedAt < user.passwordResetAt) {
        return NextResponse.json(
          { error: 'This reset token has already been used. Please request a new one.' },
          { status: 400 }
        );
      }
    }

    // Hash the new password
    const passwordHash = await hashPassword(newPassword);

    // Update the user's password AND record the reset timestamp AND increment tokenVersion
    // Incrementing tokenVersion invalidates ALL existing JWTs for this user,
    // forcing them to log in again with the new password
    await db.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        passwordResetAt: new Date(), // Invalidate any older reset tokens
        tokenVersion: { increment: 1 }, // Invalidate all existing JWTs
      },
    });

    return NextResponse.json({
      message: 'Password has been reset successfully. You can now log in with your new password.',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}
