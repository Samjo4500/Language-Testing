import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser } from '@/lib/auth-middleware';

export async function POST(request: NextRequest) {
  try {
    // Step 1: Verify authentication
    const authResult = getAuthUser(request);
    if (!authResult) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'You must be logged in to start a test.' },
        { status: 401 }
      );
    }

    // Step 2: Check test credits
    const user = await db.user.findUnique({
      where: { id: authResult.userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Not Found', message: 'User not found.' },
        { status: 404 }
      );
    }

    if (user.testCredits <= 0) {
      return NextResponse.json(
        {
          error: 'No Test Credits',
          message: 'You have no test credits remaining. Please purchase a plan to continue.',
          code: 'NO_CREDITS',
        },
        { status: 403 }
      );
    }

    // Step 3: Check if user already has an in-progress assessment
    const existingAssessment = await db.assessment.findFirst({
      where: {
        userId: authResult.userId,
        status: 'in_progress',
      },
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

    // Step 4: Decrement test credits atomically
    await db.user.update({
      where: { id: authResult.userId },
      data: { testCredits: { decrement: 1 } },
    });

    // Step 5: Create new assessment
    const assessment = await db.assessment.create({
      data: {
        userId: authResult.userId,
        status: 'in_progress',
        startedAt: new Date(),
      },
    });

    // Step 6: Get questions from the Question Bank
    const questions = await getQuestionsFromBank();

    return NextResponse.json({
      assessment: {
        id: assessment.id,
        status: assessment.status,
        startedAt: assessment.startedAt,
      },
      questions,
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

interface CefrQuestion {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  level: string;
  category: string;
}

/**
 * Pull questions from the database Question Bank.
 * Strategy: 2 questions per level across all 6 levels = 12 questions.
 * For each level, pick 1 grammar and 1 vocabulary (or reading/listening as fallback).
 * If the question bank is empty for a slot, use the hardcoded fallback.
 */
async function getQuestionsFromBank(): Promise<CefrQuestion[]> {
  const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const SKILL_PRIORITY = ['grammar', 'vocabulary', 'reading', 'listening'];
  const QUESTIONS_PER_LEVEL = 2;
  const questions: CefrQuestion[] = [];

  for (const level of LEVELS) {
    let levelQuestions: CefrQuestion[] = [];

    for (const skill of SKILL_PRIORITY) {
      if (levelQuestions.length >= QUESTIONS_PER_LEVEL) break;

      const dbQuestions = await db.question.findMany({
        where: { level, category: skill },
        take: QUESTIONS_PER_LEVEL - levelQuestions.length,
        orderBy: { createdAt: 'desc' }, // get newest first for variety
      });

      for (const q of dbQuestions) {
        levelQuestions.push({
          id: q.id,
          text: q.text,
          options: JSON.parse(q.options),
          correctIndex: q.correctIndex,
          level: q.level,
          category: q.category,
        });
      }
    }

    questions.push(...levelQuestions);
  }

  // If question bank didn't have enough questions, fill with fallback
  if (questions.length < 12) {
    const fallback = generateFallbackCefrQuestions();
    const existingIds = new Set(questions.map((q) => q.id));
    for (const q of fallback) {
      if (questions.length >= 12) break;
      if (!existingIds.has(q.id)) {
        questions.push(q);
      }
    }
  }

  return questions;
}

function generateFallbackCefrQuestions(): CefrQuestion[] {
  return [
    {
      id: 'q1-a1',
      text: 'Choose the correct answer: "She ___ a student."',
      options: ['am', 'is', 'are', 'be'],
      correctIndex: 1,
      level: 'A1',
      category: 'grammar',
    },
    {
      id: 'q2-a1',
      text: 'What is the opposite of "big"?',
      options: ['tall', 'small', 'wide', 'long'],
      correctIndex: 1,
      level: 'A1',
      category: 'vocabulary',
    },
    {
      id: 'q3-a2',
      text: 'Choose the correct form: "I ___ to the store yesterday."',
      options: ['go', 'going', 'went', 'gone'],
      correctIndex: 2,
      level: 'A2',
      category: 'grammar',
    },
    {
      id: 'q4-a2',
      text: 'Which sentence is correct?',
      options: [
        'He can plays guitar.',
        'He can play guitar.',
        'He can playing guitar.',
        'He can played guitar.',
      ],
      correctIndex: 1,
      level: 'A2',
      category: 'grammar',
    },
    {
      id: 'q5-b1',
      text: 'Choose the correct answer: "If I ___ rich, I would travel the world."',
      options: ['am', 'was', 'were', 'be'],
      correctIndex: 2,
      level: 'B1',
      category: 'grammar',
    },
    {
      id: 'q6-b1',
      text: '"She was late ___ the heavy traffic." Choose the correct preposition.',
      options: ['because', 'due to', 'since', 'for'],
      correctIndex: 1,
      level: 'B1',
      category: 'grammar',
    },
    {
      id: 'q7-b2',
      text: 'Choose the most appropriate word: "The results were ___, exceeding all expectations."',
      options: ['remarkable', 'remark', 'remarkably', 'remarked'],
      correctIndex: 0,
      level: 'B2',
      category: 'vocabulary',
    },
    {
      id: 'q8-b2',
      text: 'Which sentence uses the passive voice correctly?',
      options: [
        'The book was wrote by the author.',
        'The book was written by the author.',
        'The book is wrote by the author.',
        'The book has wrote by the author.',
      ],
      correctIndex: 1,
      level: 'B2',
      category: 'grammar',
    },
    {
      id: 'q9-c1',
      text: '"Not until the meeting ended ___ the gravity of the situation." Choose the correct inversion.',
      options: [
        'did she realize',
        'she realized',
        'she did realize',
        'realized she',
      ],
      correctIndex: 0,
      level: 'C1',
      category: 'grammar',
    },
    {
      id: 'q10-c1',
      text: 'Choose the word that best completes: "The professor\'s explanation was so ___ that even the most complex concepts seemed straightforward."',
      options: ['lucid', 'lurid', 'lucidly', 'lucidity'],
      correctIndex: 0,
      level: 'C1',
      category: 'vocabulary',
    },
    {
      id: 'q11-c2',
      text: 'Which sentence demonstrates correct use of the subjunctive mood?',
      options: [
        'It is essential that he is present at the meeting.',
        'It is essential that he be present at the meeting.',
        'It is essential that he was present at the meeting.',
        'It is essential that he will be present at the meeting.',
      ],
      correctIndex: 1,
      level: 'C2',
      category: 'grammar',
    },
    {
      id: 'q12-c2',
      text: '"The policy, ___ intended to help, actually created more problems." Choose the correct participial phrase.',
      options: [
        'albeit',
        'however',
        'notwithstanding',
        'despite of',
      ],
      correctIndex: 0,
      level: 'C2',
      category: 'vocabulary',
    },
  ];
}
