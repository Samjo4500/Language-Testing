import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireAdmin } from '@/lib/auth-middleware';
import { getRoomService } from '@/lib/livekit';

/**
 * POST /api/admin/live-monitor/mute
 *
 * Mute or unmute a participant's microphone in a LiveKit room.
 * Admin only.
 *
 * Request body:
 * {
 *   roomName: string;
 *   identity: string;
 *   muted?: boolean; // default: true (mute). Set false to unmute.
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;

    const adminCheck = requireAdmin(authResult);
    if (adminCheck) return adminCheck;

    const body = await request.json();
    const { roomName, identity, muted = true } = body;

    if (!roomName || !identity) {
      return NextResponse.json(
        { error: 'roomName and identity are required.' },
        { status: 400 },
      );
    }

    const roomService = getRoomService();

    // List participants to find the audio track SID
    const participants = await roomService.listParticipants(roomName);
    const participant = participants.find(
      (p: any) => p.identity === identity || p.name === identity,
    );

    if (!participant) {
      return NextResponse.json(
        { error: 'Participant not found in room.' },
        { status: 404 },
      );
    }

    // Find the microphone track
    const audioTrack = (participant.tracks || []).find(
      (t: any) => t.source === 'microphone' || t.kind === 'audio',
    );

    if (!audioTrack) {
      return NextResponse.json(
        { error: 'No microphone track found for this participant.' },
        { status: 404 },
      );
    }

    const trackSid = audioTrack.sid;

    await roomService.mutePublishedTrack(roomName, identity, trackSid, muted);

    return NextResponse.json({
      success: true,
      roomName,
      identity,
      muted,
      trackSid,
    });
  } catch (error: any) {
    console.error('[Live Monitor Mute Error]', error);
    return NextResponse.json(
      { error: 'Failed to mute/unmute participant.', details: error.message },
      { status: 500 },
    );
  }
}
