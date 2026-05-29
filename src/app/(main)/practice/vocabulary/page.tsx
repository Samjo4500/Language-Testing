'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import InteractiveVocabulary from '@/components/InteractiveVocabulary';
import { useAuthStore } from '@/lib/auth-store';
import { Brain, ArrowLeft, BookOpen, Loader2, LogIn, Sparkles } from 'lucide-react';

export default function VocabularyPracticePage() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuthStore();
  const [progress, setProgress] = useState<{ mastered: number; learning: number; total: number } | null>(null);
  const [progressLoading, setProgressLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProgressLoading(false);
      return;
    }

    const fetchProgress = async () => {
      try {
        const res = await fetch('/api/vocabulary/progress', { credentials: 'same-origin' });
        if (res.ok) {
          const data = await res.json();
          setProgress({
            mastered: data.mastered || 0,
            learning: data.learning || 0,
            total: data.totalWords || 0,
          });
        }
      } catch {
        // Silently fail
      }
      setProgressLoading(false);
    };

    fetchProgress();
  }, [isAuthenticated]);

  // ── Loading state ──
  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
        <Navbar />
        <div className="flex-1 py-8 px-4">
          <div className="container max-w-4xl mx-auto space-y-6">
            <Skeleton className="h-8 w-64 bg-white/5" />
            <Skeleton className="h-96 w-full bg-white/5" />
          </div>
        </div>
      </div>
    );
  }

  // ── Not authenticated ──
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4 py-12 relative">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="orb orb-violet w-[400px] h-[400px] -top-20 -right-20 animate-float-slow" />
            <div className="orb orb-blue w-[300px] h-[300px] bottom-0 left-1/4 animate-float-reverse" />
          </div>
          <div className="w-full max-w-md relative">
            <div className="glass-card p-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 text-white mb-5 shadow-lg shadow-violet-500/25">
                <Brain className="h-7 w-7" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Vocabulary Practice</h1>
              <p className="text-sm text-white/50 mb-6">
                Sign in to practice vocabulary with interactive fill-in-the-gap exercises and spaced repetition.
              </p>
              <Link href="/login?redirect=/practice/vocabulary">
                <button className="w-full flex items-center justify-center gap-2 rounded-xl py-3 bg-gradient-to-r from-violet-600 to-blue-500 hover:from-violet-500 hover:to-blue-400 text-white font-semibold transition-all duration-300 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-0.5 cursor-pointer">
                  <LogIn className="h-4 w-4" />
                  Sign in to Practice
                </button>
              </Link>
              <p className="text-xs text-white/30 mt-4">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="text-violet-400 hover:text-violet-300 transition-colors">
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
      <Navbar />
      <div className="flex-1 py-6 px-4">
        <div className="container max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="text-white/30 hover:text-white/60 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 flex items-center justify-center border border-violet-400/20">
                  <Image src="/logo-icon.svg" alt="TestCEFR" width={24} height={24} className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white flex items-center gap-2">
                    Vocabulary Practice
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-violet-400/30 text-violet-400">
                      NEW
                    </Badge>
                  </h1>
                  <p className="text-xs text-white/40">Fill in the gap &mdash; master words by level</p>
                </div>
              </div>
            </div>
            <Link href="/vocabulary">
              <Button variant="ghost" size="sm" className="text-white/40 hover:text-white hover:bg-white/5">
                <BookOpen className="w-4 h-4 mr-1.5" />
                Flashcard Mode
              </Button>
            </Link>
          </div>

          {/* Progress summary bar */}
          {progress && !progressLoading && (
            <div className="flex items-center gap-4 text-xs text-white/40 mb-6 bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                <span className="text-white font-medium">{progress.mastered}</span> mastered
              </span>
              <span className="text-white/15">|</span>
              <span className="flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-white font-medium">{progress.learning}</span> learning
              </span>
              <span className="text-white/15">|</span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-white font-medium">{progress.total}</span> total words
              </span>
            </div>
          )}

          {/* Interactive Vocabulary Component */}
          <InteractiveVocabulary
            onComplete={() => {
              // Refresh progress after completing a session
              fetch('/api/vocabulary/progress', { credentials: 'same-origin' })
                .then(res => res.ok ? res.json() : null)
                .then(data => {
                  if (data) {
                    setProgress({
                      mastered: data.mastered || 0,
                      learning: data.learning || 0,
                      total: data.totalWords || 0,
                    });
                  }
                })
                .catch(() => {});
            }}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}
