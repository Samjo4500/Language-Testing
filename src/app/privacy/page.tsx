'use client';

import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import {
  Shield, Lock, Eye, Cookie, Server, Users,
  Mail, CheckCircle2, AlertCircle, Globe, Fingerprint, Database
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

export default function PrivacyPage() {
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
              <Shield className="h-4 w-4 text-purple-300" />
              <span className="text-sm text-purple-200 font-medium">Your Data Matters</span>
              <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1] animate-slide-up">
              Privacy{' '}
              <span className="gradient-text">Policy</span>
            </h1>

            {/* Last Updated */}
            <p className="mt-6 text-lg md:text-xl text-white/60 leading-relaxed max-w-2xl mx-auto animate-fade-in delay-300">
              Your privacy is important to us. This policy explains how TestCEFR collects, uses, and protects your personal information.
            </p>
            <p className="mt-3 text-sm text-white/40 animate-fade-in delay-500">
              Last updated: March 4, 2026
            </p>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0F0A1E] to-transparent" />
      </section>

      {/* ===== INFORMATION WE COLLECT ===== */}
      <section className="relative py-16 md:py-20 bg-[#0F0A1E]">
        <div className="absolute inset-0 hero-pattern pointer-events-none" />
        <div className="container relative mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection>
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                  <Database className="h-3.5 w-3.5 text-purple-400" />
                  <span className="text-xs text-purple-300 font-medium uppercase tracking-wider">Data Collection</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Information We <span className="gradient-text-static">Collect</span>
                </h2>
                <p className="mt-4 text-white/50 max-w-2xl mx-auto text-base">
                  We only collect information that is necessary to provide our assessment services and improve your experience.
                </p>
              </div>
            </AnimatedSection>

            <div className="grid gap-5 sm:grid-cols-2">
              {/* Personal Info */}
              <AnimatedSection delay={100}>
                <div className="glass-card p-6 h-full group">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                      <Fingerprint className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Personal Information</h3>
                      <p className="text-sm text-white/50 leading-relaxed">
                        When you register, we collect your name and email address. This information is used to create and manage your account, issue certificates, and communicate with you about your assessments.
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              {/* Assessment Data */}
              <AnimatedSection delay={200}>
                <div className="glass-card p-6 h-full group">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-cyan-400 text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                      <Eye className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Assessment Data</h3>
                      <p className="text-sm text-white/50 leading-relaxed">
                        We collect your test responses, scores, and performance analytics across all six CEFR skills. This data powers your results and generates your personalized proficiency certificate.
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              {/* Payment Info */}
              <AnimatedSection delay={300}>
                <div className="glass-card p-6 h-full group">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-400 to-emerald-400 text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                      <Lock className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Payment Information</h3>
                      <p className="text-sm text-white/50 leading-relaxed">
                        All payments are processed securely by PayPal. We never store your credit card details or payment information on our servers. PayPal handles all financial data in compliance with PCI-DSS standards.
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              {/* Usage Data */}
              <AnimatedSection delay={400}>
                <div className="glass-card p-6 h-full group">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-amber-400 text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                      <Globe className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Usage Data</h3>
                      <p className="text-sm text-white/50 leading-relaxed">
                        We automatically collect page views, browser type, device information, and general interaction patterns. This helps us understand how users navigate our platform so we can improve the experience.
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

      {/* ===== HOW WE USE YOUR INFORMATION ===== */}
      <section className="relative py-16 md:py-20 bg-[#0F0A1E]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection>
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                  <Server className="h-3.5 w-3.5 text-purple-400" />
                  <span className="text-xs text-purple-300 font-medium uppercase tracking-wider">Purpose & Use</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  How We Use Your <span className="gradient-text-static">Information</span>
                </h2>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={100}>
              <div className="glass-card p-8">
                <div className="space-y-5">
                  {[
                    { icon: <CheckCircle2 className="h-5 w-5" />, text: 'To provide and maintain our AI-powered CEFR assessment services, including test delivery, scoring, and certificate generation.' },
                    { icon: <CheckCircle2 className="h-5 w-5" />, text: 'To issue personalized CEFR proficiency certificates with unique QR verification codes that employers and institutions can validate.' },
                    { icon: <CheckCircle2 className="h-5 w-5" />, text: 'To improve our platform, develop new features, and enhance the accuracy of our AI assessment algorithms.' },
                    { icon: <CheckCircle2 className="h-5 w-5" />, text: 'To communicate with you about your account, test results, certificate status, and important platform updates.' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="text-purple-400 mt-0.5 shrink-0">{item.icon}</div>
                      <p className="text-white/60 text-sm leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ===== DATA SECURITY ===== */}
      <section className="relative py-16 md:py-20 dark-section-alt hero-pattern noise-overlay">
        <div className="container relative mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection>
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                  <Lock className="h-3.5 w-3.5 text-purple-400" />
                  <span className="text-xs text-purple-300 font-medium uppercase tracking-wider">Security Measures</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Data <span className="gradient-text-static">Security</span>
                </h2>
                <p className="mt-4 text-white/50 max-w-2xl mx-auto text-base">
                  We implement industry-standard security measures to protect your personal data from unauthorized access, disclosure, or destruction.
                </p>
              </div>
            </AnimatedSection>

            <div className="grid gap-5 sm:grid-cols-2">
              {[
                { icon: <Lock className="h-5 w-5" />, title: 'Encryption', desc: 'All data transmitted between your browser and our servers is encrypted using TLS 1.3. Sensitive data at rest is encrypted using AES-256 encryption standards.', gradient: 'from-purple-400 to-indigo-500' },
                { icon: <Server className="h-5 w-5" />, title: 'Secure Servers', desc: 'Our infrastructure is hosted on enterprise-grade cloud servers with firewalls, intrusion detection systems, and regular security patching to prevent vulnerabilities.', gradient: 'from-blue-400 to-cyan-500' },
                { icon: <AlertCircle className="h-5 w-5" />, title: 'Regular Audits', desc: 'We conduct periodic security audits and penetration testing to identify and address potential vulnerabilities before they can be exploited.', gradient: 'from-green-400 to-emerald-500' },
                { icon: <Shield className="h-5 w-5" />, title: 'GDPR Compliance', desc: 'We are fully compliant with the General Data Protection Regulation. Users from the European Economic Area have enhanced rights over their personal data.', gradient: 'from-pink-400 to-rose-500' },
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

      {/* ===== COOKIES ===== */}
      <section className="relative py-16 md:py-20 bg-[#0F0A1E]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection>
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                  <Cookie className="h-3.5 w-3.5 text-purple-400" />
                  <span className="text-xs text-purple-300 font-medium uppercase tracking-wider">Cookie Policy</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  <span className="gradient-text-static">Cookies</span> & Tracking
                </h2>
              </div>
            </AnimatedSection>

            <div className="space-y-5">
              <AnimatedSection delay={100}>
                <div className="glass-card p-6 group">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Essential Cookies</h3>
                      <p className="text-sm text-white/50 leading-relaxed">
                        These cookies are required for the platform to function properly. They handle authentication, session management, and security features like CSRF protection. You cannot opt out of essential cookies as the service would not work without them.
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={200}>
                <div className="glass-card p-6 group">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-cyan-400 text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                      <Eye className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Analytics Cookies</h3>
                      <p className="text-sm text-white/50 leading-relaxed">
                        These cookies help us understand how visitors interact with our platform by collecting information about pages visited, time spent, and navigation patterns. All data is aggregated and anonymized — we never track you individually.
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={300}>
                <div className="glass-card p-6 group">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-400 to-emerald-400 text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                      <AlertCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Managing Cookies</h3>
                      <p className="text-sm text-white/50 leading-relaxed">
                        You can control and manage cookies through your browser settings. Most browsers allow you to block or delete cookies, set preferences for certain sites, and opt out of tracking. Note that disabling cookies may affect the functionality of our platform.
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* ===== THIRD-PARTY SERVICES ===== */}
      <section className="relative py-16 md:py-20 dark-section-alt hero-pattern noise-overlay">
        <div className="container relative mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection>
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                  <Users className="h-3.5 w-3.5 text-purple-400" />
                  <span className="text-xs text-purple-300 font-medium uppercase tracking-wider">External Partners</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Third-Party <span className="gradient-text-static">Services</span>
                </h2>
                <p className="mt-4 text-white/50 max-w-2xl mx-auto text-base">
                  We work with trusted third-party providers to deliver our services. Each partner adheres to strict data protection standards.
                </p>
              </div>
            </AnimatedSection>

            <div className="grid gap-5 sm:grid-cols-3">
              {[
                { name: 'PayPal', purpose: 'Payment Processing', desc: 'Handles all financial transactions securely. Your card details never touch our servers.', gradient: 'from-blue-400 to-indigo-500' },
                { name: 'Google AI', purpose: 'Assessment Engine', desc: 'Powers our CEFR evaluation using advanced natural language processing and speech recognition.', gradient: 'from-green-400 to-emerald-500' },
                { name: 'Analytics', purpose: 'Usage Insights', desc: 'Provides anonymized, aggregated data about how our platform is used to guide improvements.', gradient: 'from-orange-400 to-amber-500' },
              ].map((item, index) => (
                <AnimatedSection key={index} delay={index * 100}>
                  <div className="glass-card p-6 text-center h-full group">
                    <div className={`flex h-14 w-14 mx-auto items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient} text-white shadow-lg mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                      <span className="text-lg font-bold">{item.name[0]}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-1">{item.name}</h3>
                    <p className="text-xs text-purple-300 mb-2">{item.purpose}</p>
                    <p className="text-sm text-white/45 leading-relaxed">{item.desc}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider max-w-4xl mx-auto" />

      {/* ===== YOUR RIGHTS ===== */}
      <section className="relative py-16 md:py-20 bg-[#0F0A1E]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection>
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                  <Users className="h-3.5 w-3.5 text-purple-400" />
                  <span className="text-xs text-purple-300 font-medium uppercase tracking-wider">Your Rights</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Your <span className="gradient-text-static">Data Rights</span>
                </h2>
                <p className="mt-4 text-white/50 max-w-2xl mx-auto text-base">
                  You have full control over your personal data. Here are the rights you can exercise at any time.
                </p>
              </div>
            </AnimatedSection>

            <div className="grid gap-5 sm:grid-cols-2">
              {[
                { icon: <Eye className="h-5 w-5" />, title: 'Access Your Data', desc: 'You have the right to request a copy of all personal data we hold about you. We will provide this within 30 days of receiving your request.', gradient: 'from-purple-400 to-indigo-500' },
                { icon: <AlertCircle className="h-5 w-5" />, title: 'Request Deletion', desc: 'You can request that we delete your personal data at any time. Upon verification, we will remove your data from our active systems within 14 business days.', gradient: 'from-pink-400 to-rose-500' },
                { icon: <Globe className="h-5 w-5" />, title: 'Data Portability', desc: 'You can request your data in a structured, machine-readable format (JSON or CSV) so you can transfer it to another service provider if you choose.', gradient: 'from-blue-400 to-cyan-500' },
                { icon: <Shield className="h-5 w-5" />, title: 'Object to Processing', desc: 'You have the right to object to the processing of your personal data for specific purposes, including direct marketing and profiling activities.', gradient: 'from-green-400 to-emerald-500' },
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
                  Privacy <span className="gradient-text-static">Questions?</span>
                </h2>
                <p className="text-white/50 mb-6 leading-relaxed">
                  If you have any questions or concerns about this Privacy Policy or how we handle your data, please don&apos;t hesitate to contact our privacy team.
                </p>
                <a
                  href="mailto:privacy@testcefr.com"
                  className="inline-flex items-center gap-2 rounded-xl px-8 py-3.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold text-base transition-all duration-300 shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5"
                >
                  <Mail className="h-4 w-4" />
                  privacy@testcefr.com
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
