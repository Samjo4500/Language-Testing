import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth-middleware';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET: Return user's speaking sessions (last 20)
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

    const sessions = await db.speakingSession.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    // Calculate aggregate stats
    const totalSessions = sessions.length;
    const averageScore = totalSessions > 0
      ? Math.round(sessions.reduce((sum, s) => sum + s.score, 0) / totalSessions)
      : 0;
    const totalDuration = sessions.reduce((sum, s) => sum + s.duration, 0);
    const averageWpm = sessions.filter((s) => s.wordsPerMinute).length > 0
      ? Math.round(
          sessions
            .filter((s) => s.wordsPerMinute)
            .reduce((sum, s) => sum + (s.wordsPerMinute || 0), 0) /
          sessions.filter((s) => s.wordsPerMinute).length
        )
      : 0;

    // Score trend (last 5 sessions)
    const recentScores = sessions.slice(0, 5).map((s) => s.score).reverse();

    return NextResponse.json({
      sessions,
      summary: {
        totalSessions,
        averageScore,
        totalDuration,
        averageWpm,
        recentScores,
      },
    });
  } catch (error) {
    console.error('[speaking/sessions] GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to fetch speaking sessions.' },
      { status: 500 }
    );
  }
}

// POST: Save a speaking session
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
    const { duration, score, wordsPerMinute, pauseCount, topics, errors } = body;

    if (typeof duration !== 'number' || duration <= 0) {
      return NextResponse.json(
        { error: 'Bad request', message: 'duration (positive number) is required.' },
        { status: 400 }
      );
    }

    if (typeof score !== 'number' || score < 0 || score > 100) {
      return NextResponse.json(
        { error: 'Bad request', message: 'score (0-100) is required.' },
        { status: 400 }
      );
    }

    const userId = user.userId;

    const session = await db.speakingSession.create({
      data: {
        userId,
        duration,
        score,
        wordsPerMinute: wordsPerMinute ?? null,
        pauseCount: pauseCount ?? 0,
        topics: typeof topics === 'object' ? JSON.stringify(topics) : '[]',
        errors: typeof errors === 'object' ? JSON.stringify(errors) : '[]',
      },
    });

    // Award XP for speaking practice
    const existingStats = await db.gamificationStats.findUnique({
      where: { userId },
    });

    if (existingStats) {
      await db.gamificationStats.update({
        where: { userId },
        data: {
          xp: existingStats.xp + 20,
        },
      });
    }

    return NextResponse.json({
      message: 'Speaking session saved successfully.',
      session,
    });
  } catch (error) {
    console.error('[speaking/sessions] POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to save speaking session.' },
      { status: 500 }
    );
  }
}
