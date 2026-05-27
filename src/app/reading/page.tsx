'use client';

import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { useAuthStore } from '@/lib/auth-store';
import { isPaidPlan } from '@/lib/plan-utils';
import {
  BookOpen, Globe, FileText, BarChart3, ArrowRight,
  Play, Eye, CheckCircle2,
  Users, Zap, Search, Languages
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
      <div className="orb orb-violet w-[600px] h-[600px] -top-40 -left-40 animate-float-slow opacity-15" />
      <div className="orb orb-blue w-[400px] h-[400px] top-1/3 -right-20 animate-float-reverse opacity-15" />
      <div className="orb orb-blue w-[300px] h-[300px] bottom-20 left-1/4 animate-float opacity-15" />
      <div className="absolute top-1/4 left-1/2 w-2 h-2 rounded-full bg-blue-400/20 animate-float delay-200" />
      <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 rounded-full bg-blue-400/15 animate-float-reverse delay-500" />
      <div className="absolute bottom-1/3 left-1/3 w-2.5 h-2.5 rounded-full bg-blue-400/15 animate-float delay-300" />
    </div>
  );
}

export default function ReadingPage() {
  const { isAuthenticated, user } = useAuthStore();
  const mounted = useHydrated();
  const isAuth = mounted && isAuthenticated;

  const features = [
    {
      icon: <FileText className="h-6 w-6" />,
      title: 'Diverse Text Types',
      desc: 'Read everything from short emails and news headlines to academic papers and literary extracts — each text carefully selected to test specific comprehension skills at your level.',
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: 'Authentic Materials',
      desc: 'Engage with real-world English texts drawn from newspapers, workplace documents, academic journals, and everyday communications to prepare you for real-life reading challenges.',
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      icon: <Search className="h-6 w-6" />,
      title: 'Skimming & Scanning',
      desc: 'Develop essential reading strategies through exercises that test your ability to quickly locate key information, identify main ideas, and understand text structure efficiently.',
      gradient: 'from-blue-400 to-blue-500',
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: 'Progressive Difficulty',
      desc: 'Questions adapt from A1 beginner level through C2 mastery, automatically calibrating to challenge your current reading comprehension level with increasing text complexity.',
      gradient: 'from-amber-500 to-amber-600',
    },
  ];

  const steps = [
    {
      icon: <BookOpen className="h-7 w-7" />,
      title: 'Read the Passage',
      desc: 'Engage with carefully curated reading passages featuring authentic English texts. Each passage is designed to test specific comprehension skills at your CEFR level.',
      step: '01',
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      icon: <Eye className="h-7 w-7" />,
      title: 'Answer Questions',
      desc: 'Respond to comprehension questions that evaluate your understanding of main ideas, specific details, inference, and the author\'s purpose and tone.',
      step: '02',
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      icon: <CheckCircle2 className="h-7 w-7" />,
      title: 'Get Your Score',
      desc: 'Receive an instant CEFR-aligned reading score with detailed analytics on your strengths, weaknesses, and personalized improvement recommendations.',
      step: '03',
      gradient: 'from-blue-400 to-blue-500',
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
            <div className="animate-float inline-flex items-center gap-2 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/25 px-5 py-2 mb-8 animate-border-glow">
              <BookOpen className="h-4 w-4 text-blue-300" />
              <span className="text-sm text-blue-200 font-medium">Reading Assessment</span>
              <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1] animate-slide-up">
              Master English
              <br />
              Reading Skills
            </h1>

            {/* Description */}
            <p className="mt-6 text-lg md:text-xl text-white/60 leading-relaxed max-w-2xl mx-auto animate-fade-in delay-300">
              Strengthen your comprehension with AI-powered reading assessments. From short messages to complex academic texts, our adaptive system evaluates your ability to understand written English across all CEFR levels.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-scale-in delay-500">
              {isAuth ? (
                isPaidPlan(user?.plan) ? (
                  <Link href="/test">
                    <button className="group flex items-center gap-2 rounded-xl px-8 py-3.5 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold text-base transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-1 cursor-pointer">
                      Start Reading Test
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </Link>
                ) : (
                  <>
                    <Link href="/pricing">
                      <button className="group flex items-center gap-2 rounded-xl px-8 py-3.5 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold text-base transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-1 cursor-pointer">
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
                    <button className="group flex items-center gap-2 rounded-xl px-8 py-3.5 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold text-base transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-1 cursor-pointer">
                      Start Reading Test
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
                  <div className="flex justify-center mb-2 text-blue-400 group-hover:text-blue-300 transition-colors">
                    <Users className="h-5 w-5" />
                  </div>
                  <div className="text-xl font-bold text-white">5K+</div>
                  <div className="text-[11px] text-white/50">Tests Taken</div>
                </div>
              </AnimatedSection>
              <AnimatedSection delay={200}>
                <div className="glass-card p-4 text-center group">
                  <div className="flex justify-center mb-2 text-blue-400 group-hover:text-blue-300 transition-colors">
                    <Languages className="h-5 w-5" />
                  </div>
                  <div className="text-xl font-bold text-white">300+</div>
                  <div className="text-[11px] text-white/50">Passages</div>
                </div>
              </AnimatedSection>
              <AnimatedSection delay={300}>
                <div className="glass-card p-4 text-center group">
                  <div className="flex justify-center mb-2 text-blue-400 group-hover:text-blue-300 transition-colors">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div className="text-xl font-bold text-white">12 min</div>
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
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 px-4 py-1.5 mb-4">
                <FileText className="h-3.5 w-3.5 text-blue-400" />
                <span className="text-xs text-blue-300 font-medium uppercase tracking-wider">What You&apos;ll Experience</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Reading Features Built for You
              </h2>
              <p className="mt-4 text-white/50 max-w-2xl mx-auto text-base">
                Our AI-powered reading assessment is designed to mirror real-world English reading challenges, preparing you for success in any academic or professional environment.
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
                  <p className="text-sm text-white/50 leading-relaxed">{feature.desc}</p>
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
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 px-4 py-1.5 mb-4">
                <Play className="h-3.5 w-3.5 text-blue-400" />
                <span className="text-xs text-blue-300 font-medium uppercase tracking-wider">Simple Process</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                How It Works
              </h2>
              <p className="mt-4 text-white/50 max-w-2xl mx-auto text-base">
                Our streamlined assessment process gets you from reading to results in three simple steps.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <AnimatedSection key={index} delay={index * 150}>
                <div className="glass-card p-6 h-full text-center group relative">
                  <div className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#3b82f6] text-white text-xs font-bold shadow-lg shadow-blue-500/30">
                    {step.step}
                  </div>
                  <div className={`flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-gradient-to-br ${step.gradient} text-white shadow-lg mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    {step.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{step.desc}</p>
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
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 px-4 py-1.5 mb-4">
                <Eye className="h-3.5 w-3.5 text-blue-400" />
                <span className="text-xs text-blue-300 font-medium uppercase tracking-wider">Sample Questions</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                See What to Expect
              </h2>
              <p className="mt-4 text-white/50 max-w-2xl mx-auto text-base">
                Preview the types of reading passages and questions you will encounter during the assessment. Each level features progressively more complex texts and deeper comprehension challenges.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid gap-6 max-w-4xl mx-auto">
            {/* A2 Example */}
            <AnimatedSection delay={100}>
              <div className="glass-card p-6 group">
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold border border-green-500/30">A2</span>
                  <h3 className="text-white font-semibold">Everyday Communication</h3>
                </div>
                <div className="rounded-xl bg-white/[0.03] border border-white/5 p-5 mb-4">
                  <p className="text-white/70 text-sm leading-relaxed italic">
                    &ldquo;Dear Sarah, I wanted to let you know that our office holiday party will be held on Friday, December 15th, from 6 PM to 10 PM at the Grand Hotel downtown. Please bring a dish from your country to share. RSVP by December 10th. Looking forward to seeing you there! — Maria, HR Department&rdquo;
                  </p>
                </div>
                <div className="space-y-3">
                  <p className="text-white/50 text-sm font-medium">Where will the party take place?</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { text: 'At the office', correct: false },
                      { text: 'At the Grand Hotel', correct: true },
                      { text: 'At Maria\'s house', correct: false },
                      { text: 'At a restaurant', correct: false },
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
                  <h3 className="text-white font-semibold">Analytical Comprehension</h3>
                </div>
                <div className="rounded-xl bg-white/[0.03] border border-white/5 p-5 mb-4">
                  <p className="text-white/70 text-sm leading-relaxed italic">
                    &ldquo;The rapid urbanization of the 21st century has created unprecedented challenges for city planners worldwide. By 2050, an estimated 68% of the global population will reside in urban areas, up from 55% today. This demographic shift demands innovative approaches to housing, transportation, and resource management. While some cities embrace vertical growth and smart infrastructure, others prioritize green spaces and community-centered design. The tension between density and livability remains a central debate in urban planning circles.&rdquo;
                  </p>
                </div>
                <div className="space-y-3">
                  <p className="text-white/50 text-sm font-medium">What is the main tension discussed in the passage?</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { text: 'Between urban and rural populations', correct: false },
                      { text: 'Between density and livability', correct: true },
                      { text: 'Between smart and traditional infrastructure', correct: false },
                      { text: 'Between housing costs and wages', correct: false },
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
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold border border-indigo-500/30">C1</span>
                  <h3 className="text-white font-semibold">Inference &amp; Authorial Intent</h3>
                </div>
                <div className="rounded-xl bg-white/[0.03] border border-white/5 p-5 mb-4">
                  <p className="text-white/70 text-sm leading-relaxed italic">
                    &ldquo;It would be a profound mistake to interpret the author&rsquo;s restrained prose as detachment. Rather, the deliberate withholding of emotional commentary functions as a mirror, forcing the reader to supply their own moral framework. In this sense, silence becomes the most powerful rhetorical device — one that implicated the audience far more effectively than any explicit condemnation could.&rdquo;
                  </p>
                </div>
                <div className="space-y-3">
                  <p className="text-white/50 text-sm font-medium">What does the author suggest about the writer&rsquo;s &ldquo;restrained prose&rdquo;?</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { text: 'It shows a lack of engagement with the topic', correct: false },
                      { text: 'It is a deliberate strategy to involve the reader', correct: true },
                      { text: 'It reflects the writer\'s uncertainty', correct: false },
                      { text: 'It makes the text inaccessible to most readers', correct: false },
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
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb orb-violet w-[400px] h-[400px] -top-20 right-1/4 animate-float-slow opacity-15" />
          <div className="orb orb-blue w-[300px] h-[300px] bottom-0 left-1/4 animate-float-reverse opacity-15" />
        </div>

        <div className="container relative mx-auto px-4 text-center">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto">
              <div className="glass-card p-10 md:p-14">
                <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-6 animate-pulse-glow">
                  <BookOpen className="h-4 w-4 text-blue-300" />
                  <span className="text-sm text-blue-200 font-medium">Reading Assessment</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Ready to Test Your <span className="text-blue-400">Reading</span>?
                </h2>
                <p className="text-lg text-white/50 max-w-xl mx-auto mb-8">
                  Discover how well you understand written English. Our AI-powered assessment adapts to your level and provides detailed feedback on your reading comprehension skills.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {isAuth ? (
                    isPaidPlan(user?.plan) ? (
                      <Link href="/test">
                        <button className="group flex items-center gap-2 rounded-xl px-8 py-3.5 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold text-base transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-1 cursor-pointer">
                          Start Reading Test
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </button>
                      </Link>
                    ) : (
                      <>
                        <Link href="/pricing">
                          <button className="group flex items-center gap-2 rounded-xl px-8 py-3.5 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold text-base transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-1 cursor-pointer">
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
                        <button className="group flex items-center gap-2 rounded-xl px-8 py-3.5 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold text-base transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-1 cursor-pointer">
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
