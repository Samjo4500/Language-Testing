'use client';

import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import {
  QrCode, Search, ArrowRight, Shield, CheckCircle2, FileCheck
} from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VerifyCertificatePage() {
  const [verificationId, setVerificationId] = useState('');
  const router = useRouter();

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationId.trim()) {
      router.push(`/verify/${verificationId.trim()}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
      <Navbar />

      <div className="flex-1 py-20 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
              <QrCode className="h-3.5 w-3.5 text-purple-400" />
              <span className="text-xs text-purple-300 font-medium uppercase tracking-wider">Certificate Verification</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white">
              Verify a Certificate
            </h1>
            <p className="mt-4 text-white/50 max-w-lg mx-auto text-base">
              Enter the verification ID from a CEFR Test certificate to confirm its authenticity. You can find this ID on the certificate or scan the QR code.
            </p>
          </div>

          {/* Verification form */}
          <div className="gradient-border-wrap rounded-[21px] p-[1px] mb-10">
            <div className="glass-card-neon p-8 md:p-10 h-full">
              <form onSubmit={handleVerify}>
                <label htmlFor="verificationId" className="block text-sm font-medium text-white mb-2">
                  Verification ID
                </label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                    <input
                      id="verificationId"
                      type="text"
                      value={verificationId}
                      onChange={(e) => setVerificationId(e.target.value)}
                      placeholder="e.g., TC-A1B2C3-D4E5F6"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!verificationId.trim()}
                    className="group flex items-center gap-2 rounded-xl px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Verify
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </form>

              <div className="mt-6 pt-6 border-t border-white/5">
                <p className="text-xs text-white/30 mb-3">How to find the verification ID:</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="flex items-start gap-2">
                    <QrCode className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                    <span className="text-xs text-white/50">Scan the QR code on the certificate PDF</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <FileCheck className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                    <span className="text-xs text-white/50">Find the ID printed below the QR code</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* What verification shows */}
          <div className="glass-card p-6 mb-10">
            <h3 className="text-base font-semibold text-white mb-4">What Verification Confirms</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { icon: <CheckCircle2 className="h-5 w-5" />, title: 'Authenticity', desc: 'Confirms the certificate was issued by CEFR Test' },
                { icon: <Shield className="h-5 w-5" />, title: 'CEFR Level', desc: 'Shows the verified proficiency level and score' },
                { icon: <FileCheck className="h-5 w-5" />, title: 'Details', desc: 'Displays test date, skills breakdown, and certificate status' },
              ].map((item) => (
                <div key={item.title} className="text-center">
                  <div className="flex justify-center mb-2 text-purple-400">{item.icon}</div>
                  <h4 className="text-sm font-medium text-white">{item.title}</h4>
                  <p className="text-xs text-white/40 mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <p className="text-sm text-white/40 mb-3">Don&apos;t have a certificate yet?</p>
            <Link href="/register">
              <button className="group flex items-center gap-2 mx-auto rounded-xl px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-blue-500/25 cursor-pointer">
                Take Your Free Assessment
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
