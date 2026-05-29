'use client';

import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import {
  Cookie, Shield, Eye, Settings, Globe, Lock, AlertCircle,
  CheckCircle2, Mail, Clock, Database, BarChart3, UserCheck
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

export default function CookiesPage() {
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
              <Cookie className="h-4 w-4 text-violet-300" />
              <span className="text-sm text-violet-200 font-medium">Cookie Policy</span>
              <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1] animate-slide-up">
              Cookie{' '}
              Policy
            </h1>

            {/* Description */}
            <p className="mt-6 text-lg md:text-xl text-white/60 leading-relaxed max-w-2xl mx-auto animate-fade-in delay-300">
              This policy explains how TestCEFR uses cookies and similar technologies to enhance your experience and ensure platform security.
            </p>
            <p className="mt-3 text-sm text-white/40 animate-fade-in delay-500">
              Last updated: March 4, 2026
            </p>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0F0A1E] to-transparent" />
      </section>

      {/* ===== WHAT ARE COOKIES ===== */}
      <section className="relative py-16 md:py-20 bg-[#0F0A1E]">
        <div className="absolute inset-0 hero-pattern pointer-events-none" />
        <div className="container relative mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection>
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                  <Cookie className="h-3.5 w-3.5 text-violet-400" />
                  <span className="text-xs text-violet-300 font-medium uppercase tracking-wider">The Basics</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  What Are Cookies?
                </h2>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={100}>
              <div className="glass-card p-8">
                <p className="text-white/60 text-sm leading-relaxed mb-4">
                  Cookies are small text files that are placed on your computer or mobile device by websites you visit. They are widely used to make websites work more efficiently, provide a better browsing experience, and supply information to the owners of the site.
                </p>
                <p className="text-white/60 text-sm leading-relaxed mb-4">
                  In addition to cookies, we also use similar technologies such as localStorage, sessionStorage, and indexedDB. These technologies function similarly to cookies but can store larger amounts of data. Throughout this policy, when we refer to &ldquo;cookies&rdquo;, we mean all of these technologies unless stated otherwise.
                </p>
                <p className="text-white/60 text-sm leading-relaxed">
                  Cookies can be &ldquo;persistent&rdquo; (remaining on your device until they expire or you delete them) or &ldquo;session&rdquo; (deleted when you close your browser). Both types are used on our platform, and each serves a specific purpose described below.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <div className="section-divider max-w-4xl mx-auto" />

      {/* ===== HOW WE USE COOKIES ===== */}
      <section className="relative py-16 md:py-20 dark-section-alt hero-pattern noise-overlay">
        <div className="container relative mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection>
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                  <Eye className="h-3.5 w-3.5 text-violet-400" />
                  <span className="text-xs text-violet-300 font-medium uppercase tracking-wider">Our Purpose</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  How We Use Cookies
                </h2>
                <p className="mt-4 text-white/50 max-w-2xl mx-auto text-base">
                  We use cookies to improve your experience, secure our platform, and understand how our services are used.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={100}>
              <div className="glass-card p-8">
                <div className="space-y-5">
                  {[
                    { icon: <CheckCircle2 className="h-5 w-5" />, text: 'To authenticate your identity and maintain a secure logged-in session so you can access your courses, assessments, and certificates without repeatedly signing in.' },
                    { icon: <CheckCircle2 className="h-5 w-5" />, text: 'To remember your preferences such as language, theme, and CEFR level so the platform is configured to your liking every time you visit.' },
                    { icon: <CheckCircle2 className="h-5 w-5" />, text: 'To analyze how visitors interact with our platform using anonymized, aggregated data so we can improve content, features, and user experience.' },
                    { icon: <CheckCircle2 className="h-5 w-5" />, text: 'To protect our platform against security threats, including cross-site request forgery (CSRF) attacks, and to enforce rate limiting on API endpoints.' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="text-violet-400 mt-0.5 shrink-0">{item.icon}</div>
                      <p className="text-white/60 text-sm leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <div className="section-divider max-w-4xl mx-auto" />

      {/* ===== TYPES OF COOKIES ===== */}
      <section className="relative py-16 md:py-20 bg-[#0F0A1E]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection>
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                  <Database className="h-3.5 w-3.5 text-violet-400" />
                  <span className="text-xs text-violet-300 font-medium uppercase tracking-wider">Cookie Types</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Types of Cookies
                </h2>
                <p className="mt-4 text-white/50 max-w-2xl mx-auto text-base">
                  We categorize our cookies based on their purpose. Some are essential for the platform to function, while others help us improve your experience.
                </p>
              </div>
            </AnimatedSection>

            <div className="grid gap-5 sm:grid-cols-2">
              {/* Essential Cookies */}
              <AnimatedSection delay={100}>
                <div className="glass-card p-6 h-full group">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-400 to-orange-400 text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                      <Shield className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Essential Cookies</h3>
                      <p className="text-sm text-white/50 leading-relaxed mb-3">
                        These cookies are strictly necessary for the operation of our platform. Without them, services such as authentication, secure areas, and assessment functionality cannot be provided. Essential cookies cannot be disabled as the platform would not function without them.
                      </p>
                      <div className="space-y-1.5 text-xs text-white/40">
                        <p><strong className="text-white/60">auth-token</strong> — Maintains your logged-in session (session cookie)</p>
                        <p><strong className="text-white/60">csrf-token</strong> — Protects against cross-site request forgery attacks (session cookie)</p>
                        <p><strong className="text-white/60">session-id</strong> — Identifies your current browsing session (session cookie)</p>
                        <p><strong className="text-white/60">cookie-consent</strong> — Stores your cookie preferences (1 year)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              {/* Analytics Cookies */}
              <AnimatedSection delay={200}>
                <div className="glass-card p-6 h-full group">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-cyan-400 text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                      <BarChart3 className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Analytics Cookies</h3>
                      <p className="text-sm text-white/50 leading-relaxed mb-3">
                        These cookies collect information about how visitors use our platform, such as which pages are visited most often, how long users spend on each page, and whether users encounter error messages. All analytics data is aggregated and anonymized — we never track you individually.
                      </p>
                      <div className="space-y-1.5 text-xs text-white/40">
                        <p><strong className="text-white/60">_ga / _ga_*</strong> — Google Analytics tracking (2 years)</p>
                        <p><strong className="text-white/60">_gid</strong> — Google Analytics daily distinction (24 hours)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              {/* Functional Cookies */}
              <AnimatedSection delay={300}>
                <div className="glass-card p-6 h-full group">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-400 to-emerald-400 text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                      <Settings className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Functional Cookies</h3>
                      <p className="text-sm text-white/50 leading-relaxed mb-3">
                        These cookies allow the platform to remember choices you make — such as your preferred language, theme (dark mode), or CEFR level — and provide enhanced, personalized features. They can also be used to remember changes you have made to text size, fonts, and other customizable parts of the platform.
                      </p>
                      <div className="space-y-1.5 text-xs text-white/40">
                        <p><strong className="text-white/60">preferred-lang</strong> — Stores your language preference (1 year)</p>
                        <p><strong className="text-white/60">theme-preference</strong> — Remembers dark/light mode selection (1 year)</p>
                        <p><strong className="text-white/60">cefr-level</strong> — Saves your last assessed CEFR level (6 months)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              {/* Third-Party Cookies */}
              <AnimatedSection delay={400}>
                <div className="glass-card p-6 h-full group">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400 to-indigo-400 text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                      <Globe className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Third-Party Cookies</h3>
                      <p className="text-sm text-white/50 leading-relaxed mb-3">
                        Some cookies are set by third-party services that appear on our pages, such as payment processors and analytics providers. We do not control the cookies set by these third parties. Each partner adheres to strict data protection standards.
                      </p>
                      <div className="space-y-1.5 text-xs text-white/40">
                        <p><strong className="text-white/60">PayPal</strong> — Payment processing session cookies</p>
                        <p><strong className="text-white/60">Google Analytics</strong> — Website usage tracking</p>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* ===== COOKIE RETENTION TABLE ===== */}
      <section className="relative py-16 md:py-20 dark-section-alt hero-pattern noise-overlay">
        <div className="container relative mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection>
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                  <Clock className="h-3.5 w-3.5 text-violet-400" />
                  <span className="text-xs text-violet-300 font-medium uppercase tracking-wider">Retention Periods</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  How Long Do Cookies Last?
                </h2>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={100}>
              <div className="glass-card p-8 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-3 px-4 text-violet-300 font-semibold">Category</th>
                        <th className="text-left py-3 px-4 text-violet-300 font-semibold">Duration</th>
                        <th className="text-left py-3 px-4 text-violet-300 font-semibold">Can Be Disabled?</th>
                      </tr>
                    </thead>
                    <tbody className="text-white/60">
                      <tr className="border-b border-white/5">
                        <td className="py-3 px-4">Essential</td>
                        <td className="py-3 px-4">Session or 1 year</td>
                        <td className="py-3 px-4"><span className="text-red-400">No</span> — Required for platform operation</td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-3 px-4">Analytics</td>
                        <td className="py-3 px-4">24 hours to 2 years</td>
                        <td className="py-3 px-4"><span className="text-green-400">Yes</span> — Via consent banner or browser settings</td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-3 px-4">Functional</td>
                        <td className="py-3 px-4">6 months to 1 year</td>
                        <td className="py-3 px-4"><span className="text-green-400">Yes</span> — Via consent banner or browser settings</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4">Third-Party</td>
                        <td className="py-3 px-4">Session to 2 years</td>
                        <td className="py-3 px-4"><span className="text-green-400">Yes</span> — Via browser settings or opt-out tools</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <div className="section-divider max-w-4xl mx-auto" />

      {/* ===== MANAGING COOKIES ===== */}
      <section className="relative py-16 md:py-20 bg-[#0F0A1E]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection>
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                  <UserCheck className="h-3.5 w-3.5 text-violet-400" />
                  <span className="text-xs text-violet-300 font-medium uppercase tracking-wider">Your Control</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Managing Cookies
                </h2>
                <p className="mt-4 text-white/50 max-w-2xl mx-auto text-base">
                  You have the right to decide whether to accept or reject cookies. Here is how you can exercise that control.
                </p>
              </div>
            </AnimatedSection>

            <div className="space-y-5">
              <AnimatedSection delay={100}>
                <div className="glass-card p-6 group">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-violet-400 text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                      <Settings className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Our Cookie Consent Banner</h3>
                      <p className="text-sm text-white/50 leading-relaxed">
                        When you first visit our platform, a cookie consent banner appears allowing you to accept or customize which categories of cookies you wish to allow. Your preferences are stored in an essential cookie so the banner does not reappear on subsequent visits. You can reset your preferences at any time by clearing the &ldquo;cookie-consent&rdquo; cookie in your browser settings.
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={200}>
                <div className="glass-card p-6 group">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-cyan-400 text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                      <Lock className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Browser Settings</h3>
                      <p className="text-sm text-white/50 leading-relaxed">
                        Most browsers allow you to control cookies through their settings. You can set your browser to refuse all cookies, accept only first-party cookies, or delete cookies when you close your browser. You can also install browser extensions that block third-party cookies. Note that disabling cookies may affect the functionality of our platform — some features may not work as expected.
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
                      <h3 className="text-lg font-semibold text-white mb-2">Opt-Out Links</h3>
                      <p className="text-sm text-white/50 leading-relaxed mb-3">
                        You can opt out of specific third-party analytics and advertising cookies using these industry-standard tools:
                      </p>
                      <div className="space-y-2 text-sm text-white/50">
                        <p><strong className="text-white/70">Google Analytics:</strong> <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">GA Opt-out Browser Add-on</a></p>
                        <p><strong className="text-white/70">All advertising:</strong> <a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">NAI Opt-Out Page</a> or <a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">DAA Opt-Out Page</a></p>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* ===== YOUR RIGHTS ===== */}
      <section className="relative py-16 md:py-20 dark-section-alt hero-pattern noise-overlay">
        <div className="container relative mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection>
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                  <Shield className="h-3.5 w-3.5 text-violet-400" />
                  <span className="text-xs text-violet-300 font-medium uppercase tracking-wider">Your Rights</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Your Legal Rights
                </h2>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={100}>
              <div className="glass-card p-8">
                <p className="text-white/60 text-sm leading-relaxed mb-4">
                  Under the EU General Data Protection Regulation (GDPR), the UK Data Protection Act 2018, and the ePrivacy Directive, you have specific rights regarding cookies and your personal data:
                </p>
                <div className="space-y-5">
                  {[
                    { icon: <CheckCircle2 className="h-5 w-5" />, text: 'The right to be informed about how we use cookies (this policy fulfills that right).' },
                    { icon: <CheckCircle2 className="h-5 w-5" />, text: 'The right to withdraw your consent at any time. You can do this via our cookie consent banner, your browser settings, or by contacting us.' },
                    { icon: <CheckCircle2 className="h-5 w-5" />, text: 'The right to access the personal data we hold about you, including data collected through cookies.' },
                    { icon: <CheckCircle2 className="h-5 w-5" />, text: 'The right to request deletion of your personal data, including cookie-related data stored on our servers.' },
                    { icon: <CheckCircle2 className="h-5 w-5" />, text: 'The right to lodge a complaint with a supervisory authority if you believe our cookie practices violate your rights.' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="text-violet-400 mt-0.5 shrink-0">{item.icon}</div>
                      <p className="text-white/60 text-sm leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <div className="section-divider max-w-4xl mx-auto" />

      {/* ===== CONTACT ===== */}
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
                  <Mail className="h-6 w-6" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Cookie <span className="text-blue-400">Questions?</span>
                </h2>
                <p className="text-white/50 mb-6 leading-relaxed">
                  If you have any questions about our use of cookies or this Cookie Policy, please contact our privacy team. We are happy to clarify any concerns.
                </p>
                <a
                  href="mailto:privacy@testcefr.com"
                  className="inline-flex items-center gap-2 rounded-xl px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold text-base transition-all duration-300 shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
                >
                  <Mail className="h-4 w-4" />
                  privacy@testcefr.com
                </a>
                <div className="mt-6 flex items-center justify-center gap-4 text-xs text-white/30">
                  <Link href="/privacy" className="hover:text-white/50 transition-colors">Privacy Policy</Link>
                  <span>|</span>
                  <Link href="/terms" className="hover:text-white/50 transition-colors">Terms of Service</Link>
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
