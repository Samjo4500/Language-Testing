import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser } from '@/lib/auth-middleware';

// ── Types ───────────────────────────────────────────────────────────────────

interface AttemptBody {
  wordId: string;
  exerciseType: 'fill_gap' | 'sentence_builder' | 'multiple_choice';
  isCorrect: boolean;
  score: number;
  timeSpentMs: number;
  usedHint?: boolean;
  attempts?: number;
}

interface UpdatedProgress {
  status: string;
  masteryScore: number;
  correctStreak: number;
  box: number;
  nextReview: string;
}

// ── Leitner System Configuration ────────────────────────────────────────────

const BOX_INTERVALS_DAYS: Record<number, number> = {
  1: 1,    // Box 1: review in 1 day
  2: 3,    // Box 2: review in 3 days
  3: 7,    // Box 3: review in 7 days
  4: 14,   // Box 4: review in 14 days
  5: 30,   // Box 5: review in 30 days
};

// ── Route Handler ───────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: AttemptBody = await request.json();
    const { wordId, exerciseType, isCorrect, score, timeSpentMs, usedHint, attempts } = body;

    // ── Validate required fields ──────────────────────────────────────────
    if (!wordId || typeof isCorrect !== 'boolean') {
      return NextResponse.json(
        { error: 'wordId and isCorrect (boolean) are required.' },
        { status: 400 }
      );
    }

    if (!exerciseType || !['fill_gap', 'sentence_builder', 'multiple_choice'].includes(exerciseType)) {
      return NextResponse.json(
        { error: 'exerciseType must be one of: fill_gap, sentence_builder, multiple_choice' },
        { status: 400 }
      );
    }

    if (typeof score !== 'number' || score < 0) {
      return NextResponse.json(
        { error: 'score must be a non-negative number.' },
        { status: 400 }
      );
    }

    if (typeof timeSpentMs !== 'number' || timeSpentMs < 0) {
      return NextResponse.json(
        { error: 'timeSpentMs must be a non-negative number.' },
        { status: 400 }
      );
    }

    // ── Verify the word exists ────────────────────────────────────────────
    const word = await db.vocabWord.findUnique({ where: { id: wordId } });
    if (!word) {
      return NextResponse.json({ error: 'Word not found.' }, { status: 404 });
    }

    // ── Create ExerciseAttempt record ─────────────────────────────────────
    await db.exerciseAttempt.create({
      data: {
        userId: user.userId,
        wordId,
        exerciseType,
        isCorrect,
        score,
        timeSpentMs,
        usedHint: usedHint ?? false,
        attempts: attempts ?? 1,
      },
    });

    // ── Update UserVocabProgress ──────────────────────────────────────────
    const existingProgress = await db.userVocabProgress.findUnique({
      where: {
        userId_wordId: { userId: user.userId, wordId },
      },
    });

    let newBox: number;
    let newCorrectStreak: number;
    let newTotalReviews: number;
    let newTimesIncorrect: number;
    let newMasteryScore: number;
    let newStatus: string;
    let newBestScore: number;

    if (existingProgress) {
      // ── Update existing progress ──────────────────────────────────────
      newTotalReviews = existingProgress.totalReviews + 1;
      newBestScore = Math.max(existingProgress.bestScore, score);

      if (isCorrect) {
        newCorrectStreak = existingProgress.correctStreak + 1;
        newTimesIncorrect = existingProgress.timesIncorrect;
        // Mastery increase: +10 for correct, +5 if hint was used
        const masteryGain = usedHint ? 5 : 10;
        newMasteryScore = Math.min(100, existingProgress.masteryScore + masteryGain);
        // Promote to next box (max 5)
        newBox = Math.min(existingProgress.box + 1, 5);
      } else {
        newCorrectStreak = 0;
        newTimesIncorrect = existingProgress.timesIncorrect + 1;
        // Mastery decrease
        newMasteryScore = Math.max(0, existingProgress.masteryScore - 5);
        // Demote to box 1
        newBox = 1;
      }

      // ── Status transitions ─────────────────────────────────────────────
      newStatus = existingProgress.status;

      if (newStatus === 'new' && newCorrectStreak >= 1) {
        newStatus = 'learning';
      }

      if (newStatus === 'learning' && newCorrectStreak >= 3 && newMasteryScore >= 80) {
        newStatus = 'mastered';
      }

      // mastered → needs_review: last correct review was > 7 days ago
      if (newStatus === 'mastered' && !isCorrect) {
        newStatus = 'needs_review';
      }

      // needs_review → learning: user answers correctly again
      if (newStatus === 'needs_review' && isCorrect && newCorrectStreak >= 1) {
        newStatus = 'learning';
      }

      // Also check: mastered → needs_review if last correct was > 7 days
      if (newStatus === 'mastered' && existingProgress.lastReviewed) {
        const daysSinceLastReview =
          (Date.now() - existingProgress.lastReviewed.getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceLastReview > 7) {
          newStatus = 'needs_review';
        }
      }

      // learning → mastered if streak >= 3 and mastery >= 80 (re-check after status changes)
      if (newStatus === 'learning' && newCorrectStreak >= 3 && newMasteryScore >= 80) {
        newStatus = 'mastered';
      }

      // Calculate next review based on Leitner box
      const intervalDays = BOX_INTERVALS_DAYS[newBox] || 1;
      const newNextReview = new Date(Date.now() + intervalDays * 24 * 60 * 60 * 1000);

      await db.userVocabProgress.update({
        where: { id: existingProgress.id },
        data: {
          box: newBox,
          nextReview: newNextReview,
          correctStreak: newCorrectStreak,
          totalReviews: newTotalReviews,
          timesIncorrect: newTimesIncorrect,
          masteryScore: newMasteryScore,
          status: newStatus,
          bestScore: newBestScore,
          lastReviewed: new Date(),
        },
      });

      const updatedProgress: UpdatedProgress = {
        status: newStatus,
        masteryScore: newMasteryScore,
        correctStreak: newCorrectStreak,
        box: newBox,
        nextReview: newNextReview.toISOString(),
      };

      return NextResponse.json({ success: true, updatedProgress });
    } else {
      // ── Create new progress record ────────────────────────────────────
      newTotalReviews = 1;
      newBestScore = score;

      if (isCorrect) {
        newCorrectStreak = 1;
        newTimesIncorrect = 0;
        newMasteryScore = usedHint ? 5 : 10;
        newBox = 2; // First correct answer promotes to box 2
        newStatus = 'learning'; // 1+ correct → learning
      } else {
        newCorrectStreak = 0;
        newTimesIncorrect = 1;
        newMasteryScore = 0;
        newBox = 1;
        newStatus = 'new'; // Still new, hasn't gotten one right yet
      }

      const intervalDays = BOX_INTERVALS_DAYS[newBox] || 1;
      const newNextReview = new Date(Date.now() + intervalDays * 24 * 60 * 60 * 1000);

      await db.userVocabProgress.create({
        data: {
          userId: user.userId,
          wordId,
          box: newBox,
          nextReview: newNextReview,
          correctStreak: newCorrectStreak,
          totalReviews: newTotalReviews,
          timesIncorrect: newTimesIncorrect,
          masteryScore: newMasteryScore,
          status: newStatus,
          bestScore: newBestScore,
          lastReviewed: new Date(),
        },
      });

      const updatedProgress: UpdatedProgress = {
        status: newStatus,
        masteryScore: newMasteryScore,
        correctStreak: newCorrectStreak,
        box: newBox,
        nextReview: newNextReview.toISOString(),
      };

      return NextResponse.json({ success: true, updatedProgress });
    }
  } catch (error) {
    console.error('Vocabulary attempt POST error:', error);
    return NextResponse.json(
      { error: 'Failed to record exercise attempt.' },
      { status: 500 }
    );
  }
}
