import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser } from '@/lib/auth-middleware';
import { escapeHtml } from '@/lib/sanitize';

// GET: List moments (paginated, newest first)
export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
    const skip = (page - 1) * limit;

    const [moments, total] = await Promise.all([
      db.moment.findMany({
        where: { isDeleted: false },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
              englishLevel: true,
              interests: true,
              isVerified: true,
              emailVerified: true,
              isProfileComplete: true,
            },
          },
          comments: {
            take: 3,
            orderBy: { createdAt: 'desc' },
            include: {
              user: {
                select: { id: true, name: true, avatarUrl: true },
              },
            },
          },
          likes: {
            where: { userId: user.userId },
            select: { id: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      db.moment.count({ where: { isDeleted: false } }),
    ]);

    const results = moments.map((m) => ({
      id: m.id,
      userId: m.userId,
      content: m.content,
      imageUrl: m.imageUrl,
      audioUrl: m.audioUrl,
      language: m.language,
      tags: m.tags ? JSON.parse(m.tags) : [],
      likesCount: m.likesCount,
      commentsCount: m.commentsCount,
      isLikedByMe: m.likes.length > 0,
      createdAt: m.createdAt,
      user: {
        ...m.user,
        interests: m.user.interests ? JSON.parse(m.user.interests) : [],
      },
      comments: m.comments.map((c) => ({
        id: c.id,
        content: c.content,
        isCorrection: c.isCorrection,
        correctedText: c.correctedText,
        createdAt: c.createdAt,
        user: c.user,
      })),
    }));

    return NextResponse.json({
      moments: results,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('List moments error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

// POST: Create a new moment
export async function POST(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { content, imageUrl, audioUrl, language, tags } = body;

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: 'Content is required.' }, { status: 400 });
    }

    if (content.length > 1000) {
      return NextResponse.json({ error: 'Content must be 1000 characters or less.' }, { status: 400 });
    }

    const moment = await db.moment.create({
      data: {
        userId: user.userId,
        content: escapeHtml(content.trim()),
        imageUrl: imageUrl || null,
        audioUrl: audioUrl || null,
        language: language || null,
        tags: tags ? JSON.stringify(tags) : null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            englishLevel: true,
            interests: true,
            isVerified: true,
            emailVerified: true,
            isProfileComplete: true,
          },
        },
      },
    });

    // Update trust score for posting
    await db.user.update({
      where: { id: user.userId },
      data: { trustScore: { increment: 2 } },
    });

    return NextResponse.json({
      moment: {
        ...moment,
        tags: moment.tags ? JSON.parse(moment.tags) : [],
        user: {
          ...moment.user,
          interests: moment.user.interests ? JSON.parse(moment.user.interests) : [],
        },
      },
    });
  } catch (error) {
    console.error('Create moment error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
