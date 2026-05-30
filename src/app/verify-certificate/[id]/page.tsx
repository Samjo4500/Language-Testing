"use client";

import React, { useState, useEffect } from "react";
import {
  Shield, Check, X, AlertTriangle, Calendar,
  BookOpen, Award, Globe, ArrowLeft, ExternalLink,
  FileCheck, Zap, Lock, QrCode
} from "lucide-react";

/* ───────── Types ───────── */
interface CertificateRecord {
  certificateId: string;
  userName: string;
  courseName: string;
  courseLevel: string;
  cefrLevel: string;
  completionDate: string;
  issueDate: string;
  expiryDate: string;
  score: number;
  skillsAssessed: {
    name: string;
    score: number;
    level: string;
  }[];
  verificationStatus: "valid" | "revoked" | "expired" | "not_found";
  verifiedBy: string;
  blockchainHash?: string;
}

/* ───────── Mock Data Store ─────────
   Replace with API call: GET /api/certificates/[id]
*/
const MOCK_CERTIFICATES: Record<string, CertificateRecord> = {
  // Demo certificate
  "TCF-DEMO-2026": {
    certificateId: "TCF-DEMO-2026",
    userName: "Alex Johnson",
    courseName: "Intermediate English Course",
    courseLevel: "B1-B2",
    cefrLevel: "B2",
    completionDate: "June 15, 2026",
    issueDate: "June 15, 2026",
    expiryDate: "June 15, 2028",
    score: 87,
    skillsAssessed: [
      { name: "Grammar", score: 88, level: "B2" },
      { name: "Vocabulary", score: 85, level: "B2" },
      { name: "Reading", score: 90, level: "B2" },
      { name: "Listening", score: 84, level: "B2" },
      { name: "Speaking", score: 86, level: "B2" },
      { name: "Writing", score: 89, level: "B2" },
    ],
    verificationStatus: "valid",
    verifiedBy: "TestCEFR AI Assessment Engine",
    blockchainHash: "0x7f8a9b...2c3d4e",
  },
};

/* ───────── CEFR Level Config (platform palette) ───────── */
const CEFR_CONFIG: Record<string, {
  label: string;
  description: string;
  color: string;
  bg: string;
  border: string;
  gradient: string;
}> = {
  A1: {
    label: "Beginner",
    description: "Can understand and use familiar everyday expressions",
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    gradient: "from-green-500 to-emerald-600",
  },
  A2: {
    label: "Elementary",
    description: "Can communicate in simple and routine tasks",
    color: "text-teal-400",
    bg: "bg-teal-500/10",
    border: "border-teal-500/30",
    gradient: "from-teal-500 to-cyan-600",
  },
  B1: {
    label: "Intermediate",
    description: "Can deal with most situations likely to arise while travelling",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/30",
    gradient: "from-cyan-500 to-blue-600",
  },
  B2: {
    label: "Upper Intermediate",
    description: "Can interact with a degree of fluency and spontaneity",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    gradient: "from-blue-500 to-indigo-600",
  },
  C1: {
    label: "Advanced",
    description: "Can express ideas fluently and spontaneously without much searching",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    gradient: "from-purple-500 to-violet-600",
  },
  C2: {
    label: "Proficiency",
    description: "Can express themselves spontaneously with precision",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    gradient: "from-amber-500 to-orange-600",
  },
};

/* ───────── Status Config ───────── */
const STATUS_CONFIG: Record<string, {
  icon: React.ReactNode;
  title: string;
  message: string;
  color: string;
  bg: string;
  border: string;
}> = {
  valid: {
    icon: <Check size={20} />,
    title: "Certificate Verified",
    message: "This certificate is authentic and was issued by TestCEFR.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
  },
  revoked: {
    icon: <X size={20} />,
    title: "Certificate Revoked",
    message: "This certificate has been revoked by the issuing authority.",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
  },
  expired: {
    icon: <AlertTriangle size={20} />,
    title: "Certificate Expired",
    message: "This certificate has passed its validity period.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
  },
  not_found: {
    icon: <X size={20} />,
    title: "Certificate Not Found",
    message: "No certificate was found with this ID. It may be invalid or removed.",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
  },
};

/* ═══════════════════════════════════════════
   CERTIFICATE VERIFICATION PAGE
   Route: /verify-certificate/[id]
   ═══════════════════════════════════════════ */
export default function CertificateVerificationPage() {
  const [certId, setCertId] = useState<string>("");
  const [cert, setCert] = useState<CertificateRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [searching, setSearching] = useState(false);

  /* Extract cert ID from URL on mount */
  useEffect(() => {
    const path = typeof window !== "undefined" ? window.location.pathname : "";
    const match = path.match(/\/verify-certificate\/(.+)/);
    const id = match ? match[1] : "";
    setCertId(id);
    setSearchInput(id);

    // Try API first, fall back to mock
    fetch(`/api/certificates/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        if (data.certificate) {
          setCert(data.certificate);
        } else {
          // Try mock data for demo IDs
          const found = MOCK_CERTIFICATES[id];
          if (found) {
            setCert(found);
          }
        }
        setLoading(false);
      })
      .catch(() => {
        // Fallback to mock data
        const found = MOCK_CERTIFICATES[id];
        if (found) {
          setCert(found);
        }
        setLoading(false);
      });
  }, []);

  /* Manual search */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setSearching(true);

    fetch(`/api/certificates/${searchInput.trim()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setCert(data.certificate || null);
        setCertId(searchInput.trim());
        setSearching(false);
      })
      .catch(() => {
        // Fallback to mock
        const found = MOCK_CERTIFICATES[searchInput.trim()];
        setCert(found || null);
        setCertId(searchInput.trim());
        setSearching(false);
      });
  };

  /* Loading State */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0A1E] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/40 text-sm">Verifying certificate...</p>
        </div>
      </div>
    );
  }

  const status = cert ? STATUS_CONFIG[cert.verificationStatus] : STATUS_CONFIG.not_found;
  const cefr = cert ? CEFR_CONFIG[cert.cefrLevel] : null;

  return (
    <div className="min-h-screen bg-[#0F0A1E] text-white">
      {/* Header */}
      <header className="border-b border-white/5 bg-[#0F0A1E]/80 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
              <Shield size={16} className="text-white" />
            </div>
            <div>
              <span className="font-bold text-sm">TestCEFR</span>
              <span className="hidden sm:inline text-white/30 text-xs ml-2">Certificate Verification</span>
            </div>
          </a>
          <a href="/" className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/50 transition-colors">
            <ArrowLeft size={14} />
            Back to TestCEFR
          </a>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Status Banner */}
        <div className={`flex items-center gap-3 p-4 rounded-2xl border mb-8 ${status.bg} ${status.border}`}>
          <div className={`${status.color}`}>{status.icon}</div>
          <div>
            <h2 className={`font-semibold text-sm ${status.color}`}>{status.title}</h2>
            <p className="text-xs text-white/50">{status.message}</p>
          </div>
        </div>

        {/* Certificate Card */}
        {cert && cefr && (
          <>
            <div className="bg-gradient-to-br from-[#0c0c24] to-[#14143a] border border-white/10 rounded-3xl overflow-hidden mb-6" style={{ boxShadow: "0 0 80px rgba(6, 182, 212, 0.06)" }}>
              {/* Top stripe */}
              <div className={`h-2 bg-gradient-to-r ${cefr.gradient}`} />

              <div className="p-6 md:p-10">
                {/* Top row */}
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                      <Shield size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">TestCEFR</p>
                      <p className="text-[10px] text-white/30">AI-Powered English Assessment</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full ${cefr.bg} ${cefr.border} border`}>
                    <FileCheck size={12} className={cefr.color} />
                    <span className={cefr.color}>Verified</span>
                  </div>
                </div>

                {/* Recipient */}
                <div className="mb-8">
                  <p className="text-xs text-white/30 uppercase tracking-wider mb-2">Certificate of Achievement</p>
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent mb-3" style={{ fontFamily: "Georgia, serif" }}>
                    {cert.userName}
                  </h1>
                  <p className="text-sm text-white/50">
                    has successfully completed <span className="text-white/70 font-medium">{cert.courseName}</span>
                  </p>
                </div>

                {/* CEFR Level + Score Row */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <div className="flex-1 p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2">CEFR Level</p>
                    <div className="flex items-center gap-3">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cefr.gradient} flex items-center justify-center`}>
                        <span className="text-xl font-bold text-white">{cert.cefrLevel}</span>
                      </div>
                      <div>
                        <p className={`font-semibold ${cefr.color}`}>{cefr.label}</p>
                        <p className="text-[11px] text-white/30">{cefr.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2">Overall Score</p>
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-full border-2 border-cyan-400/30 flex items-center justify-center">
                        <span className="text-xl font-bold text-white">{cert.score}%</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white/70">Assessment Score</p>
                        <p className="text-[11px] text-white/30">Across 6 skills</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skills Breakdown */}
                <div className="mb-8">
                  <p className="text-xs text-white/30 uppercase tracking-wider mb-4">Skills Assessed</p>
                  <div className="space-y-3">
                    {cert.skillsAssessed.map((skill) => (
                      <div key={skill.name} className="flex items-center gap-4">
                        <div className="w-24 flex items-center gap-2">
                          <Check size={12} className="text-cyan-400/60 shrink-0" />
                          <span className="text-sm text-white/60">{skill.name}</span>
                        </div>
                        <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${cefr.gradient} rounded-full transition-all duration-700`}
                            style={{ width: `${skill.score}%` }}
                          />
                        </div>
                        <div className="w-16 flex items-center justify-end gap-2">
                          <span className="text-sm font-semibold text-white/80">{skill.score}%</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${cefr.bg} ${cefr.color}`}>{skill.level}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-white/5 mb-6" />

                {/* Meta Info Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Completed</p>
                    <div className="flex items-center gap-1.5 text-sm text-white/60">
                      <Calendar size={12} className="text-cyan-400/60" />
                      {cert.completionDate}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Issued</p>
                    <div className="flex items-center gap-1.5 text-sm text-white/60">
                      <Award size={12} className="text-cyan-400/60" />
                      {cert.issueDate}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Valid Until</p>
                    <div className="flex items-center gap-1.5 text-sm text-white/60">
                      <Calendar size={12} className="text-cyan-400/60" />
                      {cert.expiryDate}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Certificate ID</p>
                    <div className="flex items-center gap-1.5 text-sm text-white/60">
                      <Shield size={12} className="text-cyan-400/60" />
                      <span className="text-xs font-mono">{cert.certificateId}</span>
                    </div>
                  </div>
                </div>

                {/* Blockchain hash if available */}
                {cert.blockchainHash && (
                  <div className="flex items-center gap-2 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl mb-6">
                    <Lock size={12} className="text-emerald-400/60 shrink-0" />
                    <span className="text-[11px] text-white/30">Blockchain verified:</span>
                    <span className="text-[11px] text-emerald-400/60 font-mono">{cert.blockchainHash}</span>
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between text-[10px] text-white/20">
                  <span>testcefr.com · AI-Powered English Certification</span>
                  <span>Verified by {cert.verifiedBy}</span>
                </div>
              </div>
            </div>

            {/* Employer Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <Zap size={16} className="text-cyan-400/60" />
                  <h3 className="text-sm font-semibold text-white/80">What This Level Means</h3>
                </div>
                <p className="text-xs text-white/40 leading-relaxed mb-3">{cefr.description}</p>
                <a href="https://www.coe.int/en/web/common-european-framework-reference-languages/level-descriptions" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-cyan-400/60 hover:text-cyan-400 transition-colors">
                  <ExternalLink size={10} />
                  Learn about CEFR levels
                </a>
              </div>

              <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <Shield size={16} className="text-cyan-400/60" />
                  <h3 className="text-sm font-semibold text-white/80">Verification Details</h3>
                </div>
                <div className="space-y-2 text-xs text-white/40">
                  <div className="flex items-center gap-2">
                    <Check size={10} className="text-emerald-400/60" />
                    Certificate digitally signed by TestCEFR
                  </div>
                  <div className="flex items-center gap-2">
                    <Check size={10} className="text-emerald-400/60" />
                    Skills assessed using AI-powered evaluation
                  </div>
                  <div className="flex items-center gap-2">
                    <Check size={10} className="text-emerald-400/60" />
                    Issued on {cert.issueDate}
                  </div>
                  {cert.blockchainHash && (
                    <div className="flex items-center gap-2">
                      <Check size={10} className="text-emerald-400/60" />
                      Tamper-proof blockchain verification
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Manual Search */}
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <QrCode size={16} className="text-cyan-400/60" />
            <h3 className="text-sm font-semibold text-white/80">Verify Another Certificate</h3>
          </div>
          <form onSubmit={handleSearch} className="flex gap-3">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter certificate ID (e.g., TCF-1712345678-ABC123)"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-400/30 focus:ring-1 focus:ring-cyan-400/20 transition-all"
            />
            <button
              type="submit"
              disabled={searching || !searchInput.trim()}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap"
            >
              {searching ? "Verifying..." : "Verify"}
            </button>
          </form>
          <p className="text-[11px] text-white/20 mt-3">
            Enter a certificate ID to verify its authenticity. You can find the ID at the bottom of any TestCEFR certificate.
          </p>
        </div>

        {/* Trust Footer */}
        <div className="text-center pb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Shield size={14} className="text-cyan-400/40" />
            <span className="text-xs text-white/30">Secure verification powered by TestCEFR</span>
          </div>
          <div className="flex items-center justify-center gap-6 text-[10px] text-white/20">
            <span className="flex items-center gap-1">
              <Lock size={10} />
              256-bit SSL encrypted
            </span>
            <span className="flex items-center gap-1">
              <Globe size={10} />
              CEFR-aligned assessment
            </span>
            <span className="flex items-center gap-1">
              <Zap size={10} />
              AI-proctored testing
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
