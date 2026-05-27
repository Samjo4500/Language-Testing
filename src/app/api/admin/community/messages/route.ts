import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdmin();

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '25', 10)));
    const roomId = searchParams.get('roomId') || undefined;
    const flagged = searchParams.get('flagged') === 'true' ? true : undefined;

    const where: Record<string, unknown> = {};
    if (roomId) where.roomId = roomId;
    if (flagged !== undefined) where.isDeleted = flagged;

    const [messages, total] = await Promise.all([
      db.chatRoomMessage.findMany({
        where,
        select: {
          id: true,
          userId: true,
          userName: true,
          content: true,
          roomId: true,
          type: true,
          isDeleted: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          room: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.chatRoomMessage.count({ where }),
    ]);

    // Check for flagged reports for these messages
    const messageIds = messages.map((m) => m.id);
    const reports = messageIds.length > 0
      ? await db.report.findMany({
          where: {
            targetType: 'message',
            targetId: { in: messageIds },
          },
          select: { targetId: true, id: true },
        })
      : [];

    const reportCountMap = new Map<string, number>();
    for (const r of reports) {
      const cnt = reportCountMap.get(r.targetId) || 0;
      reportCountMap.set(r.targetId, cnt + 1);
    }

    const formattedMessages = messages.map((m) => ({
      id: m.id,
      userId: m.userId,
      content: m.content,
      roomId: m.roomId,
      roomName: m.room?.name || '',
      isDeleted: m.isDeleted,
      isFlagged: (reportCountMap.get(m.id) || 0) > 0,
      createdAt: m.createdAt.toISOString(),
      user: {
        id: m.user.id,
        name: m.user.name || '',
        email: m.user.email,
      },
      reportsCount: reportCountMap.get(m.id) || 0,
    }));

    return NextResponse.json({
      messages: formattedMessages,
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
    console.error('[Admin Community Messages API Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
