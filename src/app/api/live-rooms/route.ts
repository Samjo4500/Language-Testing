import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth, canCreateLiveRoom } from '@/lib/auth-middleware';
import { createRoom as createLiveKitRoom, listRooms as listLiveKitRooms } from '@/lib/livekit';

// GET /api/live-rooms — List all rooms with filters
export async function GET(request: NextRequest) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const level = searchParams.get('level');
    const topic = searchParams.get('topic');
    const status = searchParams.get('status') || 'active';
    const search = searchParams.get('search');

    const where: any = {};
    if (type && type !== 'all') where.type = type;
    if (level && level !== 'all') where.cefrLevel = level;
    if (topic && topic !== 'all') where.topic = topic;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { hostName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const rooms = await db.liveRoom.findMany({
      where,
      include: {
        host: { select: { id: true, name: true, avatarUrl: true } },
        participants: { where: { leftAt: null }, select: { id: true, userId: true, role: true } },
      },
      orderBy: [
        { status: 'asc' },
        { participantCount: 'desc' },
        { createdAt: 'desc' },
      ],
      take: 50,
    });

    // Get LiveKit room data for real-time participant counts
    let livekitRooms: any[] = [];
    try {
      livekitRooms = await listLiveKitRooms();
    } catch { /* continue without */ }

    const enriched = rooms.map((room) => {
      const lkRoom = livekitRooms.find((r: any) => r.name === room.roomName);
      return {
        ...room,
        activeParticipantCount: lkRoom?.numParticipants || room.participants.length,
        isLiveOnServer: !!lkRoom,
      };
    });

    return NextResponse.json({ rooms: enriched });
  } catch (error) {
    console.error('[LiveRooms GET]', error);
    return NextResponse.json({ error: 'Failed to fetch rooms' }, { status: 500 });
  }
}

// POST /api/live-rooms — Create a new room (admins + approved tutors only)
export async function POST(request: NextRequest) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;
    const user = authResult;

    // Check if user is allowed to create rooms
    const permissionCheck = await canCreateLiveRoom(user);
    if (permissionCheck) return permissionCheck;

    const body = await request.json();
    const { name, type = 'LIVE_CLASS', description, cefrLevel, topic, maxParticipants = 20, scheduledFor, isPrivate = false, language } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Room name is required' }, { status: 400 });
    }

    // Get user info for denormalized host data
    const dbUser = await db.user.findUnique({
      where: { id: user.userId },
      select: { id: true, name: true, avatarUrl: true },
    });

    const roomName = `room-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

    const room = await db.liveRoom.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        type,
        cefrLevel: cefrLevel || null,
        topic: topic || null,
        maxParticipants: Math.max(2, Math.min(200, maxParticipants)),
        hostId: user.userId,
        hostName: dbUser?.name || 'Anonymous',
        hostAvatar: dbUser?.avatarUrl || null,
        roomName,
        isPrivate,
        language: language || 'English',
        scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
        status: scheduledFor ? 'scheduled' : 'active',
      },
    });

    // Create participant record for host
    await db.liveRoomParticipant.create({
      data: {
        roomId: room.id,
        userId: user.userId,
        role: 'host',
      },
    });

    // Try creating LiveKit room
    try {
      await createLiveKitRoom(roomName, {
        maxParticipants: room.maxParticipants,
        emptyTimeout: 300,
        metadata: JSON.stringify({ roomId: room.id, type, title: name }),
      });
    } catch { /* room auto-creates on first join */ }

    return NextResponse.json({ room, roomName, joinUrl: `/speakspace/${roomName}` }, { status: 201 });
  } catch (error) {
    console.error('[LiveRooms POST]', error);
    return NextResponse.json({ error: 'Failed to create room' }, { status: 500 });
  }
}
