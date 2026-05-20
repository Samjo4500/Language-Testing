'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/auth-store';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2, CreditCard, ArrowRight, BookOpen, Award, Download, QrCode, Loader2, Sparkles, Shield, Zap, LogIn, BarChart3 } from 'lucide-react';

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

const CEFR_GRADIENTS: Record<string, string> = {
  A1: 'from-blue-400 to-blue-600',
  A2: 'from-green-400 to-green-600',
  B1: 'from-yellow-400 to-yellow-600',
  B2: 'from-orange-400 to-orange-600',
  C1: 'from-red-400 to-red-600',
  C2: 'from-purple-400 to-purple-600',
};

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authIsLoading, user } = useAuthStore();
  const [certificates, setCertificates] = useState<CertificateInfo[]>([]);
  const [certificatesLoading, setCertificatesLoading] = useState(true);

  useEffect(() => {
    if (authIsLoading || !isAuthenticated) return;

    const fetchCertificates = async () => {
      try {
        const response = await fetch('/api/certificates/list');
        if (response.ok) {
          const data = await response.json();
          setCertificates(data.certificates);
        }
      } catch (error) {
        console.error('Failed to fetch certificates:', error);
      } finally {
        setCertificatesLoading(false);
      }
    };

    fetchCertificates();
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
            <div className="orb orb-purple w-[400px] h-[400px] -top-20 -right-20 animate-float-slow" />
            <div className="orb orb-pink w-[300px] h-[300px] bottom-0 left-1/4 animate-float-reverse" />
          </div>

          <div className="w-full max-w-md relative">
            <div className="glass-card p-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white mb-5 shadow-lg shadow-purple-500/25">
                <LogIn className="h-7 w-7" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Sign in to continue</h1>
              <p className="text-sm text-white/50 mb-6">
                Access your dashboard, certificates, and CEFR assessments by signing in to your account.
              </p>
              <Link href="/login">
                <button className="w-full flex items-center justify-center gap-2 rounded-xl py-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 cursor-pointer">
                  <Sparkles className="h-4 w-4" />
                  Sign in
                </button>
              </Link>
              <p className="text-xs text-white/30 mt-4">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="text-purple-400 hover:text-purple-300 transition-colors">
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
      <div className="flex-1 py-8 px-4">
        <div className="container max-w-4xl mx-auto space-y-6">
          {/* Welcome Section */}
          <div>
            <h1 className="text-2xl font-bold text-white">
              Welcome back, <span className="gradient-text-static">{user.name || user.email}</span>!
            </h1>
            <p className="text-white/50 mt-1">
              Manage your CEFR assessment and account from here.
            </p>
          </div>

          {/* Account Status */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-400" />
              Account Status
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white/70">Current Plan:</span>
                  <span className={`inline-flex items-center rounded-full px-3 py-0.5 text-sm font-medium ${
                    user.plan === 'premium'
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-white/10 text-white/50 border border-white/10'
                  }`}>
                    {user.plan === 'premium' ? 'Premium' : 'Free'}
                  </span>
                </div>
                <p className="text-sm text-white/40">
                  {user.plan === 'premium'
                    ? 'You have full access to all assessments and features.'
                    : 'Upgrade to Premium to access the full CEFR assessment.'}
                </p>
              </div>
              {user.plan !== 'premium' && (
                <Link href="/pricing">
                  <button className="flex items-center gap-2 rounded-xl px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 cursor-pointer">
                    <CreditCard className="h-4 w-4" />
                    Upgrade to Premium
                  </button>
                </Link>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid gap-4 sm:grid-cols-2">
            {user.plan === 'premium' ? (
              <div className="glass-card p-5 cursor-pointer group" onClick={() => router.push('/test')}>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Take CEFR Test</h3>
                    <p className="text-xs text-white/40">Start your English proficiency assessment</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center text-sm text-purple-400 font-medium">
                  Start now <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            ) : (
              <div className="glass-card p-5 cursor-pointer group" onClick={() => router.push('/pricing')}>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Get Premium Access</h3>
                    <p className="text-xs text-white/40">Unlock the full CEFR assessment</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center text-sm text-purple-400 font-medium">
                  View plans <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            )}

            <div className="glass-card p-5 cursor-pointer group" onClick={() => router.push('/')}>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-purple-400 to-indigo-500 text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">CEFR Levels Guide</h3>
                  <p className="text-xs text-white/40">Learn about proficiency levels</p>
                </div>
              </div>
              <div className="mt-3 flex items-center text-sm text-purple-400 font-medium">
                Learn more <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>

          {/* Certificates Section */}
          {user.plan === 'premium' && (
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Award className="h-5 w-5 text-purple-400" />
                    Your Certificates
                  </h2>
                  <p className="text-xs text-white/40 mt-0.5">Your CEFR proficiency certificates with QR verification</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  <QrCode className="h-3 w-3" />
                  QR Verified
                </span>
              </div>

              {certificatesLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-20 w-full bg-white/5" />
                  <Skeleton className="h-20 w-full bg-white/5" />
                </div>
              ) : certificates.length === 0 ? (
                <div className="text-center py-8 space-y-3">
                  <Award className="h-12 w-12 text-white/20 mx-auto" />
                  <p className="text-white/40">No certificates yet</p>
                  <p className="text-xs text-white/30">
                    Complete a CEFR assessment to earn your certificate with QR verification.
                  </p>
                  <button
                    className="mt-2 flex items-center gap-2 mx-auto rounded-xl px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-purple-500/25 cursor-pointer"
                    onClick={() => router.push('/test')}
                  >
                    <BookOpen className="h-4 w-4" />
                    Take the Test
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {certificates.map((cert) => (
                    <div
                      key={cert.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/8 transition-colors gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br ${CEFR_GRADIENTS[cert.cefrLevel] || 'from-purple-400 to-purple-600'} text-white text-sm font-bold shadow-lg`}>
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
                          <button className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg cursor-pointer">
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
                          <button className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg cursor-pointer">
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
          )}

          {/* Premium Benefits */}
          {user.plan === 'premium' && (
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-400" />
                Your Premium Benefits
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
                    <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
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
