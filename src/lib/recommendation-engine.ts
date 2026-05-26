// ═══════════════════════════════════════════════════════════
//  RECOMMENDATION ENGINE — Maps CEFR assessment results to course recommendations
// ═══════════════════════════════════════════════════════════

/**
 * CEFR level to numeric value for averaging/comparison
 */
const CEFR_NUMERIC: Record<string, number> = {
  A1: 1,
  A2: 2,
  B1: 3,
  B2: 4,
  C1: 5,
  C2: 6,
};

const NUMERIC_TO_CEFR: Record<number, string> = {
  1: 'A1',
  2: 'A2',
  3: 'B1',
  4: 'B2',
  5: 'C1',
  6: 'C2',
};

/**
 * Skill categories that the assessment measures
 */
export type SkillCategory = 'reading' | 'writing' | 'listening' | 'speaking' | 'grammar' | 'vocabulary';

export interface SkillScore {
  skill: SkillCategory;
  score: number; // 0-100 percentage
  cefrLevel: string; // A1-C2
}

export interface ExistingProgress {
  courseSlug: string; // "beginner" | "intermediate" | "advanced"
  progress: number; // 0-100 percentage
  status: string; // "active" | "completed"
}

export interface CourseRecommendation {
  courseSlug: string; // "beginner" | "intermediate" | "advanced"
  courseLevel: string; // "A1-A2" | "B1-B2" | "C1-C2"
  courseTitle: string;
  matchPercentage: number; // How well this course matches the user
  priorityLessons: PriorityLesson[];
  reason: string; // Human-readable reason for this recommendation
}

export interface PriorityLesson {
  title: string;
  skillArea: string;
  relevance: 'critical' | 'recommended' | 'supplementary';
}

export interface RecommendationResult {
  overallCEFR: string;
  overallCEFRNumeric: number;
  skillScores: SkillScore[];
  weakAreas: SkillCategory[];
  strongAreas: SkillCategory[];
  recommendation: CourseRecommendation;
  alternativeRecommendation?: CourseRecommendation;
}

// ═══════════════════════════════════════════════════════════
//  LESSON MAPPING — Real lesson titles from the platform
// ═══════════════════════════════════════════════════════════

const PRIORITY_LESSONS: Record<string, PriorityLesson[]> = {
  'A1-A2': [
    { title: 'Present Simple Tense', skillArea: 'grammar', relevance: 'critical' },
    { title: 'Articles: A, An, The', skillArea: 'grammar', relevance: 'critical' },
    { title: 'Questions & Negatives', skillArea: 'grammar', relevance: 'recommended' },
    { title: 'Daily Routines', skillArea: 'vocabulary', relevance: 'recommended' },
  ],
  'B1-B2': [
    { title: 'Present Perfect', skillArea: 'grammar', relevance: 'critical' },
    { title: 'Passive Voice', skillArea: 'grammar', relevance: 'critical' },
    { title: 'Reported Speech', skillArea: 'grammar', relevance: 'recommended' },
    { title: 'Idioms & Expressions', skillArea: 'vocabulary', relevance: 'recommended' },
    { title: 'Relative Clauses', skillArea: 'grammar', relevance: 'supplementary' },
  ],
  'C1-C2': [
    { title: 'Debating Skills', skillArea: 'speaking', relevance: 'critical' },
    { title: 'Public Speaking', skillArea: 'speaking', relevance: 'critical' },
    { title: 'Literary Terms', skillArea: 'vocabulary', relevance: 'recommended' },
    { title: 'Conflict Resolution', skillArea: 'speaking', relevance: 'supplementary' },
  ],
};

const COURSE_INFO: Record<string, { slug: string; level: string; title: string }> = {
  'A1-A2': { slug: 'beginner', level: 'A1-A2', title: 'Beginner English' },
  'B1-B2': { slug: 'intermediate', level: 'B1-B2', title: 'Intermediate English' },
  'C1-C2': { slug: 'advanced', level: 'C1-C2', title: 'Advanced English' },
};

// ═══════════════════════════════════════════════════════════
//  CORE FUNCTIONS
// ═══════════════════════════════════════════════════════════

/**
 * Maps a percentage score (0-100) to a CEFR level
 */
export function scoreToCEFR(score: number): string {
  if (score >= 90) return 'C2';
  if (score >= 78) return 'C1';
  if (score >= 65) return 'B2';
  if (score >= 50) return 'B1';
  if (score >= 35) return 'A2';
  return 'A1';
}

/**
 * Maps an overall CEFR level to a course level band
 */
export function cefrToCourseLevel(cefr: string): string {
  const level = cefr.toUpperCase();
  if (level === 'A1' || level === 'A2') return 'A1-A2';
  if (level === 'B1' || level === 'B2') return 'B1-B2';
  return 'C1-C2';
}

/**
 * Calculates the overall CEFR level by averaging individual skill CEFR levels.
 *
 * Uses a weighted approach: converts each skill's CEFR to its numeric value,
 * takes the mean, and rounds to the nearest CEFR level.
 * Weak areas pull the average down slightly.
 */
export function calculateOverallCEFR(scores: SkillScore[]): {
  overallCEFR: string;
  overallNumeric: number;
  weakAreas: SkillCategory[];
  strongAreas: SkillCategory[];
} {
  if (scores.length === 0) {
    return { overallCEFR: 'A1', overallNumeric: 1, weakAreas: [], strongAreas: [] };
  }

  // Convert each skill score to a CEFR level, then to numeric
  const numericValues = scores.map(s => ({
    skill: s.skill,
    numeric: CEFR_NUMERIC[scoreToCEFR(s.score)] || 1,
    score: s.score,
  }));

  // Calculate mean
  const sum = numericValues.reduce((acc, v) => acc + v.numeric, 0);
  const mean = sum / numericValues.length;

  // Round to nearest integer for CEFR level
  const roundedNumeric = Math.round(mean);
  const clampedNumeric = Math.max(1, Math.min(6, roundedNumeric));
  const overallCEFR = NUMERIC_TO_CEFR[clampedNumeric] || 'A1';

  // Identify weak areas (below overall level) and strong areas (at or above overall level)
  const overallNumeric = CEFR_NUMERIC[overallCEFR];
  const weakAreas: SkillCategory[] = [];
  const strongAreas: SkillCategory[] = [];

  for (const v of numericValues) {
    if (v.numeric < overallNumeric) {
      weakAreas.push(v.skill);
    } else if (v.numeric > overallNumeric) {
      strongAreas.push(v.skill);
    }
  }

  // If no weak areas found, find the lowest-scoring skills (relative to overall)
  if (weakAreas.length === 0) {
    const sorted = [...numericValues].sort((a, b) => a.numeric - b.numeric);
    // Add the lowest scoring as weak area if it's at or below overall
    if (sorted[0] && sorted[0].numeric <= overallNumeric) {
      weakAreas.push(sorted[0].skill);
    }
  }

  // If no strong areas, find the highest-scoring
  if (strongAreas.length === 0) {
    const sorted = [...numericValues].sort((a, b) => b.numeric - a.numeric);
    if (sorted[0] && sorted[0].numeric >= overallNumeric) {
      strongAreas.push(sorted[0].skill);
    }
  }

  return { overallCEFR, overallNumeric, weakAreas, strongAreas };
}

/**
 * Generates a course recommendation based on the user's overall CEFR level,
 * weak areas, and existing course progress.
 */
export function getCourseRecommendation(
  overallCEFR: string,
  weakAreas: SkillCategory[],
  existingProgress: ExistingProgress[]
): CourseRecommendation {
  const courseLevel = cefrToCourseLevel(overallCEFR);
  const info = COURSE_INFO[courseLevel];

  // Check if user is already enrolled in the recommended course
  const existingEnrollment = existingProgress.find(
    p => p.courseSlug === info.slug
  );

  // Calculate match percentage
  let matchPercentage = 85; // Base match

  // Boost match if there's a clear alignment
  const overallNumeric = CEFR_NUMERIC[overallCEFR] || 1;
  if (courseLevel === 'A1-A2' && overallNumeric <= 2) matchPercentage = 95;
  if (courseLevel === 'B1-B2' && overallNumeric >= 3 && overallNumeric <= 4) matchPercentage = 93;
  if (courseLevel === 'C1-C2' && overallNumeric >= 5) matchPercentage = 91;

  // If already completed this course, suggest the next level up
  if (existingEnrollment?.status === 'completed') {
    const nextLevel = getNextCourseLevel(courseLevel);
    const nextInfo = COURSE_INFO[nextLevel];
    if (nextInfo) {
      return buildRecommendation(
        nextInfo,
        nextLevel,
        weakAreas,
        Math.max(70, matchPercentage - 15),
        existingProgress,
        `You've completed the ${info.title} course! Ready for the next challenge.`
      );
    }
  }

  // If already enrolled and in progress, still recommend it but adjust messaging
  if (existingEnrollment && existingEnrollment.status === 'active' && existingEnrollment.progress > 0) {
    return buildRecommendation(
      info,
      courseLevel,
      weakAreas,
      matchPercentage,
      existingProgress,
      `Continue your ${info.title} journey — focus on your weak areas to level up faster.`
    );
  }

  // Build reason based on weak areas
  const reason = buildReason(overallCEFR, courseLevel, weakAreas);

  return buildRecommendation(info, courseLevel, weakAreas, matchPercentage, existingProgress, reason);
}

// ═══════════════════════════════════════════════════════════
//  HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════

function getNextCourseLevel(currentLevel: string): string {
  if (currentLevel === 'A1-A2') return 'B1-B2';
  if (currentLevel === 'B1-B2') return 'C1-C2';
  return 'C1-C2'; // Already at top
}

function buildRecommendation(
  info: { slug: string; level: string; title: string },
  courseLevel: string,
  weakAreas: SkillCategory[],
  matchPercentage: number,
  existingProgress: ExistingProgress[],
  reason: string
): CourseRecommendation {
  // Get priority lessons for this course level
  const baseLessons = PRIORITY_LESSONS[courseLevel] || [];

  // Reorder lessons to prioritize weak areas
  const prioritizedLessons = prioritizeForWeakAreas(baseLessons, weakAreas, existingProgress);

  return {
    courseSlug: info.slug,
    courseLevel: info.level,
    courseTitle: info.title,
    matchPercentage,
    priorityLessons: prioritizedLessons,
    reason,
  };
}

function prioritizeForWeakAreas(
  lessons: PriorityLesson[],
  weakAreas: SkillCategory[],
  existingProgress: ExistingProgress[]
): PriorityLesson[] {
  // Boost relevance of lessons that target weak areas
  const relevanceOrder: Record<string, number> = { critical: 3, recommended: 2, supplementary: 1 };

  const scored = lessons.map(lesson => {
    let score = relevanceOrder[lesson.relevance] || 1;

    // Boost if the lesson's skill area matches a weak area
    if (weakAreas.includes(lesson.skillArea as SkillCategory)) {
      score += 2;
    }

    // Mark as critical if it targets a weak area
    const adjustedRelevance: PriorityLesson['relevance'] =
      weakAreas.includes(lesson.skillArea as SkillCategory) && lesson.relevance === 'recommended'
        ? 'critical'
        : lesson.relevance;

    return { ...lesson, _score: score, relevance: adjustedRelevance };
  });

  // Sort by score descending
  scored.sort((a, b) => b._score - a._score);

  // Remove internal _score field
  return scored.map(({ _score, ...lesson }) => lesson);
}

function buildReason(overallCEFR: string, courseLevel: string, weakAreas: SkillCategory[]): string {
  const skillNames: Record<string, string> = {
    reading: 'Reading',
    writing: 'Writing',
    listening: 'Listening',
    speaking: 'Speaking',
    grammar: 'Grammar',
    vocabulary: 'Vocabulary',
  };

  const weakNames = weakAreas.map(w => skillNames[w] || w);

  if (weakNames.length > 0) {
    return `Based on your CEFR ${overallCEFR} level, we recommend focusing on ${courseLevel} content. Your ${weakNames.join(', ')} skills need the most improvement.`;
  }

  return `Your CEFR ${overallCEFR} level aligns perfectly with our ${courseLevel} course. Build a strong foundation across all skills.`;
}

/**
 * Convenience function: full recommendation pipeline from skill scores
 */
export function generateRecommendation(
  skillScores: SkillScore[],
  existingProgress: ExistingProgress[]
): RecommendationResult {
  const { overallCEFR, overallNumeric, weakAreas, strongAreas } = calculateOverallCEFR(skillScores);
  const recommendation = getCourseRecommendation(overallCEFR, weakAreas, existingProgress);

  // Build alternative recommendation (one level above if appropriate)
  let alternativeRecommendation: CourseRecommendation | undefined;
  const currentCourseLevel = cefrToCourseLevel(overallCEFR);
  const nextLevel = getNextCourseLevel(currentCourseLevel);
  const nextInfo = COURSE_INFO[nextLevel];

  if (nextInfo && nextLevel !== currentCourseLevel && strongAreas.length >= 3) {
    alternativeRecommendation = {
      courseSlug: nextInfo.slug,
      courseLevel: nextInfo.level,
      courseTitle: nextInfo.title,
      matchPercentage: Math.max(55, recommendation.matchPercentage - 25),
      priorityLessons: PRIORITY_LESSONS[nextLevel] || [],
      reason: `Your strong skills suggest you could also challenge yourself with ${nextInfo.title}.`,
    };
  }

  return {
    overallCEFR,
    overallCEFRNumeric: overallNumeric,
    skillScores,
    weakAreas,
    strongAreas,
    recommendation,
    alternativeRecommendation,
  };
}
