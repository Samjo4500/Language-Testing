import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, requireAuth, requireAdmin } from '@/lib/auth-middleware';
import { db } from '@/lib/db';
import {
  listRooms as listLiveKitRooms,
  listParticipants,
  createRoom as createLiveKitRoom,
  deleteRoom as deleteLiveKitRoom,
} from '@/lib/livekit';

/**
 * GET /api/livekit/rooms
 *
 * List all LiveKit rooms and their database records.
 * Combines LiveKit server room state with our database LiveClass records.
 *
 * Query params:
 *   status?: "scheduled" | "live" | "ended" | "cancelled"
 *   category?: string
 *   level?: string
 *   includeParticipants?: boolean (default: false)
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const level = searchParams.get('level');
    const includeParticipants = searchParams.get('includeParticipants') === 'true';

    // Build where clause for database query
    const where: any = {};
    if (status) where.status = status;
    if (category) where.category = category;
    if (level) where.level = level;

    // Get database records
    const liveClasses = await db.liveClass.findMany({
      where,
      include: {
        host: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
        ...(includeParticipants ? {
          participants: {
            where: { leftAt: null },
            select: {
              id: true,
              userId: true,
              role: true,
              joinedAt: true,
              user: {
                select: { id: true, name: true, avatarUrl: true },
              },
            },
          },
        } : {
          participants: {
            where: { leftAt: null },
            select: { id: true },
          },
        }),
      },
      orderBy: [
        { status: 'asc' }, // Live first, then scheduled, then ended
        { scheduledAt: 'asc' },
      ],
    });

    // Get active LiveKit rooms for real-time participant counts
    let livekitRooms: any[] = [];
    try {
      livekitRooms = await listLiveKitRooms();
    } catch (error) {
      console.warn('[LiveKit Rooms] Could not fetch LiveKit rooms:', error);
      // Continue without LiveKit data — we still have database records
    }

    // Merge LiveKit room data with database records
    const enrichedClasses = liveClasses.map((liveClass) => {
      const livekitRoom = livekitRooms.find((r: any) => r.name === liveClass.roomName);
      const activeParticipantCount = livekitRoom?.numParticipants || 0;

      return {
        ...liveClass,
        activeParticipantCount,
        isLiveOnServer: !!livekitRoom,
        participantCount: liveClass.participants.length,
        participants: includeParticipants ? liveClass.participants : undefined,
      };
    });

    // Also include ad-hoc LiveKit rooms that don't have database records
    const dbRoomNames = new Set(liveClasses.map((c) => c.roomName));
    const adhocRooms = livekitRooms
      .filter((r: any) => !dbRoomNames.has(r.name))
      .map((r: any) => ({
        id: null,
        title: `Ad-hoc Room: ${r.name}`,
        roomName: r.name,
        status: 'live' as const,
        category: 'general',
        level: null,
        host: null,
        activeParticipantCount: r.numParticipants || 0,
        isLiveOnServer: true,
        participantCount: r.numParticipants || 0,
        isAdhoc: true,
        createdAt: new Date(r.creationTime * 1000).toISOString(),
      }));

    return NextResponse.json({
      rooms: [...enrichedClasses, ...adhocRooms],
      total: enrichedClasses.length + adhocRooms.length,
    });
  } catch (error) {
    console.error('[LiveKit Rooms GET Error]', error);
    return NextResponse.json(
      { error: 'Failed to fetch rooms.' },
      { status: 500 },
    );
  }
}

/**
 * POST /api/livekit/rooms
 *
 * Create a new scheduled live class with a LiveKit room.
 *
 * Request body:
 * {
 *   title: string;
 *   description?: string;
 *   level?: string;
 *   category?: string;
 *   maxParticipants?: number;
 *   scheduledAt?: string; // ISO date
 *   isRecorded?: boolean;
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;

    const user = authResult;
    const body = await request.json();

    const {
      title,
      description,
      level,
      category = 'general',
      maxParticipants = 20,
      scheduledAt,
      isRecorded = false,
    } = body;

    // Validate required fields
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Title is required.' },
        { status: 400 },
      );
    }

    // Generate a unique room name
    const roomName = `class-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

    // Create the LiveClass in our database
    const liveClass = await db.liveClass.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        roomName,
        hostId: user.userId,
        level: level || null,
        category,
        maxParticipants: Math.max(2, Math.min(100, maxParticipants)),
        status: scheduledAt ? 'scheduled' : 'live',
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        startedAt: scheduledAt ? null : new Date(),
        isRecorded,
      },
      include: {
        host: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
      },
    });

    // Create the room on LiveKit server
    try {
      await createLiveKitRoom(roomName, {
        maxParticipants: liveClass.maxParticipants,
        emptyTimeout: 300,
        metadata: JSON.stringify({
          classId: liveClass.id,
          title: liveClass.title,
          hostId: user.userId,
        }),
      });
    } catch (error) {
      console.warn('[LiveKit Rooms] Could not create LiveKit room:', error);
      // Continue — the room will be auto-created when the first participant joins
    }

    return NextResponse.json({
      room: liveClass,
      roomName,
      joinUrl: `/speakspace/${roomName}`,
    }, { status: 201 });
  } catch (error) {
    console.error('[LiveKit Rooms POST Error]', error);
    return NextResponse.json(
      { error: 'Failed to create room.' },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/livekit/rooms
 *
 * Delete a room (end the class and remove from LiveKit server).
 * Only the host or admin can delete a room.
 *
 * Query params:
 *   roomName: string
 */
export async function DELETE(request: NextRequest) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;

    const user = authResult;
    const { searchParams } = new URL(request.url);
    const roomName = searchParams.get('roomName');

    if (!roomName) {
      return NextResponse.json(
        { error: 'roomName query parameter is required.' },
        { status: 400 },
      );
    }

    // Find the LiveClass
    const liveClass = await db.liveClass.findUnique({
      where: { roomName },
    });

    if (!liveClass) {
      return NextResponse.json(
        { error: 'Room not found.' },
        { status: 404 },
      );
    }

    // Check permissions — only host or admin can delete
    if (liveClass.hostId !== user.userId && user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Only the host or admin can end this class.' },
        { status: 403 },
      );
    }

    // Update database record
    await db.liveClass.update({
      where: { id: liveClass.id },
      data: {
        status: 'ended',
        endedAt: new Date(),
      },
    });

    // Mark all participants as left
    await db.liveClassParticipant.updateMany({
      where: {
        classId: liveClass.id,
        leftAt: null,
      },
      data: { leftAt: new Date() },
    });

    // Delete room from LiveKit server
    try {
      await deleteLiveKitRoom(roomName);
    } catch (error) {
      console.warn('[LiveKit Rooms] Could not delete LiveKit room:', error);
    }

    return NextResponse.json({ success: true, roomName });
  } catch (error) {
    console.error('[LiveKit Rooms DELETE Error]', error);
    return NextResponse.json(
      { error: 'Failed to delete room.' },
      { status: 500 },
    );
  }
}
