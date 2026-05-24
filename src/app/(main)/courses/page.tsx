'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { COURSE_TIERS, COURSE_BUNDLE } from '@/lib/courses';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import {
  CheckCircle2,
  Star,
  Sparkles,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Sprout,
  TrendingUp,
  Crown,
  BookOpen,
  GraduationCap,
  Clock,
  Layers,
  Award,
  Shield,
  Headphones,
  Users,
  BarChart3,
  Globe,
  Zap,
} from 'lucide-react';

/* Scroll animation hook */
function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible');
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    observer.observe(el);
    if (el.getBoundingClientRect().top < window.innerHeight) {
      el.classList.add('visible');
      observer.unobserve(el);
    }
    return () => observer.disconnect();
  }, []);
  return ref;
}

function AnimatedSection({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useScrollAnimation();
  return (
    <div
      ref={ref}
      className={`scroll-animate ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
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
          <ChevronUp className="h-4 w-4 text-purple-400 shrink-0" />
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

/* Icon map for dynamic rendering */
const ICON_MAP: Record<string, React.ReactNode> = {
  Sprout: <Sprout className="h-5 w-5" />,
  TrendingUp: <TrendingUp className="h-5 w-5" />,
  Crown: <Crown className="h-5 w-5" />,
};

/* Color config for each tier */
const TIER_COLORS: Record<
  string,
  {
    checkColor: string;
    shadowColor: string;
    ctaGradient: string;
    ctaHoverGradient: string;
    borderGradient: string;
    badgeBg: string;
  }
> = {
  green: {
    checkColor: 'text-emerald-400',
    shadowColor: 'shadow-emerald-500/20',
    ctaGradient: 'from-green-600 to-emerald-500',
    ctaHoverGradient: 'hover:from-green-500 hover:to-emerald-400',
    borderGradient: 'from-green-500/40 via-emerald-500/30 to-green-500/40',
    badgeBg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20',
  },
  blue: {
    checkColor: 'text-cyan-400',
    shadowColor: 'shadow-blue-500/25',
    ctaGradient: 'from-blue-600 to-cyan-500',
    ctaHoverGradient: 'hover:from-blue-500 hover:to-cyan-400',
    borderGradient: 'from-blue-500/60 via-cyan-500/40 to-blue-500/60',
    badgeBg: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/20',
  },
  purple: {
    checkColor: 'text-purple-400',
    shadowColor: 'shadow-purple-500/25',
    ctaGradient: 'from-purple-600 to-pink-500',
    ctaHoverGradient: 'hover:from-purple-500 hover:to-pink-400',
    borderGradient: 'from-purple-500/60 via-pink-500/40 to-purple-500/60',
    badgeBg: 'bg-purple-500/15 text-purple-300 border-purple-500/20',
  },
  gold: {
    checkColor: 'text-amber-400',
    shadowColor: 'shadow-amber-500/20',
    ctaGradient: 'from-amber-600 to-orange-500',
    ctaHoverGradient: 'hover:from-amber-500 hover:to-orange-400',
    borderGradient: 'from-amber-500/40 via-orange-500/30 to-amber-500/40',
    badgeBg: 'bg-amber-500/15 text-amber-300 border-amber-500/20',
  },
};

/* Benefits data */
const BENEFITS = [
  {
    icon: <GraduationCap className="h-5 w-5" />,
    title: 'CEFR Aligned',
    description:
      'All courses follow the Common European Framework of Reference, the global standard for language proficiency.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/20',
  },
  {
    icon: <Headphones className="h-5 w-5" />,
    title: 'AI-Powered Voice',
    description:
      'Practice listening and speaking with advanced AI voice technology that adapts to your skill level.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/20',
  },
  {
    icon: <BarChart3 className="h-5 w-5" />,
    title: 'Progress Tracking',
    description:
      'Track your improvement across all skills with a detailed dashboard that shows your growth over time.',
    color: 'text-green-400',
    bg: 'bg-green-500/20',
  },
  {
    icon: <Award className="h-5 w-5" />,
    title: 'Completion Certificate',
    description:
      'Earn an official certificate for each course you complete, verifiable online by employers and institutions.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/20',
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: 'Money-Back Guarantee',
    description:
      'Not satisfied? Get a full refund within 14 days if you haven\'t completed more than 2 lessons.',
    color: 'text-rose-400',
    bg: 'bg-rose-500/20',
  },
  {
    icon: <Users className="h-5 w-5" />,
    title: 'Community Access',
    description:
      'Join thousands of learners worldwide. Share progress, ask questions, and practice together.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/20',
  },
];

/* FAQ data */
const COURSE_FAQ = [
  {
    q: 'What CEFR level will I reach after completing a course?',
    a: 'Each course is designed to take you through a specific CEFR range. The Beginner course covers A1 to A2, Intermediate covers B1 to B2, and Advanced covers C1 to C2. Your actual level upon completion depends on your starting point and the effort you put in, but our structured curriculum ensures you have all the tools to reach the target level.',
  },
  {
    q: 'Can I buy multiple courses at once?',
    a: 'Yes! Our Complete English Bundle includes all three courses at a significant discount — you save $198 compared to buying them separately. This is ideal if you want to progress from A1 all the way to C2.',
  },
  {
    q: 'How long do I have access to a course?',
    a: 'Once you purchase a course, you have lifetime access. There are no expiration dates or time limits. You can learn at your own pace and revisit lessons whenever you need a refresher.',
  },
  {
    q: 'Do I need to take the courses in order?',
    a: 'We recommend starting with the course that matches your current level. If you\'re unsure of your level, you can take our free CEFR assessment test first. You don\'t need to complete the Beginner course before starting Intermediate if you already have the foundational skills.',
  },
  {
    q: 'What is included in each lesson?',
    a: 'Each lesson includes interactive exercises, vocabulary building, grammar explanations, listening comprehension with AI voice, quizzes to test your understanding, and practical application tasks. Lessons are designed to be completed in 20-30 minutes.',
  },
  {
    q: 'Is there a refund policy?',
    a: 'Yes, we offer a full refund within 14 days of purchase if you have not completed more than 2 lessons in the course. If you have concerns after that period, please contact our support team and we\'ll work with you to find a fair resolution.',
  },
  {
    q: 'Will I get a certificate upon completion?',
    a: 'Absolutely! Each course comes with a completion certificate that includes your name, the course level, and a QR code for online verification. You can download it as a PDF and share it with employers or educational institutions.',
  },
  {
    q: 'Can I switch from one course to another?',
    a: 'If you find that a course is too easy or too difficult, you can contact our support team within 14 days to switch to a different course. We\'ll credit the amount you paid toward the new course. Any price difference will be charged or refunded accordingly.',
  },
];

/* ======================================================
   MAIN COURSES PAGE
   ====================================================== */
export default function CoursesPage() {
  const tierKeys = ['beginner', 'intermediate', 'advanced'];
  const intermediateColors = TIER_COLORS['blue'];

  return (
    <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
      <Navbar />

      {/* ===== HERO SECTION ===== */}
      <section className="relative dark-section hero-pattern noise-overlay overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb orb-purple w-[400px] h-[400px] -top-20 -right-20 animate-float-slow" />
          <div className="orb orb-pink w-[300px] h-[300px] bottom-0 left-1/4 animate-float-reverse" />
          <div className="orb orb-blue w-[250px] h-[250px] top-1/2 right-1/3 animate-float" />
        </div>

        <div className="container relative mx-auto px-4 py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full glass-light px-5 py-2 mb-6 animate-border-glow">
              <BookOpen className="h-4 w-4 text-purple-300" />
              <span className="text-sm text-purple-200 font-medium">
                English Courses
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white">
              Learn English from{' '}
              <span className="gradient-text">A1 to C2</span>
            </h1>
            <p className="mt-4 text-lg text-white/50 max-w-2xl mx-auto">
              Structured courses aligned with the CEFR framework. Build your
              skills step by step with interactive lessons, AI-powered practice,
              and official certificates.
            </p>
            <p className="mt-2 text-sm text-white/30">
              All prices in USD · Lifetime access · Certificates included
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0F0A1E] to-transparent" />
      </section>

      {/* ===== COURSE CARDS ===== */}
      <section className="relative py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 max-w-7xl mx-auto md:grid-cols-2 lg:grid-cols-4">
            {tierKeys.map((key, index) => {
              const tier = COURSE_TIERS[key];
              const colors = TIER_COLORS[tier.color];
              const isPopular = key === 'intermediate';
              const iconEl = ICON_MAP[tier.icon];

              return (
                <AnimatedSection key={key} delay={(index + 1) * 100}>
                  <div
                    className={`relative h-full rounded-2xl ${
                      isPopular ? 'animate-pulse-glow' : ''
                    }`}
                  >
                    {/* Gradient border for featured cards */}
                    <div
                      className={`absolute inset-0 rounded-2xl bg-gradient-to-b ${colors.borderGradient} p-[1px]`}
                    />
                    <div className="relative glass-card p-7 h-full flex flex-col border-transparent">
                      {/* Most Popular badge */}
                      {isPopular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-1 text-xs font-semibold text-white shadow-lg shadow-blue-500/25">
                            <Star className="h-3 w-3" />
                            Most Popular
                          </span>
                        </div>
                      )}

                      {/* Icon + Title */}
                      <div className="flex items-center gap-3 mb-1">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${tier.gradient} text-white shadow-lg ${colors.shadowColor}`}
                        >
                          {iconEl}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">
                            {tier.title}
                          </h3>
                        </div>
                      </div>
                      <p className="text-xs text-white/40 mb-4">
                        {tier.subtitle}
                      </p>

                      {/* Level badge */}
                      <div className="mb-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${colors.badgeBg}`}
                        >
                          <GraduationCap className="h-3 w-3" />
                          {tier.level}
                        </span>
                      </div>

                      {/* Price */}
                      <div className="mb-5">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl sm:text-4xl font-bold gradient-text-static">
                            ${tier.price}
                          </span>
                          {tier.compareAtPrice && (
                            <span className="text-base text-white/30 line-through">
                              ${tier.compareAtPrice}
                            </span>
                          )}
                        </div>
                        <span className="text-white/40 text-sm">
                          {' '}· {tier.estimatedHours}h of content
                        </span>
                      </div>

                      {/* Stats row */}
                      <div className="flex items-center gap-4 mb-5 text-xs text-white/50">
                        <div className="flex items-center gap-1.5">
                          <Layers className="h-3.5 w-3.5" />
                          {tier.modulesCount} modules
                        </div>
                        <div className="flex items-center gap-1.5">
                          <BookOpen className="h-3.5 w-3.5" />
                          {tier.lessonsCount} lessons
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          {tier.estimatedHours}h
                        </div>
                      </div>

                      <div className="section-divider mb-5" />

                      {/* Features */}
                      <ul className="space-y-2.5 mb-7 flex-1">
                        {tier.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-start gap-2.5 text-sm"
                          >
                            <CheckCircle2
                              className={`h-4 w-4 ${colors.checkColor} mt-0.5 shrink-0`}
                            />
                            <span className="text-white/65">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* CTA */}
                      <Link
                        href={`/courses/${tier.slug}`}
                        className="block"
                      >
                        <button
                          className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 bg-gradient-to-r ${colors.ctaGradient} ${colors.ctaHoverGradient} text-white font-semibold text-sm transition-all duration-300 shadow-lg ${colors.shadowColor} cursor-pointer`}
                        >
                          View Course
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </Link>
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}

            {/* ===== BUNDLE CARD ===== */}
            <AnimatedSection delay={500}>
              <div className="relative h-full rounded-2xl">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-amber-500/40 via-orange-500/30 to-amber-500/40 p-[1px]" />
                <div className="relative glass-card p-7 h-full flex flex-col border-transparent">
                  {/* Save badge */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-1 text-xs font-semibold text-white shadow-lg shadow-amber-500/25">
                      <Sparkles className="h-3 w-3" />
                      Save $198
                    </span>
                  </div>

                  {/* Icon + Title */}
                  <div className="flex items-center gap-3 mb-1">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20">
                      <Zap className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {COURSE_BUNDLE.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-xs text-white/40 mb-4">
                    {COURSE_BUNDLE.subtitle}
                  </p>

                  {/* Level badge */}
                  <div className="mb-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium bg-amber-500/15 text-amber-300 border-amber-500/20">
                      <Globe className="h-3 w-3" />
                      A1 – C2 Complete
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mb-5">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl sm:text-4xl font-bold gradient-text-static">
                        ${COURSE_BUNDLE.price}
                      </span>
                      {COURSE_BUNDLE.compareAtPrice && (
                        <span className="text-base text-white/30 line-through">
                          ${COURSE_BUNDLE.compareAtPrice}
                        </span>
                      )}
                    </div>
                    <span className="text-white/40 text-sm">
                      {' '}· One-time payment
                    </span>
                  </div>

                  {/* Stats row */}
                  <div className="flex items-center gap-4 mb-5 text-xs text-white/50">
                    <div className="flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5" />
                      28 modules
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5" />
                      146 lessons
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      125h
                    </div>
                  </div>

                  <div className="section-divider mb-5" />

                  {/* Features */}
                  <ul className="space-y-2.5 mb-7 flex-1">
                    {COURSE_BUNDLE.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2.5 text-sm"
                      >
                        <CheckCircle2 className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                        <span className="text-white/65">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link href="/courses/bundle" className="block">
                    <button className="w-full flex items-center justify-center gap-2 rounded-xl py-3 bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-amber-500/20 cursor-pointer">
                      Get the Bundle
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Trust badge */}
          <div className="mt-10 text-center">
            <div className="inline-flex items-center gap-2 glass px-5 py-2.5 rounded-full">
              <Shield className="h-4 w-4 text-green-400" />
              <span className="text-sm text-white/50">
                14-day money-back guarantee
              </span>
              <span className="text-white/20">·</span>
              <span className="text-sm text-white/40">
                Lifetime access included
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider max-w-4xl mx-auto" />

      {/* ===== WHY LEARN WITH US ===== */}
      <section className="relative py-20 md:py-28 dark-section-alt hero-pattern noise-overlay">
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb orb-purple w-[400px] h-[400px] top-0 right-1/4 animate-float-slow" />
          <div className="orb orb-pink w-[300px] h-[300px] bottom-0 left-1/4 animate-float-reverse" />
        </div>

        <div className="container relative mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                <GraduationCap className="h-3.5 w-3.5 text-purple-400" />
                <span className="text-xs text-purple-300 font-medium uppercase tracking-wider">
                  Why Learn With Us
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Everything You Need to{' '}
                <span className="gradient-text-static">Succeed</span>
              </h2>
              <p className="mt-4 text-white/50 max-w-2xl mx-auto text-base">
                Our courses combine proven methodology with cutting-edge
                technology to deliver an English learning experience that
                actually works.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid gap-6 max-w-5xl mx-auto sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((benefit, index) => (
              <AnimatedSection key={benefit.title} delay={index * 100}>
                <div className="glass-card p-6 h-full">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${benefit.bg} ${benefit.color} mb-4`}
                  >
                    {benefit.icon}
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider max-w-4xl mx-auto" />

      {/* ===== LEARNING PATH TIMELINE ===== */}
      <section className="relative py-20 bg-[#0F0A1E]">
        <div className="absolute inset-0 hero-pattern pointer-events-none" />
        <div className="container relative mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                <Layers className="h-3.5 w-3.5 text-purple-400" />
                <span className="text-xs text-purple-300 font-medium uppercase tracking-wider">
                  Your Learning Path
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                From Beginner to{' '}
                <span className="gradient-text-static">Mastery</span>
              </h2>
              <p className="mt-4 text-white/50 max-w-2xl mx-auto text-base">
                Follow our structured path from A1 to C2. Each course builds on
                the previous one, ensuring a smooth and effective learning
                journey.
              </p>
            </div>
          </AnimatedSection>

          <div className="max-w-3xl mx-auto">
            {tierKeys.map((key, index) => {
              const tier = COURSE_TIERS[key];
              const colors = TIER_COLORS[tier.color];
              const iconEl = ICON_MAP[tier.icon];

              return (
                <AnimatedSection key={key} delay={index * 150}>
                  <div className="flex gap-5 mb-8 last:mb-0">
                    {/* Timeline connector */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${tier.gradient} text-white shadow-lg ${colors.shadowColor}`}
                      >
                        {iconEl}
                      </div>
                      {index < tierKeys.length - 1 && (
                        <div className="w-px flex-1 bg-gradient-to-b from-white/20 to-white/5 mt-2" />
                      )}
                    </div>
                    {/* Content */}
                    <div className="glass-card p-5 flex-1 mb-2">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="text-base font-bold text-white">
                          {tier.title}
                        </h3>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-medium ${colors.badgeBg}`}
                        >
                          {tier.level}
                        </span>
                      </div>
                      <p className="text-sm text-white/50 mb-3">
                        {tier.subtitle}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-white/40">
                        <span className="flex items-center gap-1">
                          <Layers className="h-3 w-3" />
                          {tier.modulesCount} modules
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          {tier.lessonsCount} lessons
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {tier.estimatedHours} hours
                        </span>
                        <span className="flex items-center gap-1 font-medium gradient-text-static">
                          ${tier.price}
                        </span>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}

            <AnimatedSection delay={450}>
              <div className="flex gap-5 mt-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20">
                    <Zap className="h-5 w-5" />
                  </div>
                </div>
                <div className="glass-card p-5 flex-1 border-amber-500/20 bg-amber-500/5">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className="text-base font-bold text-white">
                      Complete Bundle
                    </h3>
                    <span className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-medium bg-amber-500/15 text-amber-300 border-amber-500/20">
                      A1 – C2
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                      Save $198
                    </span>
                  </div>
                  <p className="text-sm text-white/50 mb-3">
                    All three courses — the complete A1 to C2 journey
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-white/40">
                    <span className="flex items-center gap-1">
                      <Layers className="h-3 w-3" />28 modules
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      146 lessons
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />125 hours
                    </span>
                    <span className="flex items-center gap-1 font-medium gradient-text-static">
                      $179
                    </span>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <div className="section-divider max-w-4xl mx-auto" />

      {/* ===== FAQ SECTION ===== */}
      <section className="relative py-20 dark-section-alt hero-pattern noise-overlay">
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb orb-purple w-[300px] h-[300px] top-0 left-1/4 animate-float-slow" />
        </div>

        <div className="container relative mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                <span className="text-xs text-purple-300 font-medium uppercase tracking-wider">
                  FAQ
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Frequently Asked{' '}
                <span className="gradient-text-static">Questions</span>
              </h2>
              <p className="mt-4 text-white/50 max-w-2xl mx-auto text-base">
                Everything you need to know about our English courses.
              </p>
            </div>
          </AnimatedSection>

          <div className="max-w-3xl mx-auto space-y-3">
            {COURSE_FAQ.map((faq, index) => (
              <AnimatedSection key={index} delay={index * 50}>
                <FAQItem q={faq.q} a={faq.a} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="relative py-20 bg-[#0F0A1E]">
        <div className="absolute inset-0 hero-pattern pointer-events-none" />
        <div className="container relative mx-auto px-4">
          <AnimatedSection>
            <div className="glass-card max-w-3xl mx-auto p-8 md:p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none">
                <div className="orb orb-purple w-[200px] h-[200px] -top-10 -right-10 animate-float-slow opacity-40" />
                <div className="orb orb-pink w-[150px] h-[150px] -bottom-10 -left-10 animate-float-reverse opacity-30" />
              </div>
              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full glass-light px-4 py-1.5 mb-5">
                  <GraduationCap className="h-4 w-4 text-purple-300" />
                  <span className="text-xs text-purple-200 font-medium">
                    Start Learning Today
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Ready to Begin Your{' '}
                  <span className="gradient-text">English Journey?</span>
                </h2>
                <p className="text-white/50 mb-8 max-w-lg mx-auto">
                  Join thousands of learners who have improved their English
                  proficiency with our structured, CEFR-aligned courses.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/courses/beginner">
                    <button className="group flex items-center gap-2 rounded-xl px-8 py-3.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 cursor-pointer">
                      Start with Beginner
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </Link>
                  <Link href="/courses/bundle">
                    <button className="group flex items-center gap-2 rounded-xl px-8 py-3.5 glass-button text-white font-medium text-sm transition-all duration-300 hover:-translate-y-0.5 cursor-pointer">
                      Get the Complete Bundle
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </div>
  );
}
