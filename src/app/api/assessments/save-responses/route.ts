import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, verifyTokenVersion } from '@/lib/auth-middleware';

// POST /api/assessments/save-responses
// Saves responses for a single skill progressively (without completing the assessment)
// This allows per-skill results to be viewed before the full assessment is submitted
export async function POST(request: NextRequest) {
  try {
    const authResult = getAuthUser(request);
    if (!authResult) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'You must be logged in.' },
        { status: 401 }
      );
    }

    const versionError = await verifyTokenVersion(authResult);
    if (versionError) return versionError;

    const body = await request.json();
    const { assessmentId, responses } = body;

    if (!assessmentId || !responses || !Array.isArray(responses)) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Assessment ID and responses are required.' },
        { status: 400 }
      );
    }

    // Verify assessment belongs to user and is in progress
    const assessment = await db.assessment.findFirst({
      where: { id: assessmentId, userId: authResult.userId },
    });

    if (!assessment) {
      return NextResponse.json({ error: 'Not Found', message: 'No assessment found.' }, { status: 404 });
    }

    // Save each response using upsert (idempotent)
    for (const response of responses) {
      await db.assessmentResponse.upsert({
        where: { id: `${assessment.id}-${response.questionId}` },
        create: {
          id: `${assessment.id}-${response.questionId}`,
          assessmentId: assessment.id,
          questionId: response.questionId,
          questionType: response.questionType || 'mcq',
          parentItemId: response.parentItemId || null,
          answer: response.answer || '',
          isCorrect: response.isCorrect ?? null,
          aiScore: response.aiScore || null,
          aiFeedback: response.aiFeedback || null,
        },
        update: {
          answer: response.answer || '',
          isCorrect: response.isCorrect ?? null,
          aiScore: response.aiScore || null,
          aiFeedback: response.aiFeedback || null,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: `${responses.length} response(s) saved.`,
      savedCount: responses.length,
    });
  } catch (error) {
    console.error('Save responses error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to save responses.' },
      { status: 500 }
    );
  }
}
