'use client';

import { useState } from 'react';
import {
  Wifi, WifiOff, Download, Cloud, CloudOff, HardDrive,
  RefreshCw, CheckCircle2, Clock, FileText, BookOpen,
  Headphones, Volume2, ArrowDown, ArrowUp, Trash2,
  Server, Smartphone, AlertCircle
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

/* ── Types ─────────────────────────────────────── */
export interface OfflineContent {
  id: string;
  title: string;
  type: 'lesson' | 'vocabulary' | 'audio' | 'quiz';
  size: number; // MB
  downloadedAt: string;
  lastSyncedAt: string;
}

interface PWAOfflineModeProps {
  isOnline: boolean;
  downloadedContent: OfflineContent[];
  onDownload: (id: string) => void;
  onSync: () => void;
  storageUsed: number;
  storageTotal: number;
}

/* ── Constants ─────────────────────────────────── */
const CONTENT_PACKS = [
  { id: 'cp1', title: 'B1 Essential Vocabulary', type: 'vocabulary' as const, size: 12, lessons: 15, description: 'Core vocabulary for intermediate learners' },
  { id: 'cp2', title: 'Travel English Pack', type: 'lesson' as const, size: 24, lessons: 8, description: 'Airport, hotel, restaurant & direction phrases' },
  { id: 'cp3', title: 'Listening Practice A2', type: 'audio' as const, size: 45, lessons: 12, description: 'Slow-paced audio with transcripts' },
  { id: 'cp4', title: 'Grammar Fundamentals', type: 'quiz' as const, size: 8, lessons: 20, description: 'Interactive grammar drills with explanations' },
  { id: 'cp5', title: 'Business English B2', type: 'lesson' as const, size: 32, lessons: 10, description: 'Emails, meetings & presentations' },
];

const TYPE_CONFIG: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  lesson: { icon: <BookOpen className="h-4 w-4" />, color: 'from-cyan-400 to-blue-500', label: 'Lesson' },
  vocabulary: { icon: <FileText className="h-4 w-4" />, color: 'from-blue-400 to-indigo-500', label: 'Vocabulary' },
  audio: { icon: <Headphones className="h-4 w-4" />, color: 'from-indigo-400 to-purple-500', label: 'Audio' },
  quiz: { icon: <Volume2 className="h-4 w-4" />, color: 'from-purple-400 to-violet-500', label: 'Quiz' },
};

/* ── Main Component ────────────────────────────── */
export default function PWAOfflineMode({
  isOnline,
  downloadedContent,
  onDownload,
  onSync,
  storageUsed,
  storageTotal,
}: PWAOfflineModeProps) {
  const [syncing, setSyncing] = useState(false);
  const [pendingUploads] = useState(3);
  const storagePct = Math.round((storageUsed / storageTotal) * 100);

  const handleSync = () => {
    if (!isOnline) return;
    setSyncing(true);
    onSync();
    setTimeout(() => setSyncing(false), 2500);
  };

  const formatSize = (mb: number) => (mb >= 1000 ? `${(mb / 1000).toFixed(1)} GB` : `${mb} MB`);

  return (
    <div className="space-y-6">
      {/* ── Offline Status Banner ──────────── */}
      {!isOnline && (
        <div className="animate-slide-down rounded-2xl px-5 py-3 flex items-center gap-3 border bg-violet-500/10 border-violet-500/20">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/20">
            <WifiOff className="h-4 w-4 text-violet-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-violet-300">
              You are Offline
            </p>
            <p className="text-xs text-white/40">
              Access your downloaded content below
            </p>
          </div>
            <div className="flex items-center gap-1 rounded-full bg-violet-500/10 border border-violet-500/20 px-2.5 py-1">
              <AlertCircle className="h-3 w-3 text-violet-400" />
              <span className="text-[10px] text-violet-300">{pendingUploads} pending</span>
            </div>
        </div>
      )}

      {/* ── Sync & Storage Status ──────────── */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Sync Status */}
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${
              isOnline ? 'bg-cyan-500/10' : 'bg-white/5'
            }`}>
              {isOnline ? (
                <Cloud className="h-4 w-4 text-cyan-400" />
              ) : (
                <CloudOff className="h-4 w-4 text-white/30" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Sync Status</p>
              <p className="text-[10px] text-white/30">
                {isOnline ? 'Connected' : 'Waiting for connection'}
              </p>
            </div>
          </div>
          {pendingUploads > 0 && (
            <div className="flex items-center gap-2 mb-3 text-xs text-white/40">
              <ArrowUp className="h-3 w-3 text-violet-400" />
              <span>{pendingUploads} items pending upload</span>
            </div>
          )}
          <button
            onClick={handleSync}
            disabled={!isOnline || syncing}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 ${
              syncing
                ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-300'
                : 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/20 text-cyan-300 hover:from-cyan-500/30 hover:to-blue-600/30'
            }`}
          >
            <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing…' : 'Sync Now'}
          </button>
          {isOnline && syncing && (
            <p className="mt-2 text-[10px] text-cyan-400/60 flex items-center gap-1">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-400" />
              </span>
              Auto-syncing when back online
            </p>
          )}
        </div>

        {/* Storage Usage */}
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10">
              <HardDrive className="h-4 w-4 text-indigo-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Storage</p>
              <p className="text-[10px] text-white/30">{formatSize(storageUsed)} of {formatSize(storageTotal)}</p>
            </div>
          </div>
          <div className="mb-2">
            <div className="h-2.5 rounded-full bg-white/[0.06] overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  storagePct > 85 ? 'bg-gradient-to-r from-red-400 to-red-500' :
                  storagePct > 60 ? 'bg-gradient-to-r from-amber-400 to-amber-500' :
                  'bg-gradient-to-r from-cyan-400 to-blue-500'
                }`}
                style={{ width: `${storagePct}%` }}
              />
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px] text-white/30">
            <span>{storagePct}% used</span>
            <span>{formatSize(storageTotal - storageUsed)} free</span>
          </div>
        </div>
      </div>

      {/* ── Downloaded Content ─────────────── */}
      <div>
        <h3 className="text-sm font-semibold text-white/60 mb-3">Downloaded Content</h3>
        {downloadedContent.length === 0 ? (
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 text-center">
            <Smartphone className="h-8 w-8 text-white/10 mx-auto mb-3" />
            <p className="text-sm text-white/30">No content downloaded yet</p>
            <p className="text-xs text-white/20">Download content packs below for offline access</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
            {downloadedContent.map(item => {
              const config = TYPE_CONFIG[item.type];
              return (
                <div key={item.id} className="bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 flex items-center gap-3">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${config.color} text-white shadow-lg`}>
                    {config.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{item.title}</p>
                    <p className="text-[10px] text-white/30">
                      {config.label} · {item.size} MB · Last synced {item.lastSyncedAt}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5">
                    <CheckCircle2 className="h-3 w-3 text-cyan-400" />
                    <span className="text-[10px] text-cyan-300">Ready</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Download Manager ───────────────── */}
      <div>
        <h3 className="text-sm font-semibold text-white/60 mb-3">Content Packs Available</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {CONTENT_PACKS.map(pack => {
            const isDownloaded = downloadedContent.some(d => d.id === pack.id);
            const config = TYPE_CONFIG[pack.type];
            return (
              <div key={pack.id} className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 hover:bg-white/[0.04] hover:border-white/10 transition-all">
                <div className="flex items-start gap-3 mb-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${config.color} text-white shadow-lg`}>
                    {config.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-white">{pack.title}</h4>
                    <p className="text-xs text-white/40">{pack.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-white/30 mb-3">
                  <span>{pack.lessons} lessons</span>
                  <span>·</span>
                  <span>{pack.size} MB</span>
                </div>
                {isDownloaded ? (
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] px-3 py-1.5 text-xs text-white/40 cursor-default">
                      <CheckCircle2 className="h-3 w-3 text-cyan-400" /> Downloaded
                    </button>
                    <button className="flex items-center gap-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] px-2 py-1.5 text-xs text-white/30 hover:text-red-300 hover:border-red-500/20 transition-all cursor-pointer">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => onDownload(pack.id)}
                    disabled={storagePct > 90}
                    className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/20 px-3 py-1.5 text-xs font-medium text-cyan-300 hover:from-cyan-500/30 hover:to-blue-600/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Download className="h-3 w-3" /> Download for Offline
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
