import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser } from '@/lib/auth-middleware';

export async function GET(request: NextRequest) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
    const page = Math.max(parseInt(searchParams.get('page') || '1'), 1);
    const skip = (page - 1) * limit;

    const [notifications, unreadCount] = await Promise.all([
      db.notification.findMany({
        where: { userId: authUser.userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip,
      }),
      db.notification.count({
        where: { userId: authUser.userId, isRead: false },
      }),
    ]);

    return NextResponse.json({ notifications, unreadCount });
  } catch (error) {
    console.error('Get notifications error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { notificationIds, markAllRead } = body;

    if (markAllRead) {
      await db.notification.updateMany({
        where: { userId: authUser.userId, isRead: false },
        data: { isRead: true },
      });
      return NextResponse.json({ success: true });
    }

    if (notificationIds && Array.isArray(notificationIds) && notificationIds.length > 0) {
      await db.notification.updateMany({
        where: {
          id: { in: notificationIds },
          userId: authUser.userId,
        },
        data: { isRead: true },
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: 'Provide notificationIds array or markAllRead: true' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Mark notifications error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
