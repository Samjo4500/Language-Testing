'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ShieldCheck, Eye, EyeOff, CheckCircle2, ArrowRight } from 'lucide-react';

function ResetPasswordForm() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Invalid or missing reset token. Please request a new password reset link.');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      setError('Password must contain at least one uppercase letter.');
      return;
    }

    if (!/[0-9]/.test(newPassword)) {
      setError('Password must contain at least one number.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/reset-password/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
        credentials: 'same-origin',
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to reset password. Please try again.');
        return;
      }

      setIsSuccess(true);
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* If no token, show error state */
  if (!token) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4 py-12 relative">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="orb orb-violet w-[400px] h-[400px] -top-20 -right-20 animate-float-slow" />
            <div className="orb orb-violet w-[300px] h-[300px] bottom-0 left-1/4 animate-float-reverse" />
          </div>
          <div className="w-full max-w-md relative">
            <div className="glass-card p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 text-white mb-4 shadow-lg shadow-blue-500/25">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold text-white">Invalid Link</h1>
              <p className="text-sm text-white/50 mt-2 leading-relaxed">
                This password reset link is invalid or has expired. Please request a new one.
              </p>
              <div className="mt-6">
                <Link
                  href="/forgot-password"
                  className="inline-flex items-center gap-2 rounded-xl px-8 py-3 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
                >
                  Request New Link
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-12 relative">
        {/* Background orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="orb orb-violet w-[400px] h-[400px] -top-20 -left-20 animate-float-slow" />
          <div className="orb orb-violet w-[300px] h-[300px] bottom-0 right-1/4 animate-float-reverse" />
        </div>

        <div className="w-full max-w-md relative">
          <div className="glass-card p-8">
            {isSuccess ? (
              /* ===== SUCCESS STATE ===== */
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 text-white mb-4 shadow-lg shadow-green-500/25">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h1 className="text-2xl font-bold text-white">Password Reset</h1>
                <p className="text-sm text-white/50 mt-2 leading-relaxed">
                  Your password has been successfully reset. You can now sign in with your new password.
                </p>
                <div className="mt-6">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 rounded-xl px-8 py-3 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
                  >
                    Sign in
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ) : (
              /* ===== FORM STATE ===== */
              <>
                <div className="text-center mb-6">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#3b82f6] text-white mb-4 shadow-lg shadow-blue-500/25">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <h1 className="text-2xl font-bold text-white">Reset your password</h1>
                  <p className="text-sm text-white/50 mt-1">
                    Enter your new password below to regain access to your account.
                  </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3">
                      <p className="text-sm text-red-400">{error}</p>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-white/70">New password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="At least 6 characters"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                        className="pr-10 bg-white/5 border-white/10 text-white placeholder-white/30 rounded-xl glow-input focus:border-violet-500/50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-white/70">Confirm new password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="Re-enter your new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                        className="pr-10 bg-white/5 border-white/10 text-white placeholder-white/30 rounded-xl glow-input focus:border-violet-500/50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                        aria-label={showConfirm ? 'Hide password' : 'Show password'}
                      >
                        {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 rounded-xl py-3 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Resetting password...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="h-4 w-4" />
                        Reset Password
                      </>
                    )}
                  </button>
                </form>
                <div className="mt-6 text-center">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors"
                  >
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0F0A1E] flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-violet-400" /></div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
