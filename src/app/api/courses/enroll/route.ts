import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, verifyTokenVersion } from '@/lib/auth-middleware';
import { capturePayPalOrder } from '@/lib/paypal';
import { db } from '@/lib/db';
import { COURSE_PRICES } from '@/lib/courses';
import { paymentLimiter } from '@/lib/rate-limit';
import { sendPaymentConfirmation, sendAdminNewPayment } from '@/lib/email';

// POST /api/courses/enroll/ — Purchase/enroll in a course (AUTH REQUIRED)
export async function POST(request: NextRequest) {
  // Rate limit
  const limitError = paymentLimiter(request);
  if (limitError) return limitError;

  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'You must be logged in to enroll in a course.' },
        { status: 401 }
      );
    }

    // Verify token version
    const versionError = await verifyTokenVersion(user);
    if (versionError) return versionError;

    const body = await request.json();
    const { slug, orderID } = body;

    if (!slug || !orderID) {
      return NextResponse.json(
        { error: 'Course slug and PayPal order ID are required.' },
        { status: 400 }
      );
    }

    // Validate course slug
    const validSlugs = ['beginner', 'intermediate', 'advanced', 'bundle'];
    if (!validSlugs.includes(slug)) {
      return NextResponse.json(
        { error: 'Invalid course slug.' },
        { status: 400 }
      );
    }

    // Validate price
    const coursePrice = COURSE_PRICES[slug];
    if (!coursePrice) {
      return NextResponse.json(
        { error: 'Invalid course.' },
        { status: 400 }
      );
    }

    // Capture PayPal order
    const captureResult = await capturePayPalOrder(orderID);

    if (captureResult.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'Payment capture failed.', status: captureResult.status },
        { status: 400 }
      );
    }

    // Verify amount
    const capture = captureResult.purchase_units[0]?.payments?.captures?.[0];
    const capturedAmount = parseFloat(capture?.amount?.value || '0');
    const expectedAmount = coursePrice.amount;

    if (Math.abs(capturedAmount - expectedAmount) > 0.02) {
      console.error(`Course payment amount mismatch: expected $${expectedAmount} for ${slug}, captured $${capturedAmount}. OrderID: ${orderID}`);
      return NextResponse.json(
        { error: 'Payment amount does not match the course price.' },
        { status: 400 }
      );
    }

    const captureId = capture?.id || '';
    const currency = capture?.amount?.currency_code || 'USD';

    // Determine which courses to enroll in
    const courseSlugs = slug === 'bundle'
      ? ['beginner', 'intermediate', 'advanced']
      : [slug];

    // Create enrollments and payment in a transaction
    const enrollments = await db.$transaction(async (tx) => {
      // Create payment record
      await tx.payment.create({
        data: {
          userId: user.userId,
          paypalOrderId: orderID,
          paypalCaptureId: captureId,
          amount: capturedAmount,
          currency,
          status: 'completed',
          plan: 'course',
          planType: `course-${slug}`,
          testsIncluded: 0,
        },
      });

      const results: Array<{ id: string; userId: string; courseId: string; status: string; progress: number }> = [];

      for (const courseSlug of courseSlugs) {
        const course = await tx.course.findUnique({
          where: { slug: courseSlug },
        });

        if (!course) {
          throw new Error(`Course not found: ${courseSlug}`);
        }

        // Check if already enrolled
        const existing = await tx.courseEnrollment.findUnique({
          where: {
            userId_courseId: {
              userId: user.userId,
              courseId: course.id,
            },
          },
        });

        if (existing) {
          // Already enrolled — skip (or update if was refunded)
          if (existing.status === 'refunded' || existing.status === 'expired') {
            const updated = await tx.courseEnrollment.update({
              where: { id: existing.id },
              data: {
                status: 'active',
                paymentId: orderID,
                enrolledAt: new Date(),
                lastAccessedAt: new Date(),
              },
            });
            results.push(updated);
          } else {
            results.push(existing);
          }
          continue;
        }

        // Get first module and lesson for the course
        const firstModule = await tx.courseModule.findFirst({
          where: { courseId: course.id, isPublished: true },
          orderBy: [{ order: 'asc' }, { moduleNumber: 'asc' }],
        });

        let firstLessonId: string | null = null;
        if (firstModule) {
          const firstLesson = await tx.courseLesson.findFirst({
            where: { moduleId: firstModule.id, isPublished: true },
            orderBy: [{ order: 'asc' }, { lessonNumber: 'asc' }],
          });
          firstLessonId = firstLesson?.id || null;
        }

        const enrollment = await tx.courseEnrollment.create({
          data: {
            userId: user.userId,
            courseId: course.id,
            status: 'active',
            progress: 0,
            currentModuleId: firstModule?.id || null,
            currentLessonId: firstLessonId,
            paymentId: orderID,
          },
        });

        results.push(enrollment);
      }

      return results;
    });

    // Send emails (fire-and-forget)
    try {
      const dbUser = await db.user.findUnique({
        where: { id: user.userId },
        select: { name: true, email: true },
      });
      if (dbUser) {
        sendPaymentConfirmation(
          dbUser.name || dbUser.email.split('@')[0],
          dbUser.email,
          coursePrice.label,
          capturedAmount,
          captureId || orderID,
          user.userId
        ).catch(() => {});
        sendAdminNewPayment(
          dbUser.name || dbUser.email.split('@')[0],
          dbUser.email,
          coursePrice.label,
          capturedAmount,
          captureId || orderID
        ).catch(() => {});
      }
    } catch {}

    return NextResponse.json({
      success: true,
      enrollments: enrollments.map((e) => ({
        id: e.id,
        courseId: e.courseId,
        status: e.status,
        progress: e.progress,
      })),
      message: slug === 'bundle'
        ? 'Successfully enrolled in all three courses!'
        : `Successfully enrolled in the ${coursePrice.label}!`,
    });
  } catch (error) {
    console.error('Course enroll error:', error);
    return NextResponse.json(
      { error: 'Failed to enroll in course. Please contact support.' },
      { status: 500 }
    );
  }
}
