'use client';

import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { useAuthStore } from '@/lib/auth-store';
import {
  UserPlus,
  CreditCard,
  Play,
  Brain,
  FileCheck,
  Download,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useEffect } from 'react';
import { useHydrated } from '@/hooks/use-hydrated';

const steps = [
  {
    number: 1,
    title: 'Create Account',
    description:
      'Register for free with just your email. Takes less than 30 seconds.',
    icon: UserPlus,
    gradient: 'from-blue-400 to-cyan-400',
  },
  {
    number: 2,
    title: 'Choose Your Plan',
    description:
      'Select Free or Premium access. Premium unlocks all 6 skills and certified results.',
    icon: CreditCard,
    gradient: 'from-purple-400 to-pink-400',
  },
  {
    number: 3,
    title: 'Start Assessment',
    description:
      'Begin your AI-powered test covering grammar, vocabulary, reading, and more.',
    icon: Play,
    gradient: 'from-green-400 to-emerald-400',
  },
  {
    number: 4,
    title: 'AI Evaluation',
    description:
      'Our advanced AI analyzes your responses across all skill areas in real-time.',
    icon: Brain,
    gradient: 'from-amber-400 to-orange-400',
  },
  {
    number: 5,
    title: 'Get Certified',
    description:
      'Receive your CEFR level (A1-C2) with a detailed skill breakdown.',
    icon: FileCheck,
    gradient: 'from-violet-400 to-purple-400',
  },
  {
    number: 6,
    title: 'Download Certificate',
    description:
      'Get your QR-verified PDF certificate, shareable with employers and institutions.',
    icon: Download,
    gradient: 'from-rose-400 to-red-400',
  },
];

export default function QuickTourPage() {
  const { isAuthenticated } = useAuthStore();
  const mounted = useHydrated();
  const isAuth = mounted && isAuthenticated;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = document.querySelectorAll('.scroll-animate');
    elements.forEach((el) => {
      observer.observe(el);
      // Immediately mark as visible if already in viewport on mount
      if (el.getBoundingClientRect().top < window.innerHeight) {
        el.classList.add('visible');
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative dark-section overflow-hidden">
        {/* Floating Background Orbs */}
        <div className="orb orb-purple w-96 h-96 top-[-10%] left-[10%] animate-float opacity-20" />
        <div className="orb orb-pink w-80 h-80 top-[20%] right-[5%] animate-float-slow opacity-15" />
        <div className="orb orb-blue w-64 h-64 bottom-[10%] left-[30%] animate-float-reverse opacity-10" />

        <div className="hero-pattern noise-overlay relative">
          <div className="container mx-auto px-4 py-24 sm:py-32 text-center relative z-10">
            {/* Badge */}
            <div className="scroll-animate inline-flex items-center gap-2 rounded-full glass-light px-4 py-1.5 mb-8">
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span className="text-sm font-medium text-white/80">
                How It Works
              </span>
            </div>

            {/* Title */}
            <h1 className="scroll-animate text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Your Path to{' '}
              CEFR Certification
            </h1>

            {/* Description */}
            <p className="scroll-animate text-lg sm:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
              Our simple 6-step process takes you from sign-up to a
              QR-verified certificate recognized by employers and institutions
              worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider" />

      {/* Steps Section */}
      <section className="relative bg-[#0F0A1E] py-20 sm:py-28 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid gap-6 lg:grid-cols-2">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="scroll-animate glass-card p-6 sm:p-8 flex items-start gap-5"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {/* Step Number Circle */}
                  <div
                    className={`shrink-0 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${step.gradient} shadow-lg`}
                  >
                    <span className="text-white font-bold text-lg">
                      {step.number}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <Icon
                        className={`h-5 w-5 bg-gradient-to-r ${step.gradient} bg-clip-text`}
                        style={{ color: 'rgba(255,255,255,0.8)' }}
                      />
                      <h3 className="text-lg font-semibold text-white">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-white/60 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider" />

      {/* CTA Section */}
      <section className="relative bg-[#0F0A1E] py-20 sm:py-28 overflow-hidden">
        <div className="orb orb-purple w-72 h-72 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 animate-float" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="scroll-animate glass-card p-8 sm:p-12 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Begin?
            </h2>
            <p className="text-white/60 text-lg mb-8 max-w-lg mx-auto">
              Start your CEFR certification journey today. It only takes a
              minute to create your free account.
            </p>
            <Link
              href={isAuth ? '/dashboard' : '/register'}
            >
              <button className="inline-flex items-center gap-2 rounded-xl px-8 py-3.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white text-base font-semibold transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 cursor-pointer">
                {isAuth ? 'Go to Dashboard' : 'Create Free Account'}
                <ArrowRight className="h-5 w-5" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
