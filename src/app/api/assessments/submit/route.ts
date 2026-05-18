import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, requirePremium } from '@/lib/auth-middleware';
import { sendAssessmentComplete } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    // Step 1: Verify authentication
    const authResult = getAuthUser(request);
    if (!authResult) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'You must be logged in to submit an assessment.' },
        { status: 401 }
      );
    }

    // Step 2: Check premium plan
    const premiumCheck = requirePremium(authResult);
    if (premiumCheck) {
      return premiumCheck;
    }

    // Step 3: Get the request body
    const body = await request.json();
    const { assessmentId, responses } = body;

    if (!assessmentId || !responses || !Array.isArray(responses)) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Assessment ID and responses are required.' },
        { status: 400 }
      );
    }

    // Step 4: Find the assessment
    const assessment = await db.assessment.findFirst({
      where: {
        id: assessmentId,
        userId: authResult.userId,
        status: 'in_progress',
      },
    });

    if (!assessment) {
      return NextResponse.json(
        { error: 'Not Found', message: 'No in-progress assessment found with this ID.' },
        { status: 404 }
      );
    }

    // Step 5: Calculate the score and CEFR level from responses
    const { score, cefrLevel, correctCount, totalQuestions, skillBreakdown } = calculateResults(responses);

    // Step 6: Save responses and update assessment
    await db.$transaction(async (tx) => {
      // Save individual responses
      for (const response of responses) {
        await tx.assessmentResponse.upsert({
          where: {
            id: `${assessment.id}-${response.questionId}`,
          },
          create: {
            id: `${assessment.id}-${response.questionId}`,
            assessmentId: assessment.id,
            questionId: response.questionId,
            answer: response.answer,
            isCorrect: response.isCorrect,
          },
          update: {
            answer: response.answer,
            isCorrect: response.isCorrect,
          },
        });
      }

      // Update assessment with results
      await tx.assessment.update({
        where: { id: assessment.id },
        data: {
          status: 'completed',
          cefrLevel,
          score,
          completedAt: new Date(),
        },
      });
    });

    // Step 7: Auto-generate certificate
    const { v4: uuidv4 } = await import('uuid');
    const verificationId = `TC-${uuidv4().split('-')[0].toUpperCase()}-${uuidv4().split('-')[1].toUpperCase()}`;

    const user = await db.user.findUnique({
      where: { id: authResult.userId },
    });

    const certificate = await db.certificate.upsert({
      where: { assessmentId: assessment.id },
      create: {
        verificationId,
        userId: authResult.userId,
        assessmentId: assessment.id,
        userName: user?.name || user?.email.split('@')[0] || 'Candidate',
        cefrLevel,
        score,
        skillBreakdown: JSON.stringify(skillBreakdown),
      },
      update: {},
    });

    // Send assessment complete email (fire-and-forget)
    if (user) {
      sendAssessmentComplete(
        user.name || user.email.split('@')[0],
        user.email,
        cefrLevel,
        score,
        user.id
      ).catch((err) => console.error('Assessment complete email error:', err));
    }

    return NextResponse.json({
      assessment: {
        id: assessment.id,
        status: 'completed',
        cefrLevel,
        score,
        completedAt: new Date(),
      },
      results: {
        correctCount,
        totalQuestions,
        percentage: Math.round((correctCount / totalQuestions) * 100),
      },
      certificate: {
        id: certificate.id,
        verificationId: certificate.verificationId,
        cefrLevel: certificate.cefrLevel,
        score: certificate.score,
        userName: certificate.userName,
        issuedAt: certificate.issuedAt,
      },
      message: 'Assessment completed successfully. Your certificate is ready!',
    });
  } catch (error) {
    console.error('Assessment submit error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}

interface AssessmentResponse {
  questionId: string;
  answer: string;
  isCorrect: boolean;
  level: string;
  category?: string; // "reading" | "writing" | "listening" | "speaking" | "grammar" | "vocabulary"
}

interface SkillBreakdown {
  reading: number;
  writing: number;
  listening: number;
  speaking: number;
  grammar: number;
  vocabulary: number;
}

function calculateResults(responses: AssessmentResponse[]): {
  score: number;
  cefrLevel: string;
  correctCount: number;
  totalQuestions: number;
  skillBreakdown: SkillBreakdown;
} {
  const totalQuestions = responses.length;
  const correctCount = responses.filter((r) => r.isCorrect).length;

  // Weighted scoring: higher-level questions are worth more
  const levelWeights: Record<string, number> = {
    A1: 1,
    A2: 2,
    B1: 3,
    B2: 4,
    C1: 5,
    C2: 6,
  };

  let totalWeight = 0;
  let earnedWeight = 0;

  for (const response of responses) {
    const weight = levelWeights[response.level] || 1;
    totalWeight += weight;
    if (response.isCorrect) {
      earnedWeight += weight;
    }
  }

  // Calculate score (0-100)
  const score = totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0;

  // Determine CEFR level based on performance
  let cefrLevel: string;

  // Count correct answers by level
  const correctByLevel: Record<string, number> = {};
  const totalByLevel: Record<string, number> = {};
  for (const response of responses) {
    totalByLevel[response.level] = (totalByLevel[response.level] || 0) + 1;
    if (response.isCorrect) {
      correctByLevel[response.level] = (correctByLevel[response.level] || 0) + 1;
    }
  }

  // Find the highest level where the user got at least 50% correct
  const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  cefrLevel = 'A1'; // Default

  for (const level of levels) {
    const total = totalByLevel[level] || 0;
    const correct = correctByLevel[level] || 0;
    if (total > 0 && correct / total >= 0.5) {
      cefrLevel = level;
    }
  }

  // Calculate per-category skill breakdown
  const categories = ['reading', 'writing', 'listening', 'speaking', 'grammar', 'vocabulary'] as const;
  const skillBreakdown: SkillBreakdown = {} as SkillBreakdown;

  for (const cat of categories) {
    const catResponses = responses.filter((r) => (r.category || 'grammar') === cat);
    if (catResponses.length > 0) {
      const catCorrect = catResponses.filter((r) => r.isCorrect).length;
      skillBreakdown[cat] = Math.round((catCorrect / catResponses.length) * 100);
    } else {
      // If no responses for a category, estimate based on overall score
      skillBreakdown[cat] = Math.min(100, Math.max(0, score + Math.round((Math.random() - 0.5) * 20)));
    }
  }

  return { score, cefrLevel, correctCount, totalQuestions, skillBreakdown };
}
