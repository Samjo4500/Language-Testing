'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { CheckCircle2, XCircle, Mail, ArrowRight, Loader2 } from 'lucide-react';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'idle'>(token ? 'loading' : 'idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!token) return;

    const doVerify = async () => {
      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
        const data = await response.json();

        if (response.ok) {
          setStatus('success');
        } else {
          setStatus('error');
          setErrorMessage(data.error || 'Verification failed. The link may have expired.');
        }
      } catch {
        setStatus('error');
        setErrorMessage('Network error. Please try again.');
      }
    };
    doVerify();
  }, [token]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="glass-card p-8 text-center">

            {/* No token provided */}
            {!token && (
              <>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20 mb-6">
                  <Mail className="h-8 w-8 text-purple-400" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-3">Check Your Email</h1>
                <p className="text-white/50 text-sm mb-6 leading-relaxed">
                  We&apos;ve sent a verification link to your email address. Click the link in the email to verify your account.
                  The link expires in 24 hours.
                </p>
                <div className="space-y-3">
                  <Link href="/login">
                    <button className="w-full flex items-center justify-center gap-2 rounded-xl py-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold transition-all duration-300 shadow-lg shadow-purple-500/25 cursor-pointer">
                      Go to Sign In
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </Link>
                </div>
              </>
            )}

            {/* Loading */}
            {token && status === 'loading' && (
              <>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20 mb-6 animate-pulse">
                  <Loader2 className="h-8 w-8 text-purple-400 animate-spin" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-3">Verifying Your Email</h1>
                <p className="text-white/50 text-sm">Please wait while we verify your email address...</p>
              </>
            )}

            {/* Success */}
            {status === 'success' && (
              <>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/20 mb-6">
                  <CheckCircle2 className="h-8 w-8 text-green-400" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-3">Email Verified!</h1>
                <p className="text-white/50 text-sm mb-6 leading-relaxed">
                  Your email address has been successfully verified. You can now access all features of your account.
                </p>
                <div className="space-y-3">
                  <Link href="/dashboard">
                    <button className="w-full flex items-center justify-center gap-2 rounded-xl py-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold transition-all duration-300 shadow-lg shadow-purple-500/25 cursor-pointer">
                      Go to Dashboard
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </Link>
                  <Link href="/test">
                    <button className="w-full rounded-xl py-3 glass-button text-white font-medium cursor-pointer">
                      Take a Test
                    </button>
                  </Link>
                </div>
              </>
            )}

            {/* Error */}
            {status === 'error' && (
              <>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500/20 to-rose-500/20 border border-red-500/20 mb-6">
                  <XCircle className="h-8 w-8 text-red-400" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-3">Verification Failed</h1>
                <p className="text-white/50 text-sm mb-6 leading-relaxed">
                  {errorMessage || 'The verification link is invalid or has expired. Please request a new one.'}
                </p>
                <div className="space-y-3">
                  <Link href="/login">
                    <button className="w-full flex items-center justify-center gap-2 rounded-xl py-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold transition-all duration-300 shadow-lg shadow-purple-500/25 cursor-pointer">
                      Go to Sign In
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            <div className="glass-card p-8 text-center">
              <Loader2 className="h-8 w-8 text-purple-400 animate-spin mx-auto mb-4" />
              <p className="text-white/50 text-sm">Loading...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
