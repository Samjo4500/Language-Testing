import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth-middleware';
import { db } from '@/lib/db';

const SANDBOX_MODE = process.env.NEXT_PUBLIC_SANDBOX_MODE === 'true';

// GET /api/courses/my-courses/ — Get user's enrolled courses
// In SANDBOX_MODE: returns all published courses as "enrolled" even without auth
// In production: AUTH REQUIRED
export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request);

    // Sandbox mode: return all courses as enrolled for any visitor
    if (SANDBOX_MODE && !user) {
      const courses = await db.course.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: 'asc' },
        include: {
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
      });

      const result = courses.map((course) => ({
        id: `sandbox-${course.id}`,
        status: 'active',
        progress: 0,
        enrolledAt: course.createdAt,
        lastAccessedAt: new Date().toISOString(),
        completedAt: null,
        certificateId: null,
        currentModuleId: course.modules[0]?.id || null,
        currentLessonId: course.modules[0]?.lessons[0]?.id || null,
        currentModule: course.modules[0]
          ? { id: course.modules[0].id, moduleNumber: course.modules[0].moduleNumber, title: course.modules[0].title }
          : null,
        currentLesson: course.modules[0]?.lessons[0]
          ? { id: course.modules[0].lessons[0].id, lessonNumber: course.modules[0].lessons[0].lessonNumber, title: course.modules[0].lessons[0].title }
          : null,
        totalLessons: course.modules.reduce((sum, m) => sum + m.lessons.length, 0),
        completedLessons: 0,
        course: {
          id: course.id,
          slug: course.slug,
          title: course.title,
          subtitle: '',
          level: '',
          imageUrl: null,
          modulesCount: course.modules.length,
          lessonsCount: course.modules.reduce((sum, m) => sum + m.lessons.length, 0),
          estimatedHours: 0,
          modules: course.modules,
        },
        lessonProgress: [],
      }));

      return NextResponse.json({ enrollments: result });
    }

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
