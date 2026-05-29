import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/live-rooms/trending — Trending rooms (most participants recently)
export async function GET() {
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const rooms = await db.liveRoom.findMany({
      where: {
        status: 'active',
        createdAt: { gte: oneHourAgo },
      },
      include: {
        host: { select: { id: true, name: true, avatarUrl: true } },
      },
      orderBy: [
        { participantCount: 'desc' },
        { totalJoins: 'desc' },
      ],
      take: 10,
    });

    return NextResponse.json({ rooms });
  } catch (error: any) {
    console.error('[live-rooms/trending] GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
