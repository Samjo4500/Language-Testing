import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, requireAdmin } from '@/lib/auth-middleware';
import { adminLimiter } from '@/lib/rate-limit';

/**
 * GET /api/admin/notifications
 * Returns admin notifications (recent email logs) with unread count.
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

    // Get unread count
    const unreadCount = await db.emailLog.count({
      where: { isRead: false },
    });

    // Get recent notifications (latest 50)
    const notifications = await db.emailLog.findMany({
      where: {
        // Show admin-facing types and recent user emails
        type: {
          in: [
            'admin_new_user',
            'admin_new_payment',
            'welcome',
            'verification',
            'password_reset',
            'payment',
            'certificate',
            'assessment',
            'contact_auto_reply',
          ],
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({
      unreadCount,
      notifications: notifications.map((n) => ({
        id: n.id,
        to: n.to,
        from: n.from,
        subject: n.subject,
        type: n.type,
        status: n.status,
        isRead: n.isRead,
        createdAt: n.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('Notifications fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications.' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/notifications
 * Mark notifications as read.
 * Body: { markAll?: boolean, id?: string, notificationIds?: string[] }
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
    const { markAll, id, notificationIds } = body;

    if (markAll) {
      await db.emailLog.updateMany({
        where: { isRead: false },
        data: { isRead: true },
      });
      return NextResponse.json({ success: true, marked: 'all' });
    }

    // Support both single id and array of notificationIds
    const idsToMark: string[] = [];
    if (notificationIds && Array.isArray(notificationIds)) {
      idsToMark.push(...notificationIds.filter((nid: unknown) => typeof nid === 'string'));
    }
    if (id && typeof id === 'string') {
      idsToMark.push(id);
    }

    if (idsToMark.length > 0) {
      await db.emailLog.updateMany({
        where: { id: { in: idsToMark } },
        data: { isRead: true },
      });
      return NextResponse.json({ success: true, marked: idsToMark });
    }

    return NextResponse.json({ error: 'Provide markAll, id, or notificationIds' }, { status: 400 });
  } catch (error) {
    console.error('Notifications update error:', error);
    return NextResponse.json(
      { error: 'Failed to update notifications.' },
      { status: 500 }
    );
  }
}
