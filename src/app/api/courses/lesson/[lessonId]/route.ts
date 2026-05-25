import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth-middleware';
import { db } from '@/lib/db';

// GET /api/courses/lesson/[lessonId]/ — Get lesson content (AUTH + ENROLLMENT REQUIRED)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'You must be logged in to view lesson content.' },
        { status: 401 }
      );
    }

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

    // Verify user is enrolled in this course
    let enrollment = await db.courseEnrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.userId,
          courseId: lesson.module.course.id,
        },
      },
    });

    // SANDBOX/PREVIEW MODE: If not enrolled, auto-enroll the user so they can preview.
    // This allows any logged-in user to access course content without PayPal payment.
    // Remove this block when going live with real payments.
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
    const progress = await db.lessonProgress.findUnique({
      where: {
        enrollmentId_lessonId: {
          enrollmentId: enrollment.id,
          lessonId: lesson.id,
        },
      },
    });

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

    // Update current lesson position
    await db.courseEnrollment.update({
      where: { id: enrollment.id },
      data: {
        currentModuleId: lesson.moduleId,
        currentLessonId: lesson.id,
        lastAccessedAt: new Date(),
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
      enrollmentId: enrollment.id,
    });
  } catch (error) {
    console.error('Get lesson error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lesson.' },
      { status: 500 }
    );
  }
}
