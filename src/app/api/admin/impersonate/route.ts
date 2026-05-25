import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, requireAdmin } from '@/lib/auth-middleware';
import { generateTokens } from '@/lib/auth';
import { setAuthCookies } from '@/lib/cookie-auth';
import { adminLimiter } from '@/lib/rate-limit';

/**
 * POST /api/admin/impersonate/
 * Admin logs in as a specific user for debugging.
 * Body: { userId: string }
 * Sets new auth cookies for the target user.
 * Returns the user info so the admin UI can redirect.
 */
export async function POST(request: NextRequest) {
  const limitError = adminLimiter(request);
  if (limitError) return limitError;

  try {
    const authResult = getAuthUser(request);
    if (!authResult) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const adminCheck = requireAdmin(authResult);
    if (adminCheck) return adminCheck;

    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: 'userId is required.' }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true, email: true, name: true, plan: true, role: true,
        isSuspended: true, tokenVersion: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    if (user.isSuspended) {
      return NextResponse.json({ error: 'Cannot impersonate a suspended user.' }, { status: 400 });
    }

    // Generate tokens for the target user
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
      plan: user.plan,
      tokenVersion: user.tokenVersion,
    });

    // Set auth cookies for the impersonated user
    const response = NextResponse.json({
      message: `Now impersonating ${user.email}`,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        plan: user.plan,
        role: user.role,
      },
      adminEmail: authResult.email, // Track who initiated the impersonation
    });

    setAuthCookies(response, tokens.accessToken, tokens.refreshToken);

    return response;
  } catch (error) {
    console.error('Impersonate user error:', error);
    return NextResponse.json(
      { error: 'Failed to impersonate user.' },
      { status: 500 }
    );
  }
}
