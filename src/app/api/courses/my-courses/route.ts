import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth-middleware';
import { db } from '@/lib/db';

// GET /api/courses/my-courses/ — Get user's enrolled courses (AUTH REQUIRED)
export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'You must be logged in to view your courses.' },
        { status: 401 }
      );
    }

    const enrollments = await db.courseEnrollment.findMany({
      where: { userId: user.userId, status: { in: ['active', 'completed'] } },
      orderBy: { lastAccessedAt: 'desc' },
      include: {
        course: {
          select: {
            id: true,
            slug: true,
            title: true,
            subtitle: true,
            level: true,
            imageUrl: true,
            modulesCount: true,
            lessonsCount: true,
            estimatedHours: true,
            modules: {
              where: { isPublished: true },
              orderBy: [{ order: 'asc' }, { moduleNumber: 'asc' }],
              select: {
                id: true,
                moduleNumber: true,
                title: true,
                lessons: {
                  where: { isPublished: true },
                  orderBy: [{ order: 'asc' }, { lessonNumber: 'asc' }],
                  select: { id: true, lessonNumber: true, title: true, contentType: true, estimatedMinutes: true },
                },
              },
            },
          },
        },
        lessonProgress: {
          select: {
            lessonId: true,
            completed: true,
            quizScore: true,
            quizPassed: true,
            timeSpentSeconds: true,
          },
        },
      },
    });

    const result = enrollments.map((enrollment) => {
      const totalLessons = enrollment.course.modules.reduce(
        (sum, mod) => sum + mod.lessons.length,
        0
      );
      const completedLessons = enrollment.lessonProgress.filter(
        (lp) => lp.completed
      ).length;

      // Find current lesson info
      let currentModule: { id: string; moduleNumber: number; title: string; lessons: { id: string; lessonNumber: number; title: string; contentType: string; estimatedMinutes: number }[] } | null = null;
      let currentLesson: { id: string; lessonNumber: number; title: string; contentType: string; estimatedMinutes: number } | null = null;
      if (enrollment.currentModuleId) {
        currentModule = enrollment.course.modules.find(
          (m) => m.id === enrollment.currentModuleId
        ) || null;
      }
      if (enrollment.currentLessonId && currentModule) {
        currentLesson = currentModule.lessons.find(
          (l) => l.id === enrollment.currentLessonId
        ) || null;
      }

      return {
        id: enrollment.id,
        status: enrollment.status,
        progress: enrollment.progress,
        enrolledAt: enrollment.enrolledAt,
        lastAccessedAt: enrollment.lastAccessedAt,
        completedAt: enrollment.completedAt,
        certificateId: enrollment.certificateId,
        currentModuleId: enrollment.currentModuleId,
        currentLessonId: enrollment.currentLessonId,
        currentModule: currentModule
          ? { id: currentModule.id, moduleNumber: currentModule.moduleNumber, title: currentModule.title }
          : null,
        currentLesson: currentLesson
          ? { id: currentLesson.id, lessonNumber: currentLesson.lessonNumber, title: currentLesson.title }
          : null,
        totalLessons,
        completedLessons,
        course: enrollment.course,
        lessonProgress: enrollment.lessonProgress,
      };
    });

    return NextResponse.json({ enrollments: result });
  } catch (error) {
    console.error('Get my courses error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch your courses.' },
      { status: 500 }
    );
  }
}
