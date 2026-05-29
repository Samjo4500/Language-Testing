import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireAdmin } from '@/lib/auth-middleware';
import { listRecordings, startRoomCompositeRecording, stopRecording } from '@/lib/livekit';
import { db } from '@/lib/db';

/**
 * GET /api/livekit/recordings
 *
 * List all recordings from LiveKit egress and our database.
 * Admin only.
 *
 * Query params:
 *   roomName?: string — filter by room
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;

    const user = authResult;

    // Only admins can list all recordings
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required.' },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(request.url);
    const roomName = searchParams.get('roomName') || undefined;

    // Get recordings from our database
    const dbRecordings = await db.liveClass.findMany({
      where: {
        isRecorded: true,
        ...(roomName ? { roomName } : {}),
      },
      select: {
        id: true,
        title: true,
        roomName: true,
        recordingUrl: true,
        recordingDuration: true,
        host: {
          select: { id: true, name: true },
        },
        startedAt: true,
        endedAt: true,
        participants: {
          select: { userId: true },
        },
      },
      orderBy: { startedAt: 'desc' },
    });

    // Try to get active recordings from LiveKit
    let activeRecordings: any[] = [];
    try {
      const egressList = await listRecordings(roomName);
      activeRecordings = Array.isArray(egressList) ? egressList : [];
    } catch (error) {
      console.warn('[LiveKit Recordings] Could not fetch LiveKit recordings:', error);
    }

    return NextResponse.json({
      recordings: dbRecordings,
      activeRecordings,
      total: dbRecordings.length,
    });
  } catch (error) {
    console.error('[LiveKit Recordings GET Error]', error);
    return NextResponse.json(
      { error: 'Failed to fetch recordings.' },
      { status: 500 },
    );
  }
}

/**
 * POST /api/livekit/recordings
 *
 * Start or stop a recording for a room.
 * Admin or host only.
 *
 * Request body:
 * {
 *   action: "start" | "stop";
 *   roomName: string;
 *   layout?: "grid" | "speaker" | "single-speaker";
 *   egressId?: string; // Required for stop action
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;

    const user = authResult;
    const body = await request.json();
    const { action, roomName, layout = 'speaker', egressId } = body;

    if (!action || !roomName) {
      return NextResponse.json(
        { error: 'action and roomName are required.' },
        { status: 400 },
      );
    }

    // Check if user is host or admin
    const liveClass = await db.liveClass.findUnique({
      where: { roomName },
    });

    if (!liveClass) {
      return NextResponse.json(
        { error: 'Room not found.' },
        { status: 404 },
      );
    }

    if (liveClass.hostId !== user.userId && user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Only the host or admin can manage recordings.' },
        { status: 403 },
      );
    }

    if (action === 'start') {
      // Start recording
      try {
        const egressInfo = await startRoomCompositeRecording(roomName, {
          layout: layout as 'grid' | 'speaker' | 'single-speaker',
        });

        await db.liveClass.update({
          where: { id: liveClass.id },
          data: { isRecorded: true },
        });

        return NextResponse.json({
          success: true,
          egressId: (egressInfo as any).egressId,
          status: (egressInfo as any).status,
        });
      } catch (error: any) {
        console.error('[LiveKit Recordings] Start recording error:', error);
        return NextResponse.json(
          { error: 'Failed to start recording.', details: error.message },
          { status: 500 },
        );
      }
    }

    if (action === 'stop') {
      if (!egressId) {
        return NextResponse.json(
          { error: 'egressId is required to stop recording.' },
          { status: 400 },
        );
      }

      try {
        await stopRecording(egressId);
        return NextResponse.json({ success: true });
      } catch (error: any) {
        console.error('[LiveKit Recordings] Stop recording error:', error);
        return NextResponse.json(
          { error: 'Failed to stop recording.', details: error.message },
          { status: 500 },
        );
      }
    }

    return NextResponse.json(
      { error: 'Invalid action. Use "start" or "stop".' },
      { status: 400 },
    );
  } catch (error) {
    console.error('[LiveKit Recordings POST Error]', error);
    return NextResponse.json(
      { error: 'Failed to manage recording.' },
      { status: 500 },
    );
  }
}
