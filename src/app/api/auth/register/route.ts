import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, generateTokens, getJwtSecret } from '@/lib/auth';
import { sendWelcomeEmail, sendEmailVerification, sendAdminNewUser } from '@/lib/email';
import { authLimiter } from '@/lib/rate-limit';
import { setAuthCookies } from '@/lib/cookie-auth';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  // Rate limit: 10 registrations per 15 minutes per IP
  const limitError = authLimiter(request);
  if (limitError) return limitError;

  try {
    const body = await request.json();
    const { email, password, name, accountType, organizationName } = body;

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

    // Validate accountType if provided
    const validAccountTypes = ['individual', 'university', 'business'];
    const sanitizedAccountType = validAccountTypes.includes(accountType) ? accountType : 'individual';

    const isB2B = sanitizedAccountType === 'university' || sanitizedAccountType === 'business';

    const user = await db.user.create({
      data: {
        email,
        name: name || null,
        passwordHash,
        plan: 'free',
        role,
        accountType: sanitizedAccountType,
        organizationName: isB2B ? (organizationName || null) : null,
      },
    });

    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      plan: user.plan,
      role: user.role,
      tokenVersion: user.tokenVersion,
    });

    // Send welcome email (fire-and-forget)
    sendWelcomeEmail(user.name || user.email.split('@')[0], user.email, user.id).catch((err) =>
      console.error('Welcome email send error:', err)
    );

    // Notify admin of new user signup (fire-and-forget)
    sendAdminNewUser(
      user.name || user.email.split('@')[0],
      user.email,
      sanitizedAccountType,
      user.organizationName || undefined
    ).catch((err) => console.error('Admin new user email error:', err));

    // Generate email verification token (24-hour expiry)
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
    ).catch((err) => console.error('Verification email send error:', err));

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
    }, { status: 201 });
    setAuthCookies(response, tokens.accessToken, tokens.refreshToken);
    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}
