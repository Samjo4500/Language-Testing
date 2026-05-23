import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, requireAdmin } from '@/lib/auth-middleware';
import { adminLimiter } from '@/lib/rate-limit';

/**
 * DELETE /api/admin/users/clear-demo/
 * Delete all users where isDemo = true.
 * This is a destructive action — only available to admins.
 */
export async function DELETE(request: NextRequest) {
  const limitError = adminLimiter(request);
  if (limitError) return limitError;

  try {
    const authResult = getAuthUser(request);
    if (!authResult) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const adminCheck = requireAdmin(authResult);
    if (adminCheck) return adminCheck;

    // Count demo users first
    const demoCount = await db.user.count({
      where: { isDemo: true },
    });

    if (demoCount === 0) {
      return NextResponse.json({
        message: 'No demo accounts to delete.',
        deletedCount: 0,
      });
    }

    // Delete demo users. We need to delete related records first to avoid FK constraints.
    // Get demo user IDs
    const demoUsers = await db.user.findMany({
      where: { isDemo: true },
      select: { id: true },
    });
    const demoIds = demoUsers.map(u => u.id);

    // Delete related records in order (certificates → assessments → payments → emailLogs → pageViews → apiKeys → user)
    // Using deleteMany with in clause
    await db.certificate.deleteMany({ where: { userId: { in: demoIds } } });
    await db.assessmentResponse.deleteMany({ where: { assessment: { userId: { in: demoIds } } } });
    await db.assessment.deleteMany({ where: { userId: { in: demoIds } } });
    await db.payment.deleteMany({ where: { userId: { in: demoIds } } });
    await db.emailLog.deleteMany({ where: { userId: { in: demoIds } } });
    await db.pageView.deleteMany({ where: { userId: { in: demoIds } } });
    await db.apiKey.deleteMany({ where: { userId: { in: demoIds } } });

    // Now delete the users
    const result = await db.user.deleteMany({
      where: { isDemo: true },
    });

    return NextResponse.json({
      message: `Successfully deleted ${result.count} demo account(s).`,
      deletedCount: result.count,
    });
  } catch (error) {
    console.error('Clear demo accounts error:', error);
    return NextResponse.json(
      { error: 'Failed to clear demo accounts.' },
      { status: 500 }
    );
  }
}
