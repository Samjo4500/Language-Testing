import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth-middleware';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

// XP reward mapping for different actions
const XP_REWARDS: Record<string, number> = {
  complete_test: 50,
  complete_lesson: 30,
  review_vocab: 10,
  daily_login: 5,
  speaking_practice: 20,
  writing_practice: 25,
  complete_quest: 15,
  earn_badge: 40,
  peer_call: 20,
  community_post: 10,
};

// Level thresholds: level N requires (N-1)*100 XP
function calculateLevel(xp: number): number {
  return Math.floor(xp / 100) + 1;
}

function calculateXpForNextLevel(level: number): number {
  return (level) * 100;
}

// GET: Return user's gamification stats (XP, level, streak, badges, quests)
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

    // Get or create gamification stats
    let stats = await db.gamificationStats.findUnique({
      where: { userId },
    });

    if (!stats) {
      stats = await db.gamificationStats.create({
        data: { userId },
      });
    }

    // Check and update streak
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lastActive = stats.lastActiveDate
      ? new Date(stats.lastActiveDate.getFullYear(), stats.lastActiveDate.getMonth(), stats.lastActiveDate.getDate())
      : null;

    if (lastActive) {
      const diffDays = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays > 1) {
        // Streak broken
        stats = await db.gamificationStats.update({
          where: { userId },
          data: { streak: 0 },
        });
      }
    }

    // Get badges
    const badges = await db.badge.findMany({
      where: { userId },
      orderBy: { earnedAt: 'desc' },
    });

    // Get today's quests progress
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const quests = await db.dailyQuest.findMany({
      where: {
        userId,
        date: { gte: startOfDay },
      },
    });

    // Check for new badges
    const newBadges: string[] = [];
    if (stats.streak >= 7 && !badges.find((b) => b.badgeType === 'week_warrior')) {
      await db.badge.create({
        data: {
          userId,
          badgeType: 'week_warrior',
          name: 'Week Warrior',
          description: 'Maintained a 7-day streak',
          icon: '🔥',
          rarity: 'rare',
        },
      });
      newBadges.push('week_warrior');
    }
    if (stats.level >= 5 && !badges.find((b) => b.badgeType === 'cefr_climber')) {
      await db.badge.create({
        data: {
          userId,
          badgeType: 'cefr_climber',
          name: 'CEFR Climber',
          description: 'Reached level 5',
          icon: '🏔️',
          rarity: 'epic',
        },
      });
      newBadges.push('cefr_climber');
    }

    const xpForNextLevel = calculateXpForNextLevel(stats.level);
    const currentLevelXp = (stats.level - 1) * 100;

    return NextResponse.json({
      stats: {
        xp: stats.xp,
        level: stats.level,
        streak: stats.streak,
        longestStreak: stats.longestStreak,
        lastActiveDate: stats.lastActiveDate,
        weeklyGoal: stats.weeklyGoal,
        weeklyProgress: stats.weeklyProgress,
        xpForNextLevel,
        currentLevelXp,
        xpProgress: stats.xp - currentLevelXp,
        xpNeeded: xpForNextLevel - currentLevelXp,
      },
      badges,
      quests,
      newBadges,
    });
  } catch (error) {
    console.error('[gamification/stats] GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to fetch gamification stats.' },
      { status: 500 }
    );
  }
}

// POST: Award XP for an action
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
    const { action } = body;

    if (!action || typeof action !== 'string') {
      return NextResponse.json(
        { error: 'Bad request', message: 'Action is required.' },
        { status: 400 }
      );
    }

    const xpGain = XP_REWARDS[action];
    if (xpGain === undefined) {
      return NextResponse.json(
        { error: 'Bad request', message: `Unknown action: ${action}. Valid actions: ${Object.keys(XP_REWARDS).join(', ')}` },
        { status: 400 }
      );
    }

    const userId = user.userId;

    // Get or create stats
    let stats = await db.gamificationStats.findUnique({
      where: { userId },
    });

    if (!stats) {
      stats = await db.gamificationStats.create({
        data: { userId },
      });
    }

    // Update XP, streak, and last active date
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lastActive = stats.lastActiveDate
      ? new Date(stats.lastActiveDate.getFullYear(), stats.lastActiveDate.getMonth(), stats.lastActiveDate.getDate())
      : null;

    let newStreak = stats.streak;
    if (lastActive) {
      const diffDays = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        newStreak = stats.streak + 1;
      } else if (diffDays > 1) {
        newStreak = 1;
      }
      // same day: no change to streak
    } else {
      newStreak = 1;
    }

    const newLongestStreak = Math.max(newStreak, stats.longestStreak);
    const newWeeklyProgress = stats.weeklyProgress + xpGain;

    stats = await db.gamificationStats.update({
      where: { userId },
      data: {
        xp: stats.xp + xpGain,
        level: calculateLevel(stats.xp + xpGain),
        streak: newStreak,
        longestStreak: newLongestStreak,
        lastActiveDate: now,
        weeklyProgress: newWeeklyProgress,
      },
    });

    // Log activity
    await db.activityLog.create({
      data: {
        userId,
        type: action.split('_')[0] || 'general',
        title: action.replace(/_/g, ' '),
        detail: `Earned ${xpGain} XP`,
        xp: xpGain,
      },
    });

    const xpForNextLevel = calculateXpForNextLevel(stats.level);
    const currentLevelXp = (stats.level - 1) * 100;

    return NextResponse.json({
      message: `Earned ${xpGain} XP for ${action}`,
      xpGain,
      stats: {
        xp: stats.xp,
        level: stats.level,
        streak: stats.streak,
        longestStreak: stats.longestStreak,
        lastActiveDate: stats.lastActiveDate,
        weeklyGoal: stats.weeklyGoal,
        weeklyProgress: stats.weeklyProgress,
        xpForNextLevel,
        currentLevelXp,
        xpProgress: stats.xp - currentLevelXp,
        xpNeeded: xpForNextLevel - currentLevelXp,
      },
    });
  } catch (error) {
    console.error('[gamification/stats] POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to award XP.' },
      { status: 500 }
    );
  }
}
