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
  A1: { title: 'Beginner',           color: '#3b82f6', bgColor: 'rgba(59,130,246,0.15)',  accent: '#60a5fa' },
  A2: { title: 'Elementary',         color: '#22c55e', bgColor: 'rgba(34,197,94,0.15)',   accent: '#4ade80' },
  B1: { title: 'Intermediate',       color: '#eab308', bgColor: 'rgba(234,179,8,0.15)',   accent: '#facc15' },
  B2: { title: 'Upper Intermediate', color: '#f97316', bgColor: 'rgba(249,115,22,0.15)',  accent: '#fb923c' },
  C1: { title: 'Advanced',           color: '#ef4444', bgColor: 'rgba(239,68,68,0.15)',   accent: '#f87171' },
  C2: { title: 'Proficient',         color: '#a855f7', bgColor: 'rgba(168,85,247,0.15)',  accent: '#c084fc' },
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
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Verifying certificate...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !valid) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 mb-4">
                <XCircle className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl">Certificate Verification Failed</CardTitle>
              <CardDescription>
                {error || 'This certificate could not be verified.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  Verification ID: <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">{verificationId}</code>
                </p>
              </div>
              <Link href="/">
                <Button variant="outline" className="w-full">
                  Return to Home
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const levelInfo = CEFR_LEVELS[certificate?.cefrLevel || 'A1'] || CEFR_LEVELS.A1;
  const skills = certificate?.skillBreakdown || {};
  const skillEntries = Object.entries(skills).filter(([_, v]) => v !== undefined);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 py-8 px-4">
        <div className="container max-w-4xl mx-auto space-y-6">
          {/* Verification Status Banner */}
          <div className="flex items-center justify-center gap-2 p-4 bg-green-50 text-green-800 rounded-lg border border-green-200">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-medium">This certificate is valid and authentic</span>
            <Shield className="h-4 w-4 ml-1" />
          </div>

          {/* Certificate Card - Matching the dark gradient design */}
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <div
              className="relative"
              style={{
                background: 'linear-gradient(135deg, #2A9D8F 0%, #264653 100%)',
                padding: '2px',
                borderRadius: '1rem',
              }}
            >
              <div className="relative rounded-2xl overflow-hidden">
                {/* Top accent line */}
                <div className="h-1" style={{ background: 'linear-gradient(90deg, #F4A261, #E76F51, #F4A261)' }} />

                <div className="px-6 py-8 sm:px-10 sm:py-10 space-y-6">
                  {/* Header Row */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold"
                        style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff' }}
                      >
                        C
                      </div>
                      <div>
                        <p className="text-white font-bold text-lg tracking-tight">CEFR Test</p>
                        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>testcefr.com</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.6)' }}>
                        Certificate of Achievement
                      </p>
                      <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                        ID: {certificate?.verificationId}
                      </p>
                    </div>
                  </div>

                  {/* Certification Statement */}
                  <div className="text-center space-y-3 pt-2">
                    <p className="text-sm tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.6)' }}>
                      This Certifies That
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-wide">
                      {certificate?.userName}
                    </h2>
                    <p className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
                      has demonstrated English language proficiency at
                    </p>
                  </div>

                  {/* CEFR Level Display */}
                  <div className="flex items-center justify-center gap-4">
                    <div
                      className="flex items-center justify-center h-20 w-20 rounded-full border-2"
                      style={{
                        borderColor: levelInfo.accent,
                        backgroundColor: levelInfo.bgColor,
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
                      <p className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
                        {levelInfo.title}
                      </p>
                    </div>
                  </div>

                  {/* Score + Dates Row */}
                  <div
                    className="grid grid-cols-3 gap-4 rounded-xl p-4"
                    style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
                  >
                    <div className="text-center">
                      <p className="text-2xl sm:text-3xl font-bold" style={{ color: levelInfo.accent }}>
                        {certificate?.score}%
                      </p>
                      <p className="text-[10px] uppercase tracking-wider mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
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
                      <p className="text-[10px] uppercase tracking-wider mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
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
                      <p className="text-[10px] uppercase tracking-wider mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                        Issued
                      </p>
                    </div>
                  </div>

                  {/* Skill Breakdown */}
                  {skillEntries.length > 0 && (
                    <div>
                      <p className="text-xs tracking-widest uppercase text-center mb-4" style={{ color: 'rgba(255,255,255,0.6)' }}>
                        Skill Breakdown
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {skillEntries.map(([skill, value]) => (
                          <div
                            key={skill}
                            className="rounded-lg p-3"
                            style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-white">{SKILL_LABELS[skill] || skill}</span>
                              <span className="text-xs font-bold" style={{ color: levelInfo.accent }}>
                                {value}%
                              </span>
                            </div>
                            <div className="h-1.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                              <div
                                className="h-full rounded-full transition-all"
                                style={{
                                  width: `${value}%`,
                                  backgroundColor: levelInfo.accent,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Footer: QR + Verification */}
                  <div className="flex items-end justify-between pt-2">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5" style={{ color: '#2A9D8F' }} />
                        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
                          AI-Verified Assessment
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs" style={{ color: '#F4A261' }}>&#9733;</span>
                        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
                          CEFR Test — testcefr.com
                        </span>
                      </div>
                      <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
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
                          fgColor="#264653"
                          bgColor="#ffffff"
                        />
                      </div>
                      <p className="text-[9px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        Scan to verify
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom accent line */}
                <div className="h-1" style={{ background: 'linear-gradient(90deg, #F4A261, #E76F51, #F4A261)' }} />
              </div>
            </div>
          </div>

          {/* Download + Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={`/api/certificates/download/${verificationId}`} target="_blank" rel="noopener noreferrer">
              <Button className="gap-2">
                <Download className="h-4 w-4" />
                Download Certificate PDF
              </Button>
            </a>
            <Link href="/">
              <Button variant="outline" className="gap-2">
                Return to Home
              </Button>
            </Link>
          </div>

          {/* Trust Footer */}
          <div className="text-center text-sm text-muted-foreground space-y-2">
            <p>This certificate was issued by TestCEFR.com and can be independently verified.</p>
            <p>Each certificate includes a unique QR code that links to this verification page.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
