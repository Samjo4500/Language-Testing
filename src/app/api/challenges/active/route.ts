import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth-middleware';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET: Return active challenges with user's participation status
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
    const now = new Date();

    // Get all active challenges (deadline is in the future)
    const challenges = await db.challenge.findMany({
      where: {
        deadline: { gt: now },
      },
      include: {
        participants: {
          where: { userId },
          select: {
            id: true,
            progress: true,
            completed: true,
            joinedAt: true,
          },
        },
        _count: {
          select: { participants: true },
        },
      },
      orderBy: { deadline: 'asc' },
    });

    // Format response with participation status
    const formattedChallenges = challenges.map((challenge) => {
      const participation = challenge.participants[0] || null;
      return {
        id: challenge.id,
        title: challenge.title,
        description: challenge.description,
        type: challenge.type,
        goal: challenge.goal,
        xpReward: challenge.xpReward,
        deadline: challenge.deadline,
        category: challenge.category,
        createdAt: challenge.createdAt,
        participantCount: challenge._count.participants,
        userParticipation: participation
          ? {
              id: participation.id,
              progress: participation.progress,
              completed: participation.completed,
              joinedAt: participation.joinedAt,
            }
          : null,
        isJoined: !!participation,
        isCompleted: participation?.completed || false,
        progressPercentage: participation
          ? Math.min(Math.round((participation.progress / challenge.goal) * 100), 100)
          : 0,
      };
    });

    // Group by type
    const grouped = {
      daily_drill: formattedChallenges.filter((c) => c.type === 'daily_drill'),
      weekly_sprint: formattedChallenges.filter((c) => c.type === 'weekly_sprint'),
      monthly_marathon: formattedChallenges.filter((c) => c.type === 'monthly_marathon'),
    };

    // User's joined challenges summary
    const joinedCount = formattedChallenges.filter((c) => c.isJoined).length;
    const completedCount = formattedChallenges.filter((c) => c.isCompleted).length;

    return NextResponse.json({
      challenges: formattedChallenges,
      grouped,
      summary: {
        totalActive: challenges.length,
        joined: joinedCount,
        completed: completedCount,
      },
    });
  } catch (error) {
    console.error('[challenges/active] GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to fetch active challenges.' },
      { status: 500 }
    );
  }
}
