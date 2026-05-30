import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser } from '@/lib/auth-middleware';
import { escapeHtml } from '@/lib/sanitize';

// GET: List comments for a moment
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ momentId: string }> }
) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { momentId } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      db.momentComment.findMany({
        where: { momentId },
        include: {
          user: {
            select: { id: true, name: true, avatarUrl: true },
          },
        },
        orderBy: { createdAt: 'asc' },
        skip,
        take: limit,
      }),
      db.momentComment.count({ where: { momentId } }),
    ]);

    return NextResponse.json({
      comments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('List comments error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

// POST: Add a comment
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ momentId: string }> }
) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { momentId } = await params;
    const body = await request.json();
    const { content, isCorrection, correctedText } = body;

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: 'Content is required.' }, { status: 400 });
    }

    if (content.length > 500) {
      return NextResponse.json({ error: 'Comment must be 500 characters or less.' }, { status: 400 });
    }

    const moment = await db.moment.findUnique({
      where: { id: momentId },
      select: { id: true, isDeleted: true },
    });

    if (!moment || moment.isDeleted) {
      return NextResponse.json({ error: 'Moment not found.' }, { status: 404 });
    }

    const comment = await db.momentComment.create({
      data: {
        momentId,
        userId: user.userId,
        content: escapeHtml(content.trim()),
        isCorrection: isCorrection || false,
        correctedText: correctedText ? escapeHtml(correctedText.trim()) : null,
      },
      include: {
        user: {
          select: { id: true, name: true, avatarUrl: true },
        },
      },
    });

    // Update comment count
    await db.moment.update({
      where: { id: momentId },
      data: { commentsCount: { increment: 1 } },
    });

    // Update trust score for commenting
    await db.user.update({
      where: { id: user.userId },
      data: { trustScore: { increment: 1 } },
    });

    return NextResponse.json({ comment });
  } catch (error) {
    console.error('Create comment error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
