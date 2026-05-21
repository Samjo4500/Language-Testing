'use client';

import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import {
  Scale, FileText, UserCheck, Award, CreditCard,
  Lightbulb, AlertTriangle, RefreshCcw, Mail, QrCode,
  CheckCircle2, Shield, Clock, Users, Sparkles
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
      <div className="orb orb-purple w-[500px] h-[500px] -top-32 -left-32 animate-float-slow" />
      <div className="orb orb-pink w-[350px] h-[350px] top-1/3 -right-16 animate-float-reverse" />
      <div className="orb orb-blue w-[250px] h-[250px] bottom-16 left-1/4 animate-float" />
      <div className="absolute top-1/4 left-1/2 w-2 h-2 rounded-full bg-purple-400/40 animate-float delay-200" />
      <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 rounded-full bg-pink-400/30 animate-float-reverse delay-500" />
      <div className="absolute bottom-1/3 left-1/3 w-2.5 h-2.5 rounded-full bg-blue-400/30 animate-float delay-300" />
    </div>
  );
}

export default function TermsPage() {
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
              <Scale className="h-4 w-4 text-purple-300" />
              <span className="text-sm text-purple-200 font-medium">Legal Agreement</span>
              <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1] animate-slide-up">
              Terms of{' '}
              <span className="gradient-text">Service</span>
            </h1>

            {/* Description */}
            <p className="mt-6 text-lg md:text-xl text-white/60 leading-relaxed max-w-2xl mx-auto animate-fade-in delay-300">
              By using TestCEFR, you agree to these terms. Please read them carefully to understand your rights and responsibilities.
            </p>
            <p className="mt-3 text-sm text-white/40 animate-fade-in delay-500">
              Last updated: March 4, 2026
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0F0A1E] to-transparent" />
      </section>

      {/* ===== ACCEPTANCE OF TERMS ===== */}
      <section className="relative py-16 md:py-20 bg-[#0F0A1E]">
        <div className="absolute inset-0 hero-pattern pointer-events-none" />
        <div className="container relative mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection>
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                  <FileText className="h-3.5 w-3.5 text-purple-400" />
                  <span className="text-xs text-purple-300 font-medium uppercase tracking-wider">Agreement</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Acceptance of <span className="gradient-text-static">Terms</span>
                </h2>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={100}>
              <div className="glass-card p-8">
                <p className="text-white/60 leading-relaxed text-base">
                  By accessing or using the TestCEFR platform at testcefr.com, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our services. These terms apply to all visitors, users, and others who access or use the platform.
                </p>
                <p className="text-white/60 leading-relaxed text-base mt-4">
                  We reserve the right to update or modify these terms at any time without prior notice. Your continued use of the platform after any such changes constitutes your acceptance of the new terms. We encourage you to review this page periodically for the latest information.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <div className="section-divider max-w-4xl mx-auto" />

      {/* ===== SERVICE DESCRIPTION ===== */}
      <section className="relative py-16 md:py-20 bg-[#0F0A1E]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection>
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                  <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                  <span className="text-xs text-purple-300 font-medium uppercase tracking-wider">Our Platform</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Service <span className="gradient-text-static">Description</span>
                </h2>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={100}>
              <div className="glass-card p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 text-white shadow-lg">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">AI-Powered CEFR Assessment</h3>
                    <p className="text-sm text-white/50 leading-relaxed">
                      TestCEFR is an AI-powered English proficiency assessment platform that evaluates your language skills across six core competencies — grammar, vocabulary, reading, listening, speaking, and writing — and assigns an internationally recognized CEFR level (A1 to C2). Upon successful completion, users receive a downloadable PDF certificate with a unique QR verification code.
                    </p>
                  </div>
                </div>
                <p className="text-white/60 leading-relaxed text-sm">
                  Our services are provided &quot;as is&quot; and we make no guarantees about the availability, accuracy, or reliability of the platform at any given time. We strive for 99.9% uptime but cannot guarantee uninterrupted access due to maintenance, updates, or circumstances beyond our control.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ===== USER ACCOUNTS ===== */}
      <section className="relative py-16 md:py-20 dark-section-alt hero-pattern noise-overlay">
        <div className="container relative mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection>
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                  <UserCheck className="h-3.5 w-3.5 text-purple-400" />
                  <span className="text-xs text-purple-300 font-medium uppercase tracking-wider">Account Management</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  User <span className="gradient-text-static">Accounts</span>
                </h2>
              </div>
            </AnimatedSection>

            <div className="grid gap-5 sm:grid-cols-3">
              {[
                {
                  icon: <Users className="h-5 w-5" />,
                  title: 'Registration',
                  desc: 'You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.',
                  gradient: 'from-purple-400 to-indigo-500',
                },
                {
                  icon: <Shield className="h-5 w-5" />,
                  title: 'Account Security',
                  desc: 'You must notify us immediately of any unauthorized use of your account. We are not liable for any loss or damage arising from your failure to protect your account credentials or from any unauthorized access.',
                  gradient: 'from-blue-400 to-cyan-500',
                },
                {
                  icon: <Award className="h-5 w-5" />,
                  title: 'Free vs Premium',
                  desc: 'Free accounts can access sample tests and limited features. Premium accounts unlock the full assessment, personalized certificate generation with QR verification, and detailed analytics across all six CEFR skills.',
                  gradient: 'from-green-400 to-emerald-500',
                },
              ].map((item, index) => (
                <AnimatedSection key={index} delay={index * 100}>
                  <div className="glass-card p-6 h-full group">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient} text-white shadow-lg mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
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

      <div className="section-divider max-w-4xl mx-auto" />

      {/* ===== ASSESSMENT & CERTIFICATES ===== */}
      <section className="relative py-16 md:py-20 bg-[#0F0A1E]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection>
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                  <Award className="h-3.5 w-3.5 text-purple-400" />
                  <span className="text-xs text-purple-300 font-medium uppercase tracking-wider">Assessment Details</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Assessment & <span className="gradient-text-static">Certificates</span>
                </h2>
              </div>
            </AnimatedSection>

            <div className="space-y-5">
              {[
                {
                  icon: <CheckCircle2 className="h-5 w-5" />,
                  title: 'Assessment Methodology',
                  desc: 'Our AI evaluates your English proficiency across six core skills using adaptive testing technology. Questions adjust in difficulty based on your responses, ensuring an accurate and efficient assessment. The evaluation is powered by Google Gemini AI, providing reliable and consistent CEFR-aligned results.',
                },
                {
                  icon: <QrCode className="h-5 w-5" />,
                  title: 'Certificate Validity & QR Verification',
                  desc: 'Each certificate includes a unique QR code linking to a public verification page. This allows employers, universities, and institutions to instantly validate the authenticity of your CEFR level. Certificates do not expire but reflect your proficiency at the time of assessment.',
                },
                {
                  icon: <RefreshCcw className="h-5 w-5" />,
                  title: 'Retake Policy',
                  desc: 'You may retake the assessment at any time to update your CEFR level. Each new attempt requires a separate payment for Premium users. Your most recent certificate will replace previous versions, and the QR code will always link to your latest valid result.',
                },
              ].map((item, index) => (
                <AnimatedSection key={index} delay={index * 100}>
                  <div className="glass-card p-6 group">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                        <p className="text-sm text-white/50 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== PAYMENT TERMS ===== */}
      <section className="relative py-16 md:py-20 dark-section-alt hero-pattern noise-overlay">
        <div className="container relative mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection>
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                  <CreditCard className="h-3.5 w-3.5 text-purple-400" />
                  <span className="text-xs text-purple-300 font-medium uppercase tracking-wider">Payment Information</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Payment <span className="gradient-text-static">Terms</span>
                </h2>
              </div>
            </AnimatedSection>

            <div className="grid gap-5 sm:grid-cols-3">
              <AnimatedSection delay={100}>
                <div className="glass-card p-6 h-full group">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-400 to-indigo-500 text-white shadow-lg mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">One-Time Payment</h3>
                  <p className="text-sm text-white/45 leading-relaxed">
                    Premium access is a one-time payment per assessment attempt. There are no recurring charges or hidden subscription fees. You only pay when you choose to take a full CEFR assessment.
                  </p>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={200}>
                <div className="glass-card p-6 h-full group">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-cyan-500 text-white shadow-lg mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <Shield className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">PayPal Processing</h3>
                  <p className="text-sm text-white/45 leading-relaxed">
                    All payments are securely processed through PayPal. Your financial information is never stored on our servers. PayPal&apos;s buyer protection policy applies to all transactions made on our platform.
                  </p>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={300}>
                <div className="glass-card p-6 h-full group">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-lg mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <RefreshCcw className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Refund Policy</h3>
                  <p className="text-sm text-white/45 leading-relaxed">
                    We offer a 30-day refund policy for technical issues that prevent you from completing the assessment. If the platform fails to deliver your results or certificate due to a technical error, contact us for a full refund or a free retake.
                  </p>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider max-w-4xl mx-auto" />

      {/* ===== INTELLECTUAL PROPERTY & LIABILITY ===== */}
      <section className="relative py-16 md:py-20 bg-[#0F0A1E]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection>
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                  <Lightbulb className="h-3.5 w-3.5 text-purple-400" />
                  <span className="text-xs text-purple-300 font-medium uppercase tracking-wider">Legal Provisions</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Intellectual Property & <span className="gradient-text-static">Liability</span>
                </h2>
              </div>
            </AnimatedSection>

            <div className="grid gap-5 sm:grid-cols-2">
              <AnimatedSection delay={100}>
                <div className="glass-card p-6 h-full group">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 text-white shadow-lg mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <FileText className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Intellectual Property</h3>
                  <p className="text-sm text-white/45 leading-relaxed">
                    The TestCEFR certificate design, platform content, assessment questions, AI algorithms, and all visual elements are our intellectual property. However, your own test results and certificate belong to you and may be shared with employers or institutions at your discretion.
                  </p>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={200}>
                <div className="glass-card p-6 h-full group">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 text-white shadow-lg mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Limitation of Liability</h3>
                  <p className="text-sm text-white/45 leading-relaxed">
                    TestCEFR shall not be liable for any indirect, incidental, or consequential damages arising from the use of our platform. Our total liability is limited to the amount you paid for the assessment. We are not responsible for decisions made by third parties based on your test results.
                  </p>
                </div>
              </AnimatedSection>
            </div>

            <AnimatedSection delay={300}>
              <div className="glass-card p-6 mt-5 group">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-cyan-400 text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Changes to Terms</h3>
                    <p className="text-sm text-white/50 leading-relaxed">
                      We reserve the right to modify these Terms of Service at any time. Changes will be posted on this page with an updated revision date. Continued use of the platform after changes are posted constitutes acceptance of the revised terms. We will make reasonable efforts to notify registered users of significant changes via email.
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section className="relative py-16 md:py-20 dark-section overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb orb-purple w-[400px] h-[400px] -top-20 right-1/4 animate-float-slow" />
          <div className="orb orb-pink w-[300px] h-[300px] bottom-0 left-1/4 animate-float-reverse" />
        </div>
        <div className="container relative mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <AnimatedSection>
              <div className="glass-card p-8 md:p-10 text-center">
                <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg mb-6">
                  <Mail className="h-6 w-6" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Legal <span className="gradient-text-static">Inquiries</span>
                </h2>
                <p className="text-white/50 mb-6 leading-relaxed">
                  For any legal questions, concerns about these Terms of Service, or to request a copy of our data processing agreement, please contact our legal team.
                </p>
                <a
                  href="mailto:legal@testcefr.com"
                  className="inline-flex items-center gap-2 rounded-xl px-8 py-3.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold text-base transition-all duration-300 shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5"
                >
                  <Mail className="h-4 w-4" />
                  legal@testcefr.com
                </a>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
