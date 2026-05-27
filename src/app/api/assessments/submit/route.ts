import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, verifyTokenVersion } from '@/lib/auth-middleware';
import { sendAssessmentComplete } from '@/lib/email';
import { enqueueNurtureSequence } from '@/lib/email-queue';
import type { NurturePayload } from '@/lib/email-queue';

export async function POST(request: NextRequest) {
  try {
    const authResult = getAuthUser(request);
    if (!authResult) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'You must be logged in to submit an assessment.' },
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

    const assessment = await db.assessment.findFirst({
      where: { id: assessmentId, userId: authResult.userId },
    });

    if (!assessment) {
      return NextResponse.json({ error: 'Not Found', message: 'No assessment found.' }, { status: 404 });
    }

    // Idempotency
    if (assessment.status === 'completed') {
      const existingCert = await db.certificate.findUnique({ where: { assessmentId: assessment.id } });
      return NextResponse.json({
        assessment: { id: assessment.id, status: 'completed', cefrLevel: assessment.cefrLevel, score: assessment.score, completedAt: assessment.completedAt },
        certificate: existingCert ? { verificationId: existingCert.verificationId, cefrLevel: existingCert.cefrLevel, score: existingCert.score, userName: existingCert.userName, issuedAt: existingCert.issuedAt } : null,
        message: 'Assessment already submitted.',
      });
    }

    // Get the questionSet snapshot to validate questionIds
    let validQuestionIds = new Set<string>();
    if (assessment.questionSet) {
      try {
        const qs = JSON.parse(assessment.questionSet);
        const allIds = [
          ...(qs.grammar || []),
          ...(qs.vocabulary || []),
          qs.speaking, qs.writing,
        ].filter(Boolean);
        // Handle both old format (string[]) and new format ({passageId, questionIds}[])
        if (qs.reading) {
          for (const r of qs.reading) {
            if (typeof r === 'string') { allIds.push(r); }
            else { allIds.push(r.passageId, ...(r.questionIds || [])); }
          }
        }
        if (qs.listening) {
          for (const l of qs.listening) {
            if (typeof l === 'string') { allIds.push(l); }
            else { allIds.push(l.itemId, ...(l.questionIds || [])); }
          }
        }
        validQuestionIds = new Set(allIds);
      } catch {}
    }

    // Warn about missing question set — but still process for backward compatibility
    if (validQuestionIds.size === 0 && responses.length > 0) {
      console.warn(`Assessment ${assessmentId} has no validQuestionIds — accepting all responses without validation (legacy mode)`);
    }

    // Verify answers server-side from DB
    const verifiedResponses = await verifyResponsesFromDB(responses, validQuestionIds, assessmentId);
    const { score, cefrLevel, correctCount, totalQuestions, skillBreakdown } = calculateResults(verifiedResponses);

    // Save responses and update assessment
    await db.$transaction(async (tx) => {
      for (const response of verifiedResponses) {
        await tx.assessmentResponse.upsert({
          where: { id: `${assessment.id}-${response.questionId}` },
          create: {
            id: `${assessment.id}-${response.questionId}`,
            assessmentId: assessment.id,
            questionId: response.questionId,
            questionType: response.questionType || 'mcq',
            parentItemId: response.parentItemId || null,
            answer: response.answer,
            isCorrect: response.isCorrect,
            aiScore: response.aiScore || null,
            aiFeedback: response.aiFeedback || null,
          },
          update: {
            answer: response.answer,
            isCorrect: response.isCorrect,
            aiScore: response.aiScore || null,
          },
        });
      }

      await tx.assessment.update({
        where: { id: assessment.id },
        data: { status: 'completed', cefrLevel, score, completedAt: new Date() },
      });
    });

    // Generate certificate
    const { v4: uuidv4 } = await import('uuid');
    const verificationId = `TC-${uuidv4().split('-')[0].toUpperCase()}-${uuidv4().split('-')[1].toUpperCase()}`;

    const user = await db.user.findUnique({
      where: { id: authResult.userId },
      select: { id: true, plan: true, name: true, email: true },
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

    if (user) {
      sendAssessmentComplete(user.name || user.email.split('@')[0], user.email, cefrLevel, score, user.id)
        .catch((err) => console.error('Assessment complete email error:', err));

      // Enqueue nurture sequence for free-tier users (7 emails over 6 days)
      if (user.plan === 'free') {
        // Find weakest skill from breakdown
        const categories = ['reading', 'writing', 'listening', 'speaking', 'grammar', 'vocabulary'] as const;
        let weakestSkill = 'grammar';
        let weakestScore = 100;
        const breakdown = skillBreakdown as unknown as Record<string, number>;
        for (const cat of categories) {
          if (breakdown[cat] < weakestScore) {
            weakestScore = breakdown[cat];
            weakestSkill = cat;
          }
        }

        const nurturePayload: NurturePayload = {
          name: user.name || user.email.split('@')[0],
          email: user.email,
          cefrLevel,
          score,
          weakestSkill,
          weakestScore,
        };

        enqueueNurtureSequence(user.id, nurturePayload)
          .catch((err) => console.error('Nurture sequence enqueue error:', err));
      }
    }

    return NextResponse.json({
      assessment: { id: assessment.id, status: 'completed', cefrLevel, score, completedAt: new Date() },
      results: { correctCount, totalQuestions, percentage: Math.round((correctCount / totalQuestions) * 100) },
      certificate: { id: certificate.id, verificationId: certificate.verificationId, cefrLevel: certificate.cefrLevel, score: certificate.score, userName: certificate.userName, issuedAt: certificate.issuedAt },
      message: 'Assessment completed successfully. Your certificate is ready!',
    });
  } catch (error) {
    console.error('Assessment submit error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

// ═══════════════════════════════════════════════════════════
//  SERVER-SIDE VERIFICATION FROM DATABASE
// ═══════════════════════════════════════════════════════════

interface ResponseInput {
  questionId: string;
  questionType?: string;
  parentItemId?: string;
  answer: string;
  isCorrect?: boolean;
  level?: string;
  category?: string;
  aiScore?: number;
  aiFeedback?: string;
}

async function verifyResponsesFromDB(
  responses: ResponseInput[],
  validQuestionIds: Set<string>,
  assessmentId: string
): Promise<any[]> {
  const verified: any[] = [];

  for (const r of responses) {
    const qType = r.questionType || 'mcq';
    let isCorrect = r.isCorrect || false;
    let level = r.level || 'B1';
    let category = r.category || 'grammar';

    if (qType === 'mcq') {
      // Look up the MCQ question from DB
      const question = await db.question.findUnique({ where: { id: r.questionId } });
      if (question) {
        isCorrect = Number(r.answer) === question.correctIndex;
        level = question.level;
        category = question.category;
      }
    } else if (qType === 'reading') {
      // Look up reading sub-question from DB
      const question = await db.readingQuestion.findUnique({ where: { id: r.questionId } });
      if (question) {
        isCorrect = Number(r.answer) === question.correctIndex;
        category = 'reading';
        // Get level from parent passage
        if (r.parentItemId) {
          const passage = await db.readingPassage.findUnique({ where: { id: r.parentItemId } });
          if (passage) level = passage.level;
        }
      }
    } else if (qType === 'listening') {
      const question = await db.listeningQuestion.findUnique({ where: { id: r.questionId } });
      if (question) {
        isCorrect = Number(r.answer) === question.correctIndex;
        category = 'listening';
        if (r.parentItemId) {
          const item = await db.listeningItem.findUnique({ where: { id: r.parentItemId } });
          if (item) level = item.level;
        }
      }
    } else if (qType === 'speaking') {
      category = 'speaking';
      const prompt = await db.speakingPrompt.findUnique({ where: { id: r.questionId } });
      if (prompt) level = prompt.level;
      // Validate: use server-stored evaluation if available
      const existingEval = await db.assessmentResponse.findFirst({
        where: { assessmentId, questionId: r.questionId },
        select: { aiScore: true },
      });
      if (existingEval?.aiScore != null) {
        r.aiScore = existingEval.aiScore; // Override client score with server-stored score
      }
      isCorrect = (r.aiScore || 0) >= 50;
    } else if (qType === 'writing') {
      category = 'writing';
      const prompt = await db.writingPrompt.findUnique({ where: { id: r.questionId } });
      if (prompt) level = prompt.level;
      const existingEval = await db.assessmentResponse.findFirst({
        where: { assessmentId, questionId: r.questionId },
        select: { aiScore: true },
      });
      if (existingEval?.aiScore != null) {
        r.aiScore = existingEval.aiScore;
      }
      isCorrect = (r.aiScore || 0) >= 50;
    }

    verified.push({
      ...r,
      questionType: qType,
      isCorrect,
      level,
      category,
    });
  }

  return verified;
}

// ═══════════════════════════════════════════════════════════
//  RESULTS CALCULATION
// ═══════════════════════════════════════════════════════════

interface SkillBreakdown {
  reading: number;
  writing: number;
  listening: number;
  speaking: number;
  grammar: number;
  vocabulary: number;
}

function calculateResults(responses: any[]): {
  score: number;
  cefrLevel: string;
  correctCount: number;
  totalQuestions: number;
  skillBreakdown: SkillBreakdown;
} {
  const totalQuestions = responses.length;
  const correctCount = responses.filter((r) => r.isCorrect).length;

  // Weighted scoring
  const levelWeights: Record<string, number> = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 };

  let totalWeight = 0;
  let earnedWeight = 0;

  for (const response of responses) {
    const weight = levelWeights[response.level] || 3;
    totalWeight += weight;
    if (response.isCorrect) earnedWeight += weight;
  }

  const score = totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0;

  // Determine CEFR level
  const correctByLevel: Record<string, number> = {};
  const totalByLevel: Record<string, number> = {};
  for (const response of responses) {
    totalByLevel[response.level] = (totalByLevel[response.level] || 0) + 1;
    if (response.isCorrect) correctByLevel[response.level] = (correctByLevel[response.level] || 0) + 1;
  }

  const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  let cefrLevel = 'A1';
  for (const level of levels) {
    const total = totalByLevel[level] || 0;
    const correct = correctByLevel[level] || 0;
    if (total > 0 && correct / total >= 0.5) cefrLevel = level;
  }

  // Skill breakdown
  const categories = ['reading', 'writing', 'listening', 'speaking', 'grammar', 'vocabulary'] as const;
  const skillBreakdown: SkillBreakdown = {} as SkillBreakdown;
  for (const cat of categories) {
    const catResponses = responses.filter((r) => (r.category || 'grammar') === cat);
    skillBreakdown[cat] = catResponses.length > 0
      ? Math.round((catResponses.filter((r) => r.isCorrect).length / catResponses.length) * 100)
      : 0;
  }

  return { score, cefrLevel, correctCount, totalQuestions, skillBreakdown };
}
