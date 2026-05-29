import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth-middleware';

// GET /api/live-rooms/stats — User's live stats
export async function GET(request: NextRequest) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;

    const stats = await db.userLiveStats.upsert({
      where: { userId: authResult.userId },
      create: { userId: authResult.userId },
      update: {},
    });

    return NextResponse.json({ stats });
  } catch (error: any) {
    console.error('[live-rooms/stats] GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
