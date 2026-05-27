'use client';

import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import {
  HelpCircle, ChevronDown, MessageCircle, CreditCard, GitCompare, BookOpen,
  ArrowRight, Mail, Sparkles
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

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
      <div className="orb orb-violet w-[500px] h-[500px] -top-32 -left-32 animate-float-slow" />
      <div className="orb orb-violet w-[350px] h-[350px] top-1/3 -right-16 animate-float-reverse" />
      <div className="orb orb-blue w-[250px] h-[250px] bottom-16 left-1/4 animate-float" />
      <div className="absolute top-1/4 left-1/2 w-2 h-2 rounded-full bg-violet-400/40 animate-float delay-200" />
      <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 rounded-full bg-blue-400/30 animate-float-reverse delay-500" />
      <div className="absolute bottom-1/3 left-1/3 w-2.5 h-2.5 rounded-full bg-blue-400/30 animate-float delay-300" />
    </div>
  );
}

/* FAQ item data */
interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  title: string;
  icon: React.ReactNode;
  gradient: string;
  items: FAQItem[];
}

const faqCategories: FAQCategory[] = [
  {
    title: 'General Questions',
    icon: <BookOpen className="h-5 w-5" />,
    gradient: 'from-blue-400 to-violet-400',
    items: [
      {
        question: 'Is TestCEFR really free?',
        answer: 'Yes, you get 1 free test credit on signup. The free test includes all 6 skills (grammar, vocabulary, reading, listening, speaking, writing) and a full CEFR level result. Premium plans offer additional tests and PDF certificates with QR verification.',
      },
      {
        question: 'How accurate is the AI scoring?',
        answer: 'Our AI evaluates responses across 6 CEFR skills using advanced natural language processing. The assessment is designed for self-evaluation, practice, and supplemental proof of proficiency. While not a replacement for high-stakes exams like IELTS or TOEFL, it provides a reliable indication of your CEFR level.',
      },
      {
        question: 'Is the certificate accepted by universities/employers?',
        answer: 'Our certificates include QR verification and a detailed skills breakdown. Acceptance depends on the institution. Many organizations accept it as supplementary proof of English proficiency, especially for screening, placement, and internal assessments. For visa or official purposes, we recommend confirming with the receiving institution.',
      },
      {
        question: 'How long does the test take?',
        answer: 'The full assessment takes approximately 30–45 minutes and covers all 6 CEFR skills. You can pause and resume within 24 hours. The speaking section takes about 10 minutes.',
      },
    ],
  },
  {
    title: 'Assessment & Results',
    icon: <MessageCircle className="h-5 w-5" />,
    gradient: 'from-blue-400 to-cyan-400',
    items: [
      {
        question: 'Can I retake the test?',
        answer: 'Yes, you can retake the test as many times as you like. Each retake requires a test credit (included in your plan). Your best result is always available on your dashboard.',
      },
      {
        question: 'What happens to my voice recording?',
        answer: 'Your audio is encrypted and used solely for your speaking assessment. It is retained for 30 days for quality assurance, then permanently deleted. We never use your recordings for AI training or share them with third parties.',
      },
      {
        question: "What's the difference between Free and Premium?",
        answer: 'Free gives you 1 test with full results. Premium ($29.99) gives you 3 test credits plus PDF certificates with QR verification. Pro ($49.99) gives you 6 credits with priority support and detailed analytics.',
      },
    ],
  },
  {
    title: 'Payments & Policies',
    icon: <CreditCard className="h-5 w-5" />,
    gradient: 'from-green-400 to-emerald-400',
    items: [
      {
        question: 'Do you offer refunds?',
        answer: 'Yes, we offer a full refund within 14 days of purchase if you haven\'t completed any assessments using the purchased credits. For technical issues that prevent you from completing the assessment, we offer a 30-day refund or free retake. Contact support@testcefr.com to request a refund.',
      },
      {
        question: 'How is the payment processed?',
        answer: 'During our preview period, all features are completely free. No payment is required to access any assessment or feature.',
      },
      {
        question: 'Can I use this for visa applications?',
        answer: 'TestCEFR certificates are supplementary proficiency evidence, not replacements for government-approved tests like IELTS, TOEFL, or Pearson PTE. For visa applications, please check the specific requirements of your destination country.',
      },
    ],
  },
  {
    title: 'Comparisons',
    icon: <GitCompare className="h-5 w-5" />,
    gradient: 'from-orange-400 to-amber-400',
    items: [
      {
        question: 'How is this different from IELTS/TOEFL?',
        answer: 'IELTS and TOEFL are high-stakes, proctored exams that cost $200-300 and are accepted for visas and university admissions worldwide. TestCEFR is a faster ($12.99), AI-powered assessment that evaluates all 6 CEFR skills including speaking. It\'s ideal for self-evaluation, practice, pre-screening, and situations where an official exam isn\'t required.',
      },
      {
        question: 'What CEFR levels do you test?',
        answer: 'We assess across all 6 CEFR levels: A1 (Beginner), A2 (Elementary), B1 (Intermediate), B2 (Upper Intermediate), C1 (Advanced), and C2 (Proficiency). Your results include a detailed breakdown by skill.',
      },
    ],
  },
];

/* Accordion FAQ Item Component */
function FAQAccordion({ item, index, isOpen, onToggle }: { item: FAQItem; index: number; isOpen: boolean; onToggle: () => void }) {
  return (
    <div
      className="glass-card overflow-hidden group"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left transition-colors duration-200 hover:bg-white/[0.02]"
        aria-expanded={isOpen}
      >
        <span className="text-base md:text-lg font-semibold text-white pr-4">
          {item.question}
        </span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-violet-400 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-5 md:px-6 pb-5 md:pb-6 pt-0">
          <div className="border-t border-white/10 pt-4">
            <p className="text-sm md:text-base text-white/50 leading-relaxed">
              {item.answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (key: string) => {
    setOpenItems(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
      <Navbar />

      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden dark-section hero-pattern noise-overlay">
        <BackgroundOrbs />

        <div className="container relative mx-auto px-4 py-24 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="animate-float inline-flex items-center gap-2 rounded-full glass-light px-5 py-2 mb-8 animate-border-glow">
              <HelpCircle className="h-4 w-4 text-violet-300" />
              <span className="text-sm text-violet-200 font-medium">Got Questions?</span>
              <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1] animate-slide-up">
              Frequently Asked{' '}
              Questions
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-lg md:text-xl text-white/60 leading-relaxed max-w-2xl mx-auto animate-fade-in delay-300">
              Everything you need to know about TestCEFR — from how our AI assessments work to pricing, certificates, and more.
            </p>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0F0A1E] to-transparent" />
      </section>

      {/* ===== FAQ SECTIONS BY CATEGORY ===== */}
      {faqCategories.map((category, catIndex) => (
        <section
          key={category.title}
          className={`relative py-16 md:py-20 ${
            catIndex % 2 === 1 ? 'dark-section-alt hero-pattern noise-overlay' : 'bg-[#0F0A1E]'
          }`}
        >
          {catIndex % 2 === 0 && catIndex > 0 && (
            <div className="section-divider max-w-4xl mx-auto absolute top-0 left-1/2 -translate-x-1/2" />
          )}
          <div className={`container relative mx-auto px-4 ${catIndex % 2 === 0 && catIndex > 0 ? 'pt-4' : ''}`}>
            <div className="max-w-3xl mx-auto">
              {/* Category Header */}
              <AnimatedSection>
                <div className="text-center mb-10">
                  <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                    <div className={`flex h-5 w-5 items-center justify-center rounded bg-gradient-to-br ${category.gradient} text-white`}>
                      {category.icon}
                    </div>
                    <span className="text-xs text-violet-300 font-medium uppercase tracking-wider">{category.title}</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white">
                    {category.title}
                  </h2>
                </div>
              </AnimatedSection>

              {/* FAQ Items */}
              <div className="space-y-4">
                {category.items.map((item, itemIndex) => {
                  const key = `${catIndex}-${itemIndex}`;
                  return (
                    <AnimatedSection key={key} delay={itemIndex * 80}>
                      <FAQAccordion
                        item={item}
                        index={itemIndex}
                        isOpen={openItems.has(key)}
                        onToggle={() => toggleItem(key)}
                      />
                    </AnimatedSection>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* ===== CTA SECTION ===== */}
      <section className="relative py-16 md:py-20 dark-section overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb orb-violet w-[400px] h-[400px] -top-20 right-1/4 animate-float-slow" />
          <div className="orb orb-violet w-[300px] h-[300px] bottom-0 left-1/4 animate-float-reverse" />
        </div>
        <div className="container relative mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <AnimatedSection>
              <div className="glass-card p-8 md:p-10 text-center">
                <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg mb-6">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Still Have <span className="text-blue-400">Questions?</span>
                </h2>
                <p className="text-white/50 mb-8 leading-relaxed">
                  Can&apos;t find the answer you&apos;re looking for? Feel free to reach out to our support team or get started with a free assessment today.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 rounded-xl px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold text-base transition-all duration-300 shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
                  >
                    Get Started Free
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 rounded-xl px-8 py-3.5 glass hover:bg-white/10 text-white font-semibold text-base transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <Mail className="h-4 w-4" />
                    Contact Us
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
