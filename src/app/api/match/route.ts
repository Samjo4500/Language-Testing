import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth-middleware';
import { generateToken, createRoom as createLiveKitRoom } from '@/lib/livekit';

// POST /api/match — Request 1-on-1 match
export async function POST(request: NextRequest) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;
    const user = authResult;

    const body = await request.json();
    const { level, topic } = body;

    // Check if user already has an active match request
    const existing = await db.oneOnOneMatch.findFirst({
      where: { user1Id: user.userId, status: 'waiting' },
    });
    if (existing) {
      return NextResponse.json({ match: existing, status: 'already_waiting', queuePosition: 1 });
    }

    // Try to find a waiting match
    const waitingMatch = await db.oneOnOneMatch.findFirst({
      where: {
        status: 'waiting',
        user1Id: { not: user.userId },
        ...(level ? { level } : {}),
        ...(topic ? { topic } : {}),
      },
      orderBy: { startedAt: 'asc' },
    });

    if (waitingMatch) {
      // Match found!
      const roomName = waitingMatch.roomName;
      await db.oneOnOneMatch.update({
        where: { id: waitingMatch.id },
        data: { user2Id: user.userId, status: 'matched' },
      });

      // Create LiveKit room
      try {
        await createLiveKitRoom(roomName, { maxParticipants: 2, emptyTimeout: 60 });
      } catch { /* ok */ }

      // Generate tokens for both users
      const token2 = await generateToken(user.userId, '', roomName, 'participant', JSON.stringify({ matchId: waitingMatch.id }));

      const livekitUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || '';

      return NextResponse.json({
        status: 'matched',
        match: waitingMatch,
        roomName,
        token: token2,
        url: livekitUrl,
        joinUrl: `/speakspace/${roomName}`,
      });
    }

    // No match found — create waiting entry
    const roomName = `match-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const match = await db.oneOnOneMatch.create({
      data: {
        user1Id: user.userId,
        roomName,
        level: level || null,
        topic: topic || null,
        status: 'waiting',
      },
    });

    return NextResponse.json({ status: 'waiting', match, queuePosition: 1 });
  } catch (error) {
    console.error('[Match POST]', error);
    return NextResponse.json({ error: 'Failed to request match' }, { status: 500 });
  }
}

// DELETE /api/match — Cancel match request
export async function DELETE(request: NextRequest) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;
    const user = authResult;

    await db.oneOnOneMatch.updateMany({
      where: { user1Id: user.userId, status: 'waiting' },
      data: { status: 'ended', endedAt: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to cancel match' }, { status: 500 });
  }
}

// GET /api/match — Check queue position
export async function GET(request: NextRequest) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;
    const user = authResult;

    const match = await db.oneOnOneMatch.findFirst({
      where: {
        OR: [
          { user1Id: user.userId, status: { in: ['waiting', 'matched', 'active'] } },
          { user2Id: user.userId, status: { in: ['matched', 'active'] } },
        ],
      },
      orderBy: { startedAt: 'desc' },
    });

    if (!match) return NextResponse.json({ status: 'none' });

    const queuePosition = match.status === 'waiting'
      ? await db.oneOnOneMatch.count({ where: { status: 'waiting', startedAt: { lte: match.startedAt } } })
      : 0;

    const livekitUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || '';

    return NextResponse.json({
      status: match.status,
      match,
      queuePosition,
      joinUrl: match.status === 'matched' || match.status === 'active' ? `/speakspace/${match.roomName}` : null,
      url: livekitUrl,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to check match' }, { status: 500 });
  }
}
