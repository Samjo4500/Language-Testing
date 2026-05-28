'use client';

import { useState, useEffect, useRef } from 'react';
import { useHydrated } from '@/hooks/use-hydrated';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/lib/auth-store';
import { isPaidPlan, getPlanLabel } from '@/lib/plan-utils';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { COURSE_TIERS, COURSE_BUNDLE } from '@/lib/courses';
import {
  CheckCircle2,
  CreditCard,
  Star,
  Sparkles,
  ArrowRight,
  Zap,
  HelpCircle,
  Building2,
  Users,
  Globe,
  Phone,
  ChevronDown,
  ChevronUp,
  Crown,
  Rocket,
  BadgeCheck,
  Lock,
  Award,
  QrCode,
  Download,
  Shield,
  BarChart3,
  Sprout,
  TrendingUp,
  BookOpen,
  Package,
  Play,
} from 'lucide-react';

/* Sandbox notice — all plans are free during preview */

/* Scroll animation hook */
function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); observer.unobserve(el); } },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    observer.observe(el);
    // Immediately mark as visible if already in viewport on mount
    if (el.getBoundingClientRect().top < window.innerHeight) {
      el.classList.add('visible');
      observer.unobserve(el);
    }
    return () => observer.disconnect();
  }, []);
  return ref;
}

function AnimatedSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useScrollAnimation();
  return (
    <div ref={ref} className={`scroll-animate ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* FAQ Accordion Item */
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left cursor-pointer"
      >
        <span className="font-medium text-sm text-white pr-4">{q}</span>
        {open ? (
          <ChevronUp className="h-4 w-4 text-blue-400 shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-white/40 shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-5 pt-0">
          <p className="text-sm text-white/50 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

/* ======================================================
   PLAN DATA
   ====================================================== */
const INDIVIDUAL_PLANS = [
  {
    id: 'free',
    name: 'Free',
    subtitle: 'Perfect for getting started',
    price: '$0',
    priceSuffix: '',
    icon: <Zap className="h-5 w-5" />,
    iconBg: 'bg-white/10',
    features: [
      '1 comprehensive assessment',
      'Basic CEFR level result',
      'Skill breakdown scores',
      'Watermarked certificate',
      'AI-powered feedback',
      'Downloadable PDF certificate',
      'Progress tracking',
    ],
    cta: 'Start Free',
    ctaLink: '/register',
    popular: false,
    gradient: '',
    amount: 0,
  },
  {
    id: 'single',
    name: 'Single Test',
    subtitle: 'Full assessment with detailed report',
    price: '$12.99',
    priceSuffix: '/ one-time',
    icon: <BadgeCheck className="h-5 w-5" />,
    iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-500',
    features: [
      'Complete 6-skill assessment',
      'Detailed CEFR score',
      'AI-powered feedback',
      'Downloadable PDF certificate',
      'Progress tracking',
      'Priority AI analysis',
      'Email support',
    ],
    cta: 'Buy Test',
    ctaLink: '',
    popular: false,
    gradient: 'from-blue-500 to-cyan-500',
    amount: 12.99,
  },
  {
    id: 'premium',
    name: 'Premium Pack',
    subtitle: 'Best value for serious learners',
    price: '$29.99',
    priceSuffix: '/ 3 tests',
    icon: <Crown className="h-5 w-5" />,
    iconBg: 'bg-gradient-to-br from-blue-500 to-indigo-600',
    features: [
      '3 full assessments',
      'Progress tracking dashboard',
      'Priority AI analysis',
      'Unlimited certificate downloads',
      'Email support',
      'Peer comparison',
      'Full analytics suite',
    ],
    cta: 'Get Premium',
    ctaLink: '',
    popular: true,
    gradient: 'from-blue-500 to-indigo-600',
    amount: 29.99,
  },
  {
    id: 'pro',
    name: 'Pro Pack',
    subtitle: 'Complete learning solution',
    price: '$49.99',
    priceSuffix: '/ 6 tests',
    icon: <Rocket className="h-5 w-5" />,
    iconBg: 'bg-gradient-to-br from-indigo-500 to-blue-700',
    features: [
      '6 assessments',
      'Full analytics suite',
      'Detailed skill improvement tips',
      'Comparison with peers',
      'Priority support',
      'Unlimited certificate downloads',
      'Progress tracking dashboard',
    ],
    cta: 'Go Pro',
    ctaLink: '',
    popular: false,
    gradient: 'from-indigo-500 to-blue-700',
    amount: 49.99,
  },
];

const B2B_PLANS = [
  {
    name: 'Team',
    subtitle: 'Up to 5 users',
    desc: 'Perfect for small schools & tutors',
    monthlyPrice: 49,
    yearlyPrice: 39,
    features: [
      'Up to 5 team members',
      'Group dashboard & analytics',
      'Export all student results as CSV',
      'Shared question bank access',
      'Email support',
    ],
    bestFor: 'Small schools, tutors, study groups',
    cta: 'Start Team Trial',
    icon: <Users className="h-5 w-5" />,
    gradient: 'from-sky-500 to-blue-600',
  },
  {
    name: 'Business',
    subtitle: 'Up to 25 users',
    desc: 'For language schools & test centers',
    monthlyPrice: 199,
    yearlyPrice: 159,
    features: [
      'Up to 25 team members',
      'White-label certificates (your logo)',
      'API access for results',
      'Custom question bank upload',
      'Bulk user import via CSV',
      'Priority support',
    ],
    bestFor: 'Language schools, test prep centers',
    cta: 'Start Business Trial',
    icon: <Building2 className="h-5 w-5" />,
    gradient: 'from-blue-600 to-indigo-600',
  },
  {
    name: 'Enterprise',
    subtitle: 'Unlimited users',
    desc: 'For universities, corporations & government',
    monthlyPrice: null,
    yearlyPrice: null,
    features: [
      'Unlimited users & assessments',
      'SSO (Google, Microsoft, Okta)',
      'Dedicated account manager',
      'SLA guarantee',
      'On-premise or dedicated cloud',
      'Custom feature development',
    ],
    bestFor: 'Universities, corporations, government',
    cta: 'Contact Sales',
    icon: <Globe className="h-5 w-5" />,
    gradient: 'from-cyan-500 to-blue-500',
  },
];

const FAQ_ITEMS = [
  {
    q: 'What is your refund policy?',
    a: 'During our preview period, all plans are available at no cost. Simply sign up and start learning!',
  },
  {
    q: 'How long are test credits valid?',
    a: 'Test credits never expire. Once you purchase a plan, your test credits remain in your account indefinitely. You can take assessments at your own pace without worrying about losing access. This applies to all paid plans including Single Test, Premium Pack, and Pro Pack.',
  },
  {
    q: 'Are group discounts available?',
    a: 'Yes! Our Team and Business plans offer significant per-user savings compared to individual plans. For larger organizations, our Enterprise plan includes volume discounts and custom pricing tailored to your needs. Contact our sales team for a personalized quote.',
  },
  {
    q: 'Can I upgrade my plan later?',
    a: 'Absolutely. You can upgrade from any plan at any time. When upgrading, you will only pay the difference between your current plan and the new one. Your existing test credits and progress data will be preserved and carried over to your upgraded plan seamlessly.',
  },
  {
    q: 'Is my payment information secure?',
    a: 'During our preview period, all features are available for free. No payment information is required.',
  },
  {
    q: 'What happens after I complete an assessment?',
    a: 'Immediately after completing an assessment, you will receive your CEFR level (A1-C2), detailed skill breakdown scores for all six competencies, AI-powered feedback with specific improvement suggestions, and a downloadable PDF certificate with a QR verification code. You can share your results with employers or institutions right away.',
  },
];

/* ======================================================
   MAIN PRICING PAGE
   ====================================================== */
export default function PricingPage() {
  const { isAuthenticated, user } = useAuthStore();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const mounted = useHydrated();

  /* Use false for isAuthenticated until client mounts to avoid hydration mismatch */
  const isAuth = mounted && isAuthenticated;

  return (
    <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
      <Navbar />

      {/* Sandbox Banner */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-center py-2 px-4 text-sm font-bold tracking-wide">SANDBOX PREVIEW — All Plans Free — No Payment Required</div>

      {/* ===== HERO SECTION ===== */}
      <section className="relative dark-section hero-pattern noise-overlay overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb orb-blue w-[400px] h-[400px] -top-20 -right-20 animate-float-slow" />
          <div className="orb orb-cyan w-[300px] h-[300px] bottom-0 left-1/4 animate-float-reverse" />
          <div className="orb orb-blue w-[250px] h-[250px] top-1/2 right-1/3 animate-float" />
        </div>

        <div className="container relative mx-auto px-4 py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full glass-light px-5 py-2 mb-6 animate-border-glow">
              <Sparkles className="h-4 w-4 text-blue-300" />
              <span className="text-sm text-blue-200 font-medium">Simple Pricing</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white">
              Choose Your Perfect Plan
            </h1>
            <p className="mt-4 text-lg text-white/50 max-w-2xl mx-auto">
              Start free and upgrade as you grow. All plans include our AI-powered scoring engine.
            </p>
            <p className="mt-2 text-sm text-white/30">All prices in USD</p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0F0A1E] to-transparent" />
      </section>

      {/* ===== INDIVIDUAL PRICING CARDS ===== */}
      <section className="relative py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 max-w-7xl mx-auto md:grid-cols-2 lg:grid-cols-4">

            {/* Free Plan */}
            <AnimatedSection delay={100}>
              <div className="glass-card p-7 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white">
                    <Zap className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Free</h3>
                </div>
                <p className="text-xs text-white/40 mb-5">Perfect for getting started</p>
                <div className="mb-5">
                  <span className="text-2xl sm:text-4xl font-bold text-white">$0</span>
                </div>
                <div className="section-divider mb-5" />
                <ul className="space-y-2.5 mb-7 flex-1">
                  {INDIVIDUAL_PLANS[0].features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-white/30 mt-0.5 shrink-0" />
                      <span className="text-white/60">{feature}</span>
                    </li>
                  ))}
                </ul>
                {(!isAuth || user?.plan === 'free') ? (
                  <Link href="/register" className="block">
                    <button className="w-full rounded-xl py-3 glass-button text-white font-medium cursor-pointer">
                      Start Free
                    </button>
                  </Link>
                ) : (
                  <button className="w-full rounded-xl py-3 bg-white/5 text-white/30 font-medium cursor-not-allowed" disabled>
                    {isPaidPlan(user?.plan) ? `${getPlanLabel(user?.plan)} Plan` : 'Current Plan'}
                  </button>
                )}
              </div>
            </AnimatedSection>

            {/* Single Test */}
            <AnimatedSection delay={200}>
              <div className="glass-card p-7 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/20">
                    <BadgeCheck className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Single Test</h3>
                </div>
                <p className="text-xs text-white/40 mb-5">Full assessment with detailed report</p>
                <div className="mb-5">
                  <span className="text-2xl sm:text-4xl font-bold text-blue-400">$12.99</span>
                  <span className="text-white/40 ml-1 text-sm">/ one-time</span>
                </div>
                <div className="section-divider mb-5" />
                <ul className="space-y-2.5 mb-7 flex-1">
                  {INDIVIDUAL_PLANS[1].features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                      <span className="text-white/65">{feature}</span>
                    </li>
                  ))}
                </ul>
                {isAuth ? (
                  (user?.plan === 'premium' || user?.plan === 'pro') ? (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                      <CheckCircle2 className="h-4 w-4 text-blue-400" />
                      <span className="text-xs font-medium text-blue-400">You already have {user?.plan === 'pro' ? 'Pro' : 'Premium'}!</span>
                    </div>
                  ) : (
                    <Link href="/courses" className="block">
                      <button className="w-full flex items-center justify-center gap-2 rounded-xl py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-blue-500/25 cursor-pointer">
                        <Play className="h-4 w-4" />
                        Start Learning
                      </button>
                    </Link>
                  )
                ) : (
                  <Link href="/login" className="block">
                    <button className="w-full flex items-center justify-center gap-2 rounded-xl py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-blue-500/20 cursor-pointer">
                      <CreditCard className="h-4 w-4" />
                      Log in to Purchase
                    </button>
                  </Link>
                )}
              </div>
            </AnimatedSection>

            {/* Premium Pack — Most Popular */}
            <AnimatedSection delay={300}>
              <div className="relative animate-pulse-glow rounded-2xl">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-blue-500/60 via-indigo-500/40 to-blue-500/60 p-[1px]" />
                <div className="relative glass-card p-7 h-full flex flex-col border-transparent">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-1 text-xs font-semibold text-white shadow-lg shadow-blue-500/25">
                      <Star className="h-3 w-3" />
                      Most Popular
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mb-1">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25">
                      <Crown className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Premium Pack</h3>
                  </div>
                  <p className="text-xs text-white/40 mb-5">Best value for serious learners</p>
                  <div className="mb-5">
                    <span className="text-2xl sm:text-4xl font-bold text-blue-400">$29.99</span>
                    <span className="text-white/40 ml-1 text-sm">/ 3 tests</span>
                  </div>
                  <div className="section-divider mb-5" />
                  <ul className="space-y-2.5 mb-7 flex-1">
                    {INDIVIDUAL_PLANS[2].features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                        <span className="text-white/70">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {isAuth ? (
                    (user?.plan === 'premium' || user?.plan === 'pro') ? (
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                        <CheckCircle2 className="h-4 w-4 text-blue-400" />
                        <span className="text-xs font-medium text-blue-400">You already have {user?.plan === 'pro' ? 'Pro' : 'Premium'}!</span>
                      </div>
                    ) : (
                      <Link href="/courses" className="block">
                        <button className="w-full flex items-center justify-center gap-2 rounded-xl py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-blue-500/25 cursor-pointer">
                          <Play className="h-4 w-4" />
                          Start Learning
                        </button>
                      </Link>
                    )
                  ) : (
                    <Link href="/login" className="block">
                      <button className="w-full flex items-center justify-center gap-2 rounded-xl py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-blue-500/25 cursor-pointer">
                        <CreditCard className="h-4 w-4" />
                        Log in to Purchase
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </AnimatedSection>

            {/* Pro Pack */}
            <AnimatedSection delay={400}>
              <div className="relative rounded-2xl">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-indigo-500/40 via-blue-500/30 to-indigo-500/40 p-[1px]" />
                <div className="relative glass-card p-7 h-full flex flex-col border-transparent">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-700 text-white shadow-lg shadow-indigo-500/20">
                      <Rocket className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Pro Pack</h3>
                  </div>
                  <p className="text-xs text-white/40 mb-5">Complete learning solution</p>
                  <div className="mb-5">
                    <span className="text-2xl sm:text-4xl font-bold text-blue-400">$49.99</span>
                    <span className="text-white/40 ml-1 text-sm">/ 6 tests</span>
                  </div>
                  <div className="section-divider mb-5" />
                  <ul className="space-y-2.5 mb-7 flex-1">
                    {INDIVIDUAL_PLANS[3].features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-indigo-400 mt-0.5 shrink-0" />
                        <span className="text-white/65">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {isAuth ? (
                    (user?.plan === 'premium' || user?.plan === 'pro') ? (
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                        <CheckCircle2 className="h-4 w-4 text-blue-400" />
                        <span className="text-xs font-medium text-blue-400">You already have {user?.plan === 'pro' ? 'Pro' : 'Premium'}!</span>
                      </div>
                    ) : (
                      <Link href="/courses" className="block">
                        <button className="w-full flex items-center justify-center gap-2 rounded-xl py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-blue-500/25 cursor-pointer">
                          <Play className="h-4 w-4" />
                          Start Learning
                        </button>
                      </Link>
                    )
                  ) : (
                    <Link href="/login" className="block">
                      <button className="w-full flex items-center justify-center gap-2 rounded-xl py-3 bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-500 hover:to-blue-600 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-indigo-500/20 cursor-pointer">
                        <CreditCard className="h-4 w-4" />
                        Log in to Purchase
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </AnimatedSection>

          </div>

          {/* Secure payment badge */}
          <div className="mt-10 text-center">
            <div className="inline-flex items-center gap-2 glass px-5 py-2.5 rounded-full">
              <Lock className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-white/50">Sandbox Preview — All Plans Free</span>
              <span className="text-white/20">·</span>
              <span className="text-sm text-white/40">All prices in USD</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ENGLISH COURSES ===== */}
      <section className="relative py-20 dark-section-alt hero-pattern noise-overlay overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb orb-blue w-[350px] h-[350px] top-10 -left-20 animate-float-slow" />
          <div className="orb orb-cyan w-[300px] h-[300px] bottom-10 right-0 animate-float-reverse" />
        </div>

        <div className="container relative mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                <BookOpen className="h-3.5 w-3.5 text-blue-400" />
                <span className="text-xs text-blue-300 font-medium">NEW</span>
                <span className="text-white/20">·</span>
                <span className="text-xs text-blue-300 font-medium uppercase tracking-wider">Learn & Grow</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                English Courses
              </h2>
              <p className="mt-4 text-white/50 max-w-2xl mx-auto text-base">
                Go beyond testing — build real English skills from A1 to C2
              </p>
            </div>
          </AnimatedSection>

          {/* Three course cards */}
          <div className="grid gap-6 max-w-5xl mx-auto md:grid-cols-3">
            {/* Beginner Course */}
            <AnimatedSection delay={100}>
              <div className="glass-card p-7 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-blue-500 text-white shadow-lg shadow-sky-500/20">
                    <Sprout className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{COURSE_TIERS.beginner.title}</h3>
                    <span className="inline-flex items-center rounded-full bg-sky-500/15 px-2 py-0.5 text-[10px] font-semibold text-sky-400 border border-sky-500/20">
                      {COURSE_TIERS.beginner.level}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-white/40 mt-1 mb-4">{COURSE_TIERS.beginner.subtitle}</p>
                <div className="mb-5">
                  <span className="text-2xl sm:text-3xl font-bold text-white">${COURSE_TIERS.beginner.price}</span>
                  {COURSE_TIERS.beginner.compareAtPrice && (
                    <span className="ml-2 text-sm text-white/30 line-through">${COURSE_TIERS.beginner.compareAtPrice}</span>
                  )}
                </div>
                <div className="section-divider mb-5" />
                <ul className="space-y-2.5 mb-7 flex-1">
                  {COURSE_TIERS.beginner.features.slice(0, 5).map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-sky-400 mt-0.5 shrink-0" />
                      <span className="text-white/60">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href={`/courses/${COURSE_TIERS.beginner.slug}`} className="block">
                  <button className="w-full flex items-center justify-center gap-2 rounded-xl py-3 bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-400 hover:to-blue-400 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-sky-500/20 cursor-pointer">
                    Learn More
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            </AnimatedSection>

            {/* Intermediate Course — Most Popular */}
            <AnimatedSection delay={200}>
              <div className="relative animate-pulse-glow rounded-2xl">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-blue-500/50 via-cyan-500/30 to-blue-500/50 p-[1px]" />
                <div className="relative glass-card p-7 h-full flex flex-col border-transparent">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-1 text-xs font-semibold text-white shadow-lg shadow-blue-500/25">
                      <Star className="h-3 w-3" />
                      Most Popular
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mb-1">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-cyan-500 text-white shadow-lg shadow-blue-500/25">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{COURSE_TIERS.intermediate.title}</h3>
                      <span className="inline-flex items-center rounded-full bg-blue-500/15 px-2 py-0.5 text-[10px] font-semibold text-blue-400 border border-blue-500/20">
                        {COURSE_TIERS.intermediate.level}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-white/40 mt-1 mb-4">{COURSE_TIERS.intermediate.subtitle}</p>
                  <div className="mb-5">
                    <span className="text-2xl sm:text-3xl font-bold text-blue-400">${COURSE_TIERS.intermediate.price}</span>
                    {COURSE_TIERS.intermediate.compareAtPrice && (
                      <span className="ml-2 text-sm text-white/30 line-through">${COURSE_TIERS.intermediate.compareAtPrice}</span>
                    )}
                  </div>
                  <div className="section-divider mb-5" />
                  <ul className="space-y-2.5 mb-7 flex-1">
                    {COURSE_TIERS.intermediate.features.slice(0, 5).map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                        <span className="text-white/65">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={`/courses/${COURSE_TIERS.intermediate.slug}`} className="block">
                    <button className="w-full flex items-center justify-center gap-2 rounded-xl py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-blue-500/25 cursor-pointer">
                      Learn More
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </Link>
                </div>
              </div>
            </AnimatedSection>

            {/* Advanced Course */}
            <AnimatedSection delay={300}>
              <div className="relative rounded-2xl">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-indigo-500/40 via-blue-500/30 to-indigo-500/40 p-[1px]" />
                <div className="relative glass-card p-7 h-full flex flex-col border-transparent">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-700 text-white shadow-lg shadow-indigo-500/20">
                      <Crown className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{COURSE_TIERS.advanced.title}</h3>
                      <span className="inline-flex items-center rounded-full bg-indigo-500/15 px-2 py-0.5 text-[10px] font-semibold text-indigo-400 border border-indigo-500/20">
                        {COURSE_TIERS.advanced.level}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-white/40 mt-1 mb-4">{COURSE_TIERS.advanced.subtitle}</p>
                  <div className="mb-5">
                    <span className="text-2xl sm:text-3xl font-bold text-white">${COURSE_TIERS.advanced.price}</span>
                    {COURSE_TIERS.advanced.compareAtPrice && (
                      <span className="ml-2 text-sm text-white/30 line-through">${COURSE_TIERS.advanced.compareAtPrice}</span>
                    )}
                  </div>
                  <div className="section-divider mb-5" />
                  <ul className="space-y-2.5 mb-7 flex-1">
                    {COURSE_TIERS.advanced.features.slice(0, 5).map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                        <span className="text-white/65">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={`/courses/${COURSE_TIERS.advanced.slug}`} className="block">
                    <button className="w-full flex items-center justify-center gap-2 rounded-xl py-3 bg-gradient-to-r from-indigo-500 to-blue-700 hover:from-indigo-400 hover:to-blue-600 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-indigo-500/20 cursor-pointer">
                      Learn More
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Bundle Banner */}
          <AnimatedSection delay={400}>
            <div className="mt-8 max-w-5xl mx-auto">
              <div className="relative glass-card p-6 md:p-8 overflow-hidden border border-blue-500/20">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-cyan-500/5 to-blue-500/5 pointer-events-none" />
                <div className="relative flex flex-col md:flex-row items-center gap-6">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25">
                    <Package className="h-7 w-7" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col sm:flex-row items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold text-white">{COURSE_BUNDLE.title}</h3>
                      <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 px-3 py-0.5 text-xs font-bold text-white shadow-lg shadow-blue-500/25">
                        Save $198
                      </span>
                    </div>
                    <p className="text-sm text-white/50">{COURSE_BUNDLE.subtitle}</p>
                    <ul className="mt-3 flex flex-wrap justify-center md:justify-start gap-x-5 gap-y-1.5">
                      {COURSE_BUNDLE.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-1.5 text-sm">
                          <CheckCircle2 className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                          <span className="text-white/60">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="shrink-0 text-center">
                    <div className="mb-3">
                      <span className="text-3xl font-bold text-white">${COURSE_BUNDLE.price}</span>
                      <span className="ml-2 text-sm text-white/30 line-through">${COURSE_BUNDLE.compareAtPrice}</span>
                    </div>
                    <Link href="/courses" className="block">
                      <button className="flex items-center justify-center gap-2 rounded-xl px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-blue-500/25 cursor-pointer">
                        Get the Bundle
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <div className="section-divider max-w-4xl mx-auto" />

      {/* ===== CERTIFICATE PREVIEW ===== */}
      <section className="relative py-20 bg-[#0F0A1E]">
        <div className="absolute inset-0 hero-pattern pointer-events-none" />
        <div className="container relative mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                <Award className="h-3.5 w-3.5 text-blue-400" />
                <span className="text-xs text-blue-300 font-medium uppercase tracking-wider">What You Get</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Your Certificate Preview
              </h2>
              <p className="mt-4 text-white/50 max-w-2xl mx-auto text-base">
                Every paid plan includes an official CEFR proficiency certificate with QR verification. Here&apos;s what yours will look like.
              </p>
            </div>
          </AnimatedSection>

          <div className="max-w-4xl mx-auto">
            <div className="grid gap-8 md:grid-cols-2 items-center">
              {/* Certificate mockup */}
              <AnimatedSection delay={100}>
                <div className="glass-card p-6 relative overflow-hidden">
                  {/* Simulated certificate */}
                  <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-xl p-6 border border-blue-500/20">
                    <div className="text-center mb-4">
                      <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Certificate of Proficiency</p>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Image src="/logo-icon.svg" alt="" width={20} height={20} className="h-5 w-5" />
                        <span className="text-sm font-bold text-white">test<span className="text-blue-400">cefr</span><span className="text-blue-300">.com</span></span>
                      </div>
                    </div>
                    <div className="text-center mb-4">
                      <p className="text-xs text-white/40">This certifies that</p>
                      <p className="text-lg font-semibold text-white mt-1">John Smith</p>
                    </div>
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-lg">
                        <span className="text-2xl font-bold">B2</span>
                      </div>
                      <div className="text-left">
                        <p className="text-xs text-white/40">CEFR Level</p>
                        <p className="text-sm font-semibold text-white">Upper Intermediate</p>
                        <p className="text-xs text-white/40 mt-1">Score: 78/100</p>
                      </div>
                    </div>
                    {/* Skills breakdown bars */}
                    <div className="space-y-2 mb-4">
                      {[
                        { skill: 'Grammar', score: 92, color: 'from-blue-500 to-indigo-500' },
                        { skill: 'Vocabulary', score: 85, color: 'from-blue-500 to-cyan-500' },
                        { skill: 'Reading', score: 80, color: 'from-sky-500 to-blue-500' },
                        { skill: 'Listening', score: 72, color: 'from-cyan-500 to-blue-500' },
                        { skill: 'Speaking', score: 68, color: 'from-indigo-500 to-blue-600' },
                        { skill: 'Writing', score: 76, color: 'from-blue-600 to-indigo-600' },
                      ].map((item) => (
                        <div key={item.skill} className="flex items-center gap-2">
                          <span className="text-[10px] text-white/50 w-16 text-right">{item.skill}</span>
                          <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                            <div className={`h-full rounded-full bg-gradient-to-r ${item.color}`} style={{ width: `${item.score}%` }} />
                          </div>
                          <span className="text-[10px] text-white/40 w-6">{item.score}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                      <div className="flex items-center gap-1.5">
                        <QrCode className="h-4 w-4 text-blue-400" />
                        <span className="text-[10px] text-white/40">TC-B2SM1TH-2026XZ</span>
                      </div>
                      <span className="text-[10px] text-white/30">Issued: May 2026</span>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              {/* What's included */}
              <AnimatedSection delay={200}>
                <div className="space-y-5">
                  <h3 className="text-xl font-bold text-white">Everything included in your certificate</h3>
                  <div className="space-y-3">
                    {[
                      { icon: <Award className="h-4 w-4" />, text: 'Official CEFR level classification (A1 through C2)' },
                      { icon: <BarChart3 className="h-4 w-4" />, text: 'Detailed skill breakdown across 6 core competencies' },
                      { icon: <QrCode className="h-4 w-4" />, text: 'QR code verification for instant authenticity checks' },
                      { icon: <Download className="h-4 w-4" />, text: 'Downloadable PDF certificate for printing or sharing' },
                      { icon: <Shield className="h-4 w-4" />, text: 'Permanent online verification page at testcefr.com/verify' },
                      { icon: <Globe className="h-4 w-4" />, text: 'Shareable link for employers and institutions' },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
                          {item.icon}
                        </div>
                        <span className="text-sm text-white/60">{item.text}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2">
                    <Link href="/sample-certificate">
                      <button className="group flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors">
                        See full certificate sample
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </button>
                    </Link>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider max-w-4xl mx-auto" />

      {/* ===== B2B SECTION ===== */}
      <section className="relative py-20 md:py-28 dark-section-alt hero-pattern noise-overlay">
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb orb-blue w-[400px] h-[400px] top-0 right-1/4 animate-float-slow" />
          <div className="orb orb-blue w-[300px] h-[300px] bottom-0 left-1/4 animate-float-reverse" />
        </div>

        <div className="container relative mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                <Building2 className="h-3.5 w-3.5 text-blue-400" />
                <span className="text-xs text-blue-300 font-medium uppercase tracking-wider">For Organizations</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Scale English Testing Across Your Team
              </h2>
              <p className="mt-4 text-white/50 max-w-2xl mx-auto text-base">
                Purpose-built plans for schools, businesses, and institutions — with the tools your team actually needs.
              </p>

              {/* Billing Toggle */}
              <div className="mt-8 inline-flex items-center gap-3 glass-light rounded-full px-2 py-1.5">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
                    billingCycle === 'monthly'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/25'
                      : 'text-white/50 hover:text-white/70'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
                    billingCycle === 'yearly'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/25'
                      : 'text-white/50 hover:text-white/70'
                  }`}
                >
                  Yearly
                  <span className="ml-1.5 text-[10px] font-semibold text-blue-300 bg-blue-500/20 px-1.5 py-0.5 rounded-full">
                    Save 20%
                  </span>
                </button>
              </div>
            </div>
          </AnimatedSection>

          <div className="grid gap-8 max-w-5xl mx-auto md:grid-cols-3">
            {B2B_PLANS.map((plan, index) => (
              <AnimatedSection key={plan.name} delay={index * 150}>
                <div className="glass-card p-7 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-1">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${plan.gradient} text-white shadow-lg`}>
                      {plan.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                      <p className="text-xs text-white/40">{plan.subtitle}</p>
                    </div>
                  </div>
                  <p className="text-xs text-white/35 mt-1 mb-5">{plan.desc}</p>

                  <div className="mb-5">
                    {plan.monthlyPrice ? (
                      <>
                        <span className="text-2xl sm:text-4xl font-bold text-white">
                          ${billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                        </span>
                        <span className="text-white/40 ml-1 text-sm">/month</span>
                        {billingCycle === 'yearly' && (
                          <p className="text-xs text-blue-400 mt-1">
                            Billed ${plan.yearlyPrice * 12}/year — Save ${(plan.monthlyPrice - plan.yearlyPrice) * 12}/year
                          </p>
                        )}
                      </>
                    ) : (
                      <>
                        <span className="text-2xl sm:text-3xl font-bold text-white">Custom</span>
                      </>
                    )}
                  </div>

                  <div className="section-divider mb-5" />
                  <ul className="space-y-2.5 mb-5 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                        <span className="text-white/60">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-white/30 mb-5">
                    Best for: {plan.bestFor}
                  </p>

                  {plan.name === 'Enterprise' ? (
                    <Link href="/contact" className="block">
                      <button className="w-full flex items-center justify-center gap-2 rounded-xl py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-cyan-500/20 cursor-pointer">
                        <Phone className="h-4 w-4" />
                        Contact Sales
                      </button>
                    </Link>
                  ) : (
                    <Link href="/contact" className="block">
                      <button className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 bg-gradient-to-r ${plan.gradient} hover:opacity-90 text-white font-semibold text-sm transition-all duration-300 shadow-lg cursor-pointer`}>
                        {plan.cta}
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </Link>
                  )}
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* B2B links */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-4 flex-wrap justify-center">
              <Link href="/contact" className="text-sm text-blue-300 hover:text-blue-200 transition-colors">
                Learn more about Team & Business plans
              </Link>
              <span className="text-white/20">·</span>
              <Link href="/contact" className="text-sm text-blue-300 hover:text-blue-200 transition-colors">
                Enterprise solutions
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ SECTION ===== */}
      <section className="relative py-20 bg-[#0F0A1E]">
        <div className="absolute inset-0 hero-pattern pointer-events-none" />
        <div className="container relative mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                <HelpCircle className="h-3.5 w-3.5 text-blue-400" />
                <span className="text-xs text-blue-300 font-medium uppercase tracking-wider">FAQ</span>
              </div>
              <h2 className="text-3xl font-bold text-white">
                Frequently Asked Questions
              </h2>
            </div>
          </AnimatedSection>

          <div className="max-w-2xl mx-auto space-y-3">
            {FAQ_ITEMS.map((faq, index) => (
              <AnimatedSection key={index} delay={index * 80}>
                <FAQItem q={faq.q} a={faq.a} />
              </AnimatedSection>
            ))}
          </div>

          {/* Contact CTA */}
          <AnimatedSection delay={500}>
            <div className="mt-14 text-center">
              <div className="glass-card-neon p-8 max-w-lg mx-auto light-streak">
                <HelpCircle className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">Have questions about which plan is right for you?</h3>
                <p className="text-sm text-white/40 mb-5">Our team is here to help you find the perfect fit.</p>
                <Link href="/contact">
                  <button className="inline-flex items-center gap-2 rounded-xl px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-blue-500/25 cursor-pointer">
                    Contact Us
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </div>
  );
}
