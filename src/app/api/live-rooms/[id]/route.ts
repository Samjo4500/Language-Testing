import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth-middleware';
import { deleteRoom as deleteLiveKitRoom } from '@/lib/livekit';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const room = await db.liveRoom.findUnique({
      where: { id },
      include: {
        host: { select: { id: true, name: true, avatarUrl: true } },
        participants: { where: { leftAt: null } },
      },
    });
    if (!room) return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    return NextResponse.json({ room });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch room' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;
    const user = authResult;
    const { id } = await params;

    const room = await db.liveRoom.findUnique({ where: { id } });
    if (!room) return NextResponse.json({ error: 'Room not found' }, { status: 404 });

    if (room.hostId !== user.userId && user.role !== 'admin') {
      return NextResponse.json({ error: 'Only the host can end this room' }, { status: 403 });
    }

    await db.liveRoom.update({ where: { id }, data: { status: 'ended', endedAt: new Date() } });
    await db.liveRoomParticipant.updateMany({ where: { roomId: id, leftAt: null }, data: { leftAt: new Date() } });

    try { await deleteLiveKitRoom(room.roomName); } catch { /* ok */ }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to end room' }, { status: 500 });
  }
}
