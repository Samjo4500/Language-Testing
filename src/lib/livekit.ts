/**
 * LiveKit Server Utilities
 *
 * Handles token generation, room management, and recording operations
 * using the livekit-server-sdk. All operations are server-side only.
 *
 * Architecture:
 * - Token generation: signs JWT with API key/secret for browser clients
 * - Room management: creates, lists, deletes rooms via LiveKit HTTP API
 * - Recording: starts/stops egress recording to S3/R2
 */

import { AccessToken, RoomServiceClient, EgressClient, S3Upload, EncodedFileOutput, EncodedFileType } from 'livekit-server-sdk';

const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY || '';
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET || '';
const LIVEKIT_HTTP_URL = process.env.LIVEKIT_HTTP_URL || 'http://localhost:7880';

// Lazy-initialized clients (avoid instantiation at module level for Edge compatibility)
let _roomService: RoomServiceClient | null = null;
let _egressClient: EgressClient | null = null;

export function getRoomService(): RoomServiceClient {
  if (!_roomService) {
    _roomService = new RoomServiceClient(LIVEKIT_HTTP_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET);
  }
  return _roomService;
}

export function getEgressClient(): EgressClient {
  if (!_egressClient) {
    _egressClient = new EgressClient(LIVEKIT_HTTP_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET);
  }
  return _egressClient;
}

/**
 * Token grant types for different user roles in a LiveKit room.
 */
export interface TokenGrant {
  roomJoin: boolean;
  room: string;
  canPublish: boolean;
  canSubscribe: boolean;
  canPublishData: boolean;
  canUpdateOwnMetadata: boolean;
  hidden?: boolean; // For admin/observer mode
  recorder?: boolean; // For recording participant
}

/**
 * Generate a LiveKit access token for a user to join a room.
 *
 * @param userId - The user's ID (used as the participant identity)
 * @param userName - Display name shown in the room
 * @param roomName - The LiveKit room name to join
 * @param role - "host" | "co_host" | "participant" | "admin"
 * @param metadata - Optional JSON string with additional metadata
 * @returns Signed JWT token string
 */
export async function generateToken(
  userId: string,
  userName: string,
  roomName: string,
  role: 'host' | 'co_host' | 'participant' | 'admin' = 'participant',
  metadata?: string,
): Promise<string> {
  if (!LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
    throw new Error('LiveKit API key and secret are not configured. Set LIVEKIT_API_KEY and LIVEKIT_API_SECRET environment variables.');
  }

  const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
    identity: userId,
    name: userName,
    metadata: metadata || JSON.stringify({ role }),
  });

  // Set token expiry to 6 hours (generous for long classes)
  at.ttl = '6h';

  // Build grant based on role
  const grant: TokenGrant = {
    roomJoin: true,
    room: roomName,
    canSubscribe: true,
    canPublishData: true,
    canUpdateOwnMetadata: true,
    canPublish: true,
  };

  // Host and admin get full publish permissions
  if (role === 'host' || role === 'admin') {
    grant.canPublish = true;
    grant.canPublishData = true;
    // Admin can be hidden (God View)
    if (role === 'admin') {
      grant.hidden = true;
    }
  }

  // Co-host can publish but can't kick others
  if (role === 'co_host') {
    grant.canPublish = true;
  }

  // Regular participants have standard permissions
  if (role === 'participant') {
    grant.canPublish = true;
  }

  at.addGrant(grant);

  return at.toJwt();
}

/**
 * Create a LiveKit room with optional configuration.
 */
export async function createRoom(
  roomName: string,
  options?: {
    maxParticipants?: number;
    emptyTimeout?: number; // seconds before auto-close
    metadata?: string;
  },
) {
  const roomService = getRoomService();

  return roomService.createRoom({
    name: roomName,
    maxParticipants: options?.maxParticipants || 100,
    emptyTimeout: options?.emptyTimeout || 300, // 5 min default
    metadata: options?.metadata,
  });
}

/**
 * List all active LiveKit rooms.
 */
export async function listRooms() {
  const roomService = getRoomService();
  return roomService.listRooms();
}

/**
 * Get details of a specific room.
 */
export async function getRoom(roomName: string) {
  const roomService = getRoomService();
  const rooms = await roomService.listRooms([roomName]);
  return rooms[0] || null;
}

/**
 * List participants in a room.
 */
export async function listParticipants(roomName: string) {
  const roomService = getRoomService();
  return roomService.listParticipants(roomName);
}

/**
 * Remove a participant from a room.
 */
export async function removeParticipant(roomName: string, identity: string) {
  const roomService = getRoomService();
  return roomService.removeParticipant(roomName, identity);
}

/**
 * Mute/unmute a participant's published track.
 */
export async function mutePublishedTrack(
  roomName: string,
  identity: string,
  trackSid: string,
  muted: boolean,
) {
  const roomService = getRoomService();
  return roomService.mutePublishedTrack(roomName, identity, trackSid, muted);
}

/**
 * Delete a room (kicks all participants).
 */
export async function deleteRoom(roomName: string) {
  const roomService = getRoomService();
  return roomService.deleteRoom(roomName);
}

/**
 * Start room composite recording (records the entire room as a single video).
 * Output goes to S3/R2.
 */
export async function startRoomCompositeRecording(
  roomName: string,
  options?: {
    layout?: 'grid' | 'speaker' | 'single-speaker';
    customBaseUrl?: string;
  },
) {
  const egressClient = getEgressClient();

  const s3Upload = new S3Upload({
    bucket: process.env.R2_BUCKET_NAME || 'livekit-recordings',
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    accessKey: process.env.R2_ACCESS_KEY || '',
    secret: process.env.R2_SECRET_KEY || '',
    forcePathStyle: true,
  });

  const fileOutput = new EncodedFileOutput({
    fileType: EncodedFileType.MP4,
    filepath: `recordings/${roomName}-${Date.now()}.mp4`,
    output: {
      case: 's3' as const,
      value: s3Upload,
    },
  });

  return egressClient.startRoomCompositeEgress(
    roomName,
    fileOutput,
    {
      layout: options?.layout || 'speaker',
      customBaseUrl: options?.customBaseUrl,
    },
  );
}

/**
 * Start track composite recording (records specific audio/video tracks).
 */
export async function startTrackCompositeRecording(
  roomName: string,
  audioTrackId: string,
  videoTrackId: string,
) {
  const egressClient = getEgressClient();

  const s3Upload = new S3Upload({
    bucket: process.env.R2_BUCKET_NAME || 'livekit-recordings',
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    accessKey: process.env.R2_ACCESS_KEY || '',
    secret: process.env.R2_SECRET_KEY || '',
    forcePathStyle: true,
  });

  const fileOutput = new EncodedFileOutput({
    fileType: EncodedFileType.MP4,
    filepath: `recordings/${roomName}-tracks-${Date.now()}.mp4`,
    output: {
      case: 's3' as const,
      value: s3Upload,
    },
  });

  return egressClient.startTrackCompositeEgress(
    roomName,
    fileOutput,
    audioTrackId,
    videoTrackId,
  );
}

/**
 * Stop an active recording.
 */
export async function stopRecording(egressId: string) {
  const egressClient = getEgressClient();
  return egressClient.stopEgress(egressId);
}

/**
 * List all active recordings (optionally filtered by room).
 */
export async function listRecordings(roomName?: string) {
  const egressClient = getEgressClient();
  return egressClient.listEgress({
    roomName,
  });
}

/**
 * Update room metadata.
 */
export async function updateRoomMetadata(roomName: string, metadata: string) {
  const roomService = getRoomService();
  return roomService.updateRoomMetadata(roomName, metadata);
}

/**
 * Update participant metadata (e.g., raise hand status).
 */
export async function updateParticipantMetadata(
  roomName: string,
  identity: string,
  metadata: string,
  name?: string,
) {
  const roomService = getRoomService();
  return roomService.updateParticipant(roomName, identity, {
    metadata,
    name,
  });
}
