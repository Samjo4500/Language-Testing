"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Award, Download, Share2, Linkedin, Check, QrCode,
  Shield, Calendar, BookOpen, X,
  Copy, CheckCheck, ExternalLink, Globe
} from "lucide-react";
import QRCode from "qrcode";

/* ───────── Types ───────── */
interface CertificateData {
  userName: string;
  userId: string;
  courseName: string;
  courseLevel: string;
  cefrLevel: string;
  completionDate: string;
  certificateId: string;       // Maps to verificationId in DB
  score: number;
  skillsAssessed: string[];
}

interface CertificateGeneratorProps {
  data?: CertificateData;
  onClose?: () => void;
}

/* ───────── Default Data (for preview) ───────── */
const DEFAULT_CERT: CertificateData = {
  userName: "Alex Johnson",
  userId: "usr_8f2a1b",
  courseName: "Intermediate English Course",
  courseLevel: "B1-B2",
  cefrLevel: "B2",
  completionDate: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
  certificateId: `TCF-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
  score: 87,
  skillsAssessed: ["Grammar", "Vocabulary", "Reading", "Listening", "Speaking", "Writing"],
};

/* ───────── CEFR Level Colors (platform palette: no pink/magenta) ───────── */
const CEFR_COLORS: Record<string, { bg: string; text: string; border: string; gradient: string }> = {
  A1: { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/30", gradient: "from-green-500 to-emerald-600" },
  A2: { bg: "bg-teal-500/10", text: "text-teal-400", border: "border-teal-500/30", gradient: "from-teal-500 to-cyan-600" },
  B1: { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/30", gradient: "from-cyan-500 to-blue-600" },
  B2: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30", gradient: "from-blue-500 to-indigo-600" },
  C1: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/30", gradient: "from-purple-500 to-violet-600" },
  C2: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30", gradient: "from-amber-500 to-orange-600" },
};

/* ═══════════════════════════════════════════
   CERTIFICATE GENERATOR COMPONENT
   ═══════════════════════════════════════════ */
export default function CertificateGenerator({ data, onClose }: CertificateGeneratorProps) {
  const cert = data || DEFAULT_CERT;
  const colors = CEFR_COLORS[cert.cefrLevel] || CEFR_COLORS.B2;
  const [qrUrl, setQrUrl] = useState("");
  const [showPreview, setShowPreview] = useState(true);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const certRef = useRef<HTMLDivElement>(null);

  /* Generate QR code */
  useEffect(() => {
    const verifyUrl = `${typeof window !== "undefined" ? window.location.origin : "https://testcefr.com"}/verify-certificate/${cert.certificateId}`;
    QRCode.toDataURL(verifyUrl, { width: 200, margin: 2, color: { dark: "#22d3ee", light: "#0a0a1a" } })
      .then(setQrUrl)
      .catch(console.error);
  }, [cert.certificateId]);

  /* Draw certificate on canvas for download */
  const drawCertificate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = 1200;
    const h = 850;
    canvas.width = w * 2;
    canvas.height = h * 2;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.scale(2, 2);

    /* Background */
    ctx.fillStyle = "#0c0c24";
    ctx.fillRect(0, 0, w, h);

    /* Border gradient */
    const borderGrad = ctx.createLinearGradient(0, 0, w, h);
    borderGrad.addColorStop(0, "#22d3ee");
    borderGrad.addColorStop(0.5, "#3b82f6");
    borderGrad.addColorStop(1, "#8b5cf6");
    ctx.strokeStyle = borderGrad;
    ctx.lineWidth = 8;
    ctx.strokeRect(20, 20, w - 40, h - 40);

    /* Inner border */
    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.lineWidth = 1;
    ctx.strokeRect(40, 40, w - 80, h - 80);

    /* Corner decorations */
    const drawCorner = (x: number, y: number, rot: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.beginPath();
      ctx.moveTo(0, -20);
      ctx.lineTo(0, 0);
      ctx.lineTo(20, 0);
      ctx.strokeStyle = "#22d3ee";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.restore();
    };
    drawCorner(60, 60, 0);
    drawCorner(w - 60, 60, Math.PI / 2);
    drawCorner(w - 60, h - 60, Math.PI);
    drawCorner(60, h - 60, -Math.PI / 2);

    /* Title */
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 48px Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText("Certificate of Achievement", w / 2, 120);

    /* Subtitle */
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.font = "24px Arial, sans-serif";
    ctx.fillText("TestCEFR — AI-Powered English Assessment", w / 2, 155);

    /* Divider line */
    ctx.beginPath();
    ctx.moveTo(200, 180);
    ctx.lineTo(w - 200, 180);
    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.lineWidth = 1;
    ctx.stroke();

    /* Awarded to */
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "20px Arial, sans-serif";
    ctx.fillText("This certifies that", w / 2, 230);

    /* User name */
    ctx.fillStyle = "#22d3ee";
    ctx.font = "bold 56px Georgia, serif";
    ctx.fillText(cert.userName, w / 2, 300);

    /* Course */
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.font = "22px Arial, sans-serif";
    ctx.fillText("has successfully completed", w / 2, 350);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 32px Arial, sans-serif";
    ctx.fillText(cert.courseName, w / 2, 395);

    /* CEFR Level badge */
    const badgeW = 200;
    const badgeH = 60;
    const badgeX = w / 2 - badgeW / 2;
    const badgeY = 430;
    const badgeGrad = ctx.createLinearGradient(badgeX, badgeY, badgeX + badgeW, badgeY + badgeH);
    badgeGrad.addColorStop(0, "#22d3ee");
    badgeGrad.addColorStop(1, "#3b82f6");
    ctx.fillStyle = badgeGrad;
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 10);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 28px Arial, sans-serif";
    ctx.fillText(`CEFR Level: ${cert.cefrLevel}`, w / 2, 470);

    /* Score */
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "18px Arial, sans-serif";
    ctx.fillText(`Assessment Score: ${cert.score}/100`, w / 2, 520);

    /* Skills */
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.font = "14px Arial, sans-serif";
    ctx.fillText(`Skills Assessed: ${cert.skillsAssessed.join(", ")}`, w / 2, 555);

    /* Date */
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "16px Arial, sans-serif";
    ctx.fillText(`Completed on ${cert.completionDate}`, w / 2, 610);

    /* Certificate ID */
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.font = "12px Arial, sans-serif";
    ctx.fillText(`Certificate ID: ${cert.certificateId}`, w / 2, 650);

    /* QR placeholder text */
    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.font = "11px Arial, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Scan QR code to verify authenticity", 80, h - 80);
    ctx.textAlign = "center";

    /* Footer */
    ctx.fillStyle = "rgba(255,255,255,0.15)";
    ctx.font = "12px Arial, sans-serif";
    ctx.fillText("testcefr.com · AI-Powered English Certification · Verify at testcefr.com/verify-certificate", w / 2, h - 40);

    return canvas;
  }, [cert]);

  /* Download as PNG */
  const handleDownload = useCallback(() => {
    setDownloading(true);
    drawCertificate();
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (qrUrl) {
      const qrImg = new Image();
      qrImg.onload = () => {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(qrImg, 80, 720, 100, 100);
        }
        const link = document.createElement("a");
        link.download = `TestCEFR-Certificate-${cert.userName.replace(/\s+/g, "-")}-${cert.cefrLevel}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        setDownloading(false);
      };
      qrImg.src = qrUrl;
    } else {
      const link = document.createElement("a");
      link.download = `TestCEFR-Certificate-${cert.userName.replace(/\s+/g, "-")}-${cert.cefrLevel}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      setDownloading(false);
    }
  }, [drawCertificate, qrUrl, cert]);

  /* Copy certificate link */
  const handleCopyLink = useCallback(() => {
    const url = `${window.location.origin}/verify-certificate/${cert.certificateId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [cert.certificateId]);

  /* LinkedIn share */
  const handleLinkedInShare = useCallback(() => {
    const url = `${window.location.origin}/verify-certificate/${cert.certificateId}`;
    const text = `I just earned my ${cert.cefrLevel} English Certificate from TestCEFR!`;
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&summary=${encodeURIComponent(text)}`;
    window.open(linkedInUrl, "_blank", "width=600,height=400");
  }, [cert]);

  /* Toggle preview/download */
  useEffect(() => {
    if (!showPreview) drawCertificate();
  }, [showPreview, drawCertificate]);

  /* ═══════════════════ RENDER ═══════════════════ */
  return (
    <div className="min-h-screen bg-[#0F0A1E] text-white p-4 md:p-8">
      {/* Hidden canvas for PNG generation */}
      <canvas ref={canvasRef} className="hidden" />

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Award size={20} className="text-cyan-400" />
              <span className="text-xs text-cyan-400 uppercase tracking-wider font-semibold">Certificate of Achievement</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">Your CEFR Certificate</h1>
          </div>
          {onClose && (
            <button onClick={onClose} className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white/60 hover:bg-white/10 transition-colors">
              <X size={20} />
            </button>
          )}
        </div>

        {/* Preview / Canvas toggle */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => setShowPreview(true)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${showPreview ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30" : "bg-white/5 text-white/40 border border-transparent hover:bg-white/10"}`}>
            Digital Certificate
          </button>
          <button onClick={() => setShowPreview(false)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${!showPreview ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30" : "bg-white/5 text-white/40 border border-transparent hover:bg-white/10"}`}>
            Download Version
          </button>
        </div>

        {/* Certificate Preview */}
        {showPreview ? (
          <div className="relative mb-8">
            <div ref={certRef} className="relative bg-gradient-to-br from-[#0c0c24] to-[#14143a] border border-white/10 rounded-3xl overflow-hidden p-8 md:p-12" style={{ boxShadow: "0 0 80px rgba(6, 182, 212, 0.08)" }}>
              {/* Border gradient */}
              <div className="absolute inset-0 rounded-3xl border-2 border-transparent bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-purple-500/20 pointer-events-none" />

              {/* Corner decorations */}
              <div className="absolute top-6 left-6 w-12 h-12 border-l-2 border-t-2 border-cyan-500/40 rounded-tl-xl" />
              <div className="absolute top-6 right-6 w-12 h-12 border-r-2 border-t-2 border-cyan-500/40 rounded-tr-xl" />
              <div className="absolute bottom-6 left-6 w-12 h-12 border-l-2 border-b-2 border-cyan-500/40 rounded-bl-xl" />
              <div className="absolute bottom-6 right-6 w-12 h-12 border-r-2 border-b-2 border-cyan-500/40 rounded-br-xl" />

              {/* Content */}
              <div className="relative text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Shield size={16} className="text-cyan-400/60" />
                  <span className="text-xs text-white/40 uppercase tracking-widest">TestCEFR · AI-Powered English Assessment</span>
                  <Shield size={16} className="text-cyan-400/60" />
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2" style={{ fontFamily: "Georgia, serif" }}>
                  Certificate of Achievement
                </h2>

                <div className="w-32 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto mb-8" />

                <p className="text-sm text-white/40 mb-3 uppercase tracking-wider">This certifies that</p>
                <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent mb-4" style={{ fontFamily: "Georgia, serif" }}>
                  {cert.userName}
                </p>

                <p className="text-base text-white/50 mb-2">has successfully completed</p>
                <p className="text-2xl font-bold text-white mb-6">{cert.courseName}</p>

                {/* CEFR Level Badge */}
                <div className={`inline-flex items-center gap-3 px-8 py-3 bg-gradient-to-r ${colors.gradient} rounded-2xl shadow-lg mb-6`}>
                  <Award size={24} className="text-white" />
                  <div className="text-left">
                    <p className="text-[10px] text-white/70 uppercase tracking-wider">CEFR Level</p>
                    <p className="text-2xl font-bold text-white">{cert.cefrLevel}</p>
                  </div>
                </div>

                {/* Score */}
                <div className="flex items-center justify-center gap-2 mb-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-white">{cert.score}<span className="text-lg text-white/40">/100</span></p>
                    <p className="text-xs text-white/30">Assessment Score</p>
                  </div>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                  {cert.skillsAssessed.map((skill, i) => (
                    <span key={i} className="flex items-center gap-1 text-xs bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-white/50">
                      <Check size={10} className="text-cyan-400/60" />
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Date & ID */}
                <div className="flex items-center justify-center gap-8 text-sm text-white/30 mb-8">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    <span>{cert.completionDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield size={14} />
                    <span>ID: {cert.certificateId}</span>
                  </div>
                </div>

                {/* QR + Verify */}
                <div className="flex items-center justify-center gap-6">
                  {qrUrl && (
                    <div className="bg-white p-2 rounded-xl">
                      <img src={qrUrl} alt="Verify Certificate" className="w-20 h-20" />
                    </div>
                  )}
                  <div className="text-left">
                    <p className="text-xs text-white/40 mb-1">Verify Authenticity</p>
                    <p className="text-sm text-cyan-400">testcefr.com/verify-certificate</p>
                    <p className="text-[10px] text-white/20 mt-1">Scan QR or visit URL to verify</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Canvas Preview */
          <div className="relative mb-8 bg-white/5 border border-white/10 rounded-3xl p-8 text-center">
            <p className="text-sm text-white/40 mb-4">This is the print-ready version. Click download to save.</p>
            <canvas ref={canvasRef} className="mx-auto rounded-xl border border-white/10" style={{ width: "100%", maxWidth: 800 }} />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button onClick={handleDownload} disabled={downloading}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50">
            <Download size={18} />
            {downloading ? "Generating..." : "Download Certificate"}
          </button>

          <button onClick={handleLinkedInShare}
            className="flex items-center gap-2 px-6 py-3 bg-[#0077b5]/20 border border-[#0077b5]/30 text-[#0077b5] font-medium rounded-xl hover:bg-[#0077b5]/30 transition-all">
            <Linkedin size={18} />
            Share on LinkedIn
          </button>

          <div className="relative">
            <button onClick={() => setShowShareMenu(!showShareMenu)}
              className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white/60 font-medium rounded-xl hover:bg-white/10 transition-all">
              <Share2 size={18} />
              Share
            </button>
            {showShareMenu && (
              <div className="absolute top-full mt-2 right-0 bg-[#1a1a3a] border border-white/10 rounded-xl shadow-2xl p-3 min-w-[280px] z-20">
                <p className="text-xs text-white/30 mb-2 uppercase tracking-wider">Certificate Link</p>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2 mb-3">
                  <span className="text-xs text-white/40 truncate flex-1">{`${typeof window !== "undefined" ? window.location.origin : ""}/verify-certificate/${cert.certificateId}`}</span>
                  <button onClick={handleCopyLink} className="text-cyan-400 hover:text-cyan-300 shrink-0">
                    {copied ? <CheckCheck size={14} /> : <Copy size={14} />}
                  </button>
                </div>
                <button onClick={handleLinkedInShare} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors">
                  <Linkedin size={14} /> Share on LinkedIn
                </button>
                <button onClick={() => { const url = `${window.location.origin}/verify-certificate/${cert.certificateId}`; window.open(`https://twitter.com/intent/tweet?text=I earned my ${cert.cefrLevel} English Certificate from TestCEFR!&url=${url}`, "_blank"); }} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors">
                  <ExternalLink size={14} /> Share on X
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
            <Shield size={20} className="text-cyan-400/60 mb-3" />
            <h3 className="text-sm font-semibold text-white/80 mb-1">QR Verified</h3>
            <p className="text-xs text-white/30">Each certificate has a unique QR code. Employers can scan to verify authenticity instantly.</p>
          </div>
          <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
            <Globe size={20} className="text-cyan-400/60 mb-3" />
            <h3 className="text-sm font-semibold text-white/80 mb-1">Globally Recognized</h3>
            <p className="text-xs text-white/30">CEFR is the international standard used by employers and universities worldwide.</p>
          </div>
          <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
            <BookOpen size={20} className="text-cyan-400/60 mb-3" />
            <h3 className="text-sm font-semibold text-white/80 mb-1">6 Skills Assessed</h3>
            <p className="text-xs text-white/30">Grammar, Vocabulary, Reading, Listening, Speaking, and Writing — all in one certificate.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
