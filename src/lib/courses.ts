export interface CourseTier {
  slug: string;
  title: string;
  subtitle: string;
  level: string;
  price: number;
  compareAtPrice: number | null;
  features: string[];
  modulesCount: number;
  lessonsCount: number;
  estimatedHours: number;
  icon: string;
  gradient: string;
  color: string;
  badgeText?: string;
}

export const COURSE_TIERS: Record<string, CourseTier> = {
  beginner: {
    slug: 'beginner',
    title: 'Beginner English',
    subtitle: 'From A1 to A2 — Build your foundation',
    level: 'A1–A2',
    price: 49,
    compareAtPrice: 79,
    features: [
      '8 comprehensive modules',
      '50 interactive lessons',
      'Vocabulary building (500+ words)',
      'Grammar fundamentals',
      'Listening exercises with AI voice',
      'Quizzes after every lesson',
      'Progress tracking dashboard',
      'Completion certificate',
    ],
    modulesCount: 8,
    lessonsCount: 50,
    estimatedHours: 25,
    icon: 'Sprout',
    gradient: 'from-sky-400 to-blue-500',
    color: 'sky',
    badgeText: 'Best for Starters',
  },
  intermediate: {
    slug: 'intermediate',
    title: 'Intermediate English',
    subtitle: 'From B1 to B2 — Communicate with confidence',
    level: 'B1–B2',
    price: 79,
    compareAtPrice: 129,
    features: [
      '10 comprehensive modules',
      '50 interactive lessons',
      'Professional communication skills',
      'Complex grammar mastery',
      'Academic English introduction',
      'Listening exercises with AI voice',
      'Quizzes after every lesson',
      'Progress tracking dashboard',
      'Completion certificate',
    ],
    modulesCount: 10,
    lessonsCount: 50,
    estimatedHours: 45,
    icon: 'TrendingUp',
    gradient: 'from-blue-500 to-indigo-600',
    color: 'blue',
    badgeText: 'Most Popular',
  },
  advanced: {
    slug: 'advanced',
    title: 'Advanced English',
    subtitle: 'From C1 to C2 — Master the language',
    level: 'C1–C2',
    price: 99,
    compareAtPrice: 169,
    features: [
      '10 comprehensive modules',
      '50 interactive lessons',
      'Academic & professional mastery',
      'Rhetoric & persuasion techniques',
      'Literary & scientific English',
      'Phonological precision',
      'Quizzes after every lesson',
      'Progress tracking dashboard',
      'Completion certificate',
    ],
    modulesCount: 10,
    lessonsCount: 50,
    estimatedHours: 55,
    icon: 'Crown',
    gradient: 'from-indigo-500 to-blue-700',
    color: 'indigo',
    badgeText: 'For Achievers',
  },
};

export const COURSE_BUNDLE = {
  slug: 'bundle',
  title: 'Complete English Bundle',
  subtitle: 'All three courses — A1 to C2',
  price: 179,
  compareAtPrice: 377,
  features: [
    'All 3 courses included',
    '28 comprehensive modules',
    '150 interactive lessons',
    'Complete A1 → C2 journey',
    '3 completion certificates',
    'Save $198 vs buying separately',
  ],
};

// For PayPal payment validation
export const COURSE_PRICES: Record<string, { amount: number; label: string }> = {
  beginner: { amount: 49, label: 'Beginner English Course (A1–A2)' },
  intermediate: { amount: 79, label: 'Intermediate English Course (B1–B2)' },
  advanced: { amount: 99, label: 'Advanced English Course (C1–C2)' },
  bundle: { amount: 179, label: 'Complete English Bundle (A1–C2)' },
};
