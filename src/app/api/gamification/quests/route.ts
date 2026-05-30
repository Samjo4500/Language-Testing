import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth-middleware';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Default quest templates for daily generation
const QUEST_TEMPLATES = [
  { questKey: 'review_10_words', goal: 10, xpReward: 15 },
  { questKey: 'take_practice_test', goal: 1, xpReward: 25 },
  { questKey: 'practice_speaking', goal: 1, xpReward: 20 },
  { questKey: 'complete_lesson', goal: 1, xpReward: 20 },
  { questKey: 'write_50_words', goal: 50, xpReward: 15 },
  { questKey: 'join_community', goal: 1, xpReward: 10 },
  { questKey: 'review_grammar', goal: 5, xpReward: 15 },
  { questKey: 'practice_listening', goal: 1, xpReward: 15 },
];

// GET: Return today's daily quests for the user. Auto-generate if none exist.
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
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    // Check if user already has quests for today
    let quests = await db.dailyQuest.findMany({
      where: {
        userId,
        date: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    // Auto-generate daily quests if none exist
    if (quests.length === 0) {
      // Pick 3 random quests from templates
      const shuffled = [...QUEST_TEMPLATES].sort(() => Math.random() - 0.5);
      const selectedQuests = shuffled.slice(0, 3);

      const createPromises = selectedQuests.map((template) =>
        db.dailyQuest.create({
          data: {
            userId,
            questKey: template.questKey,
            goal: template.goal,
            xpReward: template.xpReward,
            date: startOfDay,
          },
        })
      );

      quests = await Promise.all(createPromises);
    }

    // Calculate summary
    const completed = quests.filter((q) => q.completed).length;
    const totalXpReward = quests.reduce((sum, q) => sum + q.xpReward, 0);
    const earnedXp = quests.filter((q) => q.completed).reduce((sum, q) => sum + q.xpReward, 0);

    return NextResponse.json({
      quests,
      summary: {
        total: quests.length,
        completed,
        totalXpReward,
        earnedXp,
        allCompleted: completed === quests.length,
      },
    });
  } catch (error) {
    console.error('[gamification/quests] GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to fetch daily quests.' },
      { status: 500 }
    );
  }
}
