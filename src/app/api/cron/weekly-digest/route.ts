import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { send as sendWeeklyProgress } from '@/lib/email/templates/weekly-progress';

/**
 * Cron endpoint to send weekly progress digest emails.
 *
 * Called by Vercel Cron (see vercel.json) or manually.
 * Queries users who were active in the past 7 days and sends them
 * a weekly progress email with their XP, words learned, and streak info.
 *
 * Security: Requires CRON_SECRET env var to prevent unauthorized calls.
 */

export async function GET(request: NextRequest) {
  // Verify authorization
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  // Fail-closed: if CRON_SECRET is set, it MUST match
  // If CRON_SECRET is not set, only allow in development mode
  if (cronSecret) {
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  } else if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Cron not configured' }, { status: 503 });
  }

  try {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // Find users who were active in the past week (had vocab exercises or assessments)
    const activeUsers = await db.user.findMany({
      where: {
        OR: [
          {
            vocabProgress: {
              some: {
                lastReviewed: { gte: oneWeekAgo },
              },
            },
          },
          {
            assessments: {
              some: {
                completedAt: { gte: oneWeekAgo },
              },
            },
          },
        ],
        isSuspended: false,
        status: 'active',
      },
      select: {
        id: true,
        email: true,
        name: true,
        vocabProgress: {
          where: {
            lastReviewed: { gte: oneWeekAgo },
          },
          select: {
            masteryScore: true,
            status: true,
            correctStreak: true,
            lastReviewed: true,
          },
        },
      },
    });

    let sentCount = 0;
    let errorCount = 0;

    for (const user of activeUsers) {
      try {
        // Calculate weekly stats from user's vocab progress
        const progressEntries = user.vocabProgress;

        // XP earned: count exercise attempts this week
        const exerciseAttempts = await db.exerciseAttempt.findMany({
          where: {
            userId: user.id,
            createdAt: { gte: oneWeekAgo },
          },
          select: {
            isCorrect: true,
            score: true,
            timeSpentMs: true,
          },
        });

        // Calculate XP: 10pts per correct + 5pts speed bonus (<5s) + 3pts streak bonus
        let xpEarned = 0;
        for (const attempt of exerciseAttempts) {
          if (attempt.isCorrect) {
            xpEarned += 10;
            if (attempt.timeSpentMs < 5000) xpEarned += 5;
            if (attempt.score >= 80) xpEarned += 3;
          }
        }

        // Words learned this week (newly mastered words)
        const wordsLearned = progressEntries.filter(
          (p) => p.status === 'mastered'
        ).length;

        // Calculate streak (consecutive days of practice)
        const allAttempts = await db.exerciseAttempt.findMany({
          where: { userId: user.id },
          select: { createdAt: true },
          orderBy: { createdAt: 'desc' },
          take: 100,
        });

        let streakDays = 0;
        if (allAttempts.length > 0) {
          const uniqueDays = new Set<string>();
          for (const a of allAttempts) {
            uniqueDays.add(a.createdAt.toISOString().split('T')[0]);
          }
          const sortedDays = Array.from(uniqueDays).sort().reverse();
          const today = new Date().toISOString().split('T')[0];
          const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

          // Check if user practiced today or yesterday (tolerate missing today)
          if (sortedDays[0] === today || sortedDays[0] === yesterday) {
            streakDays = 1;
            for (let i = 0; i < sortedDays.length - 1; i++) {
              const current = new Date(sortedDays[i]);
              const prev = new Date(sortedDays[i + 1]);
              const diffDays = Math.round(
                (current.getTime() - prev.getTime()) / 86400000
              );
              if (diffDays === 1) {
                streakDays++;
              } else {
                break;
              }
            }
          }
        }

        // Determine if streak is active (practiced today or yesterday)
        const lastPracticeDate = allAttempts[0]?.createdAt;
        const streakActive = lastPracticeDate
          ? Date.now() - lastPracticeDate.getTime() < 2 * 24 * 60 * 60 * 1000
          : false;

        // Only send if user has meaningful activity
        if (xpEarned > 0 || wordsLearned > 0 || streakDays > 0) {
          await sendWeeklyProgress(user.email, {
            firstName: user.name || 'there',
            xpEarned,
            wordsLearned,
            streakDays,
            streakActive,
          });
          sentCount++;
        }
      } catch (err) {
        console.error(`Weekly digest email error for user ${user.id}:`, err);
        errorCount++;
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      totalActiveUsers: activeUsers.length,
      emailsSent: sentCount,
      errors: errorCount,
    });
  } catch (error) {
    console.error('[cron/weekly-digest] Fatal error:', error);
    return NextResponse.json(
      { error: 'Internal server error', timestamp: new Date().toISOString() },
      { status: 500 }
    );
  }
}

// Also support POST for manual triggers
export async function POST(request: NextRequest) {
  return GET(request);
}
