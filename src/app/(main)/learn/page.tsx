'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BookOpen,
  LogIn,
  Sparkles,
  ArrowRight,
  Award,
  GraduationCap,
  Clock,
  Layers,
  CheckCircle2,
  Play,
  Trophy,
  BarChart3,
  AlertCircle,
  RotateCcw,
  Loader2,
} from 'lucide-react';

/* ============================================================
   TYPES
   ============================================================ */
interface LessonInfo {
  id: string;
  lessonNumber: number;
  title: string;
  contentType: string;
  estimatedMinutes: number;
}

interface ModuleInfo {
  id: string;
  moduleNumber: number;
  title: string;
  lessons: LessonInfo[];
}

interface LessonProgressInfo {
  lessonId: string;
  completed: boolean;
  quizScore: number | null;
  quizPassed: boolean;
  timeSpentSeconds: number;
}

interface EnrollmentData {
  id: string;
  status: string;
  progress: number;
  enrolledAt: string;
  lastAccessedAt: string;
  completedAt: string | null;
  certificateId: string | null;
  currentModuleId: string | null;
  currentLessonId: string | null;
  currentModule: { id: string; moduleNumber: number; title: string } | null;
  currentLesson: { id: string; lessonNumber: number; title: string } | null;
  totalLessons: number;
  completedLessons: number;
  course: {
    id: string;
    slug: string;
    title: string;
    subtitle: string;
    level: string;
    imageUrl: string | null;
    modulesCount: number;
    lessonsCount: number;
    estimatedHours: number;
    modules: ModuleInfo[];
  };
  lessonProgress: LessonProgressInfo[];
}

/* ============================================================
   TIER COLOR CONFIG
   ============================================================ */
const TIER_COLORS: Record<string, {
  gradient: string;
  badge: string;
  progressBar: string;
  progressBg: string;
  buttonGradient: string;
  icon: React.ReactNode;
  shadow: string;
  glowBg: string;
}> = {
  beginner: {
    gradient: 'from-sky-400 to-blue-500',
    badge: 'bg-sky-500/15 text-sky-300 border-sky-500/25',
    progressBar: 'bg-gradient-to-r from-sky-400 to-blue-400',
    progressBg: 'bg-sky-500/10',
    buttonGradient: 'from-sky-500 to-blue-500',
    icon: <GraduationCap className="h-6 w-6" />,
    shadow: 'shadow-sky-500/20',
    glowBg: 'bg-sky-500/5',
  },
  intermediate: {
    gradient: 'from-blue-500 to-indigo-600',
    badge: 'bg-blue-500/15 text-blue-300 border-blue-500/25',
    progressBar: 'bg-gradient-to-r from-blue-400 to-indigo-400',
    progressBg: 'bg-blue-500/10',
    buttonGradient: 'from-blue-600 to-indigo-500',
    icon: <BarChart3 className="h-6 w-6" />,
    shadow: 'shadow-blue-500/20',
    glowBg: 'bg-blue-500/5',
  },
  advanced: {
    gradient: 'from-indigo-500 to-blue-700',
    badge: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/25',
    progressBar: 'bg-gradient-to-r from-indigo-400 to-blue-500',
    progressBg: 'bg-indigo-500/10',
    buttonGradient: 'from-indigo-600 to-blue-700',
    icon: <Trophy className="h-6 w-6" />,
    shadow: 'shadow-indigo-500/20',
    glowBg: 'bg-indigo-500/5',
  },
};

function getTierFromSlug(slug: string): string {
  if (slug?.includes('beginner') || slug?.includes('a1') || slug?.includes('a2')) return 'beginner';
  if (slug?.includes('intermediate') || slug?.includes('b1') || slug?.includes('b2')) return 'intermediate';
  if (slug?.includes('advanced') || slug?.includes('c1') || slug?.includes('c2')) return 'advanced';
  return 'beginner';
}

/* ============================================================
   GENERATE CERTIFICATE BUTTON
   ============================================================ */
function GenerateCertButton({ enrollmentId, onGenerated }: { enrollmentId: string; onGenerated: (certId: string) => void }) {
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/courses/certificate/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ enrollmentId }),
      });
      if (res.ok) {
        const data = await res.json();
        onGenerated(data.certificate.verificationId);
      }
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleGenerate}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 bg-gradient-to-r from-purple-600/80 to-pink-600/80 hover:from-purple-500 hover:to-pink-500 text-white font-medium text-sm cursor-pointer hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Award className="h-4 w-4" />
          Generate Certificate
        </>
      )}
    </button>
  );
}

/* ============================================================
   MAIN PAGE
   ============================================================ */
export default function MyCoursesPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authIsLoading, user } = useAuthStore();
  const [enrollments, setEnrollments] = useState<EnrollmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sandboxMode = typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SANDBOX_MODE === 'true';

  useEffect(() => {
    // In sandbox mode, fetch courses even without auth
    if (authIsLoading) return;
    if (!isAuthenticated && !sandboxMode) return;

    const fetchEnrollments = async () => {
      try {
        const res = await fetch('/api/courses/my-courses/', { credentials: 'same-origin' });
        if (res.status === 401) {
          router.push('/login?redirect=/learn');
          return;
        }
        if (!res.ok) throw new Error('Failed to fetch courses');
        const data = await res.json();
        setEnrollments(data.enrollments || []);
      } catch {
        setError('Failed to load your courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [authIsLoading, isAuthenticated, sandboxMode, router]);

  /* ---- Auth Loading ---- */
  if (authIsLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
        <Navbar />
        <div className="flex-1 py-8 px-4">
          <div className="container max-w-5xl mx-auto space-y-6">
            <Skeleton className="h-10 w-56 bg-white/5" />
            <Skeleton className="h-6 w-80 bg-white/5" />
            <div className="grid gap-6 sm:grid-cols-2">
              <Skeleton className="h-72 w-full bg-white/5 rounded-2xl" />
              <Skeleton className="h-72 w-full bg-white/5 rounded-2xl" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  /* ---- Not Authenticated (skip in sandbox mode) ---- */
  if (!isAuthenticated && !sandboxMode) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4 py-12 relative">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="orb orb-blue w-[400px] h-[400px] -top-20 -right-20 animate-float-slow" />
            <div className="orb orb-cyan w-[300px] h-[300px] bottom-0 left-1/4 animate-float-reverse" />
          </div>
          <div className="w-full max-w-md relative">
            <div className="glass-card p-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white mb-5 shadow-lg shadow-blue-500/25">
                <LogIn className="h-7 w-7" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Sign in to continue</h1>
              <p className="text-sm text-white/50 mb-6">
                Access your courses, track progress, and continue learning by signing in to your account.
              </p>
              <Link href="/login?redirect=/learn">
                <button className="w-full flex items-center justify-center gap-2 rounded-xl py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 cursor-pointer">
                  <Sparkles className="h-4 w-4" />
                  Sign in
                </button>
              </Link>
              <p className="text-xs text-white/30 mt-4">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  /* ---- Get first incomplete lesson for an enrollment ---- */
  const getContinueLearningUrl = (enrollment: EnrollmentData): string => {
    if (enrollment.currentModuleId && enrollment.currentLessonId) {
      return `/learn/${enrollment.course.id}/${enrollment.currentModuleId}?lesson=${enrollment.currentLessonId}`;
    }

    const completedIds = new Set(enrollment.lessonProgress.filter(lp => lp.completed).map(lp => lp.lessonId));

    for (const mod of enrollment.course.modules) {
      for (const lesson of mod.lessons) {
        if (!completedIds.has(lesson.id)) {
          return `/learn/${enrollment.course.id}/${mod.id}?lesson=${lesson.id}`;
        }
      }
    }

    if (enrollment.course.modules.length > 0 && enrollment.course.modules[0].lessons.length > 0) {
      const firstMod = enrollment.course.modules[0];
      return `/learn/${enrollment.course.id}/${firstMod.id}?lesson=${firstMod.lessons[0].id}`;
    }

    return `/learn/${enrollment.course.id}/${enrollment.course.modules[0]?.id || ''}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative dark-section hero-pattern noise-overlay overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb orb-blue w-[400px] h-[400px] -top-20 -right-20 animate-float-slow" />
          <div className="orb orb-cyan w-[300px] h-[300px] bottom-0 left-1/4 animate-float-reverse" />
          <div className="orb orb-blue w-[250px] h-[250px] top-1/2 right-1/3 animate-float" />
        </div>

        <div className="container relative mx-auto px-4 py-16 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full glass-light px-5 py-2 mb-6 animate-border-glow">
              <BookOpen className="h-4 w-4 text-blue-300" />
              <span className="text-sm text-blue-200 font-medium">My Courses</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white">
              Your Learning{' '}
              Journey
            </h1>
            <p className="mt-4 text-lg text-white/50 max-w-2xl mx-auto">
              Track your progress, continue where you left off, and achieve your English learning goals.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0F0A1E] to-transparent" />
      </section>

      {/* Main Content */}
      <section className="relative py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Loading State */}
            {loading && (
              <div className="grid gap-6 sm:grid-cols-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="glass-card p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-12 w-12 rounded-xl bg-white/5" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-5 w-40 bg-white/5" />
                        <Skeleton className="h-4 w-28 bg-white/5" />
                      </div>
                    </div>
                    <Skeleton className="h-3 w-full bg-white/5 rounded-full" />
                    <Skeleton className="h-10 w-full bg-white/5 rounded-xl" />
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {!loading && error && (
              <div className="glass-card p-8 text-center max-w-md mx-auto">
                <AlertCircle className="h-12 w-12 text-red-400/50 mx-auto mb-4" />
                <p className="text-red-400/70 text-sm mb-4">{error}</p>
                <button
                  className="inline-flex items-center gap-2 rounded-xl px-6 py-2.5 glass-button text-white font-semibold text-sm cursor-pointer"
                  onClick={() => { setError(null); setLoading(true); }}
                >
                  <RotateCcw className="h-4 w-4" />
                  Retry
                </button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && enrollments.length === 0 && (
              <div className="glass-card p-10 text-center max-w-lg mx-auto">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-blue-400 mb-6">
                  <BookOpen className="h-10 w-10" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">No Courses Yet</h2>
                <p className="text-white/50 text-sm mb-6 max-w-sm mx-auto">
                  You haven&apos;t enrolled in any courses yet. Explore our CEFR-aligned English courses and start your learning journey.
                </p>
                <Link href="/courses">
                  <button className="inline-flex items-center gap-2 rounded-xl px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 cursor-pointer">
                    <Sparkles className="h-4 w-4" />
                    Browse Courses
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            )}

            {/* Course Cards Grid */}
            {!loading && !error && enrollments.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2">
                {enrollments.map((enrollment) => {
                  const tier = getTierFromSlug(enrollment.course.slug);
                  const colors = TIER_COLORS[tier];
                  const isCompleted = enrollment.status === 'completed' || enrollment.progress >= 100;
                  const progressPercent = Math.round(enrollment.progress);
                  const continueUrl = getContinueLearningUrl(enrollment);

                  return (
                    <div key={enrollment.id} className="glass-card p-6 flex flex-col relative overflow-hidden group">
                      {/* Tier glow background */}
                      <div className={`absolute top-0 right-0 w-40 h-40 ${colors.glowBg} rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none`} />

                      {/* Header: Icon + Title */}
                      <div className="flex items-start gap-4 mb-4 relative">
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${colors.gradient} text-white shadow-lg ${colors.shadow}`}>
                          {colors.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-white truncate">
                            {enrollment.course.title}
                          </h3>
                          <p className="text-xs text-white/40 truncate">
                            {enrollment.course.subtitle}
                          </p>
                        </div>
                      </div>

                      {/* Level Badge */}
                      <div className="mb-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${colors.badge}`}>
                          <GraduationCap className="h-3 w-3" />
                          {enrollment.course.level}
                        </span>
                        {isCompleted && (
                          <span className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium bg-blue-500/15 text-blue-300 border-blue-500/25 ml-2">
                            <Award className="h-3 w-3" />
                            Completed
                          </span>
                        )}
                      </div>

                      {/* Stats Row */}
                      <div className="flex items-center gap-4 mb-4 text-xs text-white/50 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <Layers className="h-3.5 w-3.5" />
                          {enrollment.course.modulesCount} modules
                        </div>
                        <div className="flex items-center gap-1.5">
                          <BookOpen className="h-3.5 w-3.5" />
                          {enrollment.course.lessonsCount} lessons
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          {enrollment.course.estimatedHours}h
                        </div>
                      </div>

                      {/* Progress Section */}
                      <div className="mb-5">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-white/70">Progress</span>
                          <span className="text-sm font-bold gradient-text-static">{progressPercent}%</span>
                        </div>
                        <div className={`h-2.5 rounded-full ${colors.progressBg} overflow-hidden`}>
                          <div
                            className={`h-full rounded-full ${colors.progressBar} transition-all duration-700 ease-out`}
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between mt-1.5">
                          <span className="text-xs text-white/40">
                            {enrollment.completedLessons} / {enrollment.totalLessons} lessons completed
                          </span>
                          {enrollment.lastAccessedAt && (
                            <span className="text-xs text-white/30">
                              Last: {new Date(enrollment.lastAccessedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-auto flex flex-col gap-2">
                        {isCompleted ? (
                          <>
                            <Link href={continueUrl}>
                              <button className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 bg-gradient-to-r ${colors.buttonGradient} text-white font-semibold text-sm transition-all duration-300 shadow-lg ${colors.shadow} hover:-translate-y-0.5 cursor-pointer`}>
                                <Play className="h-4 w-4" />
                                Review Course
                              </button>
                            </Link>
                            {enrollment.certificateId ? (
                              <Link href={`/certificate/${enrollment.certificateId}`}>
                                <button className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 glass-button text-white font-medium text-sm cursor-pointer hover:-translate-y-0.5 transition-all duration-300">
                                  <Award className="h-4 w-4" />
                                  View Certificate
                                </button>
                              </Link>
                            ) : (
                              <GenerateCertButton enrollmentId={enrollment.id} onGenerated={(certId) => {
                                setEnrollments(prev => prev.map(e =>
                                  e.id === enrollment.id ? { ...e, certificateId: certId } : e
                                ));
                              }} />
                            )}
                          </>
                        ) : (
                          <Link href={continueUrl}>
                            <button className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 bg-gradient-to-r ${colors.buttonGradient} text-white font-semibold text-sm transition-all duration-300 shadow-lg ${colors.shadow} hover:-translate-y-0.5 cursor-pointer`}>
                              <Play className="h-4 w-4" />
                              Continue Learning
                              <ArrowRight className="h-4 w-4" />
                            </button>
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Browse More Courses Link */}
            {!loading && !error && enrollments.length > 0 && (
              <div className="mt-10 text-center">
                <Link href="/courses">
                  <button className="inline-flex items-center gap-2 rounded-xl px-6 py-2.5 glass-button text-white font-medium text-sm cursor-pointer hover:-translate-y-0.5 transition-all duration-300">
                    <BookOpen className="h-4 w-4" />
                    Browse More Courses
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
