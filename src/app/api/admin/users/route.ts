import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, requireAdmin } from '@/lib/auth-middleware';
import { adminLimiter } from '@/lib/rate-limit';

/**
 * GET /api/admin/users
 * List users with pagination and search.
 * Query params: page, limit, search (by email or name)
 */
export async function GET(request: NextRequest) {
  // Rate limit: 60 requests per minute per IP
  const limitError = adminLimiter(request);
  if (limitError) return limitError;

  try {
    const authResult = getAuthUser(request);
    if (!authResult) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const adminCheck = requireAdmin(authResult);
    if (adminCheck) return adminCheck;

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const search = searchParams.get('search')?.trim() || '';

    const where = search
      ? {
          OR: [
            { email: { contains: search, mode: 'insensitive' as const } },
            { name: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      db.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          plan: true,
          role: true,
          isDemo: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              assessments: true,
              certificates: true,
              payments: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.user.count({ where }),
    ]);

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('List users error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users.' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/users
 * Update a user's role or plan.
 * Body: { userId: string, role?: string, plan?: string }
 * For password resets, use POST /api/admin/users/reset-password instead.
 */
export async function PATCH(request: NextRequest) {
  // Rate limit: 60 requests per minute per IP
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
    const { userId, role, plan } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required.' },
        { status: 400 }
      );
    }

    if (!role && !plan) {
      return NextResponse.json(
        { error: 'At least one of role or plan must be provided.' },
        { status: 400 }
      );
    }

    // Validate role if provided
    if (role && !['user', 'admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be "user" or "admin".' },
        { status: 400 }
      );
    }

    // Validate plan if provided
    if (plan && !['free', 'premium', 'pro'].includes(plan)) {
      return NextResponse.json(
        { error: 'Invalid plan. Must be "free", "premium", or "pro".' },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (role) updateData.role = role;
    if (plan) updateData.plan = plan;

    await db.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json({ message: 'User updated successfully.' });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Failed to update user.' },
      { status: 500 }
    );
  }
}
