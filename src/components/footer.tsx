'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Headphones, BookOpenCheck, PenTool, Mic, GraduationCap, Trophy, BookOpen, HelpCircle, Mail, MessageCircle, Users, Newspaper, Award, FileText } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#0A0618] border-t border-white/5 py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3.5 mb-4">
              <Image src="/logo-icon.svg" alt="TestCEFR home" width={56} height={56} className="h-12 w-12 sm:h-14 sm:w-14" />
              <div className="flex flex-col">
                <span className="text-white font-bold text-lg sm:text-xl tracking-tight leading-tight">
                  test<span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">cefr</span><span className="text-blue-300">.com</span>
                </span>
                <span className="text-white/60 text-[11px] uppercase tracking-[0.2em] leading-tight">English Assessment</span>
              </div>
            </div>
            <p className="text-sm text-white/60 leading-relaxed mb-4">
              AI-powered English proficiency assessment aligned with the Common European Framework of Reference. Certify your skills with confidence.
            </p>
            <div className="flex items-center gap-3">
              {/* TikTok */}
              <a
                href="https://www.tiktok.com/@testcefr"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:border-blue-500/40 hover:bg-blue-500/10 transition-all duration-200"
                aria-label="TikTok"
              >
                <svg className="w-4 h-4 text-white/50 group-hover:text-blue-400 transition-colors" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.73a8.19 8.19 0 0 0 4.76 1.52V6.79a4.84 4.84 0 0 1-1-.1z" />
                </svg>
              </a>

              {/* X / Twitter */}
              <a
                href="https://x.com/testcefr"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:border-blue-500/40 hover:bg-blue-500/10 transition-all duration-200"
                aria-label="X / Twitter"
              >
                <svg className="w-4 h-4 text-white/50 group-hover:text-blue-400 transition-colors" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/testcefr2026/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:border-blue-500/40 hover:bg-blue-500/10 transition-all duration-200"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 text-white/50 group-hover:text-blue-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="5" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/test-cefr-313421411/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:border-blue-500/40 hover:bg-blue-500/10 transition-all duration-200"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4 text-white/50 group-hover:text-blue-400 transition-colors" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          {/* CEFR Tests */}
          <div>
            <p className="text-white font-semibold text-sm mb-4">CEFR Tests</p>
            <div className="space-y-2.5">
              <Link href="/listening" className="flex items-center gap-2 text-sm text-[#9494a8] hover:text-[#b4b4c8] transition-colors">
                <Headphones className="h-3.5 w-3.5 text-[#9494a8]" />
                Listening
              </Link>
              <Link href="/reading" className="flex items-center gap-2 text-sm text-[#9494a8] hover:text-[#b4b4c8] transition-colors">
                <BookOpenCheck className="h-3.5 w-3.5 text-[#9494a8]" />
                Reading
              </Link>
              <Link href="/writing" className="flex items-center gap-2 text-sm text-[#9494a8] hover:text-[#b4b4c8] transition-colors">
                <PenTool className="h-3.5 w-3.5 text-[#9494a8]" />
                Writing
              </Link>
              <Link href="/speaking" className="flex items-center gap-2 text-sm text-[#9494a8] hover:text-[#b4b4c8] transition-colors">
                <Mic className="h-3.5 w-3.5 text-[#9494a8]" />
                Speaking
              </Link>
              <Link href="/test" className="flex items-center gap-2 text-sm text-[#9494a8] hover:text-[#b4b4c8] transition-colors">
                <Trophy className="h-3.5 w-3.5 text-[#9494a8]" />
                Take Full Test
              </Link>
              <Link href="/sample-certificate" className="flex items-center gap-2 text-sm text-[#9494a8] hover:text-[#b4b4c8] transition-colors">
                <Award className="h-3.5 w-3.5 text-[#9494a8]" />
                Sample Certificate
              </Link>
              <Link href="/sample-report" className="flex items-center gap-2 text-sm text-[#9494a8] hover:text-[#b4b4c8] transition-colors">
                <FileText className="h-3.5 w-3.5 text-[#9494a8]" />
                Sample Report
              </Link>
            </div>
          </div>

          {/* Courses */}
          <div>
            <p className="text-white font-semibold text-sm mb-4">Courses</p>
            <div className="space-y-2.5">
              <Link href="/courses?level=a1" className="flex items-center gap-2 text-sm text-[#9494a8] hover:text-[#b4b4c8] transition-colors">
                <GraduationCap className="h-3.5 w-3.5 text-[#9494a8]" />
                Beginners
                <span className="text-[9px] font-semibold tracking-wide uppercase px-1 py-0.5 rounded bg-blue-500/15 text-blue-400">A1-A2</span>
              </Link>
              <Link href="/courses?level=b1" className="flex items-center gap-2 text-sm text-[#9494a8] hover:text-[#b4b4c8] transition-colors">
                <BookOpen className="h-3.5 w-3.5 text-[#9494a8]" />
                Intermediate
                <span className="text-[9px] font-semibold tracking-wide uppercase px-1 py-0.5 rounded bg-cyan-500/15 text-cyan-400">B1-B2</span>
              </Link>
              <Link href="/courses?level=c1" className="flex items-center gap-2 text-sm text-[#9494a8] hover:text-[#b4b4c8] transition-colors">
                <Trophy className="h-3.5 w-3.5 text-[#9494a8]" />
                Advanced
                <span className="text-[9px] font-semibold tracking-wide uppercase px-1 py-0.5 rounded bg-violet-500/15 text-violet-400">C1-C2</span>
              </Link>
              <Link href="/courses" className="flex items-center gap-2 text-sm text-[#9494a8] hover:text-[#b4b4c8] transition-colors">
                <BookOpen className="h-3.5 w-3.5 text-[#9494a8]" />
                All Courses
              </Link>
              <Link href="/pricing" className="block text-sm text-[#9494a8] hover:text-[#b4b4c8] transition-colors">
                Pricing
              </Link>
              <Link href="/blog" className="flex items-center gap-2 text-sm text-[#9494a8] hover:text-[#b4b4c8] transition-colors">
                <Newspaper className="h-3.5 w-3.5 text-[#9494a8]" />
                Blog
              </Link>
            </div>
          </div>

          {/* Support & Community */}
          <div>
            <p className="text-white font-semibold text-sm mb-4">Support</p>
            <div className="space-y-2.5">
              <Link href="/faq" className="flex items-center gap-2 text-sm text-[#9494a8] hover:text-[#b4b4c8] transition-colors">
                <HelpCircle className="h-3.5 w-3.5 text-[#9494a8]" />
                FAQ
              </Link>
              <Link href="/contact" className="flex items-center gap-2 text-sm text-[#9494a8] hover:text-[#b4b4c8] transition-colors">
                <Mail className="h-3.5 w-3.5 text-[#9494a8]" />
                Contact Us
              </Link>
              <Link href="/quick-tour" className="flex items-center gap-2 text-sm text-[#9494a8] hover:text-[#b4b4c8] transition-colors">
                <MessageCircle className="h-3.5 w-3.5 text-[#9494a8]" />
                Quick Tour
              </Link>
              <div className="pt-2 mt-2 border-t border-white/5">
                <Link href="/community" className="flex items-center gap-2 text-sm text-[#9494a8] hover:text-[#b4b4c8] transition-colors">
                  <Users className="h-3.5 w-3.5 text-[#9494a8]" />
                  Community
                  <span className="text-[9px] font-semibold tracking-wide uppercase px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400">New</span>
                </Link>
                <Link href="/community/chatroom" className="flex items-center gap-2 text-sm text-[#9494a8] hover:text-[#b4b4c8] transition-colors ml-4">
                  <MessageCircle className="h-3.5 w-3.5 text-[#9494a8]" />
                  Chatroom
                </Link>
              </div>
              <div className="space-y-2.5 pt-1">
                <Link href="/about" className="block text-sm text-[#9494a8] hover:text-[#b4b4c8] transition-colors">About</Link>
                <Link href="/privacy" className="block text-sm text-[#9494a8] hover:text-[#b4b4c8] transition-colors">Privacy</Link>
                <Link href="/cookies" className="block text-sm text-[#9494a8] hover:text-[#b4b4c8] transition-colors">Cookies</Link>
                <Link href="/terms" className="block text-sm text-[#9494a8] hover:text-[#b4b4c8] transition-colors">Terms</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Trust & Security Badges */}
        <div className="mt-10 pt-8 border-t border-white/5">
          <div className="flex flex-col items-center gap-5">
            <p className="text-white/50 text-xs uppercase tracking-[0.15em] font-semibold">Trust &amp; Security</p>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              {/* GDPR Compliant */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:border-blue-500/30 transition-colors">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
                <span className="text-white/50 text-xs font-medium">GDPR Compliant</span>
              </div>

              {/* SSL Secure */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:border-blue-500/30 transition-colors">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span className="text-white/50 text-xs font-medium">SSL Secure</span>
              </div>

              {/* PayPal Verified */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:border-blue-500/30 transition-colors">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c1.847 2.826.632 7.26-3.595 7.26h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106H9.076l.16-1.014h2.627c4.298 0 7.664-1.748 8.647-6.797.395-2.028.142-3.682-.688-5.014z" />
                </svg>
                <span className="text-white/50 text-xs font-medium">PayPal Verified</span>
              </div>

              {/* Visa */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:border-yellow-500/30 transition-colors">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9.09 16.28H6.53L8.13 7.7h2.56l-1.6 8.58zm9.63-8.38a6.5 6.5 0 0 0-2.3-.41c-2.53 0-4.31 1.3-4.32 3.15-.02 1.37 1.27 2.14 2.24 2.6 1 .47 1.33.77 1.33 1.19-.01.64-.8.93-1.54.93-1.03 0-1.58-.15-2.42-.5l-.34-.15-.36 2.16c.6.27 1.71.5 2.87.51 2.69 0 4.43-1.28 4.45-3.27.01-1.09-.67-1.92-2.15-2.6-.9-.44-1.45-.73-1.44-1.18 0-.4.46-.82 1.47-.82a4.7 4.7 0 0 1 1.93.37l.23.11.35-2.09zM16.2 7.7h-1.98c-.62 0-1.08.17-1.35.8l-3.83 8.78h2.69l.54-1.43h3.29l.31 1.43h2.37L18.5 7.7h-2.3zm-2.83 5.63l2.09-5.46.47 5.46h-2.56zM5.85 7.7L3.37 13.4l-.27-1.46c-.46-1.52-1.87-3.17-3.45-3.99l2.27 8.33h2.71L8.57 7.7H5.85z" />
                </svg>
                <span className="text-white/50 text-xs font-medium">Visa</span>
              </div>

              {/* Mastercard */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:border-red-500/30 transition-colors">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="9.5" cy="12" r="6.5" opacity="0.8" />
                  <circle cx="14.5" cy="12" r="6.5" opacity="0.5" />
                </svg>
                <span className="text-white/50 text-xs font-medium">Mastercard</span>
              </div>

              {/* Discover */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:border-blue-500/30 transition-colors">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13v6l4-3-4-3z" />
                </svg>
                <span className="text-white/50 text-xs font-medium">Discover</span>
              </div>

              {/* AMEX */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:border-cyan-500/30 transition-colors">
                <svg className="h-5 w-5 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2 7h3.5L7 10.5 8.5 7H22v10h-8.5L12 13.5 10.5 17H2V7zm1.5 1.5v7h2l1.5-3.5 1.5 3.5h2v-7h-1.5v4.5l-1.5-3h-1l-1.5 3V8.5h-1.5zm9 0v7h1.5v-2.5h2l1.5 2.5h1.5l-1.5-2.5c1 0 1.5-.75 1.5-2s-.5-2.5-2-2.5h-4.5zm1.5 1.5h2c.5 0 1 .33 1 1s-.5 1-1 1h-2v-2zm5.5-1.5v7h1.5v-2.5h1l1.5 2.5H24l-1.5-2.5c1 0 1.5-.75 1.5-2s-.5-2.5-2-2.5H19.5zM21 10h-2v2h2c.5 0 1-.33 1-1s-.5-1-1-1z" />
                </svg>
                <span className="text-white/50 text-xs font-medium">AMEX</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image src="/logo-icon.svg" alt="TestCEFR home" width={40} height={40} className="h-10 w-10" />
            <span className="text-white font-semibold text-base">
              test<span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">cefr</span><span className="text-blue-300">.com</span>
            </span>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <p className="text-[#9494a8] text-xs">
              Secure payments powered by PayPal
            </p>
            <span className="hidden sm:inline text-white/10">|</span>
            <p className="text-[#9494a8] text-xs">
              &copy; {new Date().getFullYear()} CEFR Test. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
