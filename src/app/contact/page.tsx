'use client';

import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Mail, MapPin, Clock, Send, Sparkles, MessageSquare, Phone, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
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
      <div className="orb orb-purple w-[500px] h-[500px] -top-32 -left-32 animate-float-slow" />
      {/* Pink orb */}
      <div className="orb orb-pink w-[350px] h-[350px] top-1/3 -right-16 animate-float-reverse" />
      {/* Blue orb */}
      <div className="orb orb-blue w-[250px] h-[250px] bottom-16 left-1/4 animate-float" />
      {/* Small accent dots */}
      <div className="absolute top-1/4 left-1/2 w-2 h-2 rounded-full bg-purple-400/40 animate-float delay-200" />
      <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 rounded-full bg-pink-400/30 animate-float-reverse delay-500" />
      <div className="absolute bottom-1/3 left-1/3 w-2.5 h-2.5 rounded-full bg-blue-400/30 animate-float delay-300" />
    </div>
  );
}

export default function ContactPage() {
  // ── Form State ──
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formAccountType, setFormAccountType] = useState('individual');
  const [formOrgName, setFormOrgName] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSubmitting(true);

    try {
      const res = await fetch('/api/contact/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          name: formName,
          email: formEmail,
          message: formMessage,
          accountType: formAccountType,
          organizationName: formOrgName || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setFormSuccess(true);
        setFormName('');
        setFormEmail('');
        setFormAccountType('individual');
        setFormOrgName('');
        setFormMessage('');
      } else {
        setFormError(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setFormError('Network error. Please check your connection and try again.');
    } finally {
      setFormSubmitting(false);
    }
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
              <MessageSquare className="h-4 w-4 text-purple-300" />
              <span className="text-sm text-purple-200 font-medium">Get in Touch</span>
              <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1] animate-slide-up">
              Contact{' '}
              <span className="gradient-text">Our Team</span>
            </h1>

            {/* Description */}
            <p className="mt-6 text-lg md:text-xl text-white/60 leading-relaxed max-w-2xl mx-auto animate-fade-in delay-300">
              Have questions about TestCEFR? Whether it&apos;s about our AI-powered assessment, CEFR certification, or anything else — we&apos;re here to help. Reach out and we&apos;ll get back to you as soon as possible.
            </p>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0F0A1E] to-transparent" />
      </section>

      {/* ===== CONTACT INFO + FORM SECTION ===== */}
      <section className="relative py-20 md:py-28 bg-[#0F0A1E]">
        <div className="absolute inset-0 hero-pattern pointer-events-none" />
        <div className="container relative mx-auto px-4">
          <div className="max-w-6xl mx-auto grid gap-8 lg:grid-cols-2">

            {/* LEFT COLUMN — Contact Info */}
            <div className="space-y-5">
              <AnimatedSection>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Reach Out <span className="gradient-text-static">Directly</span>
                </h2>
                <p className="text-white/50 mb-8">
                  We&apos;d love to hear from you. Choose the most convenient way to connect.
                </p>
              </AnimatedSection>

              {/* Email Card */}
              <AnimatedSection delay={100}>
                <div className="glass-card p-6 group">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">Email Us</h3>
                      <p className="text-white/70 text-sm">support@testcefr.com</p>
                      <p className="text-white/40 text-xs mt-1">We typically respond within 24 hours</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              {/* Location Card */}
              <AnimatedSection delay={200}>
                <div className="glass-card p-6 group">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-cyan-400 text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">Location</h3>
                      <p className="text-white/70 text-sm">Available Worldwide — Online Platform</p>
                      <p className="text-white/40 text-xs mt-1">Access from anywhere, anytime</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              {/* Support Hours Card */}
              <AnimatedSection delay={300}>
                <div className="glass-card p-6 group">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-400 to-emerald-400 text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">Support Hours</h3>
                      <p className="text-white/70 text-sm">Monday – Friday, 9:00 AM – 6:00 PM (UTC)</p>
                      <p className="text-white/40 text-xs mt-1">Weekend inquiries answered on Monday</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>

            {/* RIGHT COLUMN — Contact Form */}
            <AnimatedSection delay={150}>
              <div className="glass-card p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg">
                    <Send className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Send a Message</h2>
                    <p className="text-white/40 text-xs">Fill out the form and we&apos;ll get back to you</p>
                  </div>
                </div>

                {/* Success State */}
                {formSuccess ? (
                  <div className="text-center py-10">
                    <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-green-500/20 border border-green-500/30 mb-5">
                      <CheckCircle2 className="h-8 w-8 text-green-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
                    <p className="text-white/50 text-sm mb-6">Thank you for reaching out. We&apos;ll get back to you within 24 hours.</p>
                    <button
                      onClick={() => setFormSuccess(false)}
                      className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                <form
                  className="space-y-5"
                  onSubmit={handleSubmit}
                >
                  {/* Error Alert */}
                  {formError && (
                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      {formError}
                    </div>
                  )}

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Name</label>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none glow-input transition-all duration-300"
                      placeholder="Your name"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Email</label>
                    <input
                      type="email"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none glow-input transition-all duration-300"
                      placeholder="your@email.com"
                    />
                  </div>

                  {/* Account Type */}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">I am a...</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: 'individual', label: 'Individual' },
                        { value: 'university', label: 'University' },
                        { value: 'business', label: 'Business' },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setFormAccountType(opt.value)}
                          className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                            formAccountType === opt.value
                              ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-500/30 shadow-lg shadow-purple-500/10'
                              : 'text-white/50 hover:text-white hover:bg-white/5 border border-white/10'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Organization Name (conditional) */}
                  {(formAccountType === 'university' || formAccountType === 'business') && (
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">
                        {formAccountType === 'university' ? 'University/College Name' : 'Company Name'}
                      </label>
                      <input
                        type="text"
                        value={formOrgName}
                        onChange={(e) => setFormOrgName(e.target.value)}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none glow-input transition-all duration-300"
                        placeholder={formAccountType === 'university' ? 'e.g., Oxford University' : 'e.g., Acme Corp'}
                      />
                    </div>
                  )}

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Message</label>
                    <textarea
                      rows={5}
                      value={formMessage}
                      onChange={(e) => setFormMessage(e.target.value)}
                      required
                      minLength={10}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none glow-input transition-all duration-300 resize-none"
                      placeholder="Tell us more about your inquiry... (min 10 characters)"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="group w-full flex items-center justify-center gap-2 rounded-xl px-8 py-3.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold text-base transition-all duration-300 shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  >
                    {formSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
                )}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ===== FAQ SECTION ===== */}
      <section className="relative py-20 md:py-28 dark-section-alt hero-pattern noise-overlay">
        <div className="container relative mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                <span className="text-xs text-purple-300 font-medium uppercase tracking-wider">Common Questions</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Frequently Asked <span className="gradient-text-static">Questions</span>
              </h2>
              <p className="mt-4 text-white/50 max-w-2xl mx-auto text-base">
                Find quick answers to the most common questions about our platform and assessments.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {/* FAQ 1 */}
            <AnimatedSection delay={100}>
              <div className="glass-card p-6 h-full group">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 text-white shadow-lg mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">How accurate is the CEFR test?</h3>
                <p className="text-sm text-white/45 leading-relaxed">
                  Our AI-powered assessment uses advanced natural language processing and machine learning models trained on millions of language samples across all proficiency levels, delivering highly accurate CEFR level determinations backed by rigorous validation.
                </p>
              </div>
            </AnimatedSection>

            {/* FAQ 2 */}
            <AnimatedSection delay={200}>
              <div className="glass-card p-6 h-full group">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-cyan-400 text-white shadow-lg mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <Clock className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">How long does the test take?</h3>
                <p className="text-sm text-white/45 leading-relaxed">
                  The full assessment takes approximately 30-45 minutes to complete. This includes all sections: grammar, vocabulary, reading, listening, speaking, and writing. You can take breaks between sections if needed.
                </p>
              </div>
            </AnimatedSection>

            {/* FAQ 3 */}
            <AnimatedSection delay={300}>
              <div className="glass-card p-6 h-full group">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-400 to-emerald-400 text-white shadow-lg mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Is the certificate recognized?</h3>
                <p className="text-sm text-white/45 leading-relaxed">
                  Our certificates follow the CEFR framework, which is the internationally recognized standard for language proficiency. Each certificate includes a unique QR code for instant verification by employers and institutions worldwide.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
