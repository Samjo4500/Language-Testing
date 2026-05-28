import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdmin();

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '25', 10)));
    const status = searchParams.get('status') || undefined;

    // Query the EmailQueue model for pending/scheduled emails
    const where: Record<string, unknown> = {};
    if (status) where.status = status;

    const [queueItems, total] = await Promise.all([
      db.emailQueue.findMany({
        where,
        select: {
          id: true,
          userId: true,
          to: true,
          emailType: true,
          status: true,
          sendAt: true,
          sentAt: true,
          error: true,
          payload: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { sendAt: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.emailQueue.count({ where }),
    ]);

    const formatted = queueItems.map((item) => ({
      id: item.id,
      userId: item.userId,
      recipientEmail: item.to,
      recipientName: item.user?.name || '',
      emailType: item.emailType,
      status: item.status,
      scheduledFor: item.sendAt.toISOString(),
      sentAt: item.sentAt?.toISOString() || null,
      error: item.error || null,
      payload: item.payload ? JSON.parse(item.payload) : null,
      createdAt: item.createdAt.toISOString(),
    }));

    return NextResponse.json({
      queue: formatted,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json(
        { error: error.message === 'UNAUTHORIZED' ? 'Unauthorized' : 'Forbidden' },
        { status: error.message === 'UNAUTHORIZED' ? 401 : 403 }
      );
    }
    console.error('[Admin Email Queue API Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
