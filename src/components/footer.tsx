'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[#0A0618] border-t border-white/5 py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold text-sm shadow-lg shadow-purple-500/20">
                CE
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-base">testcefr.com</span>
                <span className="text-white/30 text-[9px] uppercase tracking-[0.2em]">English Assessment</span>
              </div>
            </div>
            <p className="text-sm text-white/40 leading-relaxed mb-4">
              AI-powered English proficiency assessment aligned with the Common European Framework of Reference.
            </p>
            <div className="flex items-center gap-3 text-white/30">
              <span className="text-xs hover:text-white/60 transition-colors cursor-pointer">Twitter / X</span>
              <span>&middot;</span>
              <span className="text-xs hover:text-white/60 transition-colors cursor-pointer">LinkedIn</span>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Product</h4>
            <div className="space-y-2.5">
              <Link href="/" className="block text-sm text-white/40 hover:text-white/70 transition-colors">Home</Link>
              <Link href="/pricing" className="block text-sm text-white/40 hover:text-white/70 transition-colors">Pricing</Link>
              <Link href="/quick-tour" className="block text-sm text-white/40 hover:text-white/70 transition-colors">Quick Tour</Link>
              <Link href="/sample-certificate" className="block text-sm text-white/40 hover:text-white/70 transition-colors">Sample Certificate</Link>
              <Link href="/register" className="block text-sm text-white/40 hover:text-white/70 transition-colors">Get Started</Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
            <div className="space-y-2.5">
              <Link href="/about" className="block text-sm text-white/40 hover:text-white/70 transition-colors">About</Link>
              <Link href="/contact" className="block text-sm text-white/40 hover:text-white/70 transition-colors">Contact</Link>
              <Link href="/privacy" className="block text-sm text-white/40 hover:text-white/70 transition-colors">Privacy</Link>
              <Link href="/terms" className="block text-sm text-white/40 hover:text-white/70 transition-colors">Terms</Link>
              <Link href="/verify" className="block text-sm text-white/40 hover:text-white/70 transition-colors">Verify Certificate</Link>
            </div>
          </div>

          {/* Account & Reports */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Account</h4>
            <div className="space-y-2.5">
              <Link href="/dashboard" className="block text-sm text-white/40 hover:text-white/70 transition-colors">Dashboard</Link>
              <Link href="/login" className="block text-sm text-white/40 hover:text-white/70 transition-colors">Sign In</Link>
              <Link href="/register" className="block text-sm text-white/40 hover:text-white/70 transition-colors">Create Account</Link>
              <Link href="/sample-certificate" className="block text-sm text-white/40 hover:text-white/70 transition-colors">Sample Certificate</Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold text-[10px]">
              CE
            </div>
            <span className="text-white/30 text-sm">testcefr.com</span>
          </div>
          <p className="text-white/20 text-xs">
            &copy; {new Date().getFullYear()} TestCEFR. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
