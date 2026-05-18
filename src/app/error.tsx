'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0F0A1E] px-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="orb orb-purple w-[400px] h-[400px] -top-24 -right-24 animate-float-slow" />
        <div className="orb orb-pink w-[250px] h-[250px] bottom-0 left-1/4 animate-float-reverse" />
      </div>

      <div className="relative text-center max-w-lg mx-auto">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/20">
            <AlertTriangle className="h-10 w-10 text-red-400" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
          Something Went Wrong
        </h1>

        {/* Description */}
        <p className="text-white/50 text-base mb-8 leading-relaxed">
          We encountered an unexpected error while processing your request. This has been logged and our team will investigate. Please try again or return to the homepage.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 rounded-xl px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 cursor-pointer w-full sm:w-auto"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
          <Link href="/">
            <button className="flex items-center justify-center gap-2 rounded-xl px-6 py-3 glass-button text-white font-medium text-sm cursor-pointer w-full sm:w-auto">
              <Home className="h-4 w-4" />
              Go Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
