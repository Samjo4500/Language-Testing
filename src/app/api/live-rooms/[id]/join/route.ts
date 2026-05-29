import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth-middleware';
import { generateToken } from '@/lib/livekit';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;
    const user = authResult;
    const { id } = await params;

    const room = await db.liveRoom.findUnique({ where: { id } });
    if (!room) return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    if (room.status === 'ended') return NextResponse.json({ error: 'Room has ended' }, { status: 410 });
    if (room.isLocked) return NextResponse.json({ error: 'Room is locked' }, { status: 403 });

    // Determine role
    let role = 'participant';
    if (room.hostId === user.userId) role = 'host';

    // Upsert participant
    await db.liveRoomParticipant.upsert({
      where: { roomId_userId: { roomId: id, userId: user.userId } },
      create: { roomId: id, userId: user.userId, role },
      update: { leftAt: null, role },
    });

    // Get LiveKit token
    const dbUser = await db.user.findUnique({ where: { id: user.userId }, select: { name: true } });
    const token = await generateToken(
      user.userId,
      dbUser?.name || 'Anonymous',
      room.roomName,
      role as any,
      JSON.stringify({ role, roomId: id, roomType: room.type }),
    );

    const livekitUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || '';

    return NextResponse.json({
      token,
      url: livekitUrl,
      roomName: room.roomName,
      identity: user.userId,
      role,
      roomType: room.type,
    });
  } catch (error: any) {
    if (error.message?.includes('not configured')) {
      return NextResponse.json({ error: 'LiveKit not configured' }, { status: 503 });
    }
    return NextResponse.json({ error: 'Failed to join room' }, { status: 500 });
  }
}
