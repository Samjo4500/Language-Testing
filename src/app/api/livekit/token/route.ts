import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/livekit';
import { getAuthUser, requireAuth } from '@/lib/auth-middleware';
import { db } from '@/lib/db';

/**
 * POST /api/livekit/token
 *
 * Generate a LiveKit access token for a user to join a video room.
 * Requires authentication. Validates that the user has permission to join the room.
 *
 * Request body:
 * {
 *   roomName: string;          // The LiveKit room name
 *   role?: "host" | "co_host" | "participant";  // Default: "participant"
 *   autoCreate?: boolean;      // Auto-create LiveClass record if not exists
 * }
 *
 * Response:
 * {
 *   token: string;             // JWT token for LiveKit client
 *   url: string;               // LiveKit WebSocket URL
 *   roomName: string;
 *   identity: string;
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate the user
    const authResult = requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;

    const user = authResult;

    // Parse request body
    const body = await request.json();
    const { roomName, role = 'participant', autoCreate = false } = body;

    if (!roomName || typeof roomName !== 'string') {
      return NextResponse.json(
        { error: 'roomName is required' },
        { status: 400 },
      );
    }

    // Validate room name format (alphanumeric, hyphens, underscores only)
    if (!/^[a-zA-Z0-9_-]+$/.test(roomName)) {
      return NextResponse.json(
        { error: 'Invalid room name. Use only letters, numbers, hyphens, and underscores.' },
        { status: 400 },
      );
    }

    // Check room name length
    if (roomName.length > 64) {
      return NextResponse.json(
        { error: 'Room name must be 64 characters or less.' },
        { status: 400 },
      );
    }

    // Look up the LiveClass in our database (if it exists)
    const liveClass = await db.liveClass.findUnique({
      where: { roomName },
      include: { host: { select: { id: true, name: true } } },
    });

    // If a LiveClass exists, validate access
    if (liveClass) {
      // Check if class is accessible
      if (liveClass.status === 'cancelled') {
        return NextResponse.json(
          { error: 'This class has been cancelled.' },
          { status: 410 },
        );
      }

      if (liveClass.status === 'ended') {
        return NextResponse.json(
          { error: 'This class has ended.' },
          { status: 410 },
        );
      }

      // Determine actual role
      let actualRole = role;
      if (liveClass.hostId === user.userId) {
        actualRole = 'host';
      }

      // Check if user is already a co-host
      const existingParticipant = await db.liveClassParticipant.findUnique({
        where: {
          classId_userId: { classId: liveClass.id, userId: user.userId },
        },
      });

      if (existingParticipant?.role === 'co_host') {
        actualRole = 'co_host';
      }

      // Check max participants (only for non-hosts joining live classes)
      if (actualRole === 'participant' && liveClass.status === 'live') {
        const currentCount = await db.liveClassParticipant.count({
          where: {
            classId: liveClass.id,
            leftAt: null, // Still in the room
          },
        });

        if (currentCount >= liveClass.maxParticipants) {
          return NextResponse.json(
            { error: 'This class is full. Maximum participants reached.' },
            { status: 403 },
          );
        }
      }

      // Create or update participant record
      await db.liveClassParticipant.upsert({
        where: {
          classId_userId: { classId: liveClass.id, userId: user.userId },
        },
        create: {
          classId: liveClass.id,
          userId: user.userId,
          role: actualRole,
        },
        update: {
          role: actualRole,
          leftAt: null, // Reset leftAt if rejoining
        },
      });

      // If class is scheduled and host is joining, mark it as live
      if (liveClass.status === 'scheduled' && actualRole === 'host') {
        await db.liveClass.update({
          where: { id: liveClass.id },
          data: {
            status: 'live',
            startedAt: new Date(),
          },
        });
      }

      // Generate token
      const token = await generateToken(
        user.userId,
        user.email || 'Anonymous',
        roomName,
        actualRole,
        JSON.stringify({ role: actualRole, classId: liveClass.id }),
      );

      const livekitUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || '';

      return NextResponse.json({
        token,
        url: livekitUrl,
        roomName,
        identity: user.userId,
        role: actualRole,
        classId: liveClass.id,
      });
    }

    // No LiveClass exists — handle auto-create or ad-hoc rooms
    if (autoCreate) {
      // Create a new LiveClass record
      const newClass = await db.liveClass.create({
        data: {
          title: `Live Session - ${roomName}`,
          roomName,
          hostId: user.userId,
          status: 'live',
          startedAt: new Date(),
          category: 'general',
          maxParticipants: 20,
        },
      });

      // Create host participant record
      await db.liveClassParticipant.create({
        data: {
          classId: newClass.id,
          userId: user.userId,
          role: 'host',
        },
      });

      const token = await generateToken(
        user.userId,
        user.email || 'Anonymous',
        roomName,
        'host',
        JSON.stringify({ role: 'host', classId: newClass.id }),
      );

      const livekitUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || '';

      return NextResponse.json({
        token,
        url: livekitUrl,
        roomName,
        identity: user.userId,
        role: 'host',
        classId: newClass.id,
      });
    }

    // Ad-hoc room (no database record) — allow for impromptu sessions
    const token = generateToken(
      user.userId,
      user.email || 'Anonymous',
      roomName,
      role,
      JSON.stringify({ role }),
    );

    const livekitUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || '';

    return NextResponse.json({
      token,
      url: livekitUrl,
      roomName,
      identity: user.userId,
      role,
    });
  } catch (error: any) {
    console.error('[LiveKit Token Error]', error);

    if (error.message?.includes('not configured')) {
      return NextResponse.json(
        { error: 'LiveKit is not configured. Please set environment variables.' },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate LiveKit token.' },
      { status: 500 },
    );
  }
}
