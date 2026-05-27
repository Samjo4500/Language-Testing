'use client';

import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { useAuthStore } from '@/lib/auth-store';
import { isPaidPlan } from '@/lib/plan-utils';
import {
  Mic, ArrowRight, Brain, AudioWaveform, MessageSquareText,
  Activity, CirclePlay, Cpu, ClipboardCheck, Sparkles
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

/* Floating background orbs for hero */
function BackgroundOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Main purple orb */}
      <div className="orb orb-purple w-[500px] h-[500px] -top-32 -left-32 animate-float-slow opacity-15" />
      {/* Blue orb */}
      <div className="orb orb-blue w-[350px] h-[350px] top-1/4 -right-16 animate-float opacity-15" />
      {/* Small accent orbs */}
      <div className="absolute top-1/3 left-2/3 w-2 h-2 rounded-full bg-blue-400/20 animate-float delay-300" />
      <div className="absolute top-2/3 right-1/4 w-1.5 h-1.5 rounded-full bg-blue-400/15 animate-float-slow delay-500" />
      <div className="absolute bottom-1/4 left-1/4 w-2.5 h-2.5 rounded-full bg-violet-300/15 animate-float delay-200" />
    </div>
  );
}

export default function SpeakingPage() {
  const { isAuthenticated, user } = useAuthStore();
  const mounted = useHydrated();
  const isAuth = mounted && isAuthenticated;

  return (
    <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
      <Navbar />

      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden dark-section hero-pattern noise-overlay">
        <BackgroundOrbs />

        <div className="container relative mx-auto px-4 py-24 md:py-36">
          <div className="mx-auto max-w-4xl text-center">
            {/* Speaking Assessment Badge - floating animation */}
            <div className="animate-float inline-flex items-center gap-2 rounded-full glass-light px-5 py-2 mb-8 animate-border-glow">
              <Mic className="h-4 w-4 text-purple-300" />
              <span className="text-sm text-purple-200 font-medium">Speaking Assessment</span>
              <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            </div>

            {/* Headline with gradient text */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1] animate-slide-up">
              Perfect Your English
              <br />
              Speaking Skills
            </h1>

            {/* Subheadline */}
            <p className="mt-6 text-lg md:text-xl text-white/60 leading-relaxed max-w-2xl mx-auto animate-fade-in delay-300">
              Our AI-powered speaking assessment uses advanced speech recognition to evaluate your pronunciation, fluency, and coherence. Speak naturally and receive instant, detailed feedback on your English speaking proficiency.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-scale-in delay-500">
              {isAuth ? (
                isPaidPlan(user?.plan) ? (
                  <Link href="/test">
                    <button className="group flex w-full sm:w-auto items-center gap-2 rounded-xl px-8 py-3.5 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold text-base transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-1 cursor-pointer">
                      Start Speaking Test
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
                      Start Speaking Test
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
                <Brain className="h-3.5 w-3.5 text-purple-400" />
                <span className="text-xs text-purple-300 font-medium uppercase tracking-wider">Advanced AI Technology</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Speaking Assessment Features
              </h2>
              <p className="mt-4 text-white/50 max-w-2xl mx-auto text-base">
                Our cutting-edge AI technology provides comprehensive speaking evaluation that goes beyond simple pronunciation checks.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid gap-5 sm:grid-cols-2 max-w-4xl mx-auto">
            {[
              {
                icon: <AudioWaveform className="h-6 w-6" />,
                title: 'AI Speech Recognition',
                desc: 'Advanced neural networks transcribe and analyze your speech in real-time, capturing every nuance of your pronunciation and intonation patterns.',
                gradient: 'from-purple-500 to-indigo-500',
              },
              {
                icon: <Mic className="h-6 w-6" />,
                title: 'Pronunciation Scoring',
                desc: 'Receive precise scores for individual phonemes, word stress, and sentence-level intonation, mapped to CEFR proficiency descriptors.',
                gradient: 'from-pink-500 to-rose-500',
              },
              {
                icon: <Activity className="h-6 w-6" />,
                title: 'Fluency Analysis',
                desc: 'Our AI measures speaking rate, pauses, hesitations, and self-corrections to assess your fluency and natural rhythm in English conversation.',
                gradient: 'from-violet-500 to-purple-500',
              },
              {
                icon: <MessageSquareText className="h-6 w-6" />,
                title: 'Real-Time Feedback',
                desc: 'Get instant visual and textual feedback as you speak, with highlighted areas for improvement and suggestions for more natural expression.',
                gradient: 'from-violet-500 to-purple-500',
              },
            ].map((feature, index) => (
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

      {/* ===== HOW IT WORKS SECTION ===== */}
      <section className="relative py-20 md:py-28 dark-section hero-pattern noise-overlay">
        <div className="container relative mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                <CirclePlay className="h-3.5 w-3.5 text-purple-400" />
                <span className="text-xs text-purple-300 font-medium uppercase tracking-wider">Simple Process</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                How It Works
              </h2>
              <p className="mt-4 text-white/50 max-w-2xl mx-auto text-base">
                Our speaking assessment is designed to be intuitive and straightforward. Follow three simple steps to receive your comprehensive evaluation.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {[
              {
                step: '01',
                icon: <Mic className="h-7 w-7" />,
                title: 'Record Your Voice',
                desc: 'Read prompts and answer questions using your microphone. Our interface guides you through various speaking tasks designed for your target CEFR level.',
                gradient: 'from-amber-500 to-amber-600',
              },
              {
                step: '02',
                icon: <Cpu className="h-7 w-7" />,
                title: 'AI Analyzes Speech',
                desc: 'Our advanced AI processes your audio in real-time, evaluating pronunciation accuracy, fluency patterns, grammatical structures, and vocabulary usage.',
                gradient: 'from-[#7c5cff] to-[#6d4ddb]',
              },
              {
                step: '03',
                icon: <ClipboardCheck className="h-7 w-7" />,
                title: 'Get Detailed Feedback',
                desc: 'Receive a comprehensive report with your CEFR speaking level, pronunciation scores, fluency metrics, and personalized recommendations for improvement.',
                gradient: 'from-violet-500 to-indigo-500',
              },
            ].map((item, index) => (
              <AnimatedSection key={index} delay={index * 150}>
                <div className="glass-card p-6 h-full text-center group relative">
                  {/* Step number */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-[#3b82f6] text-white text-xs font-bold shadow-lg shadow-blue-500/30">
                      {item.step}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} text-white shadow-lg mx-auto mb-5 mt-3 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    {item.icon}
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-white/45 leading-relaxed">{item.desc}</p>

                  {/* Connector line for desktop */}
                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-px bg-gradient-to-r from-white/20 to-transparent" />
                  )}
                </div>
              </AnimatedSection>
            ))}
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
                <Mic className="h-3.5 w-3.5 text-purple-400" />
                <span className="text-xs text-purple-300 font-medium uppercase tracking-wider">Sample Prompts</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Speaking Practice Examples
              </h2>
              <p className="mt-4 text-white/50 max-w-2xl mx-auto text-base">
                Preview the types of speaking tasks you will encounter during the assessment. Each prompt is designed to evaluate different aspects of your spoken English proficiency.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid gap-6 max-w-4xl mx-auto">
            {/* A2 Example */}
            <AnimatedSection delay={100}>
              <div className="glass-card p-6 group">
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold border border-green-500/30">A2</span>
                  <h3 className="text-white font-semibold">Introduce Yourself</h3>
                </div>
                <div className="rounded-xl bg-white/[0.03] border border-white/5 p-5 mb-4">
                  <p className="text-white/70 text-sm leading-relaxed">
                    <span className="text-purple-400 font-medium">Prompt:</span> Record yourself introducing who you are. Talk about your name, where you live, what you do, and one hobby you enjoy. Speak for 30&ndash;60 seconds.
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-white/40 text-xs font-medium uppercase tracking-wider">What the AI evaluates:</p>
                  <div className="flex flex-wrap gap-2">
                    {['Basic pronunciation clarity', 'Simple sentence formation', 'Personal vocabulary', 'Speaking pace & rhythm'].map((skill, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-green-500/10 text-green-300 text-xs border border-green-500/20">{skill}</span>
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
                  <h3 className="text-white font-semibold">Express &amp; Defend an Opinion</h3>
                </div>
                <div className="rounded-xl bg-white/[0.03] border border-white/5 p-5 mb-4">
                  <p className="text-white/70 text-sm leading-relaxed">
                    <span className="text-purple-400 font-medium">Prompt:</span> Some cities have banned cars from their city centers to reduce pollution and congestion. Do you think this is a good idea? Give reasons for your opinion and address potential counterarguments. Speak for 1&ndash;2 minutes.
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-white/40 text-xs font-medium uppercase tracking-wider">What the AI evaluates:</p>
                  <div className="flex flex-wrap gap-2">
                    {['Argument coherence', 'Grammar accuracy in complex sentences', 'Natural intonation & stress', 'Hesitation & fillers', 'Vocabulary precision'].map((skill, i) => (
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
                  <h3 className="text-white font-semibold">Abstract Topic Discussion</h3>
                </div>
                <div className="rounded-xl bg-white/[0.03] border border-white/5 p-5 mb-4">
                  <p className="text-white/70 text-sm leading-relaxed">
                    <span className="text-purple-400 font-medium">Prompt:</span> Discuss the following statement: &ldquo;The measure of a civilization is how it treats its most vulnerable members.&rdquo; Explore different interpretations of this idea, provide concrete examples from your knowledge, and explain whether you agree or disagree. Speak for 2&ndash;3 minutes.
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-white/40 text-xs font-medium uppercase tracking-wider">What the AI evaluates:</p>
                  <div className="flex flex-wrap gap-2">
                    {['Sophisticated argumentation', 'Abstract vocabulary & idioms', 'Nuanced intonation & emphasis', 'Fluency with complex ideas', 'Rhetorical structure', 'Spontaneous cohesion'].map((skill, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-red-500/10 text-red-300 text-xs border border-red-500/20">{skill}</span>
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
      <section className="relative py-20 md:py-28 bg-[#0F0A1E] overflow-hidden">
        {/* Background orbs for CTA */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb orb-purple w-[400px] h-[400px] -top-20 right-1/4 animate-float-slow opacity-15" />
          <div className="orb orb-blue w-[300px] h-[300px] bottom-0 left-1/4 animate-float opacity-15" />
        </div>

        <div className="container relative mx-auto px-4 text-center">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto">
              <div className="glass-card p-10 md:p-14">
                <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-6 animate-pulse-glow">
                  <Sparkles className="h-4 w-4 text-purple-300" />
                  <span className="text-sm text-purple-200 font-medium">Speaking Assessment</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Ready to Test Your <span className="gradient-text-static">Speaking</span>?
                </h2>
                <p className="text-lg text-white/50 max-w-xl mx-auto mb-8">
                  Discover your English speaking proficiency level with our AI-powered assessment. Get detailed feedback on pronunciation, fluency, and coherence in minutes.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {isAuth ? (
                    isPaidPlan(user?.plan) ? (
                      <Link href="/test">
                        <button className="group flex w-full sm:w-auto items-center gap-2 rounded-xl px-8 py-3.5 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold text-base transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-1 cursor-pointer">
                          Start Speaking Test
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
