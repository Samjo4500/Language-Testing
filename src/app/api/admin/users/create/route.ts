import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, requireAdmin } from '@/lib/auth-middleware';
import { hashPassword } from '@/lib/auth';
import { adminLimiter } from '@/lib/rate-limit';

/**
 * POST /api/admin/users/create/
 * Create a new user manually from the admin panel.
 */
export async function POST(request: NextRequest) {
  // Rate limit
  const limitError = adminLimiter(request);
  if (limitError) return limitError;

  try {
    // Auth check
    const authResult = getAuthUser(request);
    if (!authResult) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const adminCheck = requireAdmin(authResult);
    if (adminCheck) return adminCheck;

    const body = await request.json();
    const { email, name, password, plan, role, country, testCredits, emailVerified, isDemo } = body;

    // Validate required fields
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required.' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format.' },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Password is required.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters.' },
        { status: 400 }
      );
    }

    // Validate plan
    const validPlan = plan || 'free';
    if (!['free', 'premium', 'pro'].includes(validPlan)) {
      return NextResponse.json(
        { error: 'Invalid plan. Must be "free", "premium", or "pro".' },
        { status: 400 }
      );
    }

    // Validate role
    const validRole = role || 'user';
    if (!['user', 'admin'].includes(validRole)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be "user" or "admin".' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await db.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existingUser) {
      return NextResponse.json(
        { error: 'A user with this email already exists.' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Determine test credits
    const credits = testCredits !== undefined
      ? Number(testCredits)
      : (validPlan === 'free' ? 0 : 999);

    // Create user
    const user = await db.user.create({
      data: {
        email: email.toLowerCase(),
        name: name || null,
        passwordHash,
        plan: validPlan,
        role: validRole,
        country: country || null,
        testCredits: credits,
        emailVerified: emailVerified !== undefined ? Boolean(emailVerified) : true,
        isDemo: isDemo !== undefined ? Boolean(isDemo) : false,
      },
      select: {
        id: true,
        email: true,
        name: true,
        plan: true,
        role: true,
        isDemo: true,
        emailVerified: true,
        testCredits: true,
        country: true,
        tokenVersion: true,
        planExpiresAt: true,
        passwordResetAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json(
      { error: 'Failed to create user.' },
      { status: 500 }
    );
  }
}
