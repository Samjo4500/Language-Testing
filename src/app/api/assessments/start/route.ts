import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, verifyTokenVersion } from '@/lib/auth-middleware';
import { selectQuestions } from '@/lib/question-selection';

/**
 * GET /api/assessments/start
 * Check if the user has an in-progress assessment (does NOT consume a credit).
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = getAuthUser(request);
    if (!authResult) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existing = await db.assessment.findFirst({
      where: { userId: authResult.userId, status: 'in_progress' },
    });

    return NextResponse.json({
      hasInProgress: !!existing,
      assessment: existing ? { id: existing.id, startedAt: existing.startedAt } : null,
    });
  } catch (error) {
    console.error('Check in-progress assessment error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = getAuthUser(request);
    if (!authResult) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'You must be logged in to start a test.' },
        { status: 401 }
      );
    }

    const versionError = await verifyTokenVersion(authResult);
    if (versionError) return versionError;

    const user = await db.user.findUnique({ where: { id: authResult.userId } });
    if (!user) {
      return NextResponse.json({ error: 'Not Found', message: 'User not found.' }, { status: 404 });
    }

    if (!user.emailVerified) {
      return NextResponse.json(
        { error: 'Email Not Verified', message: 'Please verify your email before taking a test.', code: 'EMAIL_NOT_VERIFIED' },
        { status: 403 }
      );
    }

    if (user.testCredits <= 0) {
      return NextResponse.json(
        { error: 'No Test Credits', message: 'You have no test credits remaining.', code: 'NO_CREDITS' },
        { status: 403 }
      );
    }

    // Check for existing in-progress
    const existingAssessment = await db.assessment.findFirst({
      where: { userId: authResult.userId, status: 'in_progress' },
    });

    if (existingAssessment) {
      return NextResponse.json({
        assessment: {
          id: existingAssessment.id,
          status: existingAssessment.status,
          startedAt: existingAssessment.startedAt,
        },
        message: 'You already have an assessment in progress.',
      });
    }

    // Decrement credit + create assessment in transaction
    const assessment = await db.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: authResult.userId },
        data: { testCredits: { decrement: 1 } },
      });

      return tx.assessment.create({
        data: {
          userId: authResult.userId,
          status: 'in_progress',
          startedAt: new Date(),
        },
      });
    });

    // Select questions using the rotation algorithm
    const organizationId = user.organizationId || null;
    const questionSet = await selectQuestions(authResult.userId, assessment.id, organizationId);

    return NextResponse.json({
      assessment: {
        id: assessment.id,
        status: assessment.status,
        startedAt: assessment.startedAt,
      },
      questions: questionSet,
      message: 'Assessment started successfully.',
    });
  } catch (error) {
    console.error('Start assessment error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}
