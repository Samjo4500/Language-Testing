import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth-middleware';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET: Return user's conversation history and weak areas
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

    // Get conversation history
    const [conversations, totalCount, weakAreas] = await Promise.all([
      db.lexiConversation.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      db.lexiConversation.count({
        where: { userId },
      }),
      db.weakArea.findMany({
        where: { userId },
        orderBy: [
          { severity: 'desc' },
          { timesPracticed: 'asc' },
        ],
        take: 20,
      }),
    ]);

    // Get topic summary
    const topicSummary: Record<string, number> = {};
    conversations.forEach((c) => {
      if (c.topic) {
        topicSummary[c.topic] = (topicSummary[c.topic] || 0) + 1;
      }
    });

    return NextResponse.json({
      conversations,
      totalCount,
      hasMore: offset + limit < totalCount,
      weakAreas,
      topicSummary,
    });
  } catch (error) {
    console.error('[lexi/memory] GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to fetch lexi memory.' },
      { status: 500 }
    );
  }
}

// POST: Save a conversation
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
    const { userMessage, lexiResponse, topic, sentiment } = body;

    if (!userMessage || typeof userMessage !== 'string') {
      return NextResponse.json(
        { error: 'Bad request', message: 'userMessage is required.' },
        { status: 400 }
      );
    }

    if (!lexiResponse || typeof lexiResponse !== 'string') {
      return NextResponse.json(
        { error: 'Bad request', message: 'lexiResponse is required.' },
        { status: 400 }
      );
    }

    const userId = user.userId;

    const conversation = await db.lexiConversation.create({
      data: {
        userId,
        userMessage,
        lexiResponse,
        topic: topic || null,
        sentiment: sentiment || null,
      },
    });

    return NextResponse.json({
      message: 'Conversation saved successfully.',
      conversation,
    });
  } catch (error) {
    console.error('[lexi/memory] POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to save conversation.' },
      { status: 500 }
    );
  }
}
