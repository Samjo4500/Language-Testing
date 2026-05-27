'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';
import { useHydrated } from '@/hooks/use-hydrated';

export function HeroCTA() {
  const { isAuthenticated } = useAuthStore();
  const mounted = useHydrated();
  const isAuth = mounted && isAuthenticated;
  return (
    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center animate-scale-in delay-500">
      <Link href={isAuth ? '/dashboard' : '/register'}>
        <button className="group flex items-center justify-center gap-2 rounded-xl px-8 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-base transition-all duration-300 shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-1 cursor-pointer w-full sm:w-auto">
          Start Free Assessment
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </Link>
      <Link href="/courses">
        <button className="glass-button rounded-xl px-8 py-3.5 text-white font-medium text-base cursor-pointer w-full sm:w-auto">
          Browse Courses
        </button>
      </Link>
    </div>
  );
}
