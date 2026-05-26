import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser } from '@/lib/auth-middleware';

// CEFR level weights for weighted scoring
const levelWeights: Record<string, number> = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 };

// Map questionType categories to skill names
const typeToSkill: Record<string, string> = {
  mcq: 'grammar',  // default for grammar/vocabulary MCQs
  reading: 'reading',
  listening: 'listening',
  speaking: 'speaking',
  writing: 'writing',
};

// Skill color mapping
const skillColors: Record<string, string> = {
  grammar: '#f43f5e',
  vocabulary: '#14b8a6',
  reading: '#3b82f6',
  listening: '#22c55e',
  speaking: '#f59e0b',
  writing: '#a855f7',
};

// CEFR level badge color mapping
const cefrBadgeColors: Record<string, string> = {
  A1: '#94a3b8',
  A2: '#22c55e',
  B1: '#3b82f6',
  B2: '#8b5cf6',
  C1: '#f59e0b',
  C2: '#ef4444',
};

interface QuestionResult {
  questionId: string;
  questionType: string;
  questionText: string;
  options: string[];
  correctIndex: number;
  userAnswer: number | null;
  isCorrect: boolean;
  level: string;
  category: string;
  explanation: string | null;
  aiScore?: number | null;
  aiFeedback?: string | null;
}

interface LevelPerformance {
  level: string;
  correct: number;
  total: number;
  percentage: number;
}

interface SkillResult {
  skill: string;
  score: number;
  cefrLevel: string;
  color: string;
  questions: QuestionResult[];
  levelPerformance: LevelPerformance[];
}

export async function GET(request: NextRequest) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'You must be logged in to view results.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const skill = searchParams.get('skill');

    if (!skill || !['grammar', 'vocabulary', 'reading', 'listening', 'speaking', 'writing'].includes(skill)) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Valid skill parameter is required (grammar, vocabulary, reading, listening, speaking, writing).' },
        { status: 400 }
      );
    }

    // Find the user's latest completed assessment
    const assessment = await db.assessment.findFirst({
      where: {
        userId: authUser.userId,
        status: 'completed',
      },
      orderBy: { completedAt: 'desc' },
      include: {
        responses: true,
      },
    });

    if (!assessment) {
      return NextResponse.json(
        { error: 'Not Found', message: 'No completed assessment found.' },
        { status: 404 }
      );
    }

    // Filter responses for this skill
    const skillResponses = assessment.responses.filter((r) => {
      if (skill === 'grammar' || skill === 'vocabulary') {
        // For MCQ types, we need to look at the question's category
        return r.questionType === 'mcq';
      }
      return r.questionType === skill;
    });

    // For grammar/vocabulary, further filter by looking up the question
    const questionResults: QuestionResult[] = [];
    let totalWeight = 0;
    let earnedWeight = 0;
    const correctByLevel: Record<string, { correct: number; total: number }> = {};

    for (const response of skillResponses) {
      let questionText = '';
      let options: string[] = [];
      let correctIndex = -1;
      let explanation: string | null = null;
      let category = response.questionType;
      let level = 'B1';

      if (response.questionType === 'mcq') {
        // Look up the Question model
        const question = await db.question.findUnique({ where: { id: response.questionId } });
        if (!question) continue;

        // Filter by skill: grammar or vocabulary
        if (skill === 'grammar' && question.category !== 'grammar') continue;
        if (skill === 'vocabulary' && question.category !== 'vocabulary') continue;
        if (skill !== 'grammar' && skill !== 'vocabulary') continue;

        questionText = question.text;
        try { options = JSON.parse(question.options); } catch { options = []; }
        correctIndex = question.correctIndex;
        explanation = question.explanation;
        category = question.category;
        level = question.level;
      } else if (response.questionType === 'reading') {
        const readingQ = await db.readingQuestion.findUnique({ where: { id: response.questionId } });
        if (!readingQ) continue;

        questionText = readingQ.questionText;
        try { options = JSON.parse(readingQ.options); } catch { options = []; }
        correctIndex = readingQ.correctIndex;
        explanation = readingQ.explanation;
        category = 'reading';

        // Get level from parent passage
        if (response.parentItemId) {
          const passage = await db.readingPassage.findUnique({ where: { id: response.parentItemId } });
          if (passage) level = passage.level;
        }
      } else if (response.questionType === 'listening') {
        const listeningQ = await db.listeningQuestion.findUnique({ where: { id: response.questionId } });
        if (!listeningQ) continue;

        questionText = listeningQ.questionText;
        try { options = JSON.parse(listeningQ.options); } catch { options = []; }
        correctIndex = listeningQ.correctIndex;
        explanation = listeningQ.explanation;
        category = 'listening';

        if (response.parentItemId) {
          const item = await db.listeningItem.findUnique({ where: { id: response.parentItemId } });
          if (item) level = item.level;
        }
      } else if (response.questionType === 'speaking') {
        const speakingP = await db.speakingPrompt.findUnique({ where: { id: response.questionId } });
        if (!speakingP) continue;

        questionText = speakingP.promptText;
        options = [];
        correctIndex = -1;
        explanation = null;
        category = 'speaking';
        level = speakingP.level;
      } else if (response.questionType === 'writing') {
        const writingP = await db.writingPrompt.findUnique({ where: { id: response.questionId } });
        if (!writingP) continue;

        questionText = writingP.promptText;
        options = [];
        correctIndex = -1;
        explanation = null;
        category = 'writing';
        level = writingP.level;
      } else {
        continue;
      }

      const isCorrect = response.isCorrect ?? false;
      const userAnswer = response.answer ? parseInt(response.answer, 10) : null;

      // Weighted scoring
      const weight = levelWeights[level] || 3;
      totalWeight += weight;
      if (isCorrect) earnedWeight += weight;

      // Track by level
      if (!correctByLevel[level]) correctByLevel[level] = { correct: 0, total: 0 };
      correctByLevel[level].total += 1;
      if (isCorrect) correctByLevel[level].correct += 1;

      questionResults.push({
        questionId: response.questionId,
        questionType: response.questionType,
        questionText,
        options,
        correctIndex,
        userAnswer: isNaN(userAnswer as number) ? null : userAnswer,
        isCorrect,
        level,
        category,
        explanation,
        aiScore: response.aiScore,
        aiFeedback: response.aiFeedback,
      });
    }

    // Calculate score
    const score = totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0;

    // Determine CEFR level based on performance
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    let cefrLevel = 'A1';
    for (const level of levels) {
      const data = correctByLevel[level];
      if (data && data.total > 0 && data.correct / data.total >= 0.5) {
        cefrLevel = level;
      }
    }

    // Level performance bars
    const levelPerformance: LevelPerformance[] = levels.map((level) => {
      const data = correctByLevel[level];
      return {
        level,
        correct: data?.correct ?? 0,
        total: data?.total ?? 0,
        percentage: data && data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
      };
    });

    // Build result
    const skillResult: SkillResult = {
      skill,
      score,
      cefrLevel,
      color: skillColors[skill] || '#8b5cf6',
      questions: questionResults,
      levelPerformance,
    };

    // Get overall assessment info for certificate progress
    const allSkillScores: Record<string, number> = {};
    for (const resp of assessment.responses) {
      const cat = resp.questionType === 'mcq' ? 'mcq' : resp.questionType;
      const catResponses = assessment.responses.filter((r) =>
        r.questionType === cat
      );
      const correct = catResponses.filter((r) => r.isCorrect).length;
      const total = catResponses.length;
      allSkillScores[cat] = total > 0 ? Math.round((correct / total) * 100) : 0;
    }

    // Completed skills for certificate progress
    const skillFlow = ['grammar', 'vocabulary', 'reading', 'listening', 'speaking', 'writing'];
    const completedSkills: string[] = [];
    for (const s of skillFlow) {
      const hasResponses = assessment.responses.some((r) => {
        if (s === 'grammar' || s === 'vocabulary') return r.questionType === 'mcq';
        return r.questionType === s;
      });
      if (hasResponses) completedSkills.push(s);
    }

    return NextResponse.json({
      skill: skillResult,
      overall: {
        assessmentId: assessment.id,
        cefrLevel: assessment.cefrLevel,
        score: assessment.score,
        completedAt: assessment.completedAt,
      },
      certificateProgress: {
        totalSkills: 6,
        completedSkills: completedSkills.length,
        skills: skillFlow.map((s) => ({
          skill: s,
          completed: completedSkills.includes(s),
          color: skillColors[s],
        })),
      },
      cefrBadgeColors,
      nextSkill: skillFlow[skillFlow.indexOf(skill) + 1] || null,
    });
  } catch (error) {
    console.error('Test results API error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to fetch test results.' },
      { status: 500 }
    );
  }
}
