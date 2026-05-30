import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth-middleware';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

// POST: Contribute to a challenge
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
    const { challengeId, amount } = body;

    if (!challengeId || typeof challengeId !== 'string') {
      return NextResponse.json(
        { error: 'Bad request', message: 'challengeId is required.' },
        { status: 400 }
      );
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { error: 'Bad request', message: 'amount (positive number) is required.' },
        { status: 400 }
      );
    }

    const userId = user.userId;

    // Check challenge exists and is active
    const challenge = await db.challenge.findUnique({
      where: { id: challengeId },
    });

    if (!challenge) {
      return NextResponse.json(
        { error: 'Not found', message: 'Challenge not found.' },
        { status: 404 }
      );
    }

    if (challenge.deadline < new Date()) {
      return NextResponse.json(
        { error: 'Bad request', message: 'Challenge has expired.' },
        { status: 400 }
      );
    }

    // Get or create participation
    let participation = await db.challengeParticipant.findUnique({
      where: {
        challengeId_userId: {
          challengeId,
          userId,
        },
      },
    });

    if (!participation) {
      participation = await db.challengeParticipant.create({
        data: {
          challengeId,
          userId,
          progress: 0,
        },
      });
    }

    if (participation.completed) {
      return NextResponse.json(
        { error: 'Bad request', message: 'Challenge already completed.' },
        { status: 400 }
      );
    }

    // Update progress
    const newProgress = participation.progress + amount;
    const isCompleted = newProgress >= challenge.goal;

    participation = await db.challengeParticipant.update({
      where: { id: participation.id },
      data: {
        progress: newProgress,
        completed: isCompleted,
      },
    });

    // If challenge completed, award XP
    if (isCompleted) {
      const existingStats = await db.gamificationStats.findUnique({
        where: { userId },
      });

      if (existingStats) {
        await db.gamificationStats.update({
          where: { userId },
          data: {
            xp: existingStats.xp + challenge.xpReward,
          },
        });
      }

      // Log activity
      await db.activityLog.create({
        data: {
          userId,
          type: 'challenge',
          title: `Completed: ${challenge.title}`,
          detail: `Earned ${challenge.xpReward} XP`,
          xp: challenge.xpReward,
        },
      });
    }

    return NextResponse.json({
      message: isCompleted ? 'Challenge completed!' : 'Progress updated.',
      participation: {
        id: participation.id,
        challengeId: participation.challengeId,
        progress: participation.progress,
        completed: participation.completed,
        joinedAt: participation.joinedAt,
      },
      challenge: {
        id: challenge.id,
        title: challenge.title,
        goal: challenge.goal,
        xpReward: challenge.xpReward,
      },
      isCompleted,
      xpAwarded: isCompleted ? challenge.xpReward : 0,
      progressPercentage: Math.min(Math.round((newProgress / challenge.goal) * 100), 100),
    });
  } catch (error) {
    console.error('[challenges/contribute] POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to contribute to challenge.' },
      { status: 500 }
    );
  }
}
