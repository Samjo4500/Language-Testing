import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, requireAdmin } from '@/lib/auth-middleware';
import { adminLimiter } from '@/lib/rate-limit';

/**
 * POST /api/admin/cleanup-seed-users
 * Deletes all users whose email matches seed patterns:
 *   - email LIKE '%@example.com'
 *   - email LIKE '%seed%'
 * Also deletes all related records (certificates, assessments, payments, etc.)
 * and logs the action to the AuditLog table.
 * Requires admin authentication.
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

    // Find all seed users by email pattern
    const seedUsers = await db.user.findMany({
      where: {
        OR: [
          { email: { endsWith: '@example.com' } },
          { email: { contains: 'seed' } },
        ],
      },
      select: { id: true, email: true },
    });

    if (seedUsers.length === 0) {
      return NextResponse.json({
        message: 'No seed users found to delete.',
        deletedCount: 0,
      });
    }

    const seedIds = seedUsers.map((u) => u.id);
    const seedEmails = seedUsers.map((u) => u.email);

    // Delete related records first to avoid foreign-key constraint errors
    // Order matters: child records before parent user rows
    await db.certificate.deleteMany({ where: { userId: { in: seedIds } } });
    await db.assessmentResponse.deleteMany({
      where: { assessment: { userId: { in: seedIds } } },
    });
    await db.assessment.deleteMany({ where: { userId: { in: seedIds } } });
    await db.payment.deleteMany({ where: { userId: { in: seedIds } } });
    await db.emailLog.deleteMany({ where: { userId: { in: seedIds } } });
    await db.pageView.deleteMany({ where: { userId: { in: seedIds } } });
    await db.apiKey.deleteMany({ where: { userId: { in: seedIds } } });
    await db.userVocabProgress.deleteMany({ where: { userId: { in: seedIds } } });
    await db.exerciseAttempt.deleteMany({ where: { userId: { in: seedIds } } });
    await db.languageProfile.deleteMany({ where: { userId: { in: seedIds } } });
    await db.chatRoomMessage.deleteMany({ where: { userId: { in: seedIds } } });
    await db.moment.deleteMany({ where: { userId: { in: seedIds } } });
    await db.notification.deleteMany({ where: { userId: { in: seedIds } } });

    // Delete the seed users themselves
    const result = await db.user.deleteMany({
      where: {
        id: { in: seedIds },
      },
    });

    // Log the action to AuditLog
    await db.auditLog.create({
      data: {
        adminId: authResult.userId,
        action: 'cleanup_seed_users',
        targetType: 'user',
        details: JSON.stringify({
          deletedCount: result.count,
          deletedEmails: seedEmails,
        }),
      },
    });

    return NextResponse.json({
      message: `Successfully deleted ${result.count} seed user(s).`,
      deletedCount: result.count,
      deletedEmails: seedEmails,
    });
  } catch (error) {
    console.error('Cleanup seed users error:', error);
    return NextResponse.json(
      { error: 'Failed to cleanup seed users.' },
      { status: 500 }
    );
  }
}
