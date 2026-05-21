/**
 * Shared plan configuration constants.
 *
 * Single source of truth for plan pricing, credits, CEFR level styling,
 * and related display data used across the codebase.
 */

// ─── Plan Config Types ────────────────────────────────────────────────────────

export interface IndividualPlan {
  id: string;
  name: string;
  desc: string;
  price: string;
  priceNum: number;
  features: string[];
  cta: string;
  ctaLink: string;
  popular: boolean;
}

export interface OrgPlan {
  tier: string;
  desc: string;
  subdesc: string;
  price: string;
  period: string;
  features: string[];
  bestFor: string;
  cta: string;
  ctaLink: string;
  popular?: boolean;
}

export interface PlanConfigEntry {
  credits: number;
  planName: string;
  expiryDays: number | null;
  expectedAmount: number;
  price: string;
}

// ─── Individual Plans ─────────────────────────────────────────────────────────

export const INDIVIDUAL_PLANS: IndividualPlan[] = [
  {
    id: 'single',
    name: 'Single Test',
    desc: 'Full assessment with detailed report',
    price: '$12.99',
    priceNum: 12.99,
    features: [
      'Complete 6-skill assessment',
      'Detailed CEFR score',
      'AI-powered feedback',
      'Downloadable PDF certificate',
    ],
    cta: 'Buy Test',
    ctaLink: '/pricing',
    popular: false,
  },
  {
    id: 'premium',
    name: 'Premium Pack',
    desc: '3 tests — best value for learners',
    price: '$29.99',
    priceNum: 29.99,
    features: [
      '3 full assessments',
      'Progress tracking dashboard',
      'Priority AI analysis',
      'Unlimited certificate downloads',
      'Email support',
    ],
    cta: 'Get Premium',
    ctaLink: '/pricing',
    popular: true,
  },
  {
    id: 'pro',
    name: 'Pro Pack',
    desc: '6 tests — complete learning solution',
    price: '$49.99',
    priceNum: 49.99,
    features: [
      '6 assessments',
      'Full analytics suite',
      'Detailed skill improvement tips',
      'Comparison with peers',
      'Priority support',
    ],
    cta: 'Go Pro',
    ctaLink: '/pricing',
    popular: false,
  },
];

// ─── Organization Plans ───────────────────────────────────────────────────────

export const ORG_PLANS: OrgPlan[] = [
  {
    tier: 'Team',
    desc: 'Up to 5 users',
    subdesc: 'Perfect for small schools & tutors',
    price: '$49',
    period: '/month',
    features: [
      'Up to 5 team members',
      'Group dashboard & analytics',
      'Export results as CSV',
      'Shared question bank access',
      'Email support',
    ],
    bestFor: 'Small schools, tutors, study groups',
    cta: 'Start Team Trial',
    ctaLink: '/contact',
  },
  {
    tier: 'Business',
    desc: 'Up to 25 users',
    subdesc: 'For language schools & test centers',
    price: '$199',
    period: '/month',
    features: [
      'Up to 25 team members',
      'White-label certificates',
      'API access for results',
      'Bulk user import via CSV',
      'Priority support',
    ],
    bestFor: 'Language schools, test prep centers',
    cta: 'Start Business Trial',
    ctaLink: '/contact',
    popular: true,
  },
  {
    tier: 'Enterprise',
    desc: 'Unlimited users',
    subdesc: 'For universities, corporations & government',
    price: 'Custom',
    period: '',
    features: [
      'Unlimited users & assessments',
      'SSO (Google, Microsoft, Okta)',
      'Dedicated account manager',
      'SLA guarantee',
      'On-premise or dedicated cloud',
    ],
    bestFor: 'Universities, corporations, government',
    cta: 'Contact Sales',
    ctaLink: '/contact',
  },
];

// ─── Plan Config (for payment capture & validation) ───────────────────────────

export const PLAN_CONFIG: Record<string, PlanConfigEntry> = {
  single: { credits: 1, planName: 'Single Test', expiryDays: null, expectedAmount: 12.99, price: '$12.99 USD' },
  premium: { credits: 3, planName: 'Premium', expiryDays: 90, expectedAmount: 29.99, price: '$29.99 USD' },
  pro: { credits: 6, planName: 'Pro', expiryDays: 90, expectedAmount: 49.99, price: '$49.99 USD' },
};

// ─── Plan Details (for payment-success page) ──────────────────────────────────

export const PLAN_DETAILS: Record<string, { name: string; price: string }> = {
  single: { name: 'Single Test', price: '$12.99 USD' },
  premium: { name: 'Premium', price: '$29.99 USD' },
  pro: { name: 'Pro', price: '$49.99 USD' },
};

// ─── CEFR Levels ──────────────────────────────────────────────────────────────

export const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;

export type CEFRLevel = (typeof CEFR_LEVELS)[number];

// ─── CEFR Badge Colors (dark theme) ───────────────────────────────────────────

export const CEFR_COLORS_DARK: Record<string, string> = {
  A1: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  A2: 'bg-green-500/20 text-green-400 border-green-500/30',
  B1: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  B2: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  C1: 'bg-red-500/20 text-red-400 border-red-500/30',
  C2: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

// ─── CEFR Gradients ───────────────────────────────────────────────────────────

export const CEFR_GRADIENTS: Record<string, string> = {
  A1: 'from-blue-400 to-blue-600',
  A2: 'from-green-400 to-green-600',
  B1: 'from-yellow-400 to-yellow-600',
  B2: 'from-orange-400 to-orange-600',
  C1: 'from-red-400 to-red-600',
  C2: 'from-purple-400 to-purple-600',
};

// ─── CEFR Pie Chart Colors ────────────────────────────────────────────────────

export const CEFR_PIE_COLORS: Record<string, string> = {
  A1: '#3B82F6',
  A2: '#22C55E',
  B1: '#EAB308',
  B2: '#F97316',
  C1: '#EF4444',
  C2: '#A855F7',
};

// ─── CEFR Descriptions ────────────────────────────────────────────────────────

export const CEFR_DESCRIPTIONS: Record<string, string> = {
  A1: 'Beginner',
  A2: 'Elementary',
  B1: 'Intermediate',
  B2: 'Upper Intermediate',
  C1: 'Advanced',
  C2: 'Proficient',
};
