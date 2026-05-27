'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { Navbar } from '@/components/navbar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Download,
  Share2,
  ArrowLeft,
  Shield,
  CheckCircle2,
  QrCode,
  Award,
  Sparkles,
  LogIn,
  BarChart3,
} from 'lucide-react';
import QRCode from 'react-qr-code';
import Link from 'next/link';
import { Footer } from '@/components/footer';
import { trackCertificateDownload } from '@/lib/analytics';

interface SkillBreakdown {
  reading?: number;
  writing?: number;
  listening?: number;
  speaking?: number;
  grammar?: number;
  vocabulary?: number;
}

interface CertificateInfo {
  id: string;
  verificationId: string;
  userName: string;
  cefrLevel: string;
  score: number;
  skillBreakdown: SkillBreakdown;
  issuedAt: string;
  assessmentId: string;
  completedAt: string;
  type?: string;
  courseName?: string;
}

const CEFR_LEVELS: Record<string, { title: string; gradient: string; textColor: string; barColor: string }> = {
  A1: { title: 'Beginner',          gradient: 'from-blue-500 to-blue-600',     textColor: 'text-blue-400',   barColor: 'from-blue-400 to-cyan-500' },
  A2: { title: 'Elementary',        gradient: 'from-green-500 to-green-600',   textColor: 'text-green-400',  barColor: 'from-green-400 to-emerald-500' },
  'A1-A2': { title: 'Foundation Level', gradient: 'from-blue-500 to-green-500',  textColor: 'text-blue-400',  barColor: 'from-blue-400 to-cyan-500' },
  B1: { title: 'Intermediate',      gradient: 'from-yellow-500 to-yellow-600', textColor: 'text-yellow-400', barColor: 'from-yellow-400 to-amber-500' },
  B2: { title: 'Upper Intermediate', gradient: 'from-orange-500 to-orange-600', textColor: 'text-orange-400', barColor: 'from-orange-400 to-amber-500' },
  'B1-B2': { title: 'Independent Level', gradient: 'from-yellow-500 to-orange-500', textColor: 'text-yellow-400', barColor: 'from-yellow-400 to-amber-500' },
  C1: { title: 'Advanced',          gradient: 'from-indigo-500 to-indigo-600',       textColor: 'text-indigo-400',    barColor: 'from-indigo-400 to-indigo-500' },
  C2: { title: 'Proficient',        gradient: 'from-blue-500 to-blue-600', textColor: 'text-blue-400', barColor: 'from-blue-400 to-indigo-500' },
  'C1-C2': { title: 'Proficient Level', gradient: 'from-indigo-500 to-blue-500', textColor: 'text-indigo-400',  barColor: 'from-indigo-400 to-indigo-500' },
};

const SKILL_LABELS: Record<string, string> = {
  reading: 'Reading',
  writing: 'Writing',
  listening: 'Listening',
  speaking: 'Speaking',
  grammar: 'Grammar',
  vocabulary: 'Vocabulary',
  quiz: 'Quiz',
};

const SKILL_COLORS: Record<string, string> = {
  reading: 'from-blue-400 to-cyan-500',
  writing: 'from-violet-400 to-violet-500',
  listening: 'from-green-400 to-emerald-500',
  speaking: 'from-orange-400 to-amber-500',
  grammar: 'from-blue-400 to-indigo-500',
  vocabulary: 'from-cyan-400 to-blue-500',
};

export default function CertificatePage() {
  const params = useParams();
  const router = useRouter();
  const verificationId = params.verificationId as string;
  const { isAuthenticated, isLoading: authIsLoading } = useAuthStore();

  const [certificate, setCertificate] = useState<CertificateInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const response = await fetch(`/api/certificates/verify/${verificationId}/`);
        if (!response.ok) {
          setError('Certificate not found.');
          return;
        }
        const data = await response.json();
        setCertificate(data.certificate);
      } catch {
        setError('Failed to load certificate.');
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [verificationId]);

  const handleShare = async () => {
    const url = `${window.location.origin}/verify/${verificationId}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `CEFR Certificate - ${certificate?.cefrLevel}`,
          text: `${certificate?.userName} achieved CEFR level ${certificate?.cefrLevel} on TestCEFR.com`,
          url,
        });
      } catch {
        await navigator.clipboard.writeText(url);
      }
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  const verifyUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/verify/${verificationId}`
    : `https://testcefr.com/verify/${verificationId}`;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
        <Navbar />
        <div className="flex-1 py-8 px-4">
          <div className="container max-w-3xl mx-auto space-y-6">
            <Skeleton className="h-8 w-48 bg-white/5" />
            <Skeleton className="h-96 w-full bg-white/5" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            <div className="glass-card p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/20 text-red-400 mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Certificate Not Found</h1>
              <p className="text-sm text-white/50 mb-6">{error || 'The requested certificate could not be found.'}</p>
              <Link href="/dashboard">
                <button className="w-full flex items-center justify-center gap-2 rounded-xl py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold transition-all duration-300 shadow-lg shadow-blue-500/25 cursor-pointer">
                  Return to Dashboard
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const levelInfo = CEFR_LEVELS[certificate.cefrLevel] || CEFR_LEVELS.B1;
  const skills = certificate.skillBreakdown || {};
  const skillEntries = Object.entries(skills).filter(([_, v]) => v !== undefined);
  const isCourseCompletion = certificate.type === 'course_completion';

  return (
    <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
      <Navbar />

      <div className="flex-1 py-8 px-4">
        <div className="container max-w-4xl mx-auto space-y-6">
          {/* Back button */}
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>

          {/* ── Certificate Card ── */}
          <div className="glass-card p-2 md:p-3">
            {/* Gradient border wrapper matching sample certificate */}
            <div className="p-[2px] rounded-2xl bg-gradient-to-br from-[#2A9D8F] to-[#264653]">
              {/* Inner certificate content */}
              <div className="bg-[#0F0A1E] rounded-2xl p-6 md:p-8 space-y-6">
                {/* Top header */}
                <div className="text-center space-y-1">
                  <p className="uppercase tracking-[0.25em] text-white/60 text-xs md:text-sm font-medium">
                    {isCourseCompletion ? 'Certificate of Completion' : 'Certificate of Proficiency'}
                  </p>
                </div>

                {/* Logo area - matching navbar logo */}
                <div className="flex items-center justify-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25">
                    CE
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-base tracking-tight leading-tight">
                      test<span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">cefr</span><span className="text-violet-300">.com</span>
                    </span>
                    <span className="text-white/40 text-[9px] uppercase tracking-[0.2em] leading-tight">
                      {isCourseCompletion ? 'English Course' : 'English Assessment'}
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                {/* Certification text */}
                <div className="text-center space-y-3">
                  <p className="text-white/50 text-sm">This is to certify that</p>
                  <p className="text-3xl md:text-4xl font-bold text-white tracking-wide">
                    {certificate.userName}
                  </p>
                  {isCourseCompletion ? (
                    <>
                      <p className="text-white/50 text-sm">has successfully completed the</p>
                      <p className="text-xl font-bold text-violet-300">
                        {certificate.courseName || 'English Course'}
                      </p>
                    </>
                  ) : (
                    <p className="text-white/50 text-sm">has achieved CEFR Level</p>
                  )}
                </div>

                {/* Level circle */}
                <div className="flex justify-center">
                  <div className={`h-20 w-20 rounded-full bg-gradient-to-br ${levelInfo.gradient} flex items-center justify-center shadow-lg shadow-blue-500/30 animate-pulse-glow`}>
                    <span className="text-white text-2xl font-bold">{certificate.cefrLevel}</span>
                  </div>
                </div>

                {/* Level name */}
                <p className={`text-center ${levelInfo.textColor} text-sm font-medium`}>
                  {levelInfo.title}
                </p>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                {/* Score + Dates Row */}
                <div className="grid grid-cols-3 gap-4 rounded-xl p-4 bg-white/5 border border-white/5">
                  <div className="text-center">
                    <p className={`text-2xl sm:text-3xl font-bold ${levelInfo.textColor}`}>
                      {certificate.score}%
                    </p>
                    <p className="text-[10px] uppercase tracking-wider mt-1 text-white/40">
                      {isCourseCompletion ? 'Completion Score' : 'Score'}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-white">
                      {new Date(certificate.completedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="text-[10px] uppercase tracking-wider mt-1 text-white/40">
                      Completed
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-white">
                      {new Date(certificate.issuedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="text-[10px] uppercase tracking-wider mt-1 text-white/40">
                      Issued
                    </p>
                  </div>
                </div>

                {/* Skill breakdown - matching sample certificate progress bars */}
                {skillEntries.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-white/40 text-xs uppercase tracking-widest font-medium text-center mb-4">
                      Skill Breakdown
                    </p>
                    {skillEntries.map(([skill, value]) => (
                      <div key={skill} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-white/60">{SKILL_LABELS[skill] || skill}</span>
                          <span className="text-white/80 font-medium">{value}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${SKILL_COLORS[skill] || levelInfo.barColor} transition-all duration-1000`}
                            style={{ width: `${value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                {/* QR Code & Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* QR code */}
                    <div className="h-16 w-16 rounded-lg border-2 border-white/20 flex items-center justify-center bg-white/5 overflow-hidden">
                      <QRCode
                        value={verifyUrl}
                        size={56}
                        level="M"
                        fgColor="#7c5cff"
                        bgColor="transparent"
                      />
                    </div>
                    <div>
                      <p className="text-white/40 text-xs">Scan to verify</p>
                      <div className="flex items-center gap-1 mt-1">
                        <CheckCircle2 className="h-3 w-3 text-green-400" />
                        <span className="text-green-400 text-xs font-medium">Verified</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <p className="text-white/40 text-xs">
                      Issued: {new Date(certificate.issuedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="text-white/60 text-xs font-mono">
                      {certificate.verificationId}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons - matching site design */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`/api/certificates/download/${verificationId}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCertificateDownload({ cefr_level: certificate?.cefrLevel })}
            >
              <button className="flex items-center gap-2 rounded-xl px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 cursor-pointer">
                <Download className="h-4 w-4" />
                Download PDF
              </button>
            </a>
            <Link href={`/report/${verificationId}`}>
              <button className="flex items-center gap-2 rounded-xl px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-semibold transition-all duration-300 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5 cursor-pointer">
                <BarChart3 className="h-4 w-4" />
                View Detailed Report
              </button>
            </Link>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 rounded-xl px-6 py-3 glass-button text-white font-semibold transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
            >
              <Share2 className="h-4 w-4" />
              Share Certificate
            </button>
            <Link href={`/verify/${verificationId}`} target="_blank">
              <button className="flex items-center gap-2 rounded-xl px-6 py-3 glass-button text-white font-semibold transition-all duration-300 hover:-translate-y-0.5 cursor-pointer">
                <Shield className="h-4 w-4" />
                Verification Page
              </button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
