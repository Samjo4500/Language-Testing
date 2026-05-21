'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[#0A0618] border-t border-white/5 py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3.5 mb-4">
              <img src="/logo-icon.svg" alt="CEFR Test" className="h-10 w-10 sm:h-12 sm:w-12" />
              <div className="flex flex-col">
                <span className="text-white font-bold text-base sm:text-lg tracking-tight leading-tight">
                  test<span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">cefr</span><span className="text-purple-300">.com</span>
                </span>
                <span className="text-white/60 text-[10px] uppercase tracking-[0.2em] leading-tight">English Assessment</span>
              </div>
            </div>
            <p className="text-sm text-white/60 leading-relaxed mb-4">
              AI-powered English proficiency assessment aligned with the Common European Framework of Reference.
            </p>
            <div className="flex items-center gap-3 text-white/60">
              <a href="https://twitter.com/testcefr" target="_blank" rel="noopener noreferrer" className="text-xs hover:text-white/60 transition-colors cursor-pointer">Twitter / X</a>
              <span>&middot;</span>
              <a href="https://linkedin.com/company/testcefr" target="_blank" rel="noopener noreferrer" className="text-xs hover:text-white/60 transition-colors cursor-pointer">LinkedIn</a>
            </div>
          </div>

          {/* Product */}
          <div>
            <p className="text-white font-semibold text-sm mb-4">Product</p>
            <div className="space-y-2.5">
              <Link href="/" className="block text-sm text-white/60 hover:text-white/70 transition-colors">Home</Link>
              <Link href="/pricing" className="block text-sm text-white/60 hover:text-white/70 transition-colors">Pricing</Link>
              <Link href="/quick-tour" className="block text-sm text-white/60 hover:text-white/70 transition-colors">Quick Tour</Link>
              <Link href="/sample-certificate" className="block text-sm text-white/60 hover:text-white/70 transition-colors">Sample Certificate</Link>
              <Link href="/sample-report" className="block text-sm text-white/60 hover:text-white/70 transition-colors">Sample Report</Link>
              <Link href="/register" className="block text-sm text-white/60 hover:text-white/70 transition-colors">Get Started</Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <p className="text-white font-semibold text-sm mb-4">Company</p>
            <div className="space-y-2.5">
              <Link href="/about" className="block text-sm text-white/60 hover:text-white/70 transition-colors">About</Link>
              <Link href="/faq" className="block text-sm text-white/60 hover:text-white/70 transition-colors">FAQ</Link>
              <Link href="/contact" className="block text-sm text-white/60 hover:text-white/70 transition-colors">Contact</Link>
              <Link href="/sample-certificate" className="block text-sm text-white/60 hover:text-white/70 transition-colors">Verify Certificate</Link>
              <Link href="/privacy" className="block text-sm text-white/60 hover:text-white/70 transition-colors">Privacy</Link>
              <Link href="/terms" className="block text-sm text-white/60 hover:text-white/70 transition-colors">Terms</Link>
            </div>
          </div>

          {/* Account */}
          <div>
            <p className="text-white font-semibold text-sm mb-4">Account</p>
            <div className="space-y-2.5">
              <Link href="/dashboard" className="block text-sm text-white/60 hover:text-white/70 transition-colors">Dashboard</Link>
              <Link href="/login" className="block text-sm text-white/60 hover:text-white/70 transition-colors">Sign In</Link>
              <Link href="/register" className="block text-sm text-white/60 hover:text-white/70 transition-colors">Create Account</Link>
              <Link href="/pricing" className="block text-sm text-white/60 hover:text-white/70 transition-colors">Pricing</Link>
              <Link href="/quick-tour" className="block text-sm text-white/60 hover:text-white/70 transition-colors">Quick Tour</Link>
            </div>
          </div>
        </div>

        {/* Trust & Security Badges */}
        <div className="mt-10 pt-8 border-t border-white/5">
          <div className="flex flex-col items-center gap-5">
            <p className="text-white/50 text-xs uppercase tracking-[0.15em] font-semibold">Trust &amp; Security</p>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              {/* GDPR Compliant */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:border-purple-500/30 transition-colors">
                <svg className="h-5 w-5 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
                <span className="text-white/50 text-xs font-medium">GDPR Compliant</span>
              </div>

              {/* SSL Secure */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:border-green-500/30 transition-colors">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:border-orange-500/30 transition-colors">
                <svg className="h-5 w-5 text-orange-400" viewBox="0 0 24 24" fill="currentColor">
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
            <img src="/logo-icon.svg" alt="CEFR Test" className="h-9 w-9" />
            <span className="text-white font-semibold text-sm">
              test<span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">cefr</span><span className="text-purple-300">.com</span>
            </span>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <p className="text-white/50 text-xs">
              Secure payments powered by PayPal
            </p>
            <span className="hidden sm:inline text-white/10">|</span>
            <p className="text-white/50 text-xs">
              &copy; {new Date().getFullYear()} CEFR Test. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
