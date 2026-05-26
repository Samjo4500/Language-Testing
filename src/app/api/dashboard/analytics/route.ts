import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth-middleware';
import { db } from '@/lib/db';

// GET /api/dashboard/analytics/ — Study analytics for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'You must be logged in to view analytics.' },
        { status: 401 }
      );
    }

    const userId = user.userId;

    // Fetch all LessonProgress records for the user via their enrollments
    const enrollments = await db.courseEnrollment.findMany({
      where: { userId },
      select: {
        id: true,
        lessonProgress: {
          select: {
            completed: true,
            quizScore: true,
            timeSpentSeconds: true,
            completedAt: true,
          },
        },
      },
    });

    // Flatten all lesson progress records
    const allProgress = enrollments.flatMap((e) => e.lessonProgress);

    // 1. Study Streak — consecutive days with at least one completed lesson
    const completedDates = allProgress
      .filter((lp) => lp.completed && lp.completedAt)
      .map((lp) => {
        const d = new Date(lp.completedAt!);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      });

    const uniqueCompletedDays = [...new Set(completedDates)].sort().reverse();

    let studyStreak = 0;
    if (uniqueCompletedDays.length > 0) {
      const today = new Date();
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

      // Streak can start from today or yesterday
      if (uniqueCompletedDays[0] === todayStr || uniqueCompletedDays[0] === yesterdayStr) {
        studyStreak = 1;
        let checkDate = new Date(
          uniqueCompletedDays[0] === todayStr ? today : yesterday
        );
        for (let i = 1; i < uniqueCompletedDays.length; i++) {
          checkDate.setDate(checkDate.getDate() - 1);
          const checkStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
          if (uniqueCompletedDays[i] === checkStr) {
            studyStreak++;
          } else {
            break;
          }
        }
      }
    }

    // 2. Total Study Time
    const totalStudyTimeSeconds = allProgress.reduce(
      (sum, lp) => sum + lp.timeSpentSeconds,
      0
    );

    // 3. Lessons Completed
    const lessonsCompleted = allProgress.filter((lp) => lp.completed).length;

    // 4. Quiz Performance — average quiz score (only for lessons that have a quiz score)
    const quizScores = allProgress
      .filter((lp) => lp.quizScore !== null && lp.quizScore !== undefined)
      .map((lp) => lp.quizScore!);
    const averageQuizScore =
      quizScores.length > 0
        ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length)
        : 0;

    // 5. Weekly Activity — activity per day for the past 7 days
    const now = new Date();
    const weekDays: { date: string; label: string; minutes: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
      weekDays.push({ date: dateStr, label: dayLabel, minutes: 0 });
    }

    // Sum time spent per day
    for (const lp of allProgress) {
      if (lp.completedAt) {
        const d = new Date(lp.completedAt);
        const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const dayEntry = weekDays.find((wd) => wd.date === dateStr);
        if (dayEntry) {
          dayEntry.minutes += Math.round(lp.timeSpentSeconds / 60);
        }
      }
    }

    return NextResponse.json({
      studyStreak,
      totalStudyTimeSeconds,
      lessonsCompleted,
      averageQuizScore,
      quizCount: quizScores.length,
      weeklyActivity: weekDays,
    });
  } catch (error) {
    console.error('Dashboard analytics error:', error);
    return NextResponse.json(
      {
        studyStreak: 0,
        totalStudyTimeSeconds: 0,
        lessonsCompleted: 0,
        averageQuizScore: 0,
        quizCount: 0,
        weeklyActivity: [],
      },
      { status: 200 }
    );
  }
}
