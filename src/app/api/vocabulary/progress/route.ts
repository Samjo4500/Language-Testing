import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser } from '@/lib/auth-middleware';

// ── Types ───────────────────────────────────────────────────────────────────

interface ProgressResponse {
  totalWords: number;
  mastered: number;
  learning: number;
  needsReview: number;
  new: number;
  streak: number;
  lastPracticed: string | null;
  weeklyXP: number;
}

// ── Route Handler ───────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.userId;

    // ── Fetch all progress records for the user ───────────────────────────
    const progressRecords = await db.userVocabProgress.findMany({
      where: { userId },
      select: {
        status: true,
        totalReviews: true,
        lastReviewed: true,
      },
    });

    // ── Count words by status ─────────────────────────────────────────────
    let mastered = 0;
    let learning = 0;
    let needsReview = 0;
    let newWords = 0;

    for (const p of progressRecords) {
      switch (p.status) {
        case 'mastered':
          mastered++;
          break;
        case 'learning':
          learning++;
          break;
        case 'needs_review':
          needsReview++;
          break;
        case 'new':
        default:
          newWords++;
          break;
      }
    }

    // ── Total words (all progress records) ────────────────────────────────
    const totalWords = progressRecords.length;

    // ── Calculate streak (consecutive days with at least 1 practice) ──────
    const streak = await calculateStreak(userId);

    // ── Find last practiced date ──────────────────────────────────────────
    let lastPracticed: string | null = null;
    const reviewedRecords = progressRecords
      .filter((p) => p.lastReviewed !== null)
      .sort((a, b) => new Date(b.lastReviewed!).getTime() - new Date(a.lastReviewed!).getTime());

    if (reviewedRecords.length > 0) {
      lastPracticed = reviewedRecords[0].lastReviewed!.toISOString();
    }

    // ── Calculate weekly XP ───────────────────────────────────────────────
    const weeklyXP = await calculateWeeklyXP(userId);

    // ── Build response ────────────────────────────────────────────────────
    const response: ProgressResponse = {
      totalWords,
      mastered,
      learning,
      needsReview,
      new: newWords,
      streak,
      lastPracticed,
      weeklyXP,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Vocabulary progress GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vocabulary progress.' },
      { status: 500 }
    );
  }
}

// ── Helper: Calculate streak ────────────────────────────────────────────────

async function calculateStreak(userId: string): Promise<number> {
  // Get all distinct dates the user practiced (last 365 days)
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const progressWithDates = await db.userVocabProgress.findMany({
    where: {
      userId,
      lastReviewed: { gte: oneYearAgo, not: null },
    },
    select: { lastReviewed: true },
    orderBy: { lastReviewed: 'desc' },
  });

  if (progressWithDates.length === 0) return 0;

  // Extract unique dates (YYYY-MM-DD)
  const practiceDates = new Set<string>();
  for (const p of progressWithDates) {
    if (p.lastReviewed) {
      const dateStr = p.lastReviewed.toISOString().split('T')[0];
      practiceDates.add(dateStr);
    }
  }

  // Count consecutive days starting from today (or yesterday if no practice today)
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check today first
  const todayStr = today.toISOString().split('T')[0];
  let checkDate = new Date(today);

  if (!practiceDates.has(todayStr)) {
    // If no practice today, start checking from yesterday
    checkDate.setDate(checkDate.getDate() - 1);
    const yesterdayStr = checkDate.toISOString().split('T')[0];
    if (!practiceDates.has(yesterdayStr)) {
      return 0; // No practice today or yesterday → streak broken
    }
  }

  // Count consecutive days
  for (let i = 0; i < 365; i++) {
    const dateStr = checkDate.toISOString().split('T')[0];
    if (practiceDates.has(dateStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

// ── Helper: Calculate weekly XP ─────────────────────────────────────────────

async function calculateWeeklyXP(userId: string): Promise<number> {
  // XP calculation:
  // - 10 points per correct answer
  // - Speed bonus: +5 if answered in < 5 seconds
  // - Streak bonus: +3 per correct answer if current correctStreak > 2

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const recentAttempts = await db.exerciseAttempt.findMany({
    where: {
      userId,
      createdAt: { gte: sevenDaysAgo },
    },
    select: {
      isCorrect: true,
      timeSpentMs: true,
    },
  });

  let weeklyXP = 0;

  for (const attempt of recentAttempts) {
    if (attempt.isCorrect) {
      // Base points for correct answer
      weeklyXP += 10;

      // Speed bonus: answered in under 5 seconds
      if (attempt.timeSpentMs < 5000) {
        weeklyXP += 5;
      }
    }
  }

  // Streak bonus: check if user has a current correctStreak > 2 on any word
  const activeStreaks = await db.userVocabProgress.findMany({
    where: {
      userId,
      correctStreak: { gt: 2 },
    },
    select: { correctStreak: true },
  });

  // Add streak bonus: +3 for each word with active streak > 2
  for (const s of activeStreaks) {
    weeklyXP += 3;
  }

  return weeklyXP;
}
