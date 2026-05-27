'use client';

import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { useAuthStore } from '@/lib/auth-store';
import { isPaidPlan } from '@/lib/plan-utils';
import {
  Headphones, Globe, Volume2, BarChart3, ArrowRight,
  Play, Ear, MessageCircle, CheckCircle2,
  Music, Users, Zap
} from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useHydrated } from '@/hooks/use-hydrated';

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
      <div className="orb orb-purple w-[600px] h-[600px] -top-40 -left-40 animate-float-slow opacity-15" />
      {/* Pink orb */}
      <div className="orb orb-blue w-[400px] h-[400px] top-1/3 -right-20 animate-float-reverse opacity-15" />
      {/* Blue orb */}
      <div className="orb orb-blue w-[300px] h-[300px] bottom-20 left-1/4 animate-float opacity-15" />
      {/* Small accent orbs */}
      <div className="absolute top-1/4 left-1/2 w-2 h-2 rounded-full bg-blue-400/20 animate-float delay-200" />
      <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 rounded-full bg-blue-400/15 animate-float-reverse delay-500" />
      <div className="absolute bottom-1/3 left-1/3 w-2.5 h-2.5 rounded-full bg-blue-400/15 animate-float delay-300" />
    </div>
  );
}

export default function ListeningPage() {
  const { isAuthenticated, user } = useAuthStore();
  const mounted = useHydrated();
  const isAuth = mounted && isAuthenticated;

  const features = [
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: 'Natural Conversations',
      desc: 'Listen to authentic, real-world dialogues between native English speakers in everyday situations — from ordering coffee to professional meetings.',
      gradient: 'from-purple-500 to-indigo-500',
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: 'Various Accents',
      desc: 'Train your ear to understand diverse English accents including British, American, Australian, and more — essential for real-world communication.',
      gradient: 'from-pink-500 to-rose-500',
    },
    {
      icon: <Volume2 className="h-6 w-6" />,
      title: 'Real-World Scenarios',
      desc: 'Engage with audio drawn from practical contexts: airport announcements, workplace instructions, news broadcasts, and academic lectures.',
      gradient: 'from-cyan-400 to-blue-500',
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: 'Progressive Difficulty',
      desc: 'Questions adapt from A1 beginner level through C2 mastery, automatically calibrating to challenge your current listening comprehension level.',
      gradient: 'from-green-400 to-emerald-500',
    },
  ];

  const steps = [
    {
      icon: <Headphones className="h-7 w-7" />,
      title: 'Listen to Audio',
      desc: 'Play carefully curated audio clips featuring native speakers in realistic scenarios. Each clip is designed to test specific listening skills at your level.',
      step: '01',
      gradient: 'from-purple-500 to-indigo-500',
    },
    {
      icon: <Ear className="h-7 w-7" />,
      title: 'Answer Questions',
      desc: 'Respond to comprehension questions that evaluate your understanding of main ideas, specific details, speaker intent, and implied meanings.',
      step: '02',
      gradient: 'from-pink-500 to-rose-500',
    },
    {
      icon: <CheckCircle2 className="h-7 w-7" />,
      title: 'Get Your Score',
      desc: 'Receive an instant CEFR-aligned listening score with detailed analytics on your strengths, weaknesses, and personalized improvement recommendations.',
      step: '03',
      gradient: 'from-cyan-400 to-blue-500',
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
              <Headphones className="h-4 w-4 text-purple-300" />
              <span className="text-sm text-purple-200 font-medium">Listening Assessment</span>
              <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1] animate-slide-up">
              Master English
              <br />
              Listening Skills
            </h1>

            {/* Description */}
            <p className="mt-6 text-lg md:text-xl text-white/60 leading-relaxed max-w-2xl mx-auto animate-fade-in delay-300">
              Sharpen your comprehension with AI-powered listening assessments. From casual conversations to academic lectures, our adaptive system evaluates your ability to understand spoken English across all CEFR levels.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-scale-in delay-500">
              {isAuth ? (
                isPaidPlan(user?.plan) ? (
                  <Link href="/test">
                    <button className="group flex w-full sm:w-auto items-center gap-2 rounded-xl px-8 py-3.5 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold text-base transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-1 cursor-pointer">
                      Start Listening Test
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </Link>
                ) : (
                  <>
                    <Link href="/pricing">
                      <button className="group flex w-full sm:w-auto items-center gap-2 rounded-xl px-8 py-3.5 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold text-base transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-1 cursor-pointer">
                        Get Premium Access
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </button>
                    </Link>
                    <Link href="/quick-tour">
                      <button className="rounded-xl px-8 py-3.5 border border-[#4a4a5a] text-white/80 hover:text-white hover:border-white/30 font-medium text-base cursor-pointer transition-colors">
                        Quick Tour
                      </button>
                    </Link>
                  </>
                )
              ) : (
                <>
                  <Link href="/register">
                    <button className="group flex w-full sm:w-auto items-center gap-2 rounded-xl px-8 py-3.5 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold text-base transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-1 cursor-pointer">
                      Start Listening Test
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </Link>
                  <Link href="/quick-tour">
                    <button className="rounded-xl px-8 py-3.5 border border-[#4a4a5a] text-white/80 hover:text-white hover:border-white/30 font-medium text-base cursor-pointer transition-colors">
                      Quick Tour
                    </button>
                  </Link>
                </>
              )}
            </div>

            {/* Quick stats */}
            <div className="mt-16 grid grid-cols-3 gap-2 sm:gap-4 max-w-lg mx-auto">
              <AnimatedSection delay={100}>
                <div className="glass-card p-4 text-center group">
                  <div className="flex justify-center mb-2 text-purple-400 group-hover:text-purple-300 transition-colors">
                    <Users className="h-5 w-5" />
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-white">5K+</div>
                  <div className="text-[11px] text-white/50">Tests Taken</div>
                </div>
              </AnimatedSection>
              <AnimatedSection delay={200}>
                <div className="glass-card p-4 text-center group">
                  <div className="flex justify-center mb-2 text-purple-400 group-hover:text-purple-300 transition-colors">
                    <Music className="h-5 w-5" />
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-white">200+</div>
                  <div className="text-[11px] text-white/50">Audio Clips</div>
                </div>
              </AnimatedSection>
              <AnimatedSection delay={300}>
                <div className="glass-card p-4 text-center group">
                  <div className="flex justify-center mb-2 text-purple-400 group-hover:text-purple-300 transition-colors">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-white">15 min</div>
                  <div className="text-[11px] text-white/50">Avg. Time</div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0F0A1E] to-transparent" />
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="relative py-20 md:py-28 bg-[#0F0A1E]">
        <div className="absolute inset-0 hero-pattern pointer-events-none" />
        <div className="container relative mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                <Volume2 className="h-3.5 w-3.5 text-purple-400" />
                <span className="text-xs text-purple-300 font-medium uppercase tracking-wider">What You&apos;ll Experience</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Listening Features Built for You
              </h2>
              <p className="mt-4 text-white/50 max-w-2xl mx-auto text-base">
                Our AI-powered listening assessment is designed to mirror real-world English comprehension challenges, preparing you for success in any environment.
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

      {/* Section Divider */}
      <div className="section-divider" />

      {/* ===== HOW IT WORKS SECTION ===== */}
      <section className="relative py-20 md:py-28 dark-section-alt hero-pattern noise-overlay">
        <div className="container relative mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                <Play className="h-3.5 w-3.5 text-purple-400" />
                <span className="text-xs text-purple-300 font-medium uppercase tracking-wider">Simple Process</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                How It Works
              </h2>
              <p className="mt-4 text-white/50 max-w-2xl mx-auto text-base">
                Our streamlined assessment process gets you from listening to results in three simple steps.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <AnimatedSection key={index} delay={index * 150}>
                <div className="glass-card p-6 h-full text-center group relative">
                  {/* Step number */}
                  <div className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#3b82f6] text-white text-xs font-bold shadow-lg shadow-blue-500/30">
                    {step.step}
                  </div>
                  <div className={`flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-gradient-to-br ${step.gradient} text-white shadow-lg mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    {step.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-white/45 leading-relaxed">{step.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Connecting line visual (desktop only) */}
          <div className="hidden md:flex justify-center mt-[-120px] mb-[80px] pointer-events-none">
            <div className="flex items-center gap-0 max-w-md w-full">
              <div className="flex-1 h-px bg-gradient-to-r from-blue-500/50 via-blue-400/30 to-blue-300/50" />
              <div className="flex-1 h-px bg-gradient-to-r from-blue-300/50 via-blue-400/30 to-blue-500/50" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== EXAMPLE QUESTIONS SECTION ===== */}
      <section className="relative py-20 md:py-28 bg-[#0F0A1E]">
        <div className="absolute inset-0 hero-pattern pointer-events-none" />
        <div className="container relative mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                <Ear className="h-3.5 w-3.5 text-purple-400" />
                <span className="text-xs text-purple-300 font-medium uppercase tracking-wider">Sample Questions</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Listening Practice Examples
              </h2>
              <p className="mt-4 text-white/50 max-w-2xl mx-auto text-base">
                Preview the types of audio scenarios and comprehension questions you will encounter. From everyday conversations to academic lectures, each level challenges your listening skills in different ways.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid gap-6 max-w-4xl mx-auto">
            {/* A2 Example */}
            <AnimatedSection delay={100}>
              <div className="glass-card p-6 group">
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold border border-green-500/30">A2</span>
                  <h3 className="text-white font-semibold">At the Restaurant</h3>
                </div>
                <div className="rounded-xl bg-white/[0.03] border border-white/5 p-5 mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/20">
                      <Headphones className="h-4 w-4 text-purple-400" />
                    </div>
                    <span className="text-white/50 text-xs">Audio clip: A conversation between a customer and a waiter</span>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed italic">
                    &ldquo;Good evening! Table for two? Right this way. Here are your menus. Can I start you off with something to drink? &mdash; I&apos;ll have an iced tea, please. And for you, sir? &mdash; Just water for me, thanks. Actually, could we also order an appetizer? The bruschetta sounds great.&rdquo;
                  </p>
                </div>
                <div className="space-y-3">
                  <p className="text-white/50 text-sm font-medium">What drink does the first person order?</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { text: 'Water', correct: false },
                      { text: 'Iced tea', correct: true },
                      { text: 'Coffee', correct: false },
                      { text: 'Lemonade', correct: false },
                    ].map((opt, i) => (
                      <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${opt.correct ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-white/[0.03] border border-white/5 text-white/50'}`}>
                        {opt.correct ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <div className="h-4 w-4 rounded-full border border-white/20 shrink-0" />}
                        {opt.text}
                      </div>
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
                  <h3 className="text-white font-semibold">Workplace Meeting</h3>
                </div>
                <div className="rounded-xl bg-white/[0.03] border border-white/5 p-5 mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500/20">
                      <Headphones className="h-4 w-4 text-orange-400" />
                    </div>
                    <span className="text-white/50 text-xs">Audio clip: A project update meeting with multiple speakers</span>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed italic">
                    &ldquo;So, looking at the Q3 figures, we&apos;re about 12% behind our revenue target. However, if we factor in the deferred contracts from last quarter, the actual shortfall is closer to 5%. I think the real concern isn&apos;t the top line &mdash; it&apos;s the margin compression we&apos;re seeing in the enterprise segment.&rdquo;
                  </p>
                </div>
                <div className="space-y-3">
                  <p className="text-white/50 text-sm font-medium">What does the speaker identify as the main concern?</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { text: 'Revenue being 12% behind target', correct: false },
                      { text: 'Margin compression in the enterprise segment', correct: true },
                      { text: 'Deferred contracts from last quarter', correct: false },
                      { text: 'Missing Q3 deadlines', correct: false },
                    ].map((opt, i) => (
                      <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${opt.correct ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-white/[0.03] border border-white/5 text-white/50'}`}>
                        {opt.correct ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <div className="h-4 w-4 rounded-full border border-white/20 shrink-0" />}
                        {opt.text}
                      </div>
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
                  <h3 className="text-white font-semibold">Academic Lecture</h3>
                </div>
                <div className="rounded-xl bg-white/[0.03] border border-white/5 p-5 mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/20">
                      <Headphones className="h-4 w-4 text-red-400" />
                    </div>
                    <span className="text-white/50 text-xs">Audio clip: An excerpt from a university lecture on behavioral economics</span>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed italic">
                    &ldquo;What&apos;s particularly intriguing about Kahneman&apos;s dual-process theory is not merely the distinction between System 1 and System 2 thinking, but rather the persistent illusion of rationality that System 2 generates. We don&apos;t just make suboptimal decisions &mdash; we construct elaborate post-hoc justifications for them, which paradoxically makes us more confident in our errors.&rdquo;
                  </p>
                </div>
                <div className="space-y-3">
                  <p className="text-white/50 text-sm font-medium">What paradox does the lecturer describe?</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { text: 'System 2 is slower but always correct', correct: false },
                      { text: 'Post-hoc justifications increase confidence in wrong decisions', correct: true },
                      { text: 'System 1 thinking is more reliable than System 2', correct: false },
                      { text: 'Rational decisions require more cognitive effort', correct: false },
                    ].map((opt, i) => (
                      <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${opt.correct ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-white/[0.03] border border-white/5 text-white/50'}`}>
                        {opt.correct ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <div className="h-4 w-4 rounded-full border border-white/20 shrink-0" />}
                        {opt.text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider" />

      {/* ===== CTA SECTION ===== */}
      <section className="relative py-20 md:py-28 dark-section overflow-hidden">
        {/* Background orbs for CTA */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb orb-purple w-[400px] h-[400px] -top-20 right-1/4 animate-float-slow opacity-15" />
          <div className="orb orb-blue w-[300px] h-[300px] bottom-0 left-1/4 animate-float-reverse opacity-15" />
        </div>

        <div className="container relative mx-auto px-4 text-center">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto">
              <div className="glass-card p-10 md:p-14">
                <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-6 animate-pulse-glow">
                  <Headphones className="h-4 w-4 text-purple-300" />
                  <span className="text-sm text-purple-200 font-medium">Listening Assessment</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Ready to Test Your <span className="gradient-text-static">Listening</span>?
                </h2>
                <p className="text-lg text-white/50 max-w-xl mx-auto mb-8">
                  Discover how well you understand spoken English. Our AI-powered assessment adapts to your level and provides detailed feedback on your listening comprehension skills.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {isAuth ? (
                    isPaidPlan(user?.plan) ? (
                      <Link href="/test">
                        <button className="group flex w-full sm:w-auto items-center gap-2 rounded-xl px-8 py-3.5 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold text-base transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-1 cursor-pointer">
                          Start Listening Test
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </button>
                      </Link>
                    ) : (
                      <>
                        <Link href="/pricing">
                          <button className="group flex w-full sm:w-auto items-center gap-2 rounded-xl px-8 py-3.5 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold text-base transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-1 cursor-pointer">
                            Upgrade to Premium
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </button>
                        </Link>
                        <Link href="/quick-tour">
                          <button className="rounded-xl px-8 py-3.5 border border-[#4a4a5a] text-white/80 hover:text-white hover:border-white/30 font-medium text-base cursor-pointer transition-colors">
                            Quick Tour
                          </button>
                        </Link>
                      </>
                    )
                  ) : (
                    <>
                      <Link href="/register">
                        <button className="group flex w-full sm:w-auto items-center gap-2 rounded-xl px-8 py-3.5 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold text-base transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-1 cursor-pointer">
                          Create Free Account
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </button>
                      </Link>
                      <Link href="/pricing">
                        <button className="rounded-xl px-8 py-3.5 border border-[#4a4a5a] text-white/80 hover:text-white hover:border-white/30 font-medium text-base cursor-pointer transition-colors">
                          View Pricing
                        </button>
                      </Link>
                    </>
                  )}
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
