'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';
import { useHydrated } from '@/hooks/use-hydrated';

/* ======================================================
   TRUST SIGNALS DATA
   ====================================================== */
const TRUST_SIGNALS = [
  'CEFR-Aligned Assessment',
  'AI-Powered Scoring',
  '6 Core Skills Evaluated',
  'QR-Verified Certificates',
  'Results in Under 30 Minutes',
  'Recognized by Employers',
];

/* ======================================================
   STAGGER ANIMATION HELPER
   ====================================================== */
function useStaggeredMount(count: number, baseDelay: number = 120) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);
  return mounted;
}

/* ======================================================
   HERO SECTION — "YOUR ENGLISH. CERTIFIED."
   ====================================================== */
export function HeroSection() {
  const { isAuthenticated } = useAuthStore();
  const mounted = useHydrated();
  const isAuth = mounted && isAuthenticated;
  const visible = useStaggeredMount(6);

  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center" style={{ background: '#0a0a1a' }}>
      {/* ── Background: subtle blue radial glow ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(59,130,246,0.06) 0%, transparent 70%)',
        }}
      />
      {/* Secondary violet glow — lower right */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 50% 40% at 70% 70%, rgba(139,92,246,0.04) 0%, transparent 70%)',
        }}
      />

      {/* ── Content ── */}
      <div className="container relative mx-auto px-4 py-24 md:py-32">
        <div className="mx-auto max-w-4xl text-center">

          {/* ── Eyebrow badge ── */}
          <div
            className={`inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/[0.07] px-5 py-2 mb-8 transition-all duration-700 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
            </span>
            <span className="text-sm text-blue-300 font-medium tracking-wide">
              AI-Powered English Proficiency Testing
            </span>
          </div>

          {/* ── Main headline: "YOUR ENGLISH. CERTIFIED." ── */}
          <h1
            className={`font-extrabold tracking-tight text-white leading-[1.05] transition-all duration-700 delay-100 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{
              fontSize: 'clamp(3rem, 8vw, 6rem)',
            }}
          >
            YOUR ENGLISH.
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">
              CERTIFIED.
            </span>
          </h1>

          {/* ── Subheadline ── */}
          <p
            className={`mt-6 text-lg md:text-xl text-white/50 leading-relaxed max-w-2xl mx-auto transition-all duration-700 delay-200 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            Get your internationally recognized CEFR certificate with AI-powered assessment across all 6 core skills. Accurate results in under 30 minutes.
          </p>

          {/* ── CTA: Gradient pill button ── */}
          <div
            className={`mt-10 flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 delay-300 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <Link href={isAuth ? '/dashboard' : '/register'}>
              <button className="group inline-flex items-center justify-center gap-2.5 rounded-full px-10 py-4 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-400 hover:to-violet-400 text-white font-semibold text-lg transition-all duration-300 shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 cursor-pointer">
                Take Free Test
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
            </Link>
            <Link href="/pricing">
              <button className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-white/70 hover:text-white font-medium text-lg transition-all duration-300 cursor-pointer">
                View Plans
              </button>
            </Link>
          </div>

          {/* ── Trust signals bar ── */}
          <div
            className={`mt-14 transition-all duration-700 delay-[400ms] ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              {TRUST_SIGNALS.map((signal, i) => (
                <div
                  key={signal}
                  className="flex items-center gap-2 transition-all duration-500"
                  style={{
                    transitionDelay: visible ? `${500 + i * 80}ms` : '0ms',
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateY(0)' : 'translateY(8px)',
                  }}
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span className="text-sm text-white/40 font-medium">{signal}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Stats row ── */}
          <div
            className={`mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto transition-all duration-700 delay-[500ms] ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            {[
              { value: 'A1–C2', label: 'All Levels' },
              { value: '6', label: 'Core Skills' },
              { value: '30min', label: 'Avg. Time' },
              { value: 'Free', label: 'To Start' },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-center transition-all duration-500 hover:bg-white/[0.04] hover:border-white/[0.1]"
                style={{
                  transitionDelay: visible ? `${600 + i * 80}ms` : '0ms',
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(12px)',
                }}
              >
                <div className="text-xl sm:text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-white/30 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom gradient fade into next section ── */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0F0A1E] to-transparent" />
    </section>
  );
}
