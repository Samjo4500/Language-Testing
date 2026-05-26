import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth-middleware';
import { db } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { createNotification } from '@/lib/notifications';

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

    // Auto-generate course completion certificate when course is completed
    let certificateVerificationId: string | null = null;

    if (isCourseCompleted) {
      // Check if a course completion certificate already exists
      const course = await db.course.findUnique({
        where: { id: enrollment.courseId },
      });

      const existingCert = course ? await db.certificate.findFirst({
        where: {
          userId: user.userId,
          type: 'course_completion',
          courseName: course.title,
        },
      }) : null;

      if (existingCert) {
        certificateVerificationId = existingCert.verificationId;
      } else if (course) {
        // Calculate average quiz score across all completed lessons
        const lessonProgress = await db.lessonProgress.findMany({
          where: { enrollmentId, completed: true, quizScore: { not: null } },
        });

        const avgScore = lessonProgress.length > 0
          ? Math.round(lessonProgress.reduce((sum, lp) => sum + (lp.quizScore || 0), 0) / lessonProgress.length)
          : 85;

        // Build skill breakdown from lesson content types
        const skills: Record<string, number[]> = {};
        for (const lp of lessonProgress) {
          const lessonData = await db.courseLesson.findUnique({ where: { id: lp.lessonId } });
          if (lessonData && lp.quizScore !== null) {
            const type = lessonData.contentType;
            if (!skills[type]) skills[type] = [];
            skills[type].push(lp.quizScore);
          }
        }
        const skillBreakdown: Record<string, number> = {};
        for (const [type, scores] of Object.entries(skills)) {
          skillBreakdown[type] = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
        }

        certificateVerificationId = `CC-${uuidv4().split('-')[0].toUpperCase()}-${uuidv4().split('-')[1].toUpperCase()}`;

        // Get user info for certificate name
        const dbUser = await db.user.findUnique({ where: { id: user.userId } });
        const certUserName = dbUser?.name || dbUser?.email?.split('@')[0] || 'Learner';

        await db.certificate.create({
          data: {
            verificationId: certificateVerificationId,
            userId: user.userId,
            assessmentId: null,
            userName: certUserName,
            cefrLevel: course.level,
            score: avgScore,
            skillBreakdown: JSON.stringify(skillBreakdown),
            type: 'course_completion',
            courseName: course.title,
          },
        });

        // Create notification
        await createNotification(
          user.userId,
          'certificate_ready',
          'Course Certificate Ready!',
          `Congratulations! Your completion certificate for "${course.title}" is ready.`,
          `/certificate/${certificateVerificationId}`
        );
      }
    }

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
              certificateId: certificateVerificationId || `TC-${user.userId.slice(0, 6).toUpperCase()}-${crypto.randomUUID().split('-')[0].toUpperCase()}${Date.now().toString(36).toUpperCase()}`,
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
