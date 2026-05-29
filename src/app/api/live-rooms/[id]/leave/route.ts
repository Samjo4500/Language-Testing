import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-middleware';
import { db } from '@/lib/db';

/**
 * POST /api/live-rooms/[id]/leave
 * Leave room
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;
    const user = authResult;

    const { id } = await params;

    const participant = await db.liveRoomParticipant.findUnique({
      where: { roomId_userId: { roomId: id, userId: user.userId } },
    });

    if (!participant || participant.leftAt) {
      return NextResponse.json({ error: 'Not in room.' }, { status: 400 });
    }

    const now = new Date();
    const duration = Math.round((now.getTime() - participant.joinedAt.getTime()) / 1000);

    await db.liveRoomParticipant.update({
      where: { roomId_userId: { roomId: id, userId: user.userId } },
      data: { leftAt: now, duration },
    });

    await db.liveRoom.update({
      where: { id },
      data: { participantCount: { decrement: 1 } },
    });

    // Update user live stats
    const hoursAdded = duration / 3600;
    await db.userLiveStats.upsert({
      where: { userId: user.userId },
      create: {
        userId: user.userId,
        totalHours: hoursAdded,
        roomsJoined: 1,
        weeklyHours: hoursAdded,
        weeklyRooms: 1,
      },
      update: {
        totalHours: { increment: hoursAdded },
        roomsJoined: { increment: 1 },
        weeklyHours: { increment: hoursAdded },
        weeklyRooms: { increment: 1 },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Live Room Leave Error]', error);
    return NextResponse.json({ error: 'Failed to leave room.' }, { status: 500 });
  }
}
