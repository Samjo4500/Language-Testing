/**
 * Question Rotation & Selection Algorithm
 * 
 * Blended A2–C1 approach with:
 * - Fisher-Yates shuffle for true randomization
 * - Anti-repeat via SeenQuestion table
 * - Adaptive difficulty based on prior performance
 * - Pool exhaustion fallback (LRU)
 */

import { db } from '@/lib/db';

// ═══════════════════════════════════════════════════════════
//  TYPES
// ═══════════════════════════════════════════════════════════

export interface AssessmentQuestionSet {
  grammar: any[];
  vocabulary: any[];
  reading: any[];
  listening: any[];
  speaking: any | null;
  writing: any | null;
}

interface LevelDistribution {
  level: string;
  weight: number;
}

interface SectionConfig {
  type: 'grammar' | 'vocabulary' | 'reading' | 'listening' | 'speaking' | 'writing';
  count: number;
  levels: LevelDistribution[];
}

// ═══════════════════════════════════════════════════════════
//  FISHER-YATES SHUFFLE
// ═══════════════════════════════════════════════════════════

function fisherYatesShuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ═══════════════════════════════════════════════════════════
//  MAIN SELECTION ALGORITHM
// ═══════════════════════════════════════════════════════════

export async function selectQuestions(
  userId: string,
  assessmentId: string,
  organizationId: string | null
): Promise<AssessmentQuestionSet> {
  // Step 1: Get previously seen question IDs
  const seenIds = await getSeenQuestionIds(userId);

  // Step 2: Get prior performance for adaptive adjustment
  const priorPerformance = await getPriorPerformance(userId);

  // Step 3: Define section configs with A2–C1 bell curve
  const sections: SectionConfig[] = [
    {
      type: 'grammar',
      count: 6,
      levels: [
        { level: 'A2', weight: 0.17 },
        { level: 'B1', weight: 0.33 },
        { level: 'B2', weight: 0.33 },
        { level: 'C1', weight: 0.17 },
      ],
    },
    {
      type: 'vocabulary',
      count: 6,
      levels: [
        { level: 'A2', weight: 0.17 },
        { level: 'B1', weight: 0.33 },
        { level: 'B2', weight: 0.33 },
        { level: 'C1', weight: 0.17 },
      ],
    },
    {
      type: 'reading',
      count: 2, // 2 passages
      levels: [
        { level: 'B1', weight: 0.5 },
        { level: 'B2', weight: 0.5 },
      ],
    },
    {
      type: 'listening',
      count: 2, // 2 items
      levels: [
        { level: 'B1', weight: 0.5 },
        { level: 'B2', weight: 0.5 },
      ],
    },
    {
      type: 'speaking',
      count: 1,
      levels: [{ level: 'B2', weight: 1.0 }],
    },
    {
      type: 'writing',
      count: 1,
      levels: [{ level: 'B2', weight: 1.0 }],
    },
  ];

  // Step 4: Adaptive adjustment if we have prior data
  if (priorPerformance) {
    adjustWeightsAdaptively(sections, priorPerformance);
  }

  // Step 5: Select questions for each section
  const questionSet: AssessmentQuestionSet = {
    grammar: [],
    vocabulary: [],
    reading: [],
    listening: [],
    speaking: null,
    writing: null,
  };

  for (const section of sections) {
    if (section.type === 'grammar' || section.type === 'vocabulary') {
      questionSet[section.type] = await selectMCQQuestions(section, seenIds, organizationId);
    } else if (section.type === 'reading') {
      questionSet.reading = await selectReadingPassages(section, seenIds, organizationId);
    } else if (section.type === 'listening') {
      questionSet.listening = await selectListeningItems(section, seenIds, organizationId);
    } else if (section.type === 'speaking') {
      questionSet.speaking = await selectSpeakingPrompt(section, seenIds, organizationId);
    } else if (section.type === 'writing') {
      questionSet.writing = await selectWritingPrompt(section, seenIds, organizationId);
    }
  }

  // Step 6: Record all selected as seen
  await recordSeenQuestions(userId, assessmentId, questionSet);

  // Step 7: Store questionSet snapshot on Assessment
  await db.assessment.update({
    where: { id: assessmentId },
    data: { questionSet: JSON.stringify(serializeQuestionSet(questionSet)) },
  });

  return questionSet;
}

// ═══════════════════════════════════════════════════════════
//  MCQ SELECTION (Grammar & Vocabulary)
// ═══════════════════════════════════════════════════════════

async function selectMCQQuestions(
  section: SectionConfig,
  seenIds: Set<string>,
  organizationId: string | null
): Promise<any[]> {
  const selected: any[] = [];

  for (const levelDist of section.levels) {
    const countForLevel = Math.max(1, Math.round(section.count * levelDist.weight));

    // Fetch candidates excluding seen questions
    const candidates = await db.question.findMany({
      where: {
        level: levelDist.level,
        category: section.type,
        isActive: true,
        organizationId: organizationId || null,
        ...(seenIds.size > 0 ? { id: { notIn: [...seenIds] } } : {}),
      },
    });

    let pool = candidates.filter(q => !seenIds.has(q.id));

    // Filter variantGroup conflicts
    const selectedGroups = new Set(selected.map(q => q.variantGroup).filter(Boolean));
    pool = pool.filter(q => !q.variantGroup || !selectedGroups.has(q.variantGroup));

    // Shuffle and pick
    const shuffled = fisherYatesShuffle(pool);
    let picked = shuffled.slice(0, countForLevel);

    // Fallback: relax seen filter if not enough
    if (picked.length < countForLevel) {
      const allCandidates = await db.question.findMany({
        where: {
          level: levelDist.level,
          category: section.type,
          isActive: true,
          organizationId: organizationId || null,
        },
      });
      const additional = fisherYatesShuffle(
        allCandidates.filter(q => !selected.some(s => s.id === q.id))
      ).slice(0, countForLevel - picked.length);
      picked.push(...additional);
    }

    selected.push(...picked);
  }

  // Strip correctIndex for client safety
  return selected.map(q => ({
    id: q.id,
    text: q.text,
    options: JSON.parse(q.options),
    level: q.level,
    category: q.category,
    difficultyTier: q.difficultyTier,
  }));
}

// ═══════════════════════════════════════════════════════════
//  READING PASSAGE SELECTION
// ═══════════════════════════════════════════════════════════

async function selectReadingPassages(
  section: SectionConfig,
  seenIds: Set<string>,
  organizationId: string | null
): Promise<any[]> {
  const selected: any[] = [];

  for (const levelDist of section.levels) {
    const countForLevel = Math.max(1, Math.round(section.count * levelDist.weight));

    const candidates = await db.readingPassage.findMany({
      where: {
        level: levelDist.level,
        isActive: true,
        organizationId: organizationId || null,
        ...(seenIds.size > 0 ? { id: { notIn: [...seenIds] } } : {}),
      },
      include: { questions: { orderBy: { sortOrder: 'asc' } } },
    });

    let pool = candidates.filter(p => !seenIds.has(p.id));
    const shuffled = fisherYatesShuffle(pool);
    let picked = shuffled.slice(0, countForLevel);

    // Fallback: relax seen filter
    if (picked.length < countForLevel) {
      const allPassages = await db.readingPassage.findMany({
        where: {
          level: levelDist.level,
          isActive: true,
          organizationId: organizationId || null,
        },
        include: { questions: { orderBy: { sortOrder: 'asc' } } },
      });
      const additional = fisherYatesShuffle(
        allPassages.filter(p => !selected.some(s => s.id === p.id))
      ).slice(0, countForLevel - picked.length);
      picked.push(...additional);
    }

    selected.push(...picked);
  }

  // Format for client (strip correctIndex)
  return selected.map(p => ({
    id: p.id,
    level: p.level,
    title: p.title,
    passageText: p.passageText,
    questions: p.questions.map((q: any) => ({
      id: q.id,
      questionText: q.questionText,
      options: JSON.parse(q.options),
      sortOrder: q.sortOrder,
    })),
  }));
}

// ═══════════════════════════════════════════════════════════
//  LISTENING ITEM SELECTION
// ═══════════════════════════════════════════════════════════

async function selectListeningItems(
  section: SectionConfig,
  seenIds: Set<string>,
  organizationId: string | null
): Promise<any[]> {
  const selected: any[] = [];

  for (const levelDist of section.levels) {
    const countForLevel = Math.max(1, Math.round(section.count * levelDist.weight));

    const candidates = await db.listeningItem.findMany({
      where: {
        level: levelDist.level,
        isActive: true,
        organizationId: organizationId || null,
        ...(seenIds.size > 0 ? { id: { notIn: [...seenIds] } } : {}),
      },
      include: { questions: { orderBy: { sortOrder: 'asc' } } },
    });

    let pool = candidates.filter(i => !seenIds.has(i.id));
    const shuffled = fisherYatesShuffle(pool);
    let picked = shuffled.slice(0, countForLevel);

    if (picked.length < countForLevel) {
      const allItems = await db.listeningItem.findMany({
        where: {
          level: levelDist.level,
          isActive: true,
          organizationId: organizationId || null,
        },
        include: { questions: { orderBy: { sortOrder: 'asc' } } },
      });
      const additional = fisherYatesShuffle(
        allItems.filter(i => !selected.some(s => s.id === i.id))
      ).slice(0, countForLevel - picked.length);
      picked.push(...additional);
    }

    selected.push(...picked);
  }

  return selected.map(i => ({
    id: i.id,
    level: i.level,
    scriptText: i.scriptText,
    audioUrl: i.audioUrl,
    context: i.context,
    questions: i.questions.map((q: any) => ({
      id: q.id,
      questionText: q.questionText,
      options: JSON.parse(q.options),
      sortOrder: q.sortOrder,
    })),
  }));
}

// ═══════════════════════════════════════════════════════════
//  SPEAKING & WRITING PROMPT SELECTION
// ═══════════════════════════════════════════════════════════

async function selectSpeakingPrompt(
  section: SectionConfig,
  seenIds: Set<string>,
  organizationId: string | null
): Promise<any | null> {
  const targetLevel = section.levels[0]?.level || 'B2';

  const candidates = await db.speakingPrompt.findMany({
    where: {
      level: targetLevel,
      isActive: true,
      organizationId: organizationId || null,
      ...(seenIds.size > 0 ? { id: { notIn: [...seenIds] } } : {}),
    },
  });

  let pool = candidates.filter(p => !seenIds.has(p.id));
  if (pool.length === 0) {
    // Fallback: any level
    pool = await db.speakingPrompt.findMany({
      where: { isActive: true, organizationId: organizationId || null },
    });
  }

  if (pool.length === 0) return null;

  const picked = fisherYatesShuffle(pool)[0];
  return {
    id: picked.id,
    level: picked.level,
    promptText: picked.promptText,
    preparationTime: picked.preparationTime,
    responseTime: picked.responseTime,
  };
}

async function selectWritingPrompt(
  section: SectionConfig,
  seenIds: Set<string>,
  organizationId: string | null
): Promise<any | null> {
  const targetLevel = section.levels[0]?.level || 'B2';

  const candidates = await db.writingPrompt.findMany({
    where: {
      level: targetLevel,
      isActive: true,
      organizationId: organizationId || null,
      ...(seenIds.size > 0 ? { id: { notIn: [...seenIds] } } : {}),
    },
  });

  let pool = candidates.filter(p => !seenIds.has(p.id));
  if (pool.length === 0) {
    pool = await db.writingPrompt.findMany({
      where: { isActive: true, organizationId: organizationId || null },
    });
  }

  if (pool.length === 0) return null;

  const picked = fisherYatesShuffle(pool)[0];
  return {
    id: picked.id,
    level: picked.level,
    promptText: picked.promptText,
    minWords: picked.minWords,
    maxWords: picked.maxWords,
  };
}

// ═══════════════════════════════════════════════════════════
//  ANTI-REPEAT TRACKING
// ═══════════════════════════════════════════════════════════

async function getSeenQuestionIds(userId: string): Promise<Set<string>> {
  const seen = await db.seenQuestion.findMany({
    where: { userId },
    select: { questionId: true },
  });
  return new Set(seen.map(s => s.questionId));
}

async function recordSeenQuestions(
  userId: string,
  assessmentId: string,
  questionSet: AssessmentQuestionSet
): Promise<void> {
  const records: { userId: string; questionType: string; questionId: string; assessmentId: string }[] = [];

  for (const q of questionSet.grammar) {
    records.push({ userId, questionType: 'mcq', questionId: q.id, assessmentId });
  }
  for (const q of questionSet.vocabulary) {
    records.push({ userId, questionType: 'mcq', questionId: q.id, assessmentId });
  }
  for (const p of questionSet.reading) {
    records.push({ userId, questionType: 'reading', questionId: p.id, assessmentId });
  }
  for (const l of questionSet.listening) {
    records.push({ userId, questionType: 'listening', questionId: l.id, assessmentId });
  }
  if (questionSet.speaking) {
    records.push({ userId, questionType: 'speaking', questionId: questionSet.speaking.id, assessmentId });
  }
  if (questionSet.writing) {
    records.push({ userId, questionType: 'writing', questionId: questionSet.writing.id, assessmentId });
  }

  if (records.length > 0) {
    await db.seenQuestion.createMany({ data: records, skipDuplicates: true });
  }
}

// ═══════════════════════════════════════════════════════════
//  ADAPTIVE DIFFICULTY ADJUSTMENT
// ═══════════════════════════════════════════════════════════

interface PriorPerformance {
  previousLevel: string;
  previousScore: number;
  attemptCount: number;
}

async function getPriorPerformance(userId: string): Promise<PriorPerformance | null> {
  const lastAssessment = await db.assessment.findFirst({
    where: { userId, status: 'completed', cefrLevel: { not: null } },
    orderBy: { completedAt: 'desc' },
  });

  if (!lastAssessment?.cefrLevel) return null;

  return {
    previousLevel: lastAssessment.cefrLevel,
    previousScore: lastAssessment.score || 50,
    attemptCount: await db.assessment.count({ where: { userId, status: 'completed' } }),
  };
}

function adjustWeightsAdaptively(sections: SectionConfig[], prior: PriorPerformance): void {
  const levelOrder = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const priorIdx = levelOrder.indexOf(prior.previousLevel);

  for (const section of sections) {
    if (section.type === 'speaking' || section.type === 'writing') {
      // Target one level above prior performance
      const targetLevel = levelOrder[Math.min(priorIdx + 1, levelOrder.length - 1)];
      section.levels = [{ level: targetLevel, weight: 1.0 }];
      continue;
    }

    // For MCQ sections, shift the bell curve center
    const shift = priorIdx - 2; // -2 for A1, -1 for A2, 0 for B1, 1 for B2, 2 for C1, 3 for C2

    section.levels = section.levels.map(ld => ({
      ...ld,
      weight: applyShift(ld.level, ld.weight, shift, levelOrder),
    }));

    // Re-normalize
    const totalWeight = section.levels.reduce((sum, ld) => sum + ld.weight, 0);
    if (totalWeight > 0) {
      section.levels = section.levels.map(ld => ({ ...ld, weight: ld.weight / totalWeight }));
    }
  }
}

function applyShift(level: string, baseWeight: number, shift: number, levelOrder: string[]): number {
  const levelIdx = levelOrder.indexOf(level);
  if (levelIdx === -1) return baseWeight;
  const center = 2 + shift; // 2 = B1 center
  const distance = Math.abs(levelIdx - center);
  return baseWeight * Math.pow(0.6, distance);
}

// ═══════════════════════════════════════════════════════════
//  SERIALIZATION
// ═══════════════════════════════════════════════════════════

function serializeQuestionSet(questionSet: AssessmentQuestionSet) {
  return {
    grammar: questionSet.grammar.map(q => q.id),
    vocabulary: questionSet.vocabulary.map(q => q.id),
    reading: questionSet.reading.map(p => p.id),
    listening: questionSet.listening.map(l => l.id),
    speaking: questionSet.speaking?.id || null,
    writing: questionSet.writing?.id || null,
  };
}
