'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, KeyRound, Mail, Sparkles, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/forgot-password/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
        credentials: 'same-origin',
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      setIsSuccess(true);
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-12 relative">
        {/* Background orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="orb orb-purple w-[400px] h-[400px] -top-20 -right-20 animate-float-slow" />
          <div className="orb orb-pink w-[300px] h-[300px] bottom-0 left-1/4 animate-float-reverse" />
        </div>

        <div className="w-full max-w-md relative">
          <div className="glass-card p-8">
            {isSuccess ? (
              /* ===== SUCCESS STATE ===== */
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 text-white mb-4 shadow-lg shadow-green-500/25">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h1 className="text-2xl font-bold text-white">Check your email</h1>
                <p className="text-sm text-white/50 mt-2 leading-relaxed">
                  If an account exists for <span className="text-white/70 font-medium">{email}</span>, we&apos;ve sent a password reset link to your inbox.
                </p>
                <p className="text-xs text-white/30 mt-3">
                  Didn&apos;t receive the email? Check your spam folder or try again.
                </p>
                <div className="mt-6">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 rounded-xl px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Login
                  </Link>
                </div>
              </div>
            ) : (
              /* ===== FORM STATE ===== */
              <>
                <div className="text-center mb-6">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white mb-4 shadow-lg shadow-purple-500/25">
                    <KeyRound className="h-6 w-6" />
                  </div>
                  <h1 className="text-2xl font-bold text-white">Forgot your password?</h1>
                  <p className="text-sm text-white/50 mt-1">
                    Enter your email address and we&apos;ll send you a link to reset your password.
                  </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3">
                      <p className="text-sm text-red-400">{error}</p>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white/70">Email address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                        className="pl-10 bg-white/5 border-white/10 text-white placeholder-white/30 rounded-xl glow-input focus:border-purple-500/50"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 rounded-xl py-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending reset link...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Send Reset Link
                      </>
                    )}
                  </button>
                </form>
                <div className="mt-6 text-center">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to Login
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
