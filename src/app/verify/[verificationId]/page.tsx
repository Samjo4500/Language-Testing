'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Download, Shield, Loader2 } from 'lucide-react';
import QRCode from 'react-qr-code';
import Link from 'next/link';

interface SkillBreakdown {
  reading?: number;
  writing?: number;
  listening?: number;
  speaking?: number;
  grammar?: number;
  vocabulary?: number;
}

interface CertificateInfo {
  verificationId: string;
  userName: string;
  cefrLevel: string;
  score: number;
  skillBreakdown: SkillBreakdown;
  issuedAt: string;
}

const CEFR_LEVELS: Record<string, { title: string; color: string; bgColor: string; accent: string }> = {
  A1: { title: 'Beginner',           color: '#60a5fa', bgColor: 'rgba(96,165,250,0.15)',  accent: '#60a5fa' },
  A2: { title: 'Elementary',         color: '#4ade80', bgColor: 'rgba(74,222,128,0.15)',  accent: '#4ade80' },
  B1: { title: 'Intermediate',       color: '#c084fc', bgColor: 'rgba(192,132,252,0.15)', accent: '#c084fc' },
  B2: { title: 'Upper Intermediate', color: '#a78bfa', bgColor: 'rgba(167,139,250,0.15)', accent: '#a78bfa' },
  C1: { title: 'Advanced',           color: '#f472b6', bgColor: 'rgba(244,114,182,0.15)', accent: '#f472b6' },
  C2: { title: 'Proficient',         color: '#e879f9', bgColor: 'rgba(232,121,249,0.15)', accent: '#e879f9' },
};

const SKILL_LABELS: Record<string, string> = {
  reading: 'Reading',
  writing: 'Writing',
  listening: 'Listening',
  speaking: 'Speaking',
  grammar: 'Grammar',
  vocabulary: 'Vocabulary',
};

export default function VerifyCertificatePage() {
  const params = useParams();
  const verificationId = params.verificationId as string;

  const [certificate, setCertificate] = useState<CertificateInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [valid, setValid] = useState(false);

  useEffect(() => {
    const verifyCertificate = async () => {
      try {
        const response = await fetch(`/api/certificates/verify/${verificationId}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError('Certificate not found. The verification ID may be incorrect or the certificate may have been revoked.');
          } else {
            setError('Failed to verify certificate. Please try again later.');
          }
          setValid(false);
          return;
        }

        const data = await response.json();
        setCertificate(data.certificate);
        setValid(data.valid);
      } catch {
        setError('Failed to connect to the verification service. Please try again later.');
        setValid(false);
      } finally {
        setLoading(false);
      }
    };

    if (verificationId) {
      verifyCertificate();
    }
  }, [verificationId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-purple-400" />
            <p className="text-white/50">Verifying certificate...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !valid) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="glass-card p-8 max-w-md w-full text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/15 border border-red-500/20 mb-4">
              <XCircle className="h-8 w-8 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Certificate Verification Failed</h2>
            <p className="text-white/50 text-sm mb-6">
              {error || 'This certificate could not be verified.'}
            </p>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6">
              <p className="text-sm text-white/40">
                Verification ID: <code className="font-mono text-xs bg-white/10 px-1.5 py-0.5 rounded text-white/60">{verificationId}</code>
              </p>
            </div>
            <Link href="/">
              <button className="inline-flex items-center gap-2 rounded-xl px-6 py-2.5 bg-white/10 border border-white/15 text-white/80 hover:bg-white/15 hover:text-white transition-all">
                Return to Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const levelInfo = CEFR_LEVELS[certificate?.cefrLevel || 'A1'] || CEFR_LEVELS.A1;
  const skills = certificate?.skillBreakdown || {};
  const skillEntries = Object.entries(skills).filter(([_, v]) => v !== undefined);

  return (
    <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
      <Navbar />
      <div className="flex-1 py-8 px-4">
        <div className="container max-w-4xl mx-auto space-y-6">
          {/* Verification Status Banner */}
          <div className="flex items-center justify-center gap-2 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-medium">This certificate is valid and authentic</span>
            <Shield className="h-4 w-4 ml-1" />
          </div>

          {/* Certificate Card - Matching the purple/pink dark theme */}
          <div className="glass-card p-2 md:p-3 purple-glow">
            {/* Gradient border wrapper */}
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                padding: '2px',
                borderRadius: '1rem',
              }}
            >
              <div className="relative rounded-2xl overflow-hidden bg-[#0F0A1E]">
                {/* Top accent line */}
                <div className="h-1" style={{ background: 'linear-gradient(90deg, #8B5CF6, #EC4899, #8B5CF6)' }} />

                <div className="px-6 py-8 sm:px-10 sm:py-10 space-y-6">
                  {/* Header Row */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold text-sm shadow-lg shadow-purple-500/25">
                        CE
                      </div>
                      <div>
                        <p className="text-white font-bold text-lg tracking-tight">CEFR Test</p>
                        <p className="text-xs text-white/40">testcefr.com</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs tracking-widest uppercase text-white/40">
                        Certificate of Achievement
                      </p>
                      <p className="text-xs mt-1 text-white/30 font-mono">
                        ID: {certificate?.verificationId}
                      </p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                  {/* Certification Statement */}
                  <div className="text-center space-y-3 pt-2">
                    <p className="text-sm tracking-widest uppercase text-white/40">
                      This Certifies That
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-wide">
                      {certificate?.userName}
                    </h2>
                    <p className="text-sm text-white/50">
                      has demonstrated English language proficiency at
                    </p>
                  </div>

                  {/* CEFR Level Display */}
                  <div className="flex items-center justify-center gap-4">
                    <div
                      className="flex items-center justify-center h-20 w-20 rounded-full border-2 shadow-lg"
                      style={{
                        borderColor: levelInfo.accent,
                        backgroundColor: levelInfo.bgColor,
                        boxShadow: `0 0 30px ${levelInfo.bgColor}`,
                      }}
                    >
                      <span className="text-2xl font-bold" style={{ color: levelInfo.accent }}>
                        {certificate?.cefrLevel}
                      </span>
                    </div>
                    <div>
                      <p className="text-2xl font-bold" style={{ color: levelInfo.accent }}>
                        {certificate?.cefrLevel}
                      </p>
                      <p className="text-sm text-white/50">
                        {levelInfo.title}
                      </p>
                    </div>
                  </div>

                  {/* Score + Dates Row */}
                  <div className="grid grid-cols-3 gap-4 rounded-xl p-4 bg-white/5 border border-white/5">
                    <div className="text-center">
                      <p className="text-2xl sm:text-3xl font-bold" style={{ color: levelInfo.accent }}>
                        {certificate?.score}%
                      </p>
                      <p className="text-[10px] uppercase tracking-wider mt-1 text-white/40">
                        Score
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-white">
                        {certificate?.issuedAt
                          ? new Date(certificate.issuedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : 'N/A'}
                      </p>
                      <p className="text-[10px] uppercase tracking-wider mt-1 text-white/40">
                        Completed
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-white">
                        {certificate?.issuedAt
                          ? new Date(certificate.issuedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : 'N/A'}
                      </p>
                      <p className="text-[10px] uppercase tracking-wider mt-1 text-white/40">
                        Issued
                      </p>
                    </div>
                  </div>

                  {/* Skill Breakdown */}
                  {skillEntries.length > 0 && (
                    <div>
                      <p className="text-xs tracking-widest uppercase text-center mb-4 text-white/40">
                        Skill Breakdown
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {skillEntries.map(([skill, value]) => (
                          <div
                            key={skill}
                            className="rounded-lg p-3 bg-white/5 border border-white/5"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-white/60">{SKILL_LABELS[skill] || skill}</span>
                              <span className="text-xs font-bold" style={{ color: levelInfo.accent }}>
                                {value}%
                              </span>
                            </div>
                            <div className="h-1.5 rounded-full bg-white/10">
                              <div
                                className="h-full rounded-full transition-all"
                                style={{
                                  width: `${value}%`,
                                  background: `linear-gradient(90deg, ${levelInfo.accent}, ${levelInfo.color})`,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                  {/* Footer: QR + Verification */}
                  <div className="flex items-end justify-between pt-2">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-purple-400" />
                        <span className="text-xs text-white/50">
                          AI-Verified Assessment
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-pink-400">&#9733;</span>
                        <span className="text-xs text-white/50">
                          CEFR Test — testcefr.com
                        </span>
                      </div>
                      <p className="text-[10px] text-white/30">
                        Aligned with the Common European Framework of Reference for Languages
                      </p>
                    </div>

                    {/* QR Code */}
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="bg-white p-2 rounded-lg">
                        <QRCode
                          value={`${typeof window !== 'undefined' ? window.location.origin : 'https://testcefr.com'}/verify/${verificationId}`}
                          size={80}
                          level="M"
                          fgColor="#1A0F3E"
                          bgColor="#ffffff"
                        />
                      </div>
                      <p className="text-[9px] text-white/30">
                        Scan to verify
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom accent line */}
                <div className="h-1" style={{ background: 'linear-gradient(90deg, #8B5CF6, #EC4899, #8B5CF6)' }} />
              </div>
            </div>
          </div>

          {/* Download + Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={`/api/certificates/download/${verificationId}`} target="_blank" rel="noopener noreferrer">
              <button className="inline-flex items-center gap-2 rounded-xl px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5">
                <Download className="h-4 w-4" />
                Download Certificate PDF
              </button>
            </a>
            <Link href="/">
              <button className="inline-flex items-center gap-2 rounded-xl px-6 py-3 bg-white/10 border border-white/15 text-white/80 hover:bg-white/15 hover:text-white transition-all duration-300">
                Return to Home
              </button>
            </Link>
          </div>

          {/* Trust Footer */}
          <div className="text-center text-sm text-white/30 space-y-2">
            <p>This certificate was issued by TestCEFR.com and can be independently verified.</p>
            <p>Each certificate includes a unique QR code that links to this verification page.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
