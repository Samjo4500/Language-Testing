'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/auth-store';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { CheckCircle2, ArrowRight, BookOpen, Sparkles, GraduationCap } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { PLAN_DETAILS } from '@/lib/plans';

function PaymentSuccessContent() {
  const { user } = useAuthStore();
  const searchParams = useSearchParams();
  const planParam = searchParams.get('plan') || 'premium';
  const creditsParam = searchParams.get('credits');
  const planDetails = PLAN_DETAILS[planParam] || PLAN_DETAILS.premium;
  const isCoursePurchase = planParam.startsWith('course-');

  return (
    <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-12 relative">
        {/* Background orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="orb orb-violet w-[400px] h-[400px] top-1/4 -right-20 animate-float-slow" />
          <div className="orb orb-violet w-[300px] h-[300px] bottom-0 left-1/4 animate-float" />
        </div>

        <div className="w-full max-w-md relative">
          <div className="glass-card p-8 text-center">
            <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-white mb-4 shadow-lg animate-pulse-glow ${isCoursePurchase ? 'bg-gradient-to-br from-blue-400 to-indigo-500 shadow-blue-500/25' : 'bg-gradient-to-br from-green-400 to-emerald-500 shadow-green-500/25'}`}>
              {isCoursePurchase ? <GraduationCap className="h-8 w-8" /> : <CheckCircle2 className="h-8 w-8" />}
            </div>
            <h1 className="text-2xl font-bold text-white">
              {isCoursePurchase ? 'Course Purchase Successful!' : 'Payment Successful!'}
            </h1>
            <p className="text-sm text-white/50 mt-2">
              {isCoursePurchase
                ? `You're now enrolled in the ${planDetails.name}. Start learning and track your progress anytime.`
                : `Your account has been upgraded to ${planDetails.name}. You now have full access to the CEFR English proficiency assessment.`
              }
            </p>

            <div className="mt-6 rounded-xl bg-white/5 border border-white/5 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/50">{isCoursePurchase ? 'Course' : 'Plan'}</span>
                <span className={`text-sm font-semibold ${isCoursePurchase ? 'text-blue-400' : 'text-green-400'}`}>{planDetails.name}</span>
              </div>
              <div className="section-divider" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/50">Amount Paid</span>
                <span className="text-sm text-white">{planDetails.price}</span>
              </div>
              {creditsParam && !isCoursePurchase && (
                <>
                  <div className="section-divider" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/50">Test Credits Added</span>
                    <span className="text-sm font-semibold text-blue-400">{creditsParam} credit{parseInt(creditsParam) > 1 ? 's' : ''}</span>
                  </div>
                </>
              )}
              {user?.email && (
                <>
                  <div className="section-divider" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/50">Account</span>
                    <span className="text-sm text-white/70">{user.email}</span>
                  </div>
                </>
              )}
            </div>

            <div className="mt-6 space-y-3">
              {isCoursePurchase ? (
                <>
                  <Link href="/courses" className="block">
                    <button className="w-full flex items-center justify-center gap-2 rounded-xl py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 cursor-pointer">
                      <GraduationCap className="h-4 w-4" />
                      Go to My Courses
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </Link>

                  <Link href="/dashboard" className="block">
                    <button className="w-full flex items-center justify-center gap-2 rounded-xl py-3 glass-button text-white font-medium cursor-pointer">
                      Go to Dashboard
                    </button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/test" className="block">
                    <button className="w-full flex items-center justify-center gap-2 rounded-xl py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 cursor-pointer">
                      <BookOpen className="h-4 w-4" />
                      Start Your CEFR Test
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </Link>

                  <Link href="/dashboard" className="block">
                    <button className="w-full flex items-center justify-center gap-2 rounded-xl py-3 glass-button text-white font-medium cursor-pointer">
                      Go to Dashboard
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense>
      <PaymentSuccessContent />
    </Suspense>
  );
}
