import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth-middleware';

// GET /api/match/queue — Check match queue position
export async function GET(request: NextRequest) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;

    // Check for active/waiting matches
    const match = await db.oneOnOneMatch.findFirst({
      where: {
        OR: [
          { user1Id: authResult.userId, status: { in: ['waiting', 'matched', 'active'] } },
          { user2Id: authResult.userId, status: { in: ['matched', 'active'] } },
        ],
      },
    });

    if (!match) {
      return NextResponse.json({ status: 'none', queuePosition: 0 });
    }

    let queuePosition = 0;
    if (match.status === 'waiting') {
      queuePosition = await db.oneOnOneMatch.count({
        where: {
          status: 'waiting',
          startedAt: { lte: match.startedAt },
        },
      });
    }

    return NextResponse.json({
      status: match.status,
      matchId: match.id,
      roomName: match.roomName,
      queuePosition,
      partnerId: match.user2Id || null,
    });
  } catch (error: any) {
    console.error('[match/queue] GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
