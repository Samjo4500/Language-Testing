'use client';

import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { useAuthStore } from '@/lib/auth-store';
import {
  PenTool, ArrowRight, Sparkles, BookOpen, CheckCircle2,
  MessageSquareText, SpellCheck, Layers, FileText, Award, Zap
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

/* Scroll animation hook using IntersectionObserver */
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
    // Immediately mark as visible if already in viewport on mount
    if (el.getBoundingClientRect().top < window.innerHeight) {
      el.classList.add('visible');
      observer.unobserve(el);
    }
    return () => observer.disconnect();
  }, []);
  return ref;
}

/* Animated section wrapper */
function AnimatedSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
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

/* Floating background orbs */
function BackgroundOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Main purple orb */}
      <div className="orb orb-purple w-[600px] h-[600px] -top-40 -left-40 animate-float-slow" />
      {/* Pink orb */}
      <div className="orb orb-pink w-[400px] h-[400px] top-1/3 -right-20 animate-float" />
      {/* Blue orb */}
      <div className="orb orb-blue w-[300px] h-[300px] bottom-20 left-1/4 animate-float-slow" />
      {/* Small accent dots */}
      <div className="absolute top-1/4 left-1/2 w-2 h-2 rounded-full bg-purple-400/40 animate-float" />
      <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 rounded-full bg-pink-400/30 animate-float-slow" />
      <div className="absolute bottom-1/3 left-1/3 w-2.5 h-2.5 rounded-full bg-blue-400/30 animate-float" />
    </div>
  );
}

export default function WritingPage() {
  const { isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const isAuth = mounted && isAuthenticated;

  /* Writing features data */
  const features = [
    {
      icon: <MessageSquareText className="h-6 w-6" />,
      title: 'Coherence Evaluation',
      desc: 'AI analyzes the logical flow and connectivity of your ideas, ensuring your writing progresses naturally from introduction to conclusion.',
      gradient: 'from-purple-500 to-indigo-500',
    },
    {
      icon: <SpellCheck className="h-6 w-6" />,
      title: 'Grammar Checking',
      desc: 'Advanced grammar detection covers verb tenses, subject-verb agreement, article usage, punctuation, and complex sentence structures.',
      gradient: 'from-pink-500 to-rose-500',
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: 'Vocabulary Range',
      desc: 'Measures lexical diversity and appropriateness, from basic word choice at A1 level to sophisticated, nuanced expression at C2.',
      gradient: 'from-violet-500 to-purple-500',
    },
    {
      icon: <Layers className="h-6 w-6" />,
      title: 'Structure Analysis',
      desc: 'Evaluates paragraph organization, thesis development, supporting evidence, transitions, and overall composition architecture.',
      gradient: 'from-fuchsia-500 to-pink-500',
    },
  ];

  /* How it works steps */
  const steps = [
    {
      number: '01',
      icon: <PenTool className="h-7 w-7" />,
      title: 'Write Your Response',
      desc: 'Receive a thought-provoking prompt and compose your written response. Choose from argumentative, descriptive, or analytical tasks designed for your target CEFR level.',
      gradient: 'from-purple-500 to-indigo-500',
    },
    {
      number: '02',
      icon: <Zap className="h-7 w-7" />,
      title: 'AI Evaluates Writing',
      desc: 'Our advanced AI engine analyzes your text across multiple dimensions — grammar accuracy, lexical range, coherence, cohesion, and task achievement — in real time.',
      gradient: 'from-pink-500 to-rose-500',
    },
    {
      number: '03',
      icon: <Award className="h-7 w-7" />,
      title: 'Receive Your Score',
      desc: 'Get a detailed CEFR-aligned score with a comprehensive breakdown, personalized feedback, and actionable improvement suggestions for each writing competency.',
      gradient: 'from-violet-500 to-purple-500',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
      <Navbar />

      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden dark-section hero-pattern noise-overlay">
        <BackgroundOrbs />

        <div className="container relative mx-auto px-4 py-24 md:py-36">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="animate-float inline-flex items-center gap-2 rounded-full glass-light px-5 py-2 mb-8 animate-border-glow">
              <PenTool className="h-4 w-4 text-purple-300" />
              <span className="text-sm text-purple-200 font-medium">Writing Assessment</span>
              <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1] animate-slide-up">
              Excel in English
              <br />
              <span className="gradient-text">Writing Skills</span>
            </h1>

            {/* Description */}
            <p className="mt-6 text-lg md:text-xl text-white/60 leading-relaxed max-w-2xl mx-auto animate-fade-in delay-300">
              Our AI-powered writing assessment evaluates your coherence, grammar, vocabulary, and structure — delivering a precise CEFR-aligned score with actionable feedback to elevate your written English.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-scale-in delay-500">
              {isAuth ? (
                <Link href="/test">
                  <button className="group flex w-full sm:w-auto items-center gap-2 rounded-xl px-8 py-3.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold text-base transition-all duration-300 shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-1 cursor-pointer">
                    Start Writing Test
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </Link>
              ) : (
                <>
                  <Link href="/register">
                    <button className="group flex w-full sm:w-auto items-center gap-2 rounded-xl px-8 py-3.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold text-base transition-all duration-300 shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-1 cursor-pointer">
                      Start Writing Test
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </Link>
                  <Link href="/quick-tour">
                    <button className="glass-button w-full sm:w-auto rounded-xl px-8 py-3.5 text-white font-medium text-base cursor-pointer">
                      Quick Tour
                    </button>
                  </Link>
                </>
              )}
            </div>

            {/* Subtle stats bar */}
            <div className="mt-16 grid grid-cols-3 gap-2 sm:gap-4 max-w-xl mx-auto">
              {[
                { value: '4 Skills', label: 'Evaluated' },
                { value: 'CEFR A1–C2', label: 'Level Range' },
                { value: 'Instant', label: 'AI Feedback' },
              ].map((stat, i) => (
                <AnimatedSection key={i} delay={100 + i * 100}>
                  <div className="glass-card p-4 text-center group">
                    <div className="text-lg font-bold text-white mb-0.5">{stat.value}</div>
                    <div className="text-xs text-white/50">{stat.label}</div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0F0A1E] to-transparent" />
      </section>

      {/* ===== SECTION DIVIDER ===== */}
      <div className="section-divider" />

      {/* ===== FEATURES SECTION ===== */}
      <section className="relative py-20 md:py-28 bg-[#0F0A1E]">
        <div className="absolute inset-0 hero-pattern pointer-events-none" />
        <div className="container relative mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                <FileText className="h-3.5 w-3.5 text-purple-400" />
                <span className="text-xs text-purple-300 font-medium uppercase tracking-wider">Comprehensive Analysis</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                What We <span className="gradient-text-static">Evaluate</span>
              </h2>
              <p className="mt-4 text-white/50 max-w-2xl mx-auto text-base">
                Our AI evaluates four critical dimensions of your writing, each aligned with CEFR descriptors to provide an accurate and detailed proficiency rating.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid gap-5 sm:grid-cols-2 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <AnimatedSection key={index} delay={index * 100}>
                <div className="glass-card p-6 h-full group">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-white/45 leading-relaxed">{feature.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION DIVIDER ===== */}
      <div className="section-divider" />

      {/* ===== HOW IT WORKS SECTION ===== */}
      <section className="relative py-20 md:py-28 dark-section-alt hero-pattern noise-overlay">
        <div className="container relative mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                <CheckCircle2 className="h-3.5 w-3.5 text-purple-400" />
                <span className="text-xs text-purple-300 font-medium uppercase tracking-wider">Simple Process</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                How It <span className="gradient-text-static">Works</span>
              </h2>
              <p className="mt-4 text-white/50 max-w-2xl mx-auto text-base">
                From prompt to score in three seamless steps. Our AI handles the complex analysis so you can focus on writing your best.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <AnimatedSection key={index} delay={index * 150}>
                <div className="glass-card p-6 h-full text-center group relative">
                  {/* Step number */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs font-bold shadow-lg shadow-purple-500/30">
                      {step.number}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className={`flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-gradient-to-br ${step.gradient} text-white shadow-lg mb-5 mt-3 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    {step.icon}
                  </div>

                  {/* Connector line (not on last item) */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-purple-500/40 to-transparent" />
                  )}

                  <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-white/45 leading-relaxed">{step.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION DIVIDER ===== */}
      <div className="section-divider" />

      {/* ===== EXAMPLE QUESTIONS SECTION ===== */}
      <section className="relative py-20 md:py-28 bg-[#0F0A1E]">
        <div className="absolute inset-0 hero-pattern pointer-events-none" />
        <div className="container relative mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                <PenTool className="h-3.5 w-3.5 text-purple-400" />
                <span className="text-xs text-purple-300 font-medium uppercase tracking-wider">Sample Prompts</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Practice Writing <span className="gradient-text-static">Examples</span>
              </h2>
              <p className="mt-4 text-white/50 max-w-2xl mx-auto text-base">
                Explore sample writing prompts at different CEFR levels. Each prompt is designed to elicit specific language competencies, from basic personal expression to sophisticated argumentation.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid gap-6 max-w-4xl mx-auto">
            {/* A2 Example */}
            <AnimatedSection delay={100}>
              <div className="glass-card p-6 group">
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold border border-green-500/30">A2</span>
                  <h3 className="text-white font-semibold">Personal Email</h3>
                </div>
                <div className="rounded-xl bg-white/[0.03] border border-white/5 p-5 mb-4">
                  <p className="text-white/70 text-sm leading-relaxed">
                    <span className="text-purple-400 font-medium">Prompt:</span> Write an email to your friend telling them about your weekend. Include what you did, who you were with, and how you felt about it. Write 80&ndash;120 words.
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-white/40 text-xs font-medium uppercase tracking-wider">What the AI evaluates:</p>
                  <div className="flex flex-wrap gap-2">
                    {['Basic sentence structure', 'Past tense usage', 'Personal vocabulary', 'Email format conventions'].map((skill, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-300 text-xs border border-purple-500/20">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* B2 Example */}
            <AnimatedSection delay={200}>
              <div className="glass-card p-6 group">
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold border border-orange-500/30">B2</span>
                  <h3 className="text-white font-semibold">Opinion Essay</h3>
                </div>
                <div className="rounded-xl bg-white/[0.03] border border-white/5 p-5 mb-4">
                  <p className="text-white/70 text-sm leading-relaxed">
                    <span className="text-purple-400 font-medium">Prompt:</span> Some people believe that remote work has improved work-life balance, while others argue it has blurred the boundaries between personal and professional life. Discuss both views and give your own opinion. Write 200&ndash;250 words.
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-white/40 text-xs font-medium uppercase tracking-wider">What the AI evaluates:</p>
                  <div className="flex flex-wrap gap-2">
                    {['Balanced argumentation', 'Cohesive devices & transitions', 'Complex sentence structures', 'Lexical range & precision', 'Paragraph organization'].map((skill, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-orange-500/10 text-orange-300 text-xs border border-orange-500/20">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* C1 Example */}
            <AnimatedSection delay={300}>
              <div className="glass-card p-6 group">
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/30">C1</span>
                  <h3 className="text-white font-semibold">Critical Analysis</h3>
                </div>
                <div className="rounded-xl bg-white/[0.03] border border-white/5 p-5 mb-4">
                  <p className="text-white/70 text-sm leading-relaxed">
                    <span className="text-purple-400 font-medium">Prompt:</span> Critically evaluate the statement: &ldquo;Artificial intelligence will render human creativity obsolete within the next two decades.&rdquo; Discuss the implications for education, employment, and cultural production, supporting your arguments with specific examples. Write 300&ndash;400 words.
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-white/40 text-xs font-medium uppercase tracking-wider">What the AI evaluates:</p>
                  <div className="flex flex-wrap gap-2">
                    {['Critical thinking & nuance', 'Sophisticated argumentation', 'Academic register & hedging', 'Advanced vocabulary & collocations', 'Thesis development & evidence', 'Rhetorical sophistication'].map((skill, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-red-500/10 text-red-300 text-xs border border-red-500/20">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ===== SECTION DIVIDER ===== */}
      <div className="section-divider" />

      {/* ===== CTA SECTION ===== */}
      <section className="relative py-20 md:py-28 dark-section overflow-hidden">
        {/* Background orbs for CTA */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb orb-purple w-[400px] h-[400px] -top-20 right-1/4 animate-float-slow" />
          <div className="orb orb-pink w-[300px] h-[300px] bottom-0 left-1/4 animate-float" />
        </div>

        <div className="container relative mx-auto px-4 text-center">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto">
              <div className="glass-card p-10 md:p-14">
                <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-6 animate-pulse-glow">
                  <Sparkles className="h-4 w-4 text-purple-300" />
                  <span className="text-sm text-purple-200 font-medium">Writing Assessment</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Ready to Test Your <span className="gradient-text-static">Writing</span>?
                </h2>
                <p className="text-lg text-white/50 max-w-xl mx-auto mb-8">
                  Discover your CEFR writing level with our AI-powered assessment. Get detailed feedback on coherence, grammar, vocabulary, and structure — and take your written English to the next level.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href={isAuth ? '/test' : '/register'}>
                    <button className="group flex w-full sm:w-auto items-center gap-2 rounded-xl px-8 py-3.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold text-base transition-all duration-300 shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-1 cursor-pointer">
                      Start Writing Test
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </Link>
                  <Link href="/quick-tour">
                    <button className="glass-button w-full sm:w-auto rounded-xl px-8 py-3.5 text-white font-medium text-base cursor-pointer">
                      Quick Tour
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
