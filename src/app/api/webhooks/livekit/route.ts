import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * POST /api/webhooks/livekit
 *
 * Handles webhook events from the LiveKit server.
 * These events are sent when participants join/leave rooms,
 * recordings start/stop, and other room-level events occur.
 *
 * Security: LiveKit signs webhooks with the API key/secret.
 * We verify the signature to prevent spoofing.
 *
 * Configured in livekit.yaml:
 *   webhook:
 *     api_key: APIkey123456
 *     urls:
 *       - https://testcefr.com/api/webhooks/livekit
 */

const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY || '';
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET || '';

// LiveKit webhook event types we handle
type LiveKitEvent =
  | 'room_started'
  | 'room_finished'
  | 'participant_joined'
  | 'participant_left'
  | 'track_published'
  | 'track_unpublished'
  | 'egress_started'
  | 'egress_ended'
  | 'egress_failed';

interface LiveKitWebhookBody {
  event: LiveKitEvent;
  room: {
    sid: string;
    name: string;
    metadata?: string;
    numParticipants?: number;
    maxParticipants?: number;
    creationTime?: number;
    turnVideo?: boolean;
  };
  participant?: {
    sid: string;
    identity: string;
    name?: string;
    metadata?: string;
    joinedAt?: number;
  };
  egressInfo?: {
    egressId: string;
    roomName: string;
    roomSid: string;
    status: string;
    startedAt: number;
    endedAt?: number;
    error?: string;
    fileResults?: Array<{
      filename: string;
      downloadUrl: string;
      duration?: number;
      size?: number;
    }>;
  };
  id: string;
  createdAt: string;
}

/**
 * Verify the LiveKit webhook JWT signature.
 * LiveKit sends webhooks as JWT tokens signed with the API key/secret.
 */
async function verifyWebhookToken(body: string, authHeader: string): Promise<boolean> {
  try {
    if (!LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
      console.error('[LiveKit Webhook] API key/secret not configured');
      return false;
    }

    // LiveKit webhooks use a JWT in the Authorization header
    // The JWT is signed with the API key and secret
    const { jwtVerify } = await import('jose');
    const secret = new TextEncoder().encode(LIVEKIT_API_SECRET);

    // The token should be verifiable with our API secret
    await jwtVerify(authHeader.replace('Bearer ', ''), secret, {
      issuer: LIVEKIT_API_KEY,
    });

    return true;
  } catch (error) {
    console.error('[LiveKit Webhook] Signature verification failed:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();

    // Verify webhook signature
    const authHeader = request.headers.get('authorization') || '';
    const isValid = await verifyWebhookToken(body, authHeader);

    if (!isValid) {
      // In development, allow unverified webhooks for testing
      if (process.env.NODE_ENV === 'development') {
        console.warn('[LiveKit Webhook] Skipping signature verification in development mode');
      } else {
        console.error('[LiveKit Webhook] Invalid signature — rejecting webhook');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    // Parse the webhook body
    let webhookData: LiveKitWebhookBody;
    try {
      webhookData = JSON.parse(body);
    } catch {
      console.error('[LiveKit Webhook] Failed to parse body');
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const { event, room, participant, egressInfo } = webhookData;

    console.log(`[LiveKit Webhook] Event: ${event}, Room: ${room.name}`);

    // Route to appropriate handler
    switch (event) {
      case 'room_started':
        await handleRoomStarted(room);
        break;

      case 'room_finished':
        await handleRoomFinished(room);
        break;

      case 'participant_joined':
        await handleParticipantJoined(room, participant);
        break;

      case 'participant_left':
        await handleParticipantLeft(room, participant);
        break;

      case 'egress_ended':
        await handleEgressEnded(egressInfo);
        break;

      case 'egress_failed':
        await handleEgressFailed(egressInfo);
        break;

      default:
        console.log(`[LiveKit Webhook] Unhandled event: ${event}`);
    }

    // Always return 200 OK to acknowledge receipt
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[LiveKit Webhook] Processing error:', error);
    // Return 200 to prevent LiveKit from retrying
    return NextResponse.json({ received: true, warning: 'Processing error' });
  }
}

/**
 * Handle room_started event — update LiveClass status to "live".
 */
async function handleRoomStarted(room: LiveKitWebhookBody['room']) {
  try {
    const liveClass = await db.liveClass.findUnique({
      where: { roomName: room.name },
    });

    if (liveClass && liveClass.status === 'scheduled') {
      await db.liveClass.update({
        where: { id: liveClass.id },
        data: {
          status: 'live',
          startedAt: new Date(),
        },
      });
      console.log(`[LiveKit Webhook] Room ${room.name} started — class marked as live`);
    }
  } catch (error) {
    console.error('[LiveKit Webhook] Error handling room_started:', error);
  }
}

/**
 * Handle room_finished event — update LiveClass status to "ended".
 */
async function handleRoomFinished(room: LiveKitWebhookBody['room']) {
  try {
    const liveClass = await db.liveClass.findUnique({
      where: { roomName: room.name },
    });

    if (liveClass) {
      await db.liveClass.update({
        where: { id: liveClass.id },
        data: {
          status: 'ended',
          endedAt: new Date(),
        },
      });

      // Mark all remaining participants as left
      await db.liveClassParticipant.updateMany({
        where: {
          classId: liveClass.id,
          leftAt: null,
        },
        data: {
          leftAt: new Date(),
        },
      });

      console.log(`[LiveKit Webhook] Room ${room.name} finished — class marked as ended`);
    }
  } catch (error) {
    console.error('[LiveKit Webhook] Error handling room_finished:', error);
  }
}

/**
 * Handle participant_joined event — log participant entry.
 */
async function handleParticipantJoined(
  room: LiveKitWebhookBody['room'],
  participant: LiveKitWebhookBody['participant'],
) {
  if (!participant) return;

  try {
    const liveClass = await db.liveClass.findUnique({
      where: { roomName: room.name },
    });

    if (liveClass) {
      // Upsert participant record
      await db.liveClassParticipant.upsert({
        where: {
          classId_userId: { classId: liveClass.id, userId: participant.identity },
        },
        create: {
          classId: liveClass.id,
          userId: participant.identity,
          role: participant.metadata ? JSON.parse(participant.metadata).role || 'participant' : 'participant',
          joinedAt: new Date(),
        },
        update: {
          leftAt: null, // Reset if rejoining
          joinedAt: new Date(),
        },
      });

      console.log(`[LiveKit Webhook] Participant ${participant.identity} joined room ${room.name}`);
    }
  } catch (error) {
    console.error('[LiveKit Webhook] Error handling participant_joined:', error);
  }
}

/**
 * Handle participant_left event — record departure time and duration.
 */
async function handleParticipantLeft(
  room: LiveKitWebhookBody['room'],
  participant: LiveKitWebhookBody['participant'],
) {
  if (!participant) return;

  try {
    const liveClass = await db.liveClass.findUnique({
      where: { roomName: room.name },
    });

    if (liveClass) {
      const participantRecord = await db.liveClassParticipant.findUnique({
        where: {
          classId_userId: { classId: liveClass.id, userId: participant.identity },
        },
      });

      if (participantRecord) {
        const duration = Math.floor(
          (Date.now() - participantRecord.joinedAt.getTime()) / 1000,
        );

        await db.liveClassParticipant.update({
          where: { id: participantRecord.id },
          data: {
            leftAt: new Date(),
            duration,
          },
        });
      }

      console.log(`[LiveKit Webhook] Participant ${participant.identity} left room ${room.name}`);
    }
  } catch (error) {
    console.error('[LiveKit Webhook] Error handling participant_left:', error);
  }
}

/**
 * Handle egress_ended event — save recording URL and duration.
 */
async function handleEgressEnded(egressInfo: LiveKitWebhookBody['egressInfo']) {
  if (!egressInfo) return;

  try {
    const liveClass = await db.liveClass.findUnique({
      where: { roomName: egressInfo.roomName },
    });

    if (liveClass) {
      const fileResult = egressInfo.fileResults?.[0];
      const duration = fileResult?.duration || undefined;

      await db.liveClass.update({
        where: { id: liveClass.id },
        data: {
          recordingUrl: fileResult?.downloadUrl || null,
          recordingDuration: duration || null,
          isRecorded: true,
        },
      });

      console.log(`[LiveKit Webhook] Recording saved for room ${egressInfo.roomName}, duration: ${duration}s`);
    }
  } catch (error) {
    console.error('[LiveKit Webhook] Error handling egress_ended:', error);
  }
}

/**
 * Handle egress_failed event — log the failure.
 */
async function handleEgressFailed(egressInfo: LiveKitWebhookBody['egressInfo']) {
  if (!egressInfo) return;

  console.error(
    `[LiveKit Webhook] Recording failed for room ${egressInfo.roomName}: ${egressInfo.error}`,
  );

  try {
    const liveClass = await db.liveClass.findUnique({
      where: { roomName: egressInfo.roomName },
    });

    if (liveClass) {
      await db.liveClass.update({
        where: { id: liveClass.id },
        data: {
          isRecorded: false,
        },
      });
    }
  } catch (error) {
    console.error('[LiveKit Webhook] Error handling egress_failed:', error);
  }
}
