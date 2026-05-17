'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/auth-store';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import {
  BarChart3, BookOpen, Headphones, Mic, PenTool, Award,
  CheckCircle2, Star, ArrowRight, Sparkles, Crown, RefreshCw,
  Lightbulb, Target, TrendingUp, Zap, Shield
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

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

export default function ReportLandingPage() {
  const { isAuthenticated, user } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const isAuth = mounted && isAuthenticated;
  const isPremium = user?.plan === 'premium' || user?.plan === 'pro';

  return (
    <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
      <Navbar />

      {/* Hero */}
      <section className="relative dark-section hero-pattern noise-overlay overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb orb-purple w-[500px] h-[500px] -top-24 -right-24 animate-float-slow" />
          <div className="orb orb-pink w-[350px] h-[350px] bottom-0 left-1/4 animate-float-reverse" />
        </div>

        <div className="container relative mx-auto px-4 py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full glass-light px-5 py-2 mb-6 animate-border-glow">
              <BarChart3 className="h-4 w-4 text-purple-300" />
              <span className="text-sm text-purple-200 font-medium">Detailed Reports</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight">
              Understand Your Results.<br />
              <span className="gradient-text">Accelerate Your Progress.</span>
            </h1>
            <p className="mt-5 text-lg text-white/50 max-w-2xl mx-auto">
              Every CEFR assessment comes with a comprehensive report that goes beyond a simple score. Get personalized improvement tips, skill-by-skill analysis, and a clear path to the next level.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              {isAuth ? (
                isPremium ? (
                  <Link href="/test">
                    <button className="group flex items-center gap-2 rounded-xl px-8 py-3.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold text-base transition-all duration-300 shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-1 cursor-pointer">
                      Take Assessment Now
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </Link>
                ) : (
                  <Link href="/pricing">
                    <button className="group flex items-center gap-2 rounded-xl px-8 py-3.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold text-base transition-all duration-300 shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-1 cursor-pointer">
                      <Crown className="h-4 w-4" />
                      Get Premium for Full Reports
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </Link>
                )
              ) : (
                <>
                  <Link href="/register">
                    <button className="group flex items-center gap-2 rounded-xl px-8 py-3.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold text-base transition-all duration-300 shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-1 cursor-pointer">
                      Start Free Account
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </Link>
                  <Link href="/sample-certificate">
                    <button className="glass-button rounded-xl px-8 py-3.5 text-white font-medium text-base cursor-pointer">
                      See Sample Certificate
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0F0A1E] to-transparent" />
      </section>

      {/* What's in the Report */}
      <section className="relative py-16 md:py-24 bg-[#0F0A1E]">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                What&apos;s in Your <span className="gradient-text-static">Report</span>
              </h2>
              <p className="text-white/50 max-w-2xl mx-auto">
                Each report is uniquely generated based on your assessment results, providing actionable insights across all dimensions of your English proficiency.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {[
              {
                icon: <Target className="h-6 w-6" />,
                title: 'Overall CEFR Level & Score',
                desc: 'Your precise CEFR level (A1-C2) with an overall percentage score, validated by our AI-powered assessment engine against international standards.',
                gradient: 'from-purple-500 to-pink-500',
              },
              {
                icon: <BarChart3 className="h-6 w-6" />,
                title: 'Skill-by-Skill Breakdown',
                desc: 'Detailed percentage scores for each of the six core competencies: reading, writing, listening, speaking, grammar, and vocabulary. See exactly where you excel and where to focus.',
                gradient: 'from-blue-500 to-cyan-500',
              },
              {
                icon: <Lightbulb className="h-6 w-6" />,
                title: 'Personalized Improvement Tips',
                desc: 'Tailored recommendations for each skill based on your current level. Tips are tiered: foundational for lower scores, strategic for mid-range, and advanced for strong performers.',
                gradient: 'from-amber-500 to-orange-500',
              },
              {
                icon: <TrendingUp className="h-6 w-6" />,
                title: 'Path to Next Level',
                desc: 'A clear roadmap showing what you need to achieve for the next CEFR level, with estimated study time and specific can-do statements to work toward.',
                gradient: 'from-green-500 to-emerald-500',
              },
              {
                icon: <RefreshCw className="h-6 w-6" />,
                title: 'Retest Recommendations',
                desc: 'Expert guidance on when to retake the assessment, what to practice in the interim, and how to track your improvement over time with fresh questions each attempt.',
                gradient: 'from-orange-500 to-red-500',
              },
              {
                icon: <BookOpen className="h-6 w-6" />,
                title: 'Curated Resources',
                desc: 'Handpicked learning resources for each skill, including apps, websites, books, and strategies vetted by language assessment professionals. Premium feature.',
                gradient: 'from-violet-500 to-purple-500',
              },
            ].map((item, index) => (
              <AnimatedSection key={item.title} delay={index * 100}>
                <div className="glass-card p-6 h-full group">
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient} text-white shadow-lg mb-4 transition-transform duration-300 group-hover:scale-110`}>
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Free vs Premium */}
      <section className="relative py-16 md:py-24 dark-section-alt hero-pattern noise-overlay">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Free vs <span className="gradient-text-static">Premium Report</span>
              </h2>
              <p className="text-white/50 max-w-xl mx-auto">
                Every user receives a report. Premium members unlock the full experience.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
            {/* Free */}
            <AnimatedSection delay={100}>
              <div className="glass-card p-6 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Free Report</h3>
                    <p className="text-xs text-white/40">Included with every assessment</p>
                  </div>
                </div>
                <ul className="space-y-2.5">
                  {[
                    'Overall CEFR level and score',
                    'Skill breakdown percentages',
                    'Level description and can-do statements',
                    '2 improvement tips per skill (preview)',
                    'Path to next level overview',
                    'Retest recommendation',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-white/30 mt-0.5 shrink-0" />
                      <span className="text-white/60">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>

            {/* Premium */}
            <AnimatedSection delay={200}>
              <div className="relative glass-card-neon p-6 h-full">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-1 text-xs font-semibold text-white shadow-lg shadow-purple-500/25">
                    <Star className="h-3 w-3" />
                    Recommended
                  </span>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg">
                    <Crown className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Premium Report</h3>
                    <p className="text-xs text-white/40">Full insights, unlimited access</p>
                  </div>
                </div>
                <ul className="space-y-2.5">
                  {[
                    'Everything in Free, plus:',
                    'All personalized improvement tips per skill',
                    'Curated learning resources for each skill',
                    'Detailed skill analysis with focus areas',
                    'Full analytics suite with progress tracking',
                    'Unlimited retests with fresh questions',
                    'Unlimited certificate downloads',
                    'Priority AI analysis and support',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle2 className={`h-4 w-4 mt-0.5 shrink-0 ${i === 0 ? 'text-purple-400' : 'text-purple-400'}`} />
                      <span className={`${i === 0 ? 'text-white/80 font-medium' : 'text-white/60'}`}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
          </div>

          <div className="mt-8 text-center">
            <Link href="/pricing">
              <button className="group inline-flex items-center gap-2 rounded-xl px-8 py-3.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold text-base transition-all duration-300 shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-1 cursor-pointer">
                <Crown className="h-5 w-5" />
                View Pricing Plans
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16 md:py-24 bg-[#0F0A1E]">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-2xl mx-auto">
              <div className="glass-card-neon p-8 md:p-12 text-center light-streak">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20 mb-6">
                  <Sparkles className="h-8 w-8 text-purple-400" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  Ready to See Your Report?
                </h2>
                <p className="text-white/50 mb-8 max-w-md mx-auto">
                  Complete a CEFR assessment and receive your personalized proficiency report with actionable improvement recommendations.
                </p>
                {isAuth ? (
                  <Link href="/dashboard">
                    <button className="group inline-flex items-center gap-2 rounded-xl px-8 py-3.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold text-base transition-all duration-300 shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-1 cursor-pointer">
                      Go to Dashboard
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </Link>
                ) : (
                  <Link href="/register">
                    <button className="group inline-flex items-center gap-2 rounded-xl px-8 py-3.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold text-base transition-all duration-300 shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-1 cursor-pointer">
                      Create Free Account
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </div>
  );
}
