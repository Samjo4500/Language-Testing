'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/auth-store';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2, CreditCard, ArrowRight, BookOpen, Award, Download, QrCode, Loader2, Sparkles, Shield, Zap, LogIn, BarChart3, AlertCircle, RotateCcw, GraduationCap, Compass, Trophy, Clock, Layers, Play } from 'lucide-react';
import { isPaidPlan, getPlanLabel, getPlanBadgeClasses } from '@/lib/plan-utils';

/* ============================================================
   TYPES
   ============================================================ */
interface CertificateInfo {
  id: string;
  verificationId: string;
  userName: string;
  cefrLevel: string;
  score: number;
  issuedAt: string;
  assessmentId: string;
  completedAt: string;
}

interface CourseEnrollment {
  id: string;
  status: string;
  progress: number;
  enrolledAt: string;
  lastAccessedAt: string;
  completedAt: string | null;
  certificateId: string | null;
  currentModuleId: string | null;
  currentLessonId: string | null;
  completed: boolean;
  completedLessons: number;
  totalLessons: number;
  courseId: string;
  courseTitle?: string;
  courseSubtitle?: string;
  level?: string;
  moduleId?: string;
  lessonId?: string;
  course?: {
    id: string;
    slug: string;
    title: string;
    subtitle: string;
    level: string;
    imageUrl: string | null;
    modulesCount: number;
    lessonsCount: number;
    estimatedHours: number;
  };
}

/* ============================================================
   CEFR GRADIENTS (ALL-BLUE)
   ============================================================ */
const CEFR_GRADIENTS: Record<string, string> = {
  A1: 'from-sky-400 to-blue-500',
  A2: 'from-blue-400 to-sky-500',
  B1: 'from-blue-500 to-indigo-500',
  B2: 'from-indigo-400 to-blue-600',
  C1: 'from-indigo-500 to-blue-700',
  C2: 'from-blue-600 to-indigo-700',
};

/* ============================================================
   TIER COLOR CONFIG (ALL-BLUE)
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
    icon: <GraduationCap className="h-5 w-5" />,
    shadow: 'shadow-sky-500/20',
    glowBg: 'bg-sky-500/5',
  },
  intermediate: {
    gradient: 'from-blue-500 to-indigo-600',
    badge: 'bg-blue-500/15 text-blue-300 border-blue-500/25',
    progressBar: 'bg-gradient-to-r from-blue-400 to-indigo-400',
    progressBg: 'bg-blue-500/10',
    buttonGradient: 'from-blue-600 to-indigo-500',
    icon: <BarChart3 className="h-5 w-5" />,
    shadow: 'shadow-blue-500/20',
    glowBg: 'bg-blue-500/5',
  },
  advanced: {
    gradient: 'from-indigo-500 to-blue-700',
    badge: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/25',
    progressBar: 'bg-gradient-to-r from-indigo-400 to-blue-500',
    progressBg: 'bg-indigo-500/10',
    buttonGradient: 'from-indigo-600 to-blue-700',
    icon: <Trophy className="h-5 w-5" />,
    shadow: 'shadow-indigo-500/20',
    glowBg: 'bg-indigo-500/5',
  },
};

function getTierFromLevel(level: string): string {
  const l = level?.toLowerCase() || '';
  if (l.startsWith('a')) return 'beginner';
  if (l.startsWith('b')) return 'intermediate';
  if (l.startsWith('c')) return 'advanced';
  return 'beginner';
}

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authIsLoading, user } = useAuthStore();
  const [certificates, setCertificates] = useState<CertificateInfo[]>([]);
  const [certificatesLoading, setCertificatesLoading] = useState(true);
  const [certificatesError, setCertificatesError] = useState<string | null>(null);
  const [inProgressAssessment, setInProgressAssessment] = useState<{ id: string; startedAt: string } | null>(null);
  const [courseEnrollments, setCourseEnrollments] = useState<CourseEnrollment[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  useEffect(() => {
    if (authIsLoading || !isAuthenticated) return;

    const fetchDashboardData = async () => {
      // Fetch certificates and in-progress assessment in parallel
      const [certsResult, progressResult] = await Promise.allSettled([
        fetch('/api/certificates/list/', { credentials: 'same-origin' }).then(res => res.ok ? res.json() : Promise.reject('Failed')),
        fetch('/api/assessments/start/', { method: 'GET', credentials: 'same-origin' }).then(res => res.ok ? res.json() : Promise.reject('Failed')),
      ]);

      // Process certificates
      if (certsResult.status === 'fulfilled') {
        setCertificates(certsResult.value.certificates);
      } else {
        setCertificatesError('Failed to load certificates. Please try again later.');
      }
      setCertificatesLoading(false);

      // Process in-progress assessment
      if (progressResult.status === 'fulfilled' && progressResult.value.hasInProgress && progressResult.value.assessment) {
        setInProgressAssessment(progressResult.value.assessment);
      }

      // Fetch user's enrolled courses
      const coursesResult = await Promise.allSettled([
        fetch('/api/courses/my-courses/', { credentials: 'same-origin' }).then(res => res.ok ? res.json() : Promise.reject('Failed')),
      ]);
      if (coursesResult[0].status === 'fulfilled') {
        setCourseEnrollments(coursesResult[0].value.enrollments || []);
      }
      setCoursesLoading(false);
    };

    fetchDashboardData();
  }, [authIsLoading, isAuthenticated]);

  if (authIsLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
        <Navbar />
        <div className="flex-1 py-8 px-4">
          <div className="container max-w-4xl mx-auto space-y-6">
            <Skeleton className="h-8 w-48 bg-white/5" />
            <Skeleton className="h-32 w-full bg-white/5" />
            <Skeleton className="h-48 w-full bg-white/5" />
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated - show sign-in prompt instead of redirecting
  // This prevents redirect loops on preview URLs and when API is unreachable
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4 py-12 relative">
          {/* Background orbs */}
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
                Access your dashboard, certificates, and CEFR assessments by signing in to your account.
              </p>
              <Link href="/login?redirect=/dashboard">
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
      </div>
    );
  }

  // Dynamic welcome message based on user state
  const hasCourses = courseEnrollments.length > 0;
  const hasInProgressCourse = courseEnrollments.some(e => e.progress > 0 && e.progress < 100);
  const welcomeSubtext = hasInProgressCourse
    ? 'Continue your learning journey — pick up where you left off!'
    : hasCourses
      ? 'Track your progress and keep building your English skills.'
      : 'Manage your CEFR assessment and account from here.';

  return (
    <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
      <Navbar />
      <div className="flex-1 py-8 px-4">
        <div className="container max-w-4xl mx-auto space-y-6">
          {/* Welcome Section */}
          <div>
            <h1 className="text-2xl font-bold text-white">
              Welcome back, <span className="gradient-text-static">{user.name || user.email}</span>!
            </h1>
            <p className="text-white/50 mt-1">
              {welcomeSubtext}
            </p>
          </div>

          {/* Account Status */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-400" />
              Account Status
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white/70">Current Plan:</span>
                  <span className={`inline-flex items-center rounded-full px-3 py-0.5 text-sm font-medium ${getPlanBadgeClasses(user.plan)}`}>
                    {getPlanLabel(user.plan)}
                  </span>
                </div>
                <p className="text-sm text-white/40">
                  {isPaidPlan(user.plan)
                    ? 'You have full access to all assessments and features.'
                    : 'Sandbox preview — all features are available for free. Browse our courses to get started!'}
                </p>
              </div>
              {!isPaidPlan(user.plan) && (
                <Link href="/courses">
                  <button className="flex items-center gap-2 rounded-xl px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 cursor-pointer">
                    <BookOpen className="h-4 w-4" />
                    Browse Courses
                  </button>
                </Link>
              )}
            </div>
          </div>

          {/* Resume Assessment Banner */}
          {inProgressAssessment && (
            <div className="glass-card p-5 border-blue-500/30 bg-blue-500/5 cursor-pointer group" onClick={() => router.push('/test')}>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 text-white shadow-lg transition-transform duration-300 group-hover:scale-110 animate-pulse">
                  <RotateCcw className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white text-base">Resume Your Assessment</h3>
                  <p className="text-xs text-blue-300/80 mt-0.5">
                    You have an unfinished CEFR assessment. Click here to continue where you left off.
                  </p>
                  <p className="text-xs text-white/30 mt-1">
                    Started {new Date(inProgressAssessment.startedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-blue-400 shrink-0 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="glass-card p-5 cursor-pointer group" onClick={() => router.push('/test')}>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-cyan-500 text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Take CEFR Test</h3>
                  <p className="text-xs text-white/40">Start your English proficiency assessment</p>
                </div>
              </div>
              <div className="mt-3 flex items-center text-sm text-blue-400 font-medium">
                Start now <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>

            {/* Browse Courses - visible for ALL users */}
            <div className="glass-card p-5 cursor-pointer group" onClick={() => router.push('/courses')}>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                  <Compass className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Browse Courses</h3>
                  <p className="text-xs text-white/40">Explore CEFR-aligned English courses</p>
                </div>
              </div>
              <div className="mt-3 flex items-center text-sm text-blue-400 font-medium">
                Explore <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>

            {!isPaidPlan(user.plan) && (
              <div className="glass-card p-5 cursor-pointer group" onClick={() => router.push('/learn')}>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 to-blue-500 text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    <Play className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Continue Learning</h3>
                    <p className="text-xs text-white/40">Pick up your courses where you left off</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center text-sm text-blue-400 font-medium">
                  Go to learning <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            )}

            {isPaidPlan(user.plan) && (
              <div className="glass-card p-5 cursor-pointer group" onClick={() => router.push('/#cefr-levels')}>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">CEFR Levels Guide</h3>
                    <p className="text-xs text-white/40">Learn about proficiency levels</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center text-sm text-blue-400 font-medium">
                  Learn more <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            )}
          </div>

          {/* My Courses - Enhanced Section */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-400" />
                My Courses
              </h2>
              {courseEnrollments.length > 0 && (
                <Link href="/learn" className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
                  View All Courses <ArrowRight className="h-3 w-3" />
                </Link>
              )}
            </div>

            {coursesLoading ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {[1, 2].map(i => (
                  <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-xl bg-white/5" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-32 bg-white/5" />
                        <Skeleton className="h-3 w-24 bg-white/5" />
                      </div>
                    </div>
                    <Skeleton className="h-2 w-full bg-white/5 rounded-full" />
                  </div>
                ))}
              </div>
            ) : courseEnrollments.length === 0 ? (
              <div className="text-center py-10 space-y-4">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-blue-400">
                  <BookOpen className="h-10 w-10" />
                </div>
                <h3 className="text-lg font-bold text-white">Start Your Learning Journey</h3>
                <p className="text-white/40 text-sm max-w-sm mx-auto">
                  Explore our curated CEFR-aligned courses to improve your English skills at every proficiency level.
                </p>
                <Link href="/courses">
                  <button className="mt-2 inline-flex items-center gap-2 rounded-xl px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 cursor-pointer">
                    <Sparkles className="h-4 w-4" />
                    Explore Courses
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                {courseEnrollments.map((enrollment) => {
                  const level = enrollment.course?.level || enrollment.level || '';
                  const tier = getTierFromLevel(level);
                  const colors = TIER_COLORS[tier];
                  const isCompleted = enrollment.completed || enrollment.progress >= 100;
                  const progressPercent = Math.min(enrollment.progress || 0, 100);
                  const completedLessons = enrollment.completedLessons || 0;
                  const totalLessons = enrollment.totalLessons || 0;

                  return (
                    <div
                      key={enrollment.id || enrollment.courseId}
                      className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/8 transition-colors relative overflow-hidden group"
                    >
                      {/* Tier glow background */}
                      <div className={`absolute top-0 right-0 w-32 h-32 ${colors.glowBg} rounded-full blur-3xl -mr-8 -mt-8 pointer-events-none`} />

                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 relative">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${colors.gradient} text-white shadow-lg ${colors.shadow}`}>
                              {colors.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-semibold text-white text-sm truncate">
                                  {enrollment.course?.title || enrollment.courseTitle || 'Untitled Course'}
                                </h3>
                                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium border ${colors.badge}`}>
                                  {level}
                                </span>
                                {isCompleted && (
                                  <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium bg-blue-500/15 text-blue-300 border border-blue-500/25">
                                    <CheckCircle2 className="h-3 w-3" />
                                    Completed
                                  </span>
                                )}
                              </div>
                              {(enrollment.course?.subtitle || enrollment.courseSubtitle) && (
                                <p className="text-xs text-white/40 mt-0.5 truncate">
                                  {enrollment.course?.subtitle || enrollment.courseSubtitle}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="mt-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-white/50">{progressPercent}% complete</span>
                              <span className="text-xs text-white/30">{completedLessons}/{totalLessons} lessons</span>
                            </div>
                            <div className={`h-2 rounded-full ${colors.progressBg} overflow-hidden`}>
                              <div
                                className={`h-full rounded-full ${colors.progressBar} transition-all duration-500`}
                                style={{ width: `${progressPercent}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {isCompleted ? (
                            <Link href={`/certificate/${enrollment.certificateId || enrollment.courseId}`}>
                              <button className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg cursor-pointer">
                                <GraduationCap className="h-3 w-3" />
                                View Certificate
                              </button>
                            </Link>
                          ) : (
                            <Link href={`/learn/${enrollment.courseId}/${enrollment.currentModuleId || enrollment.moduleId || ''}?lesson=${enrollment.currentLessonId || enrollment.lessonId || ''}`}>
                              <button className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium bg-gradient-to-r ${colors.buttonGradient} text-white shadow-lg cursor-pointer`}>
                                <Play className="h-3 w-3" />
                                Continue
                                <ArrowRight className="h-3 w-3" />
                              </button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Getting Started Guide (for free users with no certificates) */}
          {user.plan === 'free' && (
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-400" />
                Getting Started
              </h2>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="text-center p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex h-10 w-10 mx-auto items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg mb-3">
                    <span className="font-bold text-sm">1</span>
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1">Take the Free Test</h3>
                  <p className="text-xs text-white/40">Your account includes 1 free CEFR assessment covering all 6 skills.</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex h-10 w-10 mx-auto items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-500 text-white shadow-lg mb-3">
                    <span className="font-bold text-sm">2</span>
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1">See Your Results</h3>
                  <p className="text-xs text-white/40">Get instant results with your CEFR level and skill-by-skill breakdown.</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex h-10 w-10 mx-auto items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-lg mb-3">
                    <span className="font-bold text-sm">3</span>
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1">Get Certified</h3>
                  <p className="text-xs text-white/40">Complete a CEFR assessment to earn a PDF certificate with QR verification — free during preview.</p>
                </div>
              </div>
            </div>
          )}

          {/* Certificates Section — visible to ALL users */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Award className="h-5 w-5 text-blue-400" />
                  Your Certificates
                </h2>
                <p className="text-xs text-white/40 mt-0.5">Your CEFR proficiency certificates with QR verification</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                <QrCode className="h-3 w-3" />
                QR Verified
              </span>
            </div>

            {certificatesLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-20 w-full bg-white/5" />
                <Skeleton className="h-20 w-full bg-white/5" />
              </div>
            ) : certificatesError ? (
              <div className="text-center py-8 space-y-3">
                <AlertCircle className="h-12 w-12 text-red-400/50 mx-auto" />
                <p className="text-red-400/70 text-sm">{certificatesError}</p>
                <button
                  className="mt-2 flex items-center gap-2 mx-auto rounded-xl px-6 py-2.5 glass-button text-white font-semibold text-sm cursor-pointer"
                  onClick={() => { setCertificatesError(null); setCertificatesLoading(true); }}
                >
                  <RotateCcw className="h-4 w-4" />
                  Retry
                </button>
              </div>
            ) : certificates.length === 0 ? (
              <div className="text-center py-8 space-y-3">
                <Award className="h-12 w-12 text-white/20 mx-auto" />
                <p className="text-white/40">No certificates yet</p>
                <p className="text-xs text-white/30">
                  Complete a CEFR assessment or course to earn your certificate with QR verification.
                </p>
                <div className="flex items-center justify-center gap-3 mt-4">
                  <button
                    className="flex items-center gap-2 rounded-xl px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-blue-500/25 cursor-pointer"
                    onClick={() => router.push('/test')}
                  >
                    <BookOpen className="h-4 w-4" />
                    Take the Test
                  </button>
                  <button
                    className="flex items-center gap-2 rounded-xl px-5 py-2.5 glass-button text-white font-semibold text-sm cursor-pointer hover:-translate-y-0.5 transition-all duration-300"
                    onClick={() => router.push('/courses')}
                  >
                    <Sparkles className="h-4 w-4" />
                    Browse Courses
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/8 transition-colors gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br ${CEFR_GRADIENTS[cert.cefrLevel] || 'from-blue-400 to-blue-600'} text-white text-sm font-bold shadow-lg`}>
                        {cert.cefrLevel}
                      </span>
                      <div>
                        <p className="font-medium text-sm text-white">CEFR {cert.cefrLevel} Certificate</p>
                        <p className="text-xs text-white/40">
                          Score: {cert.score}/100 | Issued: {new Date(cert.issuedAt).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'short', day: 'numeric',
                          })}
                        </p>
                        <p className="text-xs text-white/30 flex items-center gap-1 mt-0.5">
                          <QrCode className="h-3 w-3" />
                          ID: {cert.verificationId}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/report/${cert.verificationId}`}>
                        <button className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg cursor-pointer">
                          <BarChart3 className="h-3 w-3" />
                          Report
                        </button>
                      </Link>
                      <Link href={`/certificate/${cert.verificationId}`}>
                        <button className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium glass-button text-white cursor-pointer">
                          <Award className="h-3 w-3" />
                          View
                        </button>
                      </Link>
                      <a href={`/api/certificates/download/${cert.verificationId}`} target="_blank" rel="noopener noreferrer">
                        <button className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg cursor-pointer">
                          <Download className="h-3 w-3" />
                          PDF
                        </button>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Premium Benefits */}
          {isPaidPlan(user.plan) && (
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-400" />
                Your {getPlanLabel(user.plan)} Benefits
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  'Full CEFR proficiency assessment',
                  'Instant results with detailed analytics',
                  'Shareable proficiency certificate with QR code',
                  'Unlimited test retakes',
                  'Priority email support',
                  'Performance tracking over time',
                ].map((benefit) => (
                  <div key={benefit} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-sky-400 mt-0.5 shrink-0" />
                    <span className="text-white/60">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
