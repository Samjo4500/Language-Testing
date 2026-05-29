export const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
export const SKILLS = ['grammar', 'vocabulary', 'reading', 'listening', 'speaking', 'writing'];
export const SKILL_LABELS: Record<string, string> = {
  grammar: 'Grammar',
  vocabulary: 'Vocabulary',
  reading: 'Reading',
  listening: 'Listening',
  speaking: 'Speaking',
  writing: 'Writing',
};

export const CEFR_COLORS_DARK: Record<string, string> = {
  A1: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  A2: 'bg-green-500/20 text-green-400 border-green-500/30',
  B1: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  B2: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  C1: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  C2: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
};

export const CEFR_PIE_COLORS: Record<string, string> = {
  A1: '#3B82F6',
  A2: '#22C55E',
  B1: '#EAB308',
  B2: '#F97316',
  C1: '#7c5cff',
  C2: '#A855F7',
};

export const PLAN_COLORS: Record<string, string> = {
  free: 'bg-white/10 text-white/60',
  starter: 'bg-blue-500/20 text-blue-400',
  pro: 'bg-violet-500/20 text-violet-400',
  enterprise: 'bg-amber-500/20 text-amber-400',
};

export const TABS = [
  { id: 'overview', label: 'Overview', icon: 'BarChart3' },
  { id: 'users', label: 'Users', icon: 'Users' },
  { id: 'financial', label: 'Financial', icon: 'CreditCard' },
  { id: 'assessments', label: 'Test Takers', icon: 'Award' },
  { id: 'emails', label: 'Emails', icon: 'Mail' },
  { id: 'apis', label: 'APIs', icon: 'Code2' },
  { id: 'questions', label: 'Question Bank', icon: 'BookOpen' },
  { id: 'governance', label: 'Governance', icon: 'Shield' },
  { id: 'system', label: 'System', icon: 'Server' },
  { id: 'analytics', label: 'Analytics', icon: 'Globe' },
  { id: 'livekit', label: 'Live Video', icon: 'Video' },
] as const;

export type TabId = (typeof TABS)[number]['id'];

export function cefrBadge(level: string | null) {
  if (!level) return <span className="text-white/30 text-xs">—</span>;
  const cls = CEFR_COLORS_DARK[level] || 'bg-white/10 text-white/60 border-white/20';
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${cls}`}>{level}</span>;
}

export function planBadge(plan: string) {
  const cls = PLAN_COLORS[plan.toLowerCase()] || 'bg-white/10 text-white/60';
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>{plan}</span>;
}

export function statusBadge(active: boolean, activeLabel = 'Active', inactiveLabel = 'Inactive') {
  return active ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs">{activeLabel}</span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs">{inactiveLabel}</span>
  );
}

export function formatDate(date: string | null) {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatDateTime(date: string | null) {
  if (!date) return '—';
  return new Date(date).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export function formatNumber(n: number) {
  return n.toLocaleString();
}
