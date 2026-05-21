/**
 * Plan utility helpers for consistent plan display across the site.
 *
 * Plans: "free" | "premium" | "pro"
 */

/** Returns true if the user has any paid plan (premium or pro) */
export function isPaidPlan(plan: string | undefined | null): boolean {
  return plan === 'premium' || plan === 'pro';
}

/** Returns a human-readable plan label */
export function getPlanLabel(plan: string | undefined | null): string {
  switch (plan) {
    case 'premium': return 'Premium';
    case 'pro': return 'Pro';
    default: return 'Free';
  }
}

/** Returns Tailwind classes for plan badge styling */
export function getPlanBadgeClasses(plan: string | undefined | null): string {
  switch (plan) {
    case 'premium':
      return 'bg-green-500/20 text-green-400 border border-green-500/30';
    case 'pro':
      return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
    default:
      return 'bg-white/10 text-white/60 border border-white/10';
  }
}
