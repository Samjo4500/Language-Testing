'use client';

import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import {
  Sparkles, Globe, Award, QrCode, Zap, Users, Target,
  BookOpen, BarChart3, Cpu, FileText, CreditCard,
  ArrowRight, CheckCircle2, Star, Mic, Headphones, PenTool,
  Shield, Clock
} from 'lucide-react';
import { useEffect, useRef } from 'react';

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
      <div className="orb orb-violet w-[600px] h-[600px] -top-40 -left-40 animate-float-slow" />
      <div className="orb orb-violet w-[400px] h-[400px] top-1/3 -right-20 animate-float-reverse" />
      <div className="orb orb-blue w-[300px] h-[300px] bottom-20 left-1/4 animate-float" />
      <div className="absolute top-1/4 left-1/2 w-2 h-2 rounded-full bg-violet-400/40 animate-float delay-200" />
      <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 rounded-full bg-blue-400/30 animate-float-reverse delay-500" />
      <div className="absolute bottom-1/3 left-1/3 w-2.5 h-2.5 rounded-full bg-blue-400/30 animate-float delay-300" />
    </div>
  );
}

/* Stat counter component */
function StatItem({ icon, value, label, delay }: { icon: React.ReactNode; value: string; label: string; delay: number }) {
  return (
    <AnimatedSection delay={delay}>
      <div className="glass-card p-6 text-center group">
        <div className="flex justify-center mb-3 text-violet-400 group-hover:text-violet-300 transition-colors">
          {icon}
        </div>
        <div className="text-3xl md:text-4xl font-bold text-white mb-1">{value}</div>
        <div className="text-sm text-white/50">{label}</div>
      </div>
    </AnimatedSection>
  );
}

export default function AboutPage() {
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
              <Sparkles className="h-4 w-4 text-violet-300" />
              <span className="text-sm text-violet-200 font-medium">Our Story</span>
              <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1] animate-slide-up">
              About{' '}
              TestCEFR
            </h1>

            {/* Description */}
            <p className="mt-6 text-lg md:text-xl text-white/60 leading-relaxed max-w-2xl mx-auto animate-fade-in delay-300">
              Democratizing English proficiency assessment through AI technology. We believe everyone deserves access to accurate, affordable, and internationally recognized language certification.
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0F0A1E] to-transparent" />
      </section>

      {/* ===== MISSION SECTION ===== */}
      <section className="relative py-16 md:py-20 bg-[#0F0A1E]">
        <div className="absolute inset-0 hero-pattern pointer-events-none" />
        <div className="container relative mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection>
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                  <Target className="h-3.5 w-3.5 text-violet-400" />
                  <span className="text-xs text-violet-300 font-medium uppercase tracking-wider">Our Mission</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Why We Exist
                </h2>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={100}>
              <div className="glass-card p-8 md:p-10 text-center">
                <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-xl mb-6">
                  <Globe className="h-7 w-7" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Democratizing English Proficiency Assessment Through AI Technology
                </h3>
                <p className="text-white/60 leading-relaxed max-w-2xl mx-auto text-base">
                  Traditional language assessments are expensive, slow, and inaccessible to millions of people worldwide. TestCEFR was created to change that — using cutting-edge artificial intelligence to deliver accurate CEFR-level assessments that are fast, affordable, and available to anyone with an internet connection.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <div className="section-divider max-w-4xl mx-auto" />

      {/* ===== WHAT WE DO SECTION ===== */}
      <section className="relative py-16 md:py-20 bg-[#0F0A1E]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection>
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                  <Zap className="h-3.5 w-3.5 text-violet-400" />
                  <span className="text-xs text-violet-300 font-medium uppercase tracking-wider">What We Do</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Our Platform
                </h2>
                <p className="mt-4 text-white/50 max-w-2xl mx-auto text-base">
                  TestCEFR combines advanced AI with the internationally recognized CEFR framework to deliver a complete English proficiency assessment experience.
                </p>
              </div>
            </AnimatedSection>

            <div className="grid gap-5 sm:grid-cols-3">
              {[
                {
                  icon: <Cpu className="h-6 w-6" />,
                  title: 'AI-Powered CEFR Testing',
                  desc: 'Our adaptive assessment engine uses Google Gemini AI to evaluate your English proficiency across six core skills with 98% accuracy, adjusting question difficulty in real-time based on your responses.',
                  gradient: 'from-violet-400 to-indigo-500',
                },
                {
                  icon: <Zap className="h-6 w-6" />,
                  title: 'Instant Results',
                  desc: 'No waiting days or weeks for your results. Receive your CEFR level, detailed skill breakdown, and personalized insights within moments of completing the assessment.',
                  gradient: 'from-blue-400 to-indigo-500',
                },
                {
                  icon: <QrCode className="h-6 w-6" />,
                  title: 'QR-Verified Certificates',
                  desc: 'Every certificate features a unique QR code linking to a public verification page. Employers and institutions can instantly validate the authenticity of your results.',
                  gradient: 'from-blue-400 to-cyan-500',
                },
              ].map((item, index) => (
                <AnimatedSection key={index} delay={index * 100}>
                  <div className="glass-card p-6 h-full group">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient} text-white shadow-lg mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                      {item.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-white/45 leading-relaxed">{item.desc}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== OUR STORY SECTION ===== */}
      <section className="relative py-16 md:py-20 dark-section-alt hero-pattern noise-overlay">
        <div className="container relative mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection>
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                  <BookOpen className="h-3.5 w-3.5 text-violet-400" />
                  <span className="text-xs text-violet-300 font-medium uppercase tracking-wider">Our Journey</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Our Story
                </h2>
              </div>
            </AnimatedSection>

            <div className="space-y-5">
              <AnimatedSection delay={100}>
                <div className="glass-card p-6 group">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-violet-400 text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                      <span className="text-sm font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">The Problem We Saw</h3>
                      <p className="text-sm text-white/50 leading-relaxed">
                        English proficiency testing has long been dominated by expensive, time-consuming exams that require travel to test centers and weeks of waiting for results. For students in developing countries, job seekers, and immigrants, these barriers make certification nearly impossible to access.
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={200}>
                <div className="glass-card p-6 group">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-cyan-400 text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                      <span className="text-sm font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">The Solution We Built</h3>
                      <p className="text-sm text-white/50 leading-relaxed">
                        We founded TestCEFR to make English assessment accessible worldwide. By leveraging Google&apos;s advanced Gemini AI, we created an adaptive testing platform that evaluates all six CEFR skills — grammar, vocabulary, reading, listening, speaking, and writing — in a single 30-45 minute session from any device.
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={300}>
                <div className="glass-card p-6 group">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-400 to-emerald-400 text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                      <span className="text-sm font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">The Impact We&apos;re Making</h3>
                      <p className="text-sm text-white/50 leading-relaxed">
                        Today, TestCEFR serves learners in over 120 countries, delivering accurate CEFR assessments with QR-verified certificates that are recognized by employers and educational institutions. Our AI continues to improve, ensuring the highest standards of assessment accuracy and fairness.
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider max-w-4xl mx-auto" />

      {/* ===== STATS SECTION ===== */}
      <section className="relative py-16 md:py-20 bg-[#0F0A1E]">
        <div className="absolute inset-0 hero-pattern pointer-events-none" />
        <div className="container relative mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection>
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                  <BarChart3 className="h-3.5 w-3.5 text-violet-400" />
                  <span className="text-xs text-violet-300 font-medium uppercase tracking-wider">By the Numbers</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Our Impact
                </h2>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatItem icon={<Users className="h-6 w-6" />} value="10K+" label="Tests Taken" delay={100} />
              <StatItem icon={<Globe className="h-6 w-6" />} value="120+" label="Countries" delay={200} />
              <StatItem icon={<Star className="h-6 w-6" />} value="98%" label="Accuracy" delay={300} />
              <StatItem icon={<CheckCircle2 className="h-6 w-6" />} value="6" label="Skills Assessed" delay={400} />
            </div>
          </div>
        </div>
      </section>

      {/* ===== 6 SKILLS SHOWCASE ===== */}
      <section className="relative py-16 md:py-20 dark-section-alt hero-pattern noise-overlay">
        <div className="container relative mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection>
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                  <Award className="h-3.5 w-3.5 text-violet-400" />
                  <span className="text-xs text-violet-300 font-medium uppercase tracking-wider">Comprehensive Evaluation</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  6 Skills Assessed
                </h2>
                <p className="mt-4 text-white/50 max-w-2xl mx-auto text-base">
                  Our platform evaluates every dimension of English proficiency, giving you a complete picture of your language abilities.
                </p>
              </div>
            </AnimatedSection>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: <BarChart3 className="h-5 w-5" />, skill: 'Grammar', gradient: 'from-violet-400 to-indigo-500' },
                { icon: <BookOpen className="h-5 w-5" />, skill: 'Vocabulary', gradient: 'from-blue-400 to-indigo-500' },
                { icon: <Globe className="h-5 w-5" />, skill: 'Reading', gradient: 'from-blue-400 to-cyan-500' },
                { icon: <Headphones className="h-5 w-5" />, skill: 'Listening', gradient: 'from-green-400 to-emerald-500' },
                { icon: <Mic className="h-5 w-5" />, skill: 'Speaking', gradient: 'from-orange-400 to-amber-500' },
                { icon: <PenTool className="h-5 w-5" />, skill: 'Writing', gradient: 'from-violet-400 to-violet-500' },
              ].map((item, index) => (
                <AnimatedSection key={index} delay={index * 80}>
                  <div className="glass-card p-5 flex items-center gap-4 group">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient} text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                      {item.icon}
                    </div>
                    <span className="text-white font-semibold text-base">{item.skill}</span>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider max-w-4xl mx-auto" />

      {/* ===== TECHNOLOGY SECTION ===== */}
      <section className="relative py-16 md:py-20 bg-[#0F0A1E]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection>
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                  <Cpu className="h-3.5 w-3.5 text-violet-400" />
                  <span className="text-xs text-violet-300 font-medium uppercase tracking-wider">Our Stack</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Powered by Technology
                </h2>
                <p className="mt-4 text-white/50 max-w-2xl mx-auto text-base">
                  We use best-in-class technologies to deliver reliable, accurate, and secure assessment experiences.
                </p>
              </div>
            </AnimatedSection>

            <div className="grid gap-5 sm:grid-cols-3">
              {[
                {
                  icon: <Sparkles className="h-6 w-6" />,
                  title: 'Google Gemini AI',
                  desc: 'Our assessment engine is powered by Google\'s state-of-the-art Gemini AI model, providing natural language understanding, speech recognition, and intelligent scoring with 98% accuracy across all CEFR levels.',
                  gradient: 'from-blue-400 to-indigo-500',
                },
                {
                  icon: <FileText className="h-6 w-6" />,
                  title: 'PDF Certificate Generation',
                  desc: 'Instant generation of professional PDF certificates with embedded QR codes for verification. Each certificate includes your name, CEFR level, skill breakdown, and a unique verification link.',
                  gradient: 'from-blue-400 to-violet-500',
                },
                {
                  icon: <CreditCard className="h-6 w-6" />,
                  title: 'Free Preview Access',
                  desc: 'All features are available for free during our preview period. No payment information is required — simply sign up and start learning.',
                  gradient: 'from-green-400 to-emerald-500',
                },
              ].map((item, index) => (
                <AnimatedSection key={index} delay={index * 100}>
                  <div className="glass-card p-6 h-full group">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient} text-white shadow-lg mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                      {item.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-white/45 leading-relaxed">{item.desc}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="relative py-20 md:py-28 dark-section overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb orb-violet w-[400px] h-[400px] -top-20 right-1/4 animate-float-slow" />
          <div className="orb orb-violet w-[300px] h-[300px] bottom-0 left-1/4 animate-float-reverse" />
        </div>

        <div className="container relative mx-auto px-4 text-center">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto">
              <div className="glass-card p-10 md:p-14">
                <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-6 animate-pulse-glow">
                  <Sparkles className="h-4 w-4 text-violet-300" />
                  <span className="text-sm text-violet-200 font-medium">Ready to Begin?</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Start Your <span className="text-blue-400">Assessment</span>
                </h2>
                <p className="text-lg text-white/50 max-w-xl mx-auto mb-8">
                  Join thousands of learners who have already discovered their CEFR level. It only takes 30-45 minutes to get your AI-powered English proficiency certificate.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/register">
                    <button className="group flex items-center justify-center gap-2 rounded-xl px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold text-base transition-all duration-300 shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-1 cursor-pointer w-full sm:w-auto">
                      Start Your Assessment
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </Link>
                  <Link href="/quick-tour">
                    <button className="glass-button rounded-xl px-8 py-3.5 text-white font-medium text-base cursor-pointer w-full sm:w-auto">
                      Take a Quick Tour
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
