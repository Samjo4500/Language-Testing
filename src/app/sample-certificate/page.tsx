'use client';

import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import {
  Award,
  QrCode,
  Shield,
  CheckCircle2,
  Download,
  Sparkles,
  ArrowRight,
  Eye,
  Star,
} from 'lucide-react';
import { useEffect, useRef } from 'react';

const SKILLS = [
  { name: 'Grammar', value: 85, color: 'from-purple-500 to-pink-500' },
  { name: 'Vocabulary', value: 78, color: 'from-cyan-400 to-blue-500' },
  { name: 'Reading', value: 82, color: 'from-emerald-400 to-teal-500' },
  { name: 'Listening', value: 75, color: 'from-amber-400 to-orange-500' },
];

export default function SampleCertificatePage() {
  const scrollRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    scrollRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const addScrollRef =
    (index: number) =>
    (el: HTMLDivElement | null) => {
      scrollRefs.current[index] = el;
    };

  return (
    <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
      <Navbar />

      {/* ── Hero Section ── */}
      <section className="relative dark-section overflow-hidden">
        {/* Floating Orbs */}
        <div className="orb orb-purple w-72 h-72 top-10 -left-20 animate-float" />
        <div className="orb orb-pink w-96 h-96 -top-20 right-0 animate-float-slow" />
        <div className="orb orb-blue w-64 h-64 bottom-0 left-1/3 animate-float-reverse" />

        <div className="hero-pattern noise-overlay relative z-10 py-20 md:py-28">
          <div className="container mx-auto px-4 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 glass-light text-white/80 text-sm font-medium mb-6 scroll-animate" ref={addScrollRef(0)}>
              <Award className="h-4 w-4 text-purple-400" />
              Sample Certificate
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 scroll-animate" ref={addScrollRef(1)}>
              Your CEFR{' '}
              <span className="gradient-text">Certificate</span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto scroll-animate" ref={addScrollRef(2)}>
              Receive a professional, QR-verified certificate upon completing your assessment.
              Share it with employers, institutions, or anyone who needs proof of your English proficiency.
            </p>
          </div>
        </div>

        <div className="section-divider" />
      </section>

      {/* ── Certificate Preview ── */}
      <section className="relative py-16 md:py-24 bg-[#0F0A1E]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto scroll-animate purple-glow" ref={addScrollRef(3)}>
            <div className="glass-card p-2 md:p-3">
              {/* Gradient border wrapper */}
              <div className="p-[2px] rounded-2xl bg-gradient-to-br from-[#2A9D8F] to-[#264653]">
                {/* Inner certificate content */}
                <div className="bg-[#0F0A1E] rounded-2xl p-6 md:p-8 space-y-6">
                  {/* Top header */}
                  <div className="text-center space-y-1">
                    <p className="uppercase tracking-[0.25em] text-white/60 text-xs md:text-sm font-medium">
                      Certificate of Proficiency
                    </p>
                  </div>

                  {/* Logo area */}
                  <div className="flex items-center justify-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold text-sm shadow-lg shadow-purple-500/25">
                      CE
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white font-bold text-base tracking-tight leading-tight">
                        testcefr.com
                      </span>
                      <span className="text-white/40 text-[9px] uppercase tracking-[0.2em] leading-tight">
                        English Assessment
                      </span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="section-divider" />

                  {/* Certification text */}
                  <div className="text-center space-y-3">
                    <p className="text-white/50 text-sm">This is to certify that</p>
                    <p className="text-3xl md:text-4xl font-bold text-white tracking-wide">
                      JOHN DOE
                    </p>
                    <p className="text-white/50 text-sm">has achieved CEFR Level</p>
                  </div>

                  {/* Level circle */}
                  <div className="flex justify-center">
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 animate-pulse-glow">
                      <span className="text-white text-2xl font-bold">B2</span>
                    </div>
                  </div>

                  {/* Level name */}
                  <p className="text-center text-white/70 text-sm font-medium">
                    Upper Intermediate
                  </p>

                  {/* Divider */}
                  <div className="section-divider" />

                  {/* Skill breakdown */}
                  <div className="space-y-3">
                    <p className="text-white/40 text-xs uppercase tracking-widest font-medium text-center mb-4">
                      Skill Breakdown
                    </p>
                    {SKILLS.map((skill) => (
                      <div key={skill.name} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-white/60">{skill.name}</span>
                          <span className="text-white/80 font-medium">{skill.value}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${skill.color} transition-all duration-1000`}
                            style={{ width: `${skill.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="section-divider" />

                  {/* QR Code & Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* QR placeholder */}
                      <div className="h-16 w-16 rounded-lg border-2 border-white/20 flex items-center justify-center bg-white/5">
                        <div className="text-center">
                          <QrCode className="h-6 w-6 text-white/40 mx-auto" />
                          <span className="text-white/30 text-[8px] uppercase tracking-wider">
                            QR
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-white/40 text-xs">Scan to verify</p>
                        <div className="flex items-center gap-1 mt-1">
                          <CheckCircle2 className="h-3 w-3 text-green-400" />
                          <span className="text-green-400 text-xs font-medium">Verified</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right space-y-1">
                      <p className="text-white/40 text-xs">
                        Issued: March 4, 2025
                      </p>
                      <p className="text-white/60 text-xs font-mono">
                        TCFR-2025-B2-DEMO
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* View badge */}
          <div className="flex justify-center mt-6 scroll-animate" ref={addScrollRef(4)}>
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 glass text-white/60 text-sm">
              <Eye className="h-4 w-4" />
              Sample preview — actual certificates include full QR verification
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section className="relative py-16 md:py-24 bg-[#0F0A1E]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 scroll-animate" ref={addScrollRef(5)}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Built for <span className="gradient-text-static">Trust</span>
            </h2>
            <p className="text-white/50 max-w-lg mx-auto">
              Every certificate is designed with security and shareability in mind.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* QR Verified */}
            <div className="glass-card p-6 text-center scroll-animate" ref={addScrollRef(6)}>
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20 mb-4">
                <QrCode className="h-7 w-7 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">QR Verified</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                Each certificate has a unique QR code linking to a verification page where anyone can confirm its authenticity.
              </p>
            </div>

            {/* Tamper Proof */}
            <div className="glass-card p-6 text-center scroll-animate" ref={addScrollRef(7)}>
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/20 mb-4">
                <Shield className="h-7 w-7 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Tamper Proof</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                Digital signatures ensure certificate authenticity. Any modification invalidates the signature instantly.
              </p>
            </div>

            {/* Instantly Shareable */}
            <div className="glass-card p-6 text-center scroll-animate" ref={addScrollRef(8)}>
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20 mb-4">
                <Download className="h-7 w-7 text-cyan-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Instantly Shareable</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                Download your certificate as a PDF and share it with employers, universities, or immigration services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="relative py-16 md:py-24 bg-[#0F0A1E]">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto scroll-animate" ref={addScrollRef(9)}>
            <div className="glass-card p-8 md:p-12 text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20 mb-6">
                <Star className="h-8 w-8 text-purple-400" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Get Your Certificate Today
              </h2>
              <p className="text-white/50 mb-8 max-w-md mx-auto">
                Complete a CEFR assessment and receive your personalized, verifiable certificate in minutes.
              </p>
              <Link href="/login">
                <button className="inline-flex items-center gap-2 rounded-xl px-8 py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 cursor-pointer">
                  <Sparkles className="h-4 w-4" />
                  Register Now
                  <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-[#0A0618] border-t border-white/5 mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold text-xs">
                CE
              </div>
              <span className="text-white/40 text-sm">testcefr.com</span>
            </div>
            <p className="text-white/30 text-sm">
              &copy; {new Date().getFullYear()} TestCEFR. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
