'use client';

import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { useAuthStore } from '@/lib/auth-store';
import {
  BookOpen, Globe, FileText, BarChart3, ArrowRight,
  Play, Eye, CheckCircle2, TrendingUp,
  Sparkles, Users, Zap, Search, Languages
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
      <div className="orb orb-purple w-[600px] h-[600px] -top-40 -left-40 animate-float-slow" />
      <div className="orb orb-pink w-[400px] h-[400px] top-1/3 -right-20 animate-float-reverse" />
      <div className="orb orb-blue w-[300px] h-[300px] bottom-20 left-1/4 animate-float" />
      <div className="absolute top-1/4 left-1/2 w-2 h-2 rounded-full bg-purple-400/40 animate-float delay-200" />
      <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 rounded-full bg-pink-400/30 animate-float-reverse delay-500" />
      <div className="absolute bottom-1/3 left-1/3 w-2.5 h-2.5 rounded-full bg-blue-400/30 animate-float delay-300" />
    </div>
  );
}

export default function ReadingPage() {
  const { isAuthenticated, user } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const isAuth = mounted && isAuthenticated;

  const features = [
    {
      icon: <FileText className="h-6 w-6" />,
      title: 'Diverse Text Types',
      desc: 'Read everything from short emails and news headlines to academic papers and literary extracts — each text carefully selected to test specific comprehension skills at your level.',
      gradient: 'from-purple-500 to-indigo-500',
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: 'Authentic Materials',
      desc: 'Engage with real-world English texts drawn from newspapers, workplace documents, academic journals, and everyday communications to prepare you for real-life reading challenges.',
      gradient: 'from-pink-500 to-rose-500',
    },
    {
      icon: <Search className="h-6 w-6" />,
      title: 'Skimming & Scanning',
      desc: 'Develop essential reading strategies through exercises that test your ability to quickly locate key information, identify main ideas, and understand text structure efficiently.',
      gradient: 'from-cyan-400 to-blue-500',
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: 'Progressive Difficulty',
      desc: 'Questions adapt from A1 beginner level through C2 mastery, automatically calibrating to challenge your current reading comprehension level with increasing text complexity.',
      gradient: 'from-green-400 to-emerald-500',
    },
  ];

  const steps = [
    {
      icon: <BookOpen className="h-7 w-7" />,
      title: 'Read the Passage',
      desc: 'Engage with carefully curated reading passages featuring authentic English texts. Each passage is designed to test specific comprehension skills at your CEFR level.',
      step: '01',
      gradient: 'from-purple-500 to-indigo-500',
    },
    {
      icon: <Eye className="h-7 w-7" />,
      title: 'Answer Questions',
      desc: 'Respond to comprehension questions that evaluate your understanding of main ideas, specific details, inference, and the author\'s purpose and tone.',
      step: '02',
      gradient: 'from-pink-500 to-rose-500',
    },
    {
      icon: <CheckCircle2 className="h-7 w-7" />,
      title: 'Get Your Score',
      desc: 'Receive an instant CEFR-aligned reading score with detailed analytics on your strengths, weaknesses, and personalized improvement recommendations.',
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
              <BookOpen className="h-4 w-4 text-purple-300" />
              <span className="text-sm text-purple-200 font-medium">Reading Assessment</span>
              <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1] animate-slide-up">
              Master English
              <br />
              <span className="gradient-text">Reading Skills</span>
            </h1>

            {/* Description */}
            <p className="mt-6 text-lg md:text-xl text-white/60 leading-relaxed max-w-2xl mx-auto animate-fade-in delay-300">
              Strengthen your comprehension with AI-powered reading assessments. From short messages to complex academic texts, our adaptive system evaluates your ability to understand written English across all CEFR levels.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-scale-in delay-500">
              {isAuth ? (
                user?.plan === 'premium' ? (
                  <Link href="/test">
                    <button className="group flex items-center gap-2 rounded-xl px-8 py-3.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold text-base transition-all duration-300 shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-1 cursor-pointer">
                      Start Reading Test
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </Link>
                ) : (
                  <>
                    <Link href="/pricing">
                      <button className="group flex items-center gap-2 rounded-xl px-8 py-3.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold text-base transition-all duration-300 shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-1 cursor-pointer">
                        Get Premium Access
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </button>
                    </Link>
                    <Link href="/quick-tour">
                      <button className="glass-button rounded-xl px-8 py-3.5 text-white font-medium text-base cursor-pointer">
                        Quick Tour
                      </button>
                    </Link>
                  </>
                )
              ) : (
                <>
                  <Link href="/register">
                    <button className="group flex items-center gap-2 rounded-xl px-8 py-3.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold text-base transition-all duration-300 shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-1 cursor-pointer">
                      Start Reading Test
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </Link>
                  <Link href="/quick-tour">
                    <button className="glass-button rounded-xl px-8 py-3.5 text-white font-medium text-base cursor-pointer">
                      Quick Tour
                    </button>
                  </Link>
                </>
              )}
            </div>

            {/* Quick stats */}
            <div className="mt-16 grid grid-cols-3 gap-4 max-w-lg mx-auto">
              <AnimatedSection delay={100}>
                <div className="glass-card p-4 text-center group">
                  <div className="flex justify-center mb-2 text-purple-400 group-hover:text-purple-300 transition-colors">
                    <Users className="h-5 w-5" />
                  </div>
                  <div className="text-xl font-bold text-white">5K+</div>
                  <div className="text-[11px] text-white/50">Tests Taken</div>
                </div>
              </AnimatedSection>
              <AnimatedSection delay={200}>
                <div className="glass-card p-4 text-center group">
                  <div className="flex justify-center mb-2 text-purple-400 group-hover:text-purple-300 transition-colors">
                    <Languages className="h-5 w-5" />
                  </div>
                  <div className="text-xl font-bold text-white">300+</div>
                  <div className="text-[11px] text-white/50">Passages</div>
                </div>
              </AnimatedSection>
              <AnimatedSection delay={300}>
                <div className="glass-card p-4 text-center group">
                  <div className="flex justify-center mb-2 text-purple-400 group-hover:text-purple-300 transition-colors">
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
              <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                <FileText className="h-3.5 w-3.5 text-purple-400" />
                <span className="text-xs text-purple-300 font-medium uppercase tracking-wider">What You&apos;ll Experience</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Reading Features <span className="gradient-text-static">Built for You</span>
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
                How It <span className="gradient-text-static">Works</span>
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
                  <div className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-500 text-white text-xs font-bold shadow-lg shadow-purple-500/30">
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
              <div className="flex-1 h-px bg-gradient-to-r from-purple-500/50 via-purple-400/30 to-pink-400/50" />
              <div className="flex-1 h-px bg-gradient-to-r from-pink-400/50 via-purple-400/30 to-purple-500/50" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="relative py-20 md:py-28 dark-section overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb orb-purple w-[400px] h-[400px] -top-20 right-1/4 animate-float-slow" />
          <div className="orb orb-pink w-[300px] h-[300px] bottom-0 left-1/4 animate-float-reverse" />
        </div>

        <div className="container relative mx-auto px-4 text-center">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto">
              <div className="glass-card p-10 md:p-14">
                <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-6 animate-pulse-glow">
                  <BookOpen className="h-4 w-4 text-purple-300" />
                  <span className="text-sm text-purple-200 font-medium">Reading Assessment</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Ready to Test Your <span className="gradient-text-static">Reading</span>?
                </h2>
                <p className="text-lg text-white/50 max-w-xl mx-auto mb-8">
                  Discover how well you understand written English. Our AI-powered assessment adapts to your level and provides detailed feedback on your reading comprehension skills.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {isAuth ? (
                    user?.plan === 'premium' ? (
                      <Link href="/test">
                        <button className="group flex items-center gap-2 rounded-xl px-8 py-3.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold text-base transition-all duration-300 shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-1 cursor-pointer">
                          Start Reading Test
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </button>
                      </Link>
                    ) : (
                      <>
                        <Link href="/pricing">
                          <button className="group flex items-center gap-2 rounded-xl px-8 py-3.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold text-base transition-all duration-300 shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-1 cursor-pointer">
                            Upgrade to Premium
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </button>
                        </Link>
                        <Link href="/quick-tour">
                          <button className="glass-button rounded-xl px-8 py-3.5 text-white font-medium text-base cursor-pointer">
                            Quick Tour
                          </button>
                        </Link>
                      </>
                    )
                  ) : (
                    <>
                      <Link href="/register">
                        <button className="group flex items-center gap-2 rounded-xl px-8 py-3.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold text-base transition-all duration-300 shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-1 cursor-pointer">
                          Create Free Account
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </button>
                      </Link>
                      <Link href="/pricing">
                        <button className="glass-button rounded-xl px-8 py-3.5 text-white font-medium text-base cursor-pointer">
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

      {/* ===== FOOTER ===== */}
      <footer className="relative bg-[#0A0618] border-t border-white/5 py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src="/logo-icon.svg" alt="CEFR Test" className="h-9 w-9" />
                <div className="flex flex-col">
                  <span className="text-white font-bold text-base">testcefr.com</span>
                  <span className="text-white/30 text-[9px] uppercase tracking-[0.2em]">English Assessment</span>
                </div>
              </div>
              <p className="text-sm text-white/40 leading-relaxed">
                AI-powered English proficiency assessment aligned with the CEFR framework. Trusted by learners worldwide.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Quick Links</h4>
              <div className="space-y-2.5">
                {[
                  { href: '/listening', label: 'Listening Test' },
                  { href: '/reading', label: 'Reading Test' },
                  { href: '/speaking', label: 'Speaking Test' },
                  { href: '/writing', label: 'Writing Test' },
                  { href: '/quick-tour', label: 'Quick Tour' },
                ].map((link) => (
                  <Link key={link.href} href={link.href} className="block text-sm text-white/40 hover:text-white/80 transition-colors">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Resources</h4>
              <div className="space-y-2.5">
                {[
                  { href: '/pricing', label: 'Pricing' },
                  { href: '/sample-certificate', label: 'Sample Certificate' },
                  { href: '/sample-report', label: 'Sample Report' },
                  { href: '/contact', label: 'Contact Us' },
                ].map((link) => (
                  <Link key={link.href} href={link.href} className="block text-sm text-white/40 hover:text-white/80 transition-colors">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Legal</h4>
              <div className="space-y-2.5">
                <Link href="/privacy" className="block text-sm text-white/40 hover:text-white/80 transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="block text-sm text-white/40 hover:text-white/80 transition-colors">Terms of Service</Link>
                <Link href="/verify" className="block text-sm text-white/40 hover:text-white/80 transition-colors">Verify Certificate</Link>
              </div>
            </div>
          </div>

          <div className="section-divider mt-10 mb-6" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/30">
              &copy; {new Date().getFullYear()} TestCEFR. All rights reserved.
            </p>
            <div className="flex items-center gap-1">
              <span className="text-xs text-white/30">Powered by</span>
              <span className="text-xs font-medium gradient-text-static">AI Precision</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
