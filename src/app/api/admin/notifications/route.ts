import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, requireAdmin } from '@/lib/auth-middleware';
import { db } from '@/lib/db';

const ADMIN_NOTIFICATION_TYPES = [
  'contact_notification',
  'b2b_notification',
  'admin_new_user',
  'admin_new_payment',
  'admin_certificate',
];

// GET /api/admin/notifications — Returns unread count + 10 most recent admin-relevant email logs
export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminCheck = requireAdmin(user);
    if (adminCheck) return adminCheck;

    const [unreadCount, notifications] = await Promise.all([
      db.emailLog.count({
        where: {
          type: { in: ADMIN_NOTIFICATION_TYPES },
          isRead: false,
        },
      }),
      db.emailLog.findMany({
        where: {
          type: { in: ADMIN_NOTIFICATION_TYPES },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ]);

    return NextResponse.json({ unreadCount, notifications });
  } catch (error) {
    console.error('Admin notifications GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/notifications — Mark notifications as read
export async function PATCH(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminCheck = requireAdmin(user);
    if (adminCheck) return adminCheck;

    const body = await request.json();
    const { notificationIds, markAll } = body as {
      notificationIds?: string[];
      markAll?: boolean;
    };

    if (markAll) {
      await db.emailLog.updateMany({
        where: {
          type: { in: ADMIN_NOTIFICATION_TYPES },
          isRead: false,
        },
        data: { isRead: true },
      });
      return NextResponse.json({ success: true, message: 'All notifications marked as read' });
    }

    if (notificationIds && Array.isArray(notificationIds) && notificationIds.length > 0) {
      await db.emailLog.updateMany({
        where: {
          id: { in: notificationIds },
          type: { in: ADMIN_NOTIFICATION_TYPES },
        },
        data: { isRead: true },
      });
      return NextResponse.json({ success: true, message: `${notificationIds.length} notification(s) marked as read` });
    }

    return NextResponse.json(
      { error: 'Provide notificationIds array or markAll: true' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Admin notifications PATCH error:', error);
    return NextResponse.json(
      { error: 'Failed to update notifications' },
      { status: 500 }
    );
  }
}
