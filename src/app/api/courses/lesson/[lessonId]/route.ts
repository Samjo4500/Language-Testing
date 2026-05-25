import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth-middleware';
import { db } from '@/lib/db';

const SANDBOX_MODE = process.env.NEXT_PUBLIC_SANDBOX_MODE === 'true';

// GET /api/courses/lesson/[lessonId]/ — Get lesson content
// In SANDBOX_MODE: accessible without auth (read-only preview)
// In production: AUTH + ENROLLMENT REQUIRED
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const user = getAuthUser(request);
    const { lessonId } = await params;

    // Get the lesson with module and course info
    const lesson = await db.courseLesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            course: {
              select: { id: true, slug: true, title: true },
            },
          },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found.' },
        { status: 404 }
      );
    }

    let enrollment: Awaited<ReturnType<typeof db.courseEnrollment.findUnique>> = null;
    let progress: Awaited<ReturnType<typeof db.lessonProgress.findUnique>> = null;

    if (user) {
      // Authenticated user: check/create enrollment
      enrollment = await db.courseEnrollment.findUnique({
        where: {
          userId_courseId: {
            userId: user.userId,
            courseId: lesson.module.course.id,
          },
        },
      });

      // SANDBOX/PREVIEW MODE: If not enrolled, auto-enroll the user so they can preview.
      if (!enrollment || (enrollment.status !== 'active' && enrollment.status !== 'completed')) {
        enrollment = await db.courseEnrollment.create({
          data: {
            userId: user.userId,
            courseId: lesson.module.course.id,
            status: 'active',
            progress: 0,
            paymentId: 'sandbox-auto-enroll',
          },
        });
      }

      // Get the lesson progress for this user
      progress = await db.lessonProgress.findUnique({
        where: {
          enrollmentId_lessonId: {
            enrollmentId: enrollment.id,
            lessonId: lesson.id,
          },
        },
      });

      // Update current lesson position
      await db.courseEnrollment.update({
        where: { id: enrollment.id },
        data: {
          currentModuleId: lesson.moduleId,
          currentLessonId: lesson.id,
          lastAccessedAt: new Date(),
        },
      });
    } else if (!SANDBOX_MODE) {
      // Not authenticated and not in sandbox mode → require auth
      return NextResponse.json(
        { error: 'You must be logged in to view lesson content.' },
        { status: 401 }
      );
    }
    // In sandbox mode without auth: allow read-only access (enrollment = null, progress = null)

    // Get sibling lessons in the same module (for navigation)
    const siblingLessons = await db.courseLesson.findMany({
      where: { moduleId: lesson.moduleId, isPublished: true },
      orderBy: [{ order: 'asc' }, { lessonNumber: 'asc' }],
      select: { id: true, lessonNumber: true, title: true, contentType: true, estimatedMinutes: true },
    });

    // Get all modules in the course for sidebar navigation
    const courseModules = await db.courseModule.findMany({
      where: { courseId: lesson.module.course.id, isPublished: true },
      orderBy: [{ order: 'asc' }, { moduleNumber: 'asc' }],
      select: {
        id: true,
        moduleNumber: true,
        title: true,
        icon: true,
        lessons: {
          where: { isPublished: true },
          orderBy: [{ order: 'asc' }, { lessonNumber: 'asc' }],
          select: { id: true, lessonNumber: true, title: true, contentType: true, estimatedMinutes: true },
        },
      },
    });

    return NextResponse.json({
      lesson: {
        id: lesson.id,
        lessonNumber: lesson.lessonNumber,
        title: lesson.title,
        contentType: lesson.contentType,
        content: lesson.content,
        vocabulary: lesson.vocabulary,
        quizData: lesson.quizData,
        audioScript: lesson.audioScript,
        estimatedMinutes: lesson.estimatedMinutes,
      },
      module: {
        id: lesson.module.id,
        moduleNumber: lesson.module.moduleNumber,
        title: lesson.module.title,
      },
      course: lesson.module.course,
      progress: progress
        ? {
            completed: progress.completed,
            quizScore: progress.quizScore,
            quizPassed: progress.quizPassed,
            timeSpentSeconds: progress.timeSpentSeconds,
          }
        : null,
      siblingLessons,
      courseModules,
      enrollmentId: enrollment?.id || 'sandbox-preview',
    });
  } catch (error) {
    console.error('Get lesson error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lesson.' },
      { status: 500 }
    );
  }
}
