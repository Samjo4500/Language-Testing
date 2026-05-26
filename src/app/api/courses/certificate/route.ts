import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth-middleware';
import { db } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { createNotification } from '@/lib/notifications';

// POST /api/courses/certificate — Generate a course completion certificate
export async function POST(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'You must be logged in to generate a certificate.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { enrollmentId } = body;

    if (!enrollmentId) {
      return NextResponse.json(
        { error: 'Enrollment ID is required.' },
        { status: 400 }
      );
    }

    // Verify enrollment belongs to this user
    const enrollment = await db.courseEnrollment.findUnique({
      where: { id: enrollmentId },
      include: { course: true },
    });

    if (!enrollment || enrollment.userId !== user.userId) {
      return NextResponse.json(
        { error: 'Enrollment not found or does not belong to you.' },
        { status: 403 }
      );
    }

    // Verify the enrollment is completed
    if (enrollment.status !== 'completed' && enrollment.progress < 100) {
      return NextResponse.json(
        { error: 'Course must be completed before generating a certificate.' },
        { status: 400 }
      );
    }

    // Check if a course completion certificate already exists for this enrollment
    const existingCert = await db.certificate.findFirst({
      where: {
        userId: user.userId,
        type: 'course_completion',
        courseName: enrollment.course.title,
      },
    });

    if (existingCert) {
      // Update enrollment certificateId if missing
      if (!enrollment.certificateId) {
        await db.courseEnrollment.update({
          where: { id: enrollmentId },
          data: { certificateId: existingCert.verificationId },
        });
      }
      return NextResponse.json({
        certificate: {
          id: existingCert.id,
          verificationId: existingCert.verificationId,
          cefrLevel: existingCert.cefrLevel,
          score: existingCert.score,
          userName: existingCert.userName,
          courseName: existingCert.courseName,
          type: existingCert.type,
          issuedAt: existingCert.issuedAt,
        },
        message: 'Certificate already exists for this course.',
      });
    }

    const course = enrollment.course;

    // Calculate average quiz score across all completed lessons
    const lessonProgress = await db.lessonProgress.findMany({
      where: { enrollmentId, completed: true, quizScore: { not: null } },
    });

    const avgScore =
      lessonProgress.length > 0
        ? Math.round(
            lessonProgress.reduce((sum, lp) => sum + (lp.quizScore || 0), 0) /
              lessonProgress.length
          )
        : 85; // Default if no quiz scores

    // Build skill breakdown from lesson content types
    const skills: Record<string, number[]> = {};
    for (const lp of lessonProgress) {
      const lesson = await db.courseLesson.findUnique({
        where: { id: lp.lessonId },
      });
      if (lesson && lp.quizScore !== null) {
        const type = lesson.contentType;
        if (!skills[type]) skills[type] = [];
        skills[type].push(lp.quizScore);
      }
    }

    const skillBreakdown: Record<string, number> = {};
    for (const [type, scores] of Object.entries(skills)) {
      skillBreakdown[type] = Math.round(
        scores.reduce((a, b) => a + b, 0) / scores.length
      );
    }

    const verificationId = `CC-${uuidv4().split('-')[0].toUpperCase()}-${uuidv4().split('-')[1].toUpperCase()}`;

    // Get user info for certificate
    const dbUser = await db.user.findUnique({ where: { id: user.userId } });
    const userName = dbUser?.name || dbUser?.email?.split('@')[0] || 'Learner';

    const certificate = await db.certificate.create({
      data: {
        verificationId,
        userId: user.userId,
        assessmentId: null,
        userName,
        cefrLevel: course.level,
        score: avgScore,
        skillBreakdown: JSON.stringify(skillBreakdown),
        type: 'course_completion',
        courseName: course.title,
      },
    });

    // Update enrollment's certificateId
    await db.courseEnrollment.update({
      where: { id: enrollmentId },
      data: { certificateId: verificationId },
    });

    // Create notification
    await createNotification(
      user.userId,
      'certificate_ready',
      'Course Certificate Ready!',
      `Congratulations! Your completion certificate for "${course.title}" is ready.`,
      `/certificate/${verificationId}`
    );

    return NextResponse.json(
      {
        certificate: {
          id: certificate.id,
          verificationId: certificate.verificationId,
          cefrLevel: certificate.cefrLevel,
          score: certificate.score,
          userName: certificate.userName,
          courseName: certificate.courseName,
          type: certificate.type,
          issuedAt: certificate.issuedAt,
        },
        message: 'Certificate generated successfully.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Course certificate generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}

// GET /api/courses/certificate — Get all course completion certificates for the user
export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'You must be logged in to view certificates.' },
        { status: 401 }
      );
    }

    const certificates = await db.certificate.findMany({
      where: {
        userId: user.userId,
        type: 'course_completion',
      },
      orderBy: { issuedAt: 'desc' },
      select: {
        id: true,
        verificationId: true,
        userName: true,
        cefrLevel: true,
        score: true,
        courseName: true,
        type: true,
        issuedAt: true,
        skillBreakdown: true,
      },
    });

    return NextResponse.json({
      certificates: certificates.map((cert) => ({
        ...cert,
        skillBreakdown: JSON.parse(cert.skillBreakdown || '{}'),
      })),
    });
  } catch (error) {
    console.error('Fetch course certificates error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}
