'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { AnimatedHeroSection } from '@/components/home/animated-hero-section';
import { AnimatedPillars } from '@/components/home/dynamic-imports';
import { AnimatedCEFRBadge } from '@/components/home/dynamic-imports';
import { TypewriterBadge } from '@/components/home/dynamic-imports';
import { BackgroundOrbsDynamic } from '@/components/home/dynamic-imports';
import { LiveVoiceDemo } from '@/components/home/dynamic-imports';
import { InteractiveCEFRLevels } from '@/components/home/dynamic-imports';
import { AnimatedSection } from '@/components/home/animated-section';
import { FinalCTAButtons } from '@/components/home/final-cta-buttons';
import { FAQItem } from '@/components/home/faq-item';
import { PricingTracker } from '@/components/home/pricing-tracker';
import {
  Shield, Brain, Clock, Award, CheckCircle2,
  Users, Globe, Zap, BookOpen, Radio,
  ArrowRight, Sparkles,
} from 'lucide-react';

/* ======================================================
   FEATURES DATA
   ====================================================== */
const FEATURES = [
  {
    icon: Shield,
    title: 'AI-Powered Assessment',
    description: 'Advanced AI evaluates your grammar, vocabulary, fluency, pronunciation, coherence, and interaction across all CEFR levels from A1 to C2.',
    gradient: 'from-blue-500/10 to-blue-600/5',
    iconBg: 'bg-gradient-to-br from-blue-500/20 to-blue-600/20',
    iconColor: 'text-blue-400',
    borderColor: 'hover:border-blue-500/30',
  },
  {
    icon: Clock,
    title: 'Results in 30 Minutes',
    description: 'Complete your full proficiency assessment in under 30 minutes and receive an internationally recognized CEFR certificate with QR verification.',
    gradient: 'from-cyan-500/10 to-cyan-600/5',
    iconBg: 'bg-gradient-to-br from-cyan-500/20 to-cyan-600/20',
    iconColor: 'text-cyan-400',
    borderColor: 'hover:border-cyan-500/30',
  },
  {
    icon: Brain,
    title: 'AI Tutor — Lexi',
    description: 'Meet Lexi, your personal AI English tutor. She remembers your conversations, identifies weak areas, and provides personalized practice recommendations.',
    gradient: 'from-indigo-500/10 to-indigo-600/5',
    iconBg: 'bg-gradient-to-br from-indigo-500/20 to-indigo-600/20',
    iconColor: 'text-indigo-400',
    borderColor: 'hover:border-indigo-500/30',
  },
  {
    icon: BookOpen,
    title: 'Structured Courses',
    description: 'Over 150 lessons from A1 to C2 covering grammar, vocabulary, reading, and writing with interactive exercises and progress tracking.',
    gradient: 'from-violet-500/10 to-violet-600/5',
    iconBg: 'bg-gradient-to-br from-violet-500/20 to-violet-600/20',
    iconColor: 'text-violet-400',
    borderColor: 'hover:border-violet-500/30',
  },
  {
    icon: Radio,
    title: 'SpeakSpace Live Rooms',
    description: 'Practice speaking English in real-time voice rooms with learners from around the world. Build fluency and confidence through live conversation.',
    gradient: 'from-emerald-500/10 to-cyan-500/5',
    iconBg: 'bg-gradient-to-br from-emerald-500/20 to-cyan-500/20',
    iconColor: 'text-emerald-400',
    borderColor: 'hover:border-emerald-500/30',
  },
  {
    icon: Award,
    title: 'QR-Verified Certificates',
    description: 'Earn shareable, QR-verified certificates that employers and institutions can instantly validate. Proof of your English proficiency, secured.',
    gradient: 'from-blue-500/10 to-indigo-500/5',
    iconBg: 'bg-gradient-to-br from-blue-500/20 to-indigo-500/20',
    iconColor: 'text-blue-400',
    borderColor: 'hover:border-blue-500/30',
  },
];

/* ======================================================
   FAQ DATA
   ====================================================== */
const FAQS = [
  {
    question: 'What is CEFR and why does it matter?',
    answer: 'The Common European Framework of Reference (CEFR) is the international standard for measuring language proficiency. It ranges from A1 (beginner) to C2 (proficient) and is recognized by employers, universities, and governments worldwide. Our assessments are fully aligned with CEFR descriptors across all six core skills.',
  },
  {
    question: 'How accurate is the AI assessment?',
    answer: 'Our AI models are trained on thousands of scored assessments and evaluate six dimensions: grammar, vocabulary, fluency, pronunciation, coherence, and interaction. Results closely correlate with human expert evaluations and are continuously refined through feedback loops and validation studies.',
  },
  {
    question: 'Is the test really free?',
    answer: 'Yes! You can take a complete CEFR assessment for free and receive your results. Premium plans offer additional features like downloadable certificates, detailed skill breakdowns, personalized learning paths, and unlimited AI tutor sessions with Lexi.',
  },
  {
    question: 'How long does the assessment take?',
    answer: 'Most learners complete the full assessment in 20-30 minutes. The test adapts to your level, so you will not spend time on questions far above or below your ability. You can pause and resume at any time within 48 hours.',
  },
  {
    question: 'Can I share my certificate with employers?',
    answer: 'Absolutely. Each certificate includes a unique QR code that links to a secure verification page. Employers and institutions can scan the QR code to instantly confirm your CEFR level, test date, and skill breakdown without needing an account.',
  },
  {
    question: 'What is SpeakSpace?',
    answer: 'SpeakSpace is our live voice room community where you can practice speaking English with other learners in real-time. Join topic-based rooms, participate in guided discussions, and build your speaking confidence in a supportive environment. It is included with all plans.',
  },
];

/* ======================================================
   STATS DATA
   ====================================================== */
const STATS = [
  { value: '50K+', label: 'Tests Taken', icon: Zap },
  { value: '150+', label: 'Lessons', icon: BookOpen },
  { value: '12K+', label: 'Members', icon: Users },
  { value: '80+', label: 'Countries', icon: Globe },
];

/* ======================================================
   HOME PAGE
   ====================================================== */
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#06051A]">
      <Navbar />

      <main className="flex-1">
        {/* ===== HERO SECTION ===== */}
        <AnimatedHeroSection />

        {/* ===== PILLARS: Test. Learn. Connect. ===== */}
        <section className="relative py-16 md:py-24 overflow-hidden" style={{ background: '#0F0A1E' }}>
          <BackgroundOrbsDynamic />
          <div className="container relative mx-auto px-4 text-center">
            <AnimatedSection>
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                  <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                  <span className="text-xs text-blue-300 font-medium uppercase tracking-wider">Three Pillars</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-white">
                  Everything You Need to{' '}
                  <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
                    Succeed
                  </span>
                </h2>
                <p className="mt-4 text-white/40 max-w-2xl mx-auto text-base">
                  One platform covering assessment, learning, and live practice. Each pillar strengthens the others.
                </p>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={200}>
              <AnimatedPillars />
            </AnimatedSection>
          </div>
        </section>

        {/* ===== FEATURES GRID ===== */}
        <section className="relative py-16 md:py-24 overflow-hidden" style={{ background: '#0F0A1E' }}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="orb orb-blue w-[500px] h-[500px] top-0 right-0 animate-float-slow opacity-30" />
            <div className="orb orb-cyan w-[400px] h-[400px] bottom-0 left-0 animate-float-reverse opacity-20" />
          </div>

          <div className="container relative mx-auto px-4">
            <AnimatedSection>
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                  <Zap className="h-3.5 w-3.5 text-blue-400" />
                  <span className="text-xs text-blue-300 font-medium uppercase tracking-wider">Platform Features</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-white">
                  Built for{' '}
                  <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                    Real Results
                  </span>
                </h2>
                <p className="mt-4 text-white/40 max-w-2xl mx-auto text-base">
                  Every feature is designed to accurately measure, effectively teach, and genuinely improve your English.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
                {FEATURES.map((feature, i) => (
                  <div
                    key={feature.title}
                    className={`group relative rounded-2xl border border-white/[0.06] ${feature.borderColor} bg-gradient-to-br ${feature.gradient} backdrop-blur-xl p-6 transition-all duration-500 hover:bg-white/[0.04] hover:-translate-y-1`}
                    style={{
                      animationDelay: `${i * 100}ms`,
                    }}
                  >
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${feature.iconBg} mb-4 transition-transform duration-300 group-hover:scale-110`}>
                      <feature.icon className={`h-5 w-5 ${feature.iconColor}`} />
                    </div>
                    <h3 className="text-base font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-white/40 leading-relaxed">{feature.description}</p>

                    {/* Hover glow bar */}
                    <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-500/0 to-transparent group-hover:via-blue-500/30 transition-all duration-500" />
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* ===== INTERACTIVE CEFR LEVELS ===== */}
        <section className="relative py-16 md:py-24 overflow-hidden" style={{ background: '#0a0a1a' }}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="orb orb-blue w-[600px] h-[600px] -top-32 -right-32 animate-float-slow opacity-20" />
            <div className="orb orb-cyan w-[400px] h-[400px] bottom-0 left-0 animate-float-reverse opacity-15" />
          </div>
          <InteractiveCEFRLevels />
        </section>

        {/* ===== CEFR BADGE + STATS ROW ===== */}
        <section className="relative py-16 md:py-24 overflow-hidden" style={{ background: '#0F0A1E' }}>
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
              {/* Left: Animated CEFR Badge */}
              <AnimatedSection className="flex-shrink-0">
                <AnimatedCEFRBadge />
              </AnimatedSection>

              {/* Right: Stats + Description */}
              <div className="flex-1">
                <AnimatedSection>
                  <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                    <Award className="h-3.5 w-3.5 text-blue-400" />
                    <span className="text-xs text-blue-300 font-medium uppercase tracking-wider">CEFR Certified</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                    Internationally Recognized{' '}
                    <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                      Proficiency Levels
                    </span>
                  </h2>
                  <p className="mt-4 text-white/40 text-base leading-relaxed max-w-xl">
                    The Common European Framework of Reference (CEFR) is the global standard for language proficiency.
                    Our assessments accurately place you on this six-level scale, from beginner A1 to proficient C2,
                    with detailed skill breakdowns across grammar, vocabulary, fluency, pronunciation, coherence, and interaction.
                  </p>
                </AnimatedSection>

                <AnimatedSection delay={200}>
                  <div className="grid grid-cols-2 gap-4 mt-8 max-w-md">
                    {STATS.map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 flex items-center gap-3 transition-all duration-300 hover:bg-white/[0.04] hover:border-white/[0.1]"
                      >
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-violet-500/20">
                          <stat.icon className="h-4 w-4 text-blue-400" />
                        </div>
                        <div>
                          <div className="text-lg font-bold text-white">{stat.value}</div>
                          <div className="text-xs text-white/30">{stat.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </AnimatedSection>

                <AnimatedSection delay={300}>
                  <div className="mt-8 flex flex-wrap gap-3">
                    {['Grammar', 'Vocabulary', 'Fluency', 'Pronunciation', 'Coherence', 'Interaction'].map((skill) => (
                      <div
                        key={skill}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs text-white/50"
                      >
                        <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                        {skill}
                      </div>
                    ))}
                  </div>
                </AnimatedSection>
              </div>
            </div>
          </div>
        </section>

        {/* ===== LIVE VOICE DEMO ===== */}
        <section className="relative py-16 md:py-24 overflow-hidden" style={{ background: '#0a0a1a' }}>
          <LiveVoiceDemo />
        </section>

        {/* ===== HOW IT WORKS ===== */}
        <section className="relative py-16 md:py-24 overflow-hidden" style={{ background: '#0F0A1E' }}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="orb orb-blue w-[400px] h-[400px] top-0 left-0 animate-float-slow opacity-20" />
            <div className="orb orb-cyan w-[300px] h-[300px] bottom-0 right-0 animate-float-reverse opacity-15" />
          </div>

          <div className="container relative mx-auto px-4">
            <AnimatedSection>
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                  <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                  <span className="text-xs text-blue-300 font-medium uppercase tracking-wider">Simple Process</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-white">
                  How It{' '}
                  <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                    Works
                  </span>
                </h2>
                <p className="mt-4 text-white/40 max-w-2xl mx-auto text-base">
                  Get certified in three straightforward steps. No complicated setup, no hidden fees.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {[
                  {
                    step: '01',
                    title: 'Take the Assessment',
                    description: 'Complete our AI-powered test covering all six core skills. The adaptive engine adjusts to your level in real time, ensuring accurate placement across the CEFR spectrum.',
                    gradient: 'from-blue-500 to-cyan-500',
                  },
                  {
                    step: '02',
                    title: 'Get Your Results',
                    description: 'Receive a detailed skill-by-skill breakdown with your CEFR level, personalized strengths, and specific areas for improvement. Results are available instantly after completion.',
                    gradient: 'from-cyan-500 to-indigo-500',
                  },
                  {
                    step: '03',
                    title: 'Earn Your Certificate',
                    description: 'Download your QR-verified CEFR certificate and share it with employers, universities, or immigration authorities. They can validate it instantly with a single scan.',
                    gradient: 'from-indigo-500 to-violet-500',
                  },
                ].map((item, i) => (
                  <div
                    key={item.step}
                    className="relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-center transition-all duration-500 hover:bg-white/[0.04] hover:-translate-y-1"
                  >
                    {/* Step number */}
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} text-white font-bold text-xl mb-4 shadow-lg`}>
                      {item.step}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-white/40 leading-relaxed">{item.description}</p>

                    {/* Connector line (hidden on last item and mobile) */}
                    {i < 2 && (
                      <div className="hidden md:block absolute top-7 -right-3 w-6">
                        <ArrowRight className="h-5 w-5 text-white/10" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* ===== PRICING SECTION ===== */}
        <PricingTracker>
          <section className="relative py-16 md:py-24 overflow-hidden" style={{ background: '#0a0a1a' }}>
            <div className="absolute inset-0 pointer-events-none">
              <div className="orb orb-blue w-[500px] h-[500px] -top-24 left-1/4 animate-float-slow opacity-15" />
              <div className="orb orb-cyan w-[300px] h-[300px] bottom-0 right-1/4 animate-float-reverse opacity-10" />
            </div>

            <div className="container relative mx-auto px-4">
              <AnimatedSection>
                <div className="text-center mb-12">
                  <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                    <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                    <span className="text-xs text-blue-300 font-medium uppercase tracking-wider">Pricing</span>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-bold text-white">
                    Start Free,{' '}
                    <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                      Upgrade Anytime
                    </span>
                  </h2>
                  <p className="mt-4 text-white/40 max-w-2xl mx-auto text-base">
                    Take your first assessment at no cost. Upgrade when you need certificates, AI tutoring, or premium features.
                  </p>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={200}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                  {/* Free Plan */}
                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-300 hover:border-white/[0.12]">
                    <div className="text-sm text-white/40 font-medium uppercase tracking-wider mb-2">Free</div>
                    <div className="text-3xl font-bold text-white mb-1">$0</div>
                    <div className="text-xs text-white/30 mb-6">Forever free</div>
                    <ul className="space-y-3 mb-6">
                      {['CEFR Assessment', 'Basic Results', 'Lexi AI Chat (limited)', 'Course Preview'].map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-white/50">
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Link href="/register">
                      <button className="w-full py-2.5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-white/70 hover:text-white font-medium text-sm transition-all duration-300 cursor-pointer">
                        Get Started
                      </button>
                    </Link>
                  </div>

                  {/* Premium Plan */}
                  <div className="relative rounded-2xl border border-blue-500/30 bg-gradient-to-b from-blue-500/[0.08] to-violet-500/[0.04] p-6 transition-all duration-300 hover:border-blue-500/50 shadow-xl shadow-blue-500/10">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 text-white text-[10px] font-bold uppercase tracking-wider">
                      Most Popular
                    </div>
                    <div className="text-sm text-blue-300 font-medium uppercase tracking-wider mb-2">Premium</div>
                    <div className="text-3xl font-bold text-white mb-1">$12</div>
                    <div className="text-xs text-white/30 mb-6">per month</div>
                    <ul className="space-y-3 mb-6">
                      {['Everything in Free', 'QR-Verified Certificates', 'Unlimited Lexi AI Chat', 'All 150+ Lessons', 'SpeakSpace Access', 'Detailed Skill Breakdown'].map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-white/50">
                          <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Link href="/register?plan=premium">
                      <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-400 hover:to-violet-400 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 cursor-pointer">
                        Start Premium
                      </button>
                    </Link>
                  </div>

                  {/* Pro Plan */}
                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-300 hover:border-white/[0.12]">
                    <div className="text-sm text-white/40 font-medium uppercase tracking-wider mb-2">Pro</div>
                    <div className="text-3xl font-bold text-white mb-1">$29</div>
                    <div className="text-xs text-white/30 mb-6">per month</div>
                    <ul className="space-y-3 mb-6">
                      {['Everything in Premium', '1-on-1 AI Speaking Coach', 'Priority Support', 'Custom Study Plans', 'Institution Reports', 'API Access'].map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-white/50">
                          <CheckCircle2 className="h-4 w-4 text-violet-400 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Link href="/register?plan=pro">
                      <button className="w-full py-2.5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-white/70 hover:text-white font-medium text-sm transition-all duration-300 cursor-pointer">
                        Go Pro
                      </button>
                    </Link>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </section>
        </PricingTracker>

        {/* ===== FAQ SECTION ===== */}
        <section className="relative py-16 md:py-24 overflow-hidden" style={{ background: '#0F0A1E' }}>
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                  <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                  <span className="text-xs text-blue-300 font-medium uppercase tracking-wider">FAQ</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-white">
                  Frequently Asked{' '}
                  <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                    Questions
                  </span>
                </h2>
                <p className="mt-4 text-white/40 max-w-2xl mx-auto text-base">
                  Everything you need to know about TestCEFR, CEFR assessments, and how to get started.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <div className="max-w-3xl mx-auto space-y-3">
                {FAQS.map((faq) => (
                  <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* ===== FINAL CTA SECTION ===== */}
        <section className="relative py-16 md:py-24 overflow-hidden" style={{ background: '#06051A' }}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 rounded-full blur-[130px] animate-pulse" />
            <div className="absolute bottom-0 left-1/4 w-[400px] h-[300px] bg-violet-600/[0.06] rounded-full blur-[100px] animate-float-slow" />
          </div>

          <div className="container relative mx-auto px-4 text-center">
            <AnimatedSection>
              <TypewriterBadge />
              <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                Ready to{' '}
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
                  Get Certified?
                </span>
              </h2>
              <p className="mt-4 text-white/40 max-w-xl mx-auto text-base">
                Join thousands of learners who have already discovered their CEFR level. Start your free assessment today.
              </p>
              <FinalCTAButtons />
            </AnimatedSection>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] py-12" style={{ background: '#06051A' }}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent mb-3">
                TestCEFR
              </div>
              <p className="text-sm text-white/30 leading-relaxed">
                AI-powered English proficiency assessment and learning platform. Get your internationally recognized CEFR certificate.
              </p>
            </div>

            {/* Assessment */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Assessment</h4>
              <ul className="space-y-2">
                {['Take Free Test', 'CEFR Levels', 'Certificates', 'Pricing'].map((item) => (
                  <li key={item}>
                    <Link
                      href={item === 'Take Free Test' ? '/register' : item === 'Pricing' ? '#pricing' : '/test'}
                      className="text-sm text-white/30 hover:text-white/60 transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Learning */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Learning</h4>
              <ul className="space-y-2">
                {['Courses', 'Lexi AI Tutor', 'SRS Vocabulary', 'SpeakSpace'].map((item) => (
                  <li key={item}>
                    <Link
                      href={item === 'SpeakSpace' ? '/speakspace' : item === 'Courses' ? '/courses' : '/dashboard'}
                      className="text-sm text-white/30 hover:text-white/60 transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Company</h4>
              <ul className="space-y-2">
                {['About', 'Contact', 'Privacy Policy', 'Terms of Service'].map((item) => (
                  <li key={item}>
                    <span className="text-sm text-white/30 hover:text-white/60 transition-colors cursor-pointer">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-white/[0.04] pt-6 text-center">
            <p className="text-xs text-white/20">
              &copy; {new Date().getFullYear()} TestCEFR — AI-Powered English Assessment
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
