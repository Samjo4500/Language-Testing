import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser } from '@/lib/auth-middleware';

export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.userId;

    // Total learned words
    const totalLearned = await db.userVocabProgress.count({
      where: { userId },
    });

    // Total reviews done - fetch all progress records at once
    const progressRecords = await db.userVocabProgress.findMany({
      where: { userId },
      select: { totalReviews: true, box: true },
    });
    const totalReviewed = progressRecords.reduce((sum, p) => sum + p.totalReviews, 0);

    // Words by box - calculate from already fetched records (no extra query)
    const wordsByBox: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const p of progressRecords) {
      if (p.box >= 1 && p.box <= 5) {
        wordsByBox[p.box]++;
      }
    }

    // Today's reviews
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayReviewed = await db.userVocabProgress.count({
      where: {
        userId,
        lastReviewed: { gte: todayStart },
      },
    });

    // Streak days - simplified: check last 30 days only
    let streakDays = 0;
    const checkDate = new Date();
    checkDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < 30; i++) {
      const dayStart = new Date(checkDate);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(checkDate);
      dayEnd.setHours(23, 59, 59, 999);

      const reviewedOnDay = await db.userVocabProgress.count({
        where: {
          userId,
          lastReviewed: { gte: dayStart, lte: dayEnd },
        },
      });

      if (reviewedOnDay > 0) {
        streakDays++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        if (i === 0) {
          checkDate.setDate(checkDate.getDate() - 1);
          continue;
        }
        break;
      }
    }

    // Words due for review
    const dueForReview = await db.userVocabProgress.count({
      where: {
        userId,
        nextReview: { lte: new Date() },
      },
    });

    // Level progress - efficient approach
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const levelProgress: Record<string, { learned: number; total: number }> = {};

    // Get total words per level
    for (const level of levels) {
      const total = await db.vocabWord.count({
        where: { level, isActive: true },
      });

      // Count learned words for this level
      const learnedWordIds = await db.userVocabProgress.findMany({
        where: { userId },
        select: { wordId: true },
      });

      let learned = 0;
      if (learnedWordIds.length > 0) {
        learned = await db.vocabWord.count({
          where: {
            id: { in: learnedWordIds.map(p => p.wordId) },
            level,
            isActive: true,
          },
        });
      }

      levelProgress[level] = { learned, total };
    }

    // Total available words
    const totalAvailable = await db.vocabWord.count({
      where: { isActive: true },
    });

    return NextResponse.json({
      totalLearned,
      totalReviewed,
      wordsByBox,
      todayReviewed,
      streakDays,
      dueForReview,
      levelProgress,
      totalAvailable,
    });
  } catch (error) {
    console.error('Vocab stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch vocabulary stats.' }, { status: 500 });
  }
}
