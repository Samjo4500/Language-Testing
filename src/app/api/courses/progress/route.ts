import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth-middleware';
import { db } from '@/lib/db';

// POST /api/courses/progress/ — Update lesson progress (AUTH + ENROLLMENT REQUIRED)
export async function POST(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'You must be logged in to update progress.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { enrollmentId, lessonId, completed, quizScore, quizPassed, timeSpentSeconds } = body;

    if (!enrollmentId || !lessonId) {
      return NextResponse.json(
        { error: 'Enrollment ID and Lesson ID are required.' },
        { status: 400 }
      );
    }

    // Verify enrollment belongs to this user
    const enrollment = await db.courseEnrollment.findUnique({
      where: { id: enrollmentId },
    });

    if (!enrollment || enrollment.userId !== user.userId) {
      return NextResponse.json(
        { error: 'Enrollment not found or does not belong to you.' },
        { status: 403 }
      );
    }

    // Verify lesson exists and belongs to the enrolled course
    const lesson = await db.courseLesson.findUnique({
      where: { id: lessonId },
      include: { module: true },
    });

    if (!lesson || lesson.module.courseId !== enrollment.courseId) {
      return NextResponse.json(
        { error: 'Lesson not found or not part of this course.' },
        { status: 400 }
      );
    }

    // Build update data
    const updateData: {
      completed?: boolean;
      quizScore?: number;
      quizPassed?: boolean;
      timeSpentSeconds?: number;
      completedAt?: Date;
    } = {};

    if (typeof completed === 'boolean') {
      updateData.completed = completed;
      if (completed) {
        updateData.completedAt = new Date();
      }
    }
    if (typeof quizScore === 'number') {
      updateData.quizScore = quizScore;
    }
    if (typeof quizPassed === 'boolean') {
      updateData.quizPassed = quizPassed;
    }
    if (typeof timeSpentSeconds === 'number') {
      updateData.timeSpentSeconds = timeSpentSeconds;
    }

    // Upsert lesson progress
    const progress = await db.lessonProgress.upsert({
      where: {
        enrollmentId_lessonId: { enrollmentId, lessonId },
      },
      create: {
        enrollmentId,
        lessonId,
        ...updateData,
        timeSpentSeconds: timeSpentSeconds || 0,
      },
      update: updateData,
    });

    // Recalculate overall course progress
    const allLessonProgress = await db.lessonProgress.findMany({
      where: { enrollmentId },
    });

    // Count actual published lessons in the course
    const totalLessons = await db.courseLesson.count({
      where: {
        module: { courseId: enrollment.courseId },
        isPublished: true,
      },
    });

    const safeTotalLessons = totalLessons || 1;
    const completedCount = allLessonProgress.filter((lp) => lp.completed).length;
    const progressPercentage = Math.round((completedCount / safeTotalLessons) * 100);

    // Check if course is completed
    const isCourseCompleted = progressPercentage >= 100;

    // Update enrollment
    const updatedEnrollment = await db.courseEnrollment.update({
      where: { id: enrollmentId },
      data: {
        progress: progressPercentage,
        currentModuleId: lesson.moduleId,
        currentLessonId: lessonId,
        lastAccessedAt: new Date(),
        ...(isCourseCompleted
          ? {
              status: 'completed',
              completedAt: new Date(),
              certificateId: `TC-${user.userId.slice(0, 6).toUpperCase()}-${crypto.randomUUID().split('-')[0].toUpperCase()}${Date.now().toString(36).toUpperCase()}`,
            }
          : {}),
      },
    });

    return NextResponse.json({
      success: true,
      progress: {
        lessonId: progress.lessonId,
        completed: progress.completed,
        quizScore: progress.quizScore,
        quizPassed: progress.quizPassed,
        timeSpentSeconds: progress.timeSpentSeconds,
      },
      courseProgress: {
        progress: updatedEnrollment.progress,
        status: updatedEnrollment.status,
        completedAt: updatedEnrollment.completedAt,
        certificateId: updatedEnrollment.certificateId,
      },
    });
  } catch (error) {
    console.error('Update progress error:', error);
    return NextResponse.json(
      { error: 'Failed to update progress.' },
      { status: 500 }
    );
  }
}
