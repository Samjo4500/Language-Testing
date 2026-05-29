// ── Vocabulary Utility Functions ──────────────────────────────────────────────
// Shared helpers for the InteractiveVocabulary component

/**
 * Fisher-Yates shuffle — returns a new shuffled array
 */
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Generate distractor words from a word pool.
 * Excludes the correct answer and already-selected distractors.
 */
export function generateDistractors(
  correctWord: string,
  wordPool: string[],
  count: number = 3
): string[] {
  const candidates = wordPool.filter(
    (w) => w.toLowerCase() !== correctWord.toLowerCase()
  );
  const distractors: string[] = [];
  const used = new Set<string>();

  while (distractors.length < count && candidates.length > 0) {
    const idx = Math.floor(Math.random() * candidates.length);
    const word = candidates[idx];
    if (!used.has(word.toLowerCase())) {
      distractors.push(word);
      used.add(word.toLowerCase());
    }
    candidates.splice(idx, 1);
  }

  // Fallback generic distractors if not enough words in pool
  const fallback = ['option', 'concept', 'method', 'process', 'system', 'approach'];
  while (distractors.length < count) {
    const d = fallback[Math.floor(Math.random() * fallback.length)];
    if (d.toLowerCase() !== correctWord.toLowerCase() && !used.has(d.toLowerCase())) {
      distractors.push(d);
      used.add(d.toLowerCase());
    }
  }

  return distractors;
}

/**
 * Determine mastery status based on score and streak.
 * Returns one of: 'new' | 'learning' | 'mastered' | 'needs_review'
 */
export function calculateMasteryStatus(
  correctStreak: number,
  masteryScore: number,
  totalReviews: number
): 'new' | 'learning' | 'mastered' | 'needs_review' {
  if (totalReviews === 0) return 'new';
  if (correctStreak >= 3 && masteryScore >= 80) return 'mastered';
  if (correctStreak >= 1 && masteryScore >= 20) return 'learning';
  if (totalReviews > 2 && correctStreak === 0) return 'needs_review';
  return 'learning';
}

/**
 * Format milliseconds into a human-readable string.
 * - Under 60s → "Xs"
 * - 60s–3600s → "Xm Ys"
 * - Over 1h → "Xh Ym"
 */
export function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  if (totalSeconds < 60) return `${totalSeconds}s`;

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes < 60) return `${minutes}m ${seconds}s`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}

/**
 * Format milliseconds into a compact timer display (MM:SS or SS)
 */
export function formatTimer(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes > 0) {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
  return `0:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Calculate score for fill-in-the-gap exercise
 * - Correct on 1st try: 10pts
 * - Correct with hint: 5pts
 * - Wrong: 0pts
 */
export function calculateFillGapScore(
  isCorrect: boolean,
  usedHint: boolean
): number {
  if (!isCorrect) return 0;
  return usedHint ? 5 : 10;
}

/**
 * Calculate score for sentence builder exercise
 * - Perfect: 10pts
 * - 1 word misplaced: 5pts
 * - More: 0pts
 */
export function calculateSentenceBuilderScore(
  correctOrder: string[],
  userOrder: string[]
): number {
  if (correctOrder.length !== userOrder.length) return 0;

  let misplaced = 0;
  for (let i = 0; i < correctOrder.length; i++) {
    if (correctOrder[i] !== userOrder[i]) {
      misplaced++;
    }
  }

  if (misplaced === 0) return 10;
  if (misplaced === 1) return 5;
  return 0;
}

/**
 * Calculate score for multiple choice exercise
 * - Correct: 10pts
 * - Wrong: 0pts
 */
export function calculateMultipleChoiceScore(isCorrect: boolean): number {
  return isCorrect ? 10 : 0;
}

/**
 * Scramble words from an example sentence for the sentence builder exercise.
 * Adds 1-2 distractor words from a pool if available.
 */
export function scrambleSentence(
  example: string,
  distractorPool?: string[]
): string[] {
  // Split the sentence into words, removing punctuation for simplicity
  const words = example
    .replace(/[.,!?;:'"]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 0);

  // Add 1-2 distractor words
  const distractors: string[] = [];
  if (distractorPool && distractorPool.length > 0) {
    const numDistractors = Math.min(
      Math.random() > 0.5 ? 2 : 1,
      distractorPool.length
    );
    const shuffled = shuffleArray(distractorPool);
    for (let i = 0; i < numDistractors; i++) {
      const d = shuffled[i];
      if (!words.some((w) => w.toLowerCase() === d.toLowerCase())) {
        distractors.push(d);
      }
    }
  }

  return shuffleArray([...words, ...distractors]);
}

/**
 * CEFR level colors matching the project design system
 */
export const LEVEL_COLORS: Record<string, string> = {
  A1: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
  A2: 'text-green-400 border-green-400/30 bg-green-400/10',
  B1: 'text-amber-400 border-amber-400/30 bg-amber-400/10',
  B2: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
  C1: 'text-violet-400 border-violet-400/30 bg-violet-400/10',
  C2: 'text-violet-400 border-violet-400/30 bg-violet-400/10',
};

export const LEVEL_GRADIENT_COLORS: Record<string, string> = {
  A1: 'from-emerald-500 to-emerald-600',
  A2: 'from-green-500 to-green-600',
  B1: 'from-amber-500 to-amber-600',
  B2: 'from-yellow-500 to-yellow-600',
  C1: 'from-violet-500 to-violet-600',
  C2: 'from-violet-500 to-violet-600',
};

export const LEVEL_BG: Record<string, string> = {
  A1: 'bg-emerald-500',
  A2: 'bg-green-500',
  B1: 'bg-amber-500',
  B2: 'bg-yellow-500',
  C1: 'bg-violet-500',
  C2: 'bg-violet-500',
};

export const MASTERY_COLORS: Record<string, string> = {
  new: 'text-gray-400 bg-gray-400/10 border-gray-400/30',
  learning: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
  mastered: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
  needs_review: 'text-red-400 bg-red-400/10 border-red-400/30',
};
