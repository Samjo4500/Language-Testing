'use client';

import { useEffect } from 'react';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Auth error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F0A1E] px-4">
      <div className="w-full max-w-md">
        <div className="glass-card p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-400 mb-6">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
          <p className="text-sm text-white/50 mb-6">
            An unexpected error occurred on this page. Please try again or return to the login page.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-blue-500/25 cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              Try again
            </button>
            <Link href="/login">
              <button className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 border border-[#4a4a5a] text-white/80 hover:text-white hover:border-white/30 font-semibold text-sm cursor-pointer transition-colors">
                <Home className="h-4 w-4" />
                Go to login
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
