import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser } from '@/lib/auth-middleware';

// GET /api/vocab?level=A1&category=general&page=1&limit=20&mode=learn
export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const level = searchParams.get('level');
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const mode = searchParams.get('mode') || 'learn';
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    // Build where clause for VocabWord
    const wordWhere: Record<string, unknown> = {
      isActive: true,
    };
    if (level) wordWhere.level = level;
    if (category) wordWhere.category = category;
    if (search) {
      wordWhere.word = { contains: search };
    }

    if (mode === 'learn') {
      // Words the user hasn't learned yet (no UserVocabProgress record)
      const learnedWordIds = await db.userVocabProgress.findMany({
        where: { userId: user.userId },
        select: { wordId: true },
      });
      const learnedIds = learnedWordIds.map((p) => p.wordId);

      const words = await db.vocabWord.findMany({
        where: {
          ...wordWhere,
          id: { notIn: learnedIds },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'asc' },
      });

      const total = await db.vocabWord.count({
        where: {
          ...wordWhere,
          id: { notIn: learnedIds },
        },
      });

      return NextResponse.json({
        words,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      });
    } else if (mode === 'review') {
      // Words due for review (nextReview <= now)
      const now = new Date();
      const dueProgress = await db.userVocabProgress.findMany({
        where: {
          userId: user.userId,
          nextReview: { lte: now },
        },
        select: { wordId: true },
      });
      const dueWordIds = dueProgress.map((p) => p.wordId);

      const words = await db.vocabWord.findMany({
        where: {
          ...wordWhere,
          id: { in: dueWordIds },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'asc' },
        include: {
          progress: {
            where: { userId: user.userId },
            take: 1,
          },
        },
      });

      const total = await db.vocabWord.count({
        where: {
          ...wordWhere,
          id: { in: dueWordIds },
        },
      });

      return NextResponse.json({
        words: words.map((w) => ({
          ...w,
          progress: w.progress[0] || null,
        })),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      });
    } else if (mode === 'mywords') {
      // All learned words with progress
      const progressRecords = await db.userVocabProgress.findMany({
        where: { userId: user.userId },
        select: { wordId: true },
      });
      const myWordIds = progressRecords.map((p) => p.wordId);

      const words = await db.vocabWord.findMany({
        where: {
          ...wordWhere,
          id: { in: myWordIds },
        },
        skip,
        take: limit,
        orderBy: { word: 'asc' },
        include: {
          progress: {
            where: { userId: user.userId },
            take: 1,
          },
        },
      });

      const total = await db.vocabWord.count({
        where: {
          ...wordWhere,
          id: { in: myWordIds },
        },
      });

      return NextResponse.json({
        words: words.map((w) => ({
          ...w,
          progress: w.progress[0] || null,
        })),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      });
    }

    return NextResponse.json({ error: 'Invalid mode. Use learn, review, or mywords.' }, { status: 400 });
  } catch (error) {
    console.error('Vocab GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch vocabulary.' }, { status: 500 });
  }
}

// POST /api/vocab — Submit a review answer
export async function POST(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { wordId, correct } = body;

    if (!wordId || typeof correct !== 'boolean') {
      return NextResponse.json(
        { error: 'wordId and correct (boolean) are required.' },
        { status: 400 }
      );
    }

    // Verify the word exists
    const word = await db.vocabWord.findUnique({
      where: { id: wordId },
    });
    if (!word) {
      return NextResponse.json({ error: 'Word not found.' }, { status: 404 });
    }

    // Leitner box intervals in minutes
    const BOX_INTERVALS: Record<number, number> = {
      1: 1,       // 1 minute
      2: 10,      // 10 minutes
      3: 1440,    // 1 day
      4: 4320,    // 3 days
      5: 10080,   // 7 days
    };

    const existingProgress = await db.userVocabProgress.findUnique({
      where: {
        userId_wordId: { userId: user.userId, wordId },
      },
    });

    let newBox: number;
    let newNextReview: Date;
    let newCorrectStreak: number;
    let newTotalReviews: number;

    if (existingProgress) {
      // Update existing progress
      newTotalReviews = existingProgress.totalReviews + 1;

      if (correct) {
        newBox = Math.min(existingProgress.box + 1, 5);
        newCorrectStreak = existingProgress.correctStreak + 1;
      } else {
        newBox = 1;
        newCorrectStreak = 0;
      }

      const intervalMinutes = BOX_INTERVALS[newBox] || 1;
      newNextReview = new Date(Date.now() + intervalMinutes * 60 * 1000);

      const updated = await db.userVocabProgress.update({
        where: { id: existingProgress.id },
        data: {
          box: newBox,
          nextReview: newNextReview,
          correctStreak: newCorrectStreak,
          totalReviews: newTotalReviews,
          lastReviewed: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        progress: updated,
        word: { id: word.id, word: word.word },
      });
    } else {
      // Create new progress
      newTotalReviews = 1;

      if (correct) {
        newBox = 2;
        newCorrectStreak = 1;
      } else {
        newBox = 1;
        newCorrectStreak = 0;
      }

      const intervalMinutes = BOX_INTERVALS[newBox] || 1;
      newNextReview = new Date(Date.now() + intervalMinutes * 60 * 1000);

      const created = await db.userVocabProgress.create({
        data: {
          userId: user.userId,
          wordId,
          box: newBox,
          nextReview: newNextReview,
          correctStreak: newCorrectStreak,
          totalReviews: newTotalReviews,
          lastReviewed: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        progress: created,
        word: { id: word.id, word: word.word },
      });
    }
  } catch (error) {
    console.error('Vocab POST error:', error);
    return NextResponse.json({ error: 'Failed to submit review.' }, { status: 500 });
  }
}
