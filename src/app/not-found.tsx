'use client';

import { Navbar } from '@/components/navbar';
import { SearchX, Home, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="glass-card p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400 mb-6">
              <SearchX className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">404</h1>
            <h2 className="text-lg font-medium text-white/70 mb-2">Page not found</h2>
            <p className="text-sm text-white/40 mb-6">
              The page you are looking for does not exist or has been moved. Check the URL or navigate back to the homepage.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/">
                <button className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-purple-500/25 cursor-pointer">
                  <Home className="h-4 w-4" />
                  Go home
                </button>
              </Link>
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 glass-button text-white font-semibold text-sm cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                Go back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
