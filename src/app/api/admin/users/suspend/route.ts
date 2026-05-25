import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, requireAdmin } from '@/lib/auth-middleware';
import { adminLimiter } from '@/lib/rate-limit';

/**
 * POST /api/admin/users/suspend/
 * Suspend or unsuspend a user account.
 * Body: { userId: string, isSuspended: boolean, reason?: string }
 * Suspended users cannot log in or take tests.
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
    const { userId, isSuspended, reason } = body;

    if (!userId || typeof isSuspended !== 'boolean') {
      return NextResponse.json(
        { error: 'userId and isSuspended (boolean) are required.' },
        { status: 400 }
      );
    }

    // Prevent self-suspension
    if (userId === authResult.userId) {
      return NextResponse.json(
        { error: 'You cannot suspend your own account.' },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    // Update user suspension status and invalidate their sessions
    await db.user.update({
      where: { id: userId },
      data: {
        isSuspended,
        tokenVersion: { increment: 1 }, // Force re-login
      },
    });

    return NextResponse.json({
      message: isSuspended
        ? `User ${user.email} has been suspended.${reason ? ` Reason: ${reason}` : ''}`
        : `User ${user.email} has been unsuspended.`,
      isSuspended,
    });
  } catch (error) {
    console.error('Suspend user error:', error);
    return NextResponse.json(
      { error: 'Failed to update suspension status.' },
      { status: 500 }
    );
  }
}
