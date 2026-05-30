import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, requireAdmin } from '@/lib/auth-middleware';

/**
 * GET /api/admin/email-logs
 * Returns email log entries with pagination and filtering.
 */
export async function GET(request: NextRequest) {
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
    const type = searchParams.get('type') || 'all';
    const status = searchParams.get('status') || 'all';

    const where: any = {};
    if (type !== 'all') where.type = type;
    if (status !== 'all') where.status = status;

    const [logs, total] = await Promise.all([
      db.emailLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: {
            select: { id: true, email: true, name: true },
          },
        },
      }),
      db.emailLog.count({ where }),
    ]);

    // Stats
    const [totalSent, totalFailed, totalSkipped, todayCount, todayFailed] = await Promise.all([
      db.emailLog.count({ where: { status: 'sent' } }),
      db.emailLog.count({ where: { status: 'failed' } }),
      db.emailLog.count({ where: { status: 'skipped' } }),
      db.emailLog.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      db.emailLog.count({
        where: {
          status: 'failed',
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
    ]);

    // Recent 5 for notification badge (include isRead)
    const recentLogs = await db.emailLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        to: true,
        subject: true,
        type: true,
        status: true,
        isRead: true,
        createdAt: true,
      },
    });

    // Unread count for notification badge
    const adminTypes = [
      'contact_notification',
      'b2b_notification',
      'admin_new_user',
      'admin_new_payment',
      'admin_certificate',
    ];
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@testcefr.com';
    const unreadCount = await db.emailLog.count({
      where: {
        isRead: false,
        OR: [
          { type: { in: adminTypes } },
          { to: ADMIN_EMAIL },
        ],
      },
    });

    return NextResponse.json({
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        totalSent,
        totalFailed,
        totalSkipped,
        todayCount,
        todayFailed,
        successRate: (totalSent + totalFailed + totalSkipped) > 0
          ? Math.round((totalSent / (totalSent + totalFailed + totalSkipped)) * 100)
          : 0,
        unreadCount,
      },
      recent: recentLogs,
    });
  } catch (error) {
    console.error('Admin email-logs error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email logs.' },
      { status: 500 }
    );
  }
}
