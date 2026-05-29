import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireAdmin } from '@/lib/auth-middleware';
import { getRoomService } from '@/lib/livekit';
import { db } from '@/lib/db';

/**
 * POST /api/admin/live-monitor/remove
 *
 * Remove (kick) a participant from a LiveKit room.
 * Admin only.
 *
 * Request body:
 * {
 *   roomName: string;
 *   identity: string;
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;

    const adminCheck = requireAdmin(authResult);
    if (adminCheck) return adminCheck;

    const body = await request.json();
    const { roomName, identity } = body;

    if (!roomName || !identity) {
      return NextResponse.json(
        { error: 'roomName and identity are required.' },
        { status: 400 },
      );
    }

    // Remove from LiveKit
    const roomService = getRoomService();
    await roomService.removeParticipant(roomName, identity);

    // Also update DB participant record
    try {
      const liveRoom = await db.liveRoom.findUnique({
        where: { roomName },
        select: { id: true },
      });

      if (liveRoom) {
        await db.liveRoomParticipant.updateMany({
          where: {
            roomId: liveRoom.id,
            userId: identity,
            leftAt: null,
          },
          data: { leftAt: new Date() },
        });
      }
    } catch (dbError) {
      console.warn('[Live Monitor Remove] DB update failed:', dbError);
      // LiveKit removal succeeded, continue
    }

    return NextResponse.json({
      success: true,
      roomName,
      identity,
    });
  } catch (error: any) {
    console.error('[Live Monitor Remove Error]', error);
    return NextResponse.json(
      { error: 'Failed to remove participant.', details: error.message },
      { status: 500 },
    );
  }
}
