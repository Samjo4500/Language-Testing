import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth-middleware';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET: Return user's writing drafts
export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'You must be logged in.' },
        { status: 401 }
      );
    }

    const userId = user.userId;
    const url = new URL(request.url);
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 50);
    const offset = parseInt(url.searchParams.get('offset') || '0');

    const [drafts, totalCount] = await Promise.all([
      db.writingDraft.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      db.writingDraft.count({
        where: { userId },
      }),
    ]);

    return NextResponse.json({
      drafts,
      totalCount,
      hasMore: offset + limit < totalCount,
    });
  } catch (error) {
    console.error('[writing/drafts] GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to fetch writing drafts.' },
      { status: 500 }
    );
  }
}

// POST: Save a writing draft
export async function POST(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'You must be logged in.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, content, cefrEstimate, analysis } = body;

    if (content === undefined || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Bad request', message: 'content is required.' },
        { status: 400 }
      );
    }

    const userId = user.userId;

    const draft = await db.writingDraft.create({
      data: {
        userId,
        title: title || 'Untitled',
        content,
        cefrEstimate: cefrEstimate || null,
        analysis: analysis ? (typeof analysis === 'object' ? JSON.stringify(analysis) : analysis) : '{}',
      },
    });

    // Award XP for writing practice
    const existingStats = await db.gamificationStats.findUnique({
      where: { userId },
    });

    if (existingStats) {
      await db.gamificationStats.update({
        where: { userId },
        data: {
          xp: existingStats.xp + 25,
        },
      });
    }

    return NextResponse.json({
      message: 'Writing draft saved successfully.',
      draft,
    });
  } catch (error) {
    console.error('[writing/drafts] POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to save writing draft.' },
      { status: 500 }
    );
  }
}
