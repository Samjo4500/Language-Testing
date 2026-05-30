'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Search, Users, Phone, PhoneOff, Clock, Globe, Star,
  ChevronDown, Filter, Wifi, WifiOff, MessageCircle,
  UserCheck, Zap, ArrowRight, X
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

/* ── Types ─────────────────────────────────────── */
export interface PeerUser {
  id: string;
  name: string;
  avatar: string;
  cefrLevel: string;
  nativeLanguage: string;
  targetLanguage: string;
  isOnline: boolean;
  compatibilityScore: number;
}

export interface MatchFilters {
  cefrLevel?: string;
  topic?: string;
  nativeLanguage?: string;
}

interface PeerMatchingProps {
  onlineUsers: PeerUser[];
  currentMatch: PeerUser | null;
  onFindMatch: (filters: MatchFilters) => void;
  onStartCall: (userId: string) => void;
  onEndCall: () => void;
}

/* ── Constants ─────────────────────────────────── */
const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const TOPICS = ['Daily Life', 'Travel', 'Business', 'Academic', 'Casual', 'Technology', 'Culture', 'Health'];
const NATIVE_LANGUAGES = ['Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Korean', 'Portuguese', 'Arabic', 'Hindi', 'Vietnamese'];

const RECENT_CALLS = [
  { id: 'rc1', name: 'Maria G.', level: 'B2', duration: '23 min', date: '2h ago' },
  { id: 'rc2', name: 'Kenji T.', level: 'B1', duration: '15 min', date: '5h ago' },
  { id: 'rc3', name: 'Sophie L.', level: 'C1', duration: '31 min', date: 'Yesterday' },
];

/* ── Sub-components ────────────────────────────── */
function CompatibilityBadge({ score }: { score: number }) {
  const color =
    score >= 85 ? 'from-cyan-400 to-blue-500' :
    score >= 70 ? 'from-blue-400 to-indigo-500' :
    score >= 55 ? 'from-indigo-400 to-purple-500' :
    'from-purple-400 to-violet-500';
  return (
    <div className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-r ${color} px-2.5 py-0.5`}>
      <Star className="h-3 w-3 text-white" />
      <span className="text-[10px] font-bold text-white">{score}%</span>
    </div>
  );
}

function OnlineDot({ isOnline }: { isOnline: boolean }) {
  return (
    <span className="relative flex h-2.5 w-2.5">
      {isOnline && (
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-50" />
      )}
      <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${isOnline ? 'bg-cyan-400' : 'bg-white/20'}`} />
    </span>
  );
}

/* ── Main Component ────────────────────────────── */
export default function PeerMatching({ onlineUsers, currentMatch, onFindMatch, onStartCall, onEndCall }: PeerMatchingProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<MatchFilters>({});
  const [isSearching, setIsSearching] = useState(false);
  const [estimatedWait, setEstimatedWait] = useState(0);
  const [inCall, setInCall] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  // Simulated queue timer
  useEffect(() => {
    if (!isSearching) return;
    const t = setInterval(() => setEstimatedWait(p => (p > 0 ? p - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [isSearching]);

  // Simulated call timer
  useEffect(() => {
    if (!inCall) return;
    const t = setInterval(() => setCallDuration(p => p + 1), 1000);
    return () => clearInterval(t);
  }, [inCall]);

  const formatDuration = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const handleFindMatch = useCallback(() => {
    setIsSearching(true);
    setEstimatedWait(12);
    onFindMatch(filters);
  }, [filters, onFindMatch]);

  const handleStartCall = (id: string) => {
    setInCall(true);
    onStartCall(id);
  };

  const handleEndCall = () => {
    setInCall(false);
    setIsSearching(false);
    setCallDuration(0);
    onEndCall();
  };

  const onlineCount = onlineUsers.filter(u => u.isOnline).length;

  return (
    <div className="space-y-6">
      {/* ── Header ──────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-blue-500/20">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Peer Matching</h2>
            <p className="text-xs text-white/40">{onlineCount} learners online now</p>
          </div>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="glass-button flex items-center gap-2 px-4 py-2 text-sm text-white cursor-pointer"
        >
          <Filter className="h-4 w-4 text-cyan-400" />
          Filters
          <ChevronDown className={`h-3.5 w-3.5 text-white/50 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* ── Filter Panel ────────────────────── */}
      {showFilters && (
        <div className="glass-card p-5 animate-slide-down space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            {/* CEFR Level */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white/50">CEFR Level</label>
              <select
                value={filters.cefrLevel ?? ''}
                onChange={e => setFilters(f => ({ ...f, cefrLevel: e.target.value || undefined }))}
                className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-cyan-500/40 transition-colors"
              >
                <option value="">Any Level</option>
                {CEFR_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            {/* Topic */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white/50">Topic</label>
              <select
                value={filters.topic ?? ''}
                onChange={e => setFilters(f => ({ ...f, topic: e.target.value || undefined }))}
                className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-cyan-500/40 transition-colors"
              >
                <option value="">Any Topic</option>
                {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            {/* Native Language */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white/50">Native Language</label>
              <select
                value={filters.nativeLanguage ?? ''}
                onChange={e => setFilters(f => ({ ...f, nativeLanguage: e.target.value || undefined }))}
                className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-cyan-500/40 transition-colors"
              >
                <option value="">Any Language</option>
                {NATIVE_LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>
          <button
            onClick={handleFindMatch}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all cursor-pointer"
          >
            <Search className="h-4 w-4" />
            Find a Partner
          </button>
        </div>
      )}

      {/* ── Match Queue ─────────────────────── */}
      {isSearching && !currentMatch && (
        <div className="glass-card p-5 flex items-center gap-4">
          <div className="relative flex h-12 w-12 items-center justify-center">
            <div className="absolute h-12 w-12 rounded-full border-2 border-cyan-400/40 animate-ping-slow" />
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30">
              <Clock className="h-5 w-5 text-cyan-400" />
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Searching for a match…</p>
            <p className="text-xs text-white/40">
              Estimated wait: <span className="text-cyan-400 font-medium">{estimatedWait}s</span>
            </p>
          </div>
          <button onClick={() => setIsSearching(false)} className="text-white/40 hover:text-white transition-colors cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ── Active Partner / Call ───────────── */}
      {currentMatch && (
        <div className={`glass-card-neon p-6 ${inCall ? 'ring-2 ring-cyan-500/40' : ''}`}>
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/20">
                {currentMatch.name.charAt(0)}
              </div>
              <div className="absolute -bottom-1 -right-1">
                <OnlineDot isOnline={currentMatch.isOnline} />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-semibold text-white truncate">{currentMatch.name}</h3>
                <CompatibilityBadge score={currentMatch.compatibilityScore} />
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-white/40">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.04] border border-white/[0.06] px-2 py-0.5">
                  <Globe className="h-3 w-3 text-indigo-400" /> {currentMatch.nativeLanguage}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.04] border border-white/[0.06] px-2 py-0.5">
                  {currentMatch.cefrLevel}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.04] border border-white/[0.06] px-2 py-0.5">
                  Wants: {currentMatch.targetLanguage}
                </span>
              </div>
              {inCall && (
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex items-center gap-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 px-3 py-1">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
                    </span>
                    <span className="text-xs font-mono text-cyan-300">{formatDuration(callDuration)}</span>
                  </div>
                  <span className="text-xs text-white/30">In call</span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              {!inCall ? (
                <button
                  onClick={() => handleStartCall(currentMatch.id)}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all cursor-pointer"
                >
                  <Phone className="h-4 w-4" /> Start Call
                </button>
              ) : (
                <button
                  onClick={handleEndCall}
                  className="flex items-center gap-2 rounded-xl bg-red-500/20 border border-red-500/30 px-4 py-2 text-sm font-medium text-red-300 hover:bg-red-500/30 transition-all cursor-pointer"
                >
                  <PhoneOff className="h-4 w-4" /> End Call
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Online Users Grid ───────────────── */}
      <div>
        <h3 className="text-sm font-semibold text-white/60 mb-3">Available Partners</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {onlineUsers.map(user => (
            <div
              key={user.id}
              className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 hover:bg-white/[0.04] hover:border-white/10 transition-all group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="relative shrink-0">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/15">
                    {user.name.charAt(0)}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5">
                    <OnlineDot isOnline={user.isOnline} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{user.name}</p>
                  <p className="text-[10px] text-white/30">{user.cefrLevel} · {user.nativeLanguage}</p>
                </div>
                <CompatibilityBadge score={user.compatibilityScore} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-white/30">Learning {user.targetLanguage}</span>
                <div className="flex-1" />
                <button
                  onClick={() => handleStartCall(user.id)}
                  disabled={!user.isOnline || inCall}
                  className="flex items-center gap-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 text-[10px] font-medium text-cyan-300 hover:bg-cyan-500/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <MessageCircle className="h-3 w-3" /> Chat
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Recent Calls History ────────────── */}
      <div>
        <h3 className="text-sm font-semibold text-white/60 mb-3">Recent Calls</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
          {RECENT_CALLS.map(call => (
            <div key={call.id} className="flex items-center gap-3 bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white font-bold text-xs">
                {call.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{call.name}</p>
                <p className="text-[10px] text-white/30">{call.level} · {call.duration}</p>
              </div>
              <span className="text-[10px] text-white/20">{call.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
