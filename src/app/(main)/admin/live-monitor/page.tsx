'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { Navbar } from '@/components/navbar';
import { StatCard, ConfirmModal, cefrBadge, CEFR_LEVELS, CEFR_PIE_COLORS } from '@/components/admin/shared';
import {
  Radio, Users, Clock, Monitor, BarChart3,
  Mic, MicOff, UserMinus, Trash2, Download,
  Search, RefreshCw, ArrowLeft, Video,
  Loader2, ChevronRight,
  CircleDot, FileText, Activity,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';

// ─── Room Types ────────────────────────────────────────────────────────────

const ROOM_TYPES = [
  { value: 'VOICE_HANGOUT', label: 'Voice Hangout', emoji: '🎙️', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { value: 'LIVE_CLASS', label: 'Live Class', emoji: '🎓', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { value: 'ONE_ON_ONE', label: '1-on-1 Match', emoji: '👥', color: 'text-green-400', bg: 'bg-green-500/10' },
  { value: 'LECTURE', label: 'Lecture', emoji: '📺', color: 'text-red-400', bg: 'bg-red-500/10' },
  { value: 'OPEN_MIC', label: 'Open Mic', emoji: '🎤', color: 'text-orange-400', bg: 'bg-orange-500/10' },
  { value: 'STUDY_GROUP', label: 'Study Group', emoji: '📚', color: 'text-teal-400', bg: 'bg-teal-500/10' },
  { value: 'WATCH_PARTY', label: 'Watch Party', emoji: '👀', color: 'text-pink-400', bg: 'bg-pink-500/10' },
];

// ─── Types ─────────────────────────────────────────────────────────────────

interface Participant {
  id: string;
  userId: string;
  role: string;
  joinedAt: string;
  leftAt: string | null;
  user?: {
    id: string;
    name: string | null;
    avatarUrl: string | null;
  };
}

interface LiveKitParticipant {
  identity: string;
  name?: string;
  state: string;
  tracks?: Array<{
    sid: string;
    name: string;
    kind: string;
    source: string;
    muted: boolean;
  }>;
  joinedAt?: number;
  metadata?: string;
}

interface LiveRoom {
  id: string;
  name: string;
  description: string | null;
  type: string;
  status: string;
  maxParticipants: number;
  cefrLevel: string | null;
  topic: string | null;
  language: string;
  hostId: string;
  hostName: string;
  hostAvatar: string | null;
  roomName: string;
  isRecording: boolean;
  isPrivate: boolean;
  createdAt: string;
  endedAt: string | null;
  participants: Participant[];
  activeParticipantCount: number;
  isLiveOnServer: boolean;
}

interface MonitorStats {
  totalRoomsToday: number;
  peakConcurrent: number;
  avgDurationMinutes: number;
  totalRecordings: number;
  activeRooms: number;
  currentOnline: number;
  totalParticipantsNow: number;
  roomTypeDistribution: Array<{ type: string; count: number }>;
  cefrLevelDistribution: Array<{ level: string; count: number }>;
}

// ─── Helper ────────────────────────────────────────────────────────────────

function getRoomType(type: string) {
  return ROOM_TYPES.find((t) => t.value === type) || ROOM_TYPES[1];
}

function formatJoinTime(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ${diffMin % 60}m`;
  return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function roleBadge(role: string) {
  const config: Record<string, { label: string; cls: string }> = {
    host: { label: 'Host', cls: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
    co_host: { label: 'Co-Host', cls: 'bg-violet-500/20 text-violet-400 border-violet-500/30' },
    speaker: { label: 'Speaker', cls: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
    participant: { label: 'Member', cls: 'bg-white/10 text-white/50 border-white/20' },
  };
  const c = config[role] || config.participant;
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold border ${c.cls}`}>
      {c.label}
    </span>
  );
}

// ─── Toast ─────────────────────────────────────────────────────────────────

function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium shadow-2xl animate-slide-up ${
      type === 'success'
        ? 'bg-green-500/20 border border-green-500/30 text-green-400 backdrop-blur-xl'
        : 'bg-red-500/20 border border-red-500/30 text-red-400 backdrop-blur-xl'
    }`}>
      {type === 'success' ? '✓' : '✕'} {message}
      <button onClick={onClose} className="ml-2 hover:opacity-70 text-current">×</button>
    </div>
  );
}

// ─── CSS Bar Chart ─────────────────────────────────────────────────────────

function BarChart({ data, colorMap, height = 120 }: {
  data: Array<{ label: string; value: number }>;
  colorMap?: Record<string, string>;
  height?: number;
}) {
  const maxVal = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="flex items-end gap-2" style={{ height }}>
      {data.map((d) => {
        const pct = (d.value / maxVal) * 100;
        const barColor = colorMap?.[d.label] || 'bg-violet-500/60';
        return (
          <div key={d.label} className="flex-1 flex flex-col items-center gap-1 min-w-0">
            <span className="text-white/50 text-[10px] font-medium">{d.value}</span>
            <div className="w-full relative rounded-t-md overflow-hidden" style={{ height: `${Math.max(pct, 4)}%` }}>
              <div className={`absolute inset-0 ${barColor} rounded-t-md`} />
            </div>
            <span className="text-white/40 text-[9px] truncate w-full text-center">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────

export default function LiveMonitorPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuthStore();
  const isMobile = useIsMobile();

  // Data
  const [rooms, setRooms] = useState<LiveRoom[]>([]);
  const [livekitParticipants, setLivekitParticipants] = useState<Record<string, LiveKitParticipant[]>>({});
  const [stats, setStats] = useState<MonitorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

  // UI state
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'rooms' | 'analytics'>('rooms');
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    type: 'close_room' | 'remove_participant' | 'stop_recording';
    roomName: string;
    identity?: string;
    title: string;
    message: string;
  } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const onToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  }, []);

  // Auth gate
  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/admin');
    }
  }, [user, authLoading, router]);

  // Fetch rooms
  const fetchRooms = useCallback(async () => {
    try {
      const res = await fetch('/api/live-rooms?admin=true&status=active', {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setRooms(data.rooms || []);
      }
    } catch (err) {
      console.error('Failed to fetch rooms:', err);
    }
  }, []);

  // Fetch LiveKit participants for active rooms (single API call)
  const fetchLivekitData = useCallback(async (roomList: LiveRoom[]) => {
    const participantsMap: Record<string, LiveKitParticipant[]> = {};
    const activeRoomNames = new Set(
      roomList.filter((r) => r.isLiveOnServer && r.roomName).map((r) => r.roomName)
    );
    if (activeRoomNames.size === 0) {
      setLivekitParticipants(participantsMap);
      return;
    }
    try {
      const res = await fetch(
        `/api/livekit/rooms?includeParticipants=true`,
        { credentials: 'include' }
      );
      if (res.ok) {
        const data = await res.json();
        const lkRooms = data.rooms || [];
        for (const lkRoom of lkRooms) {
          if (activeRoomNames.has(lkRoom.roomName) && lkRoom.participants) {
            participantsMap[lkRoom.roomName] = lkRoom.participants;
          }
        }
      }
    } catch { /* continue without LiveKit data */ }
    setLivekitParticipants(participantsMap);
  }, []);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await fetch('/api/admin/live-monitor/stats', {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Refresh all
  const refreshAll = useCallback(async () => {
    setLoading(true);
    await fetchRooms();
    setLoading(false);
    if (activeTab === 'analytics') {
      fetchStats();
    }
  }, [fetchRooms, fetchStats, activeTab]);

  // Auto-refresh
  useEffect(() => {
    refreshAll();
    const interval = setInterval(refreshAll, 15000);
    return () => clearInterval(interval);
  }, [refreshAll]);

  // Fetch livekit data when rooms change
  useEffect(() => {
    if (rooms.length > 0) {
      fetchLivekitData(rooms);
    }
  }, [rooms, fetchLivekitData]);

  // Fetch stats when switching to analytics tab
  useEffect(() => {
    if (activeTab === 'analytics') {
      fetchStats();
    }
  }, [activeTab, fetchStats]);

  // Filtered rooms
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      if (filterType !== 'all' && room.type !== filterType) return false;
      if (filterLevel !== 'all' && room.cefrLevel !== filterLevel) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          room.name.toLowerCase().includes(q) ||
          room.hostName.toLowerCase().includes(q) ||
          room.roomName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [rooms, filterType, filterLevel, search]);

  // Selected room
  const selectedRoom = useMemo(() => {
    if (!selectedRoomId) return null;
    return rooms.find((r) => r.id === selectedRoomId) || null;
  }, [rooms, selectedRoomId]);

  // Combined participants (DB + LiveKit)
  const selectedRoomParticipants = useMemo(() => {
    if (!selectedRoom) return [];
    const lkParts = livekitParticipants[selectedRoom.roomName] || [];

    // Merge DB participants with LiveKit data
    const dbParts = selectedRoom.participants || [];

    return dbParts.map((p) => {
      const lkP = lkParts.find((lk) => lk.identity === p.userId);
      const isMuted = lkP?.tracks?.find(
        (t) => t.source === 'microphone' || t.kind === 'audio'
      )?.muted ?? false;
      const hasMic = lkP?.tracks?.some(
        (t) => t.source === 'microphone' || t.kind === 'audio'
      ) ?? false;

      return {
        ...p,
        name: p.user?.name || p.userId,
        isMuted,
        hasMic,
        isOnline: !p.leftAt,
      };
    });
  }, [selectedRoom, livekitParticipants]);

  // ─── Actions ───────────────────────────────────────────────────────────

  const handleMute = async (roomName: string, identity: string, currentlyMuted: boolean) => {
    try {
      const res = await fetch('/api/admin/live-monitor/mute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ roomName, identity, muted: !currentlyMuted }),
      });
      if (res.ok) {
        onToast(currentlyMuted ? 'Participant unmuted' : 'Participant muted', 'success');
        fetchLivekitData(rooms);
      } else {
        const err = await res.json();
        onToast(err.error || 'Failed to toggle mute', 'error');
      }
    } catch {
      onToast('Failed to toggle mute', 'error');
    }
  };

  const handleRemove = async (roomName: string, identity: string) => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/live-monitor/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ roomName, identity }),
      });
      if (res.ok) {
        onToast('Participant removed', 'success');
        fetchRooms();
        fetchLivekitData(rooms);
      } else {
        const err = await res.json();
        onToast(err.error || 'Failed to remove participant', 'error');
      }
    } catch {
      onToast('Failed to remove participant', 'error');
    } finally {
      setActionLoading(false);
      setConfirmAction(null);
    }
  };

  const handleCloseRoom = async (roomId: string, roomName: string) => {
    setActionLoading(true);
    try {
      // Close via live-rooms API
      const res = await fetch(`/api/live-rooms/${roomId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        // Also delete LiveKit room
        try {
          await fetch(`/api/livekit/rooms?roomName=${encodeURIComponent(roomName)}`, {
            method: 'DELETE',
            credentials: 'include',
          });
        } catch { /* ok */ }
        onToast('Room closed successfully', 'success');
        setSelectedRoomId(null);
        fetchRooms();
      } else {
        const err = await res.json();
        onToast(err.error || 'Failed to close room', 'error');
      }
    } catch {
      onToast('Failed to close room', 'error');
    } finally {
      setActionLoading(false);
      setConfirmAction(null);
    }
  };

  const handleToggleRecording = async (roomName: string, isRecording: boolean) => {
    try {
      if (isRecording) {
        // Need egress ID to stop — for now, stop via recordings endpoint
        const recsRes = await fetch('/api/livekit/recordings', { credentials: 'include' });
        if (recsRes.ok) {
          const recsData = await recsRes.json();
          const activeRec = (recsData.activeRecordings || []).find(
            (r: any) => r.roomName === roomName
          );
          if (activeRec) {
            const res = await fetch('/api/livekit/recordings', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ action: 'stop', roomName, egressId: activeRec.egressId }),
            });
            if (res.ok) {
              onToast('Recording stopped', 'success');
              fetchRooms();
            } else {
              onToast('Failed to stop recording', 'error');
            }
          }
        }
      } else {
        const res = await fetch('/api/livekit/recordings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ action: 'start', roomName }),
        });
        if (res.ok) {
          onToast('Recording started', 'success');
          fetchRooms();
        } else {
          const err = await res.json();
          onToast(err.error || 'Failed to start recording', 'error');
        }
      }
    } catch {
      onToast('Failed to toggle recording', 'error');
    }
  };

  const handleDownloadCSV = () => {
    if (!selectedRoom) return;
    const headers = ['Name', 'Role', 'Join Time', 'Status'];
    const rows = selectedRoomParticipants.map((p) => [
      p.name || p.userId,
      p.role,
      new Date(p.joinedAt).toISOString(),
      p.isOnline ? 'Online' : 'Left',
    ]);

    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedRoom.name.replace(/\s+/g, '_')}_participants.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ─── Loading & Auth ──────────────────────────────────────────────────

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0F0A1E] flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/50 text-sm">Loading monitor...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') return null;

  // ─── Render ──────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#0F0A1E]">
      <Navbar />

      <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-700 text-white shadow-lg">
                <Radio className="h-5 w-5" />
              </div>
              SpeakSpace Control
              <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full border border-red-500/30 flex items-center gap-1">
                <CircleDot className="h-2.5 w-2.5 animate-pulse" />
                LIVE
              </span>
            </h1>
            <p className="text-white/40 text-sm mt-1">Real-time monitoring &amp; admin controls for all SpeakSpace rooms</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={refreshAll}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors text-sm"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6">
          <button
            onClick={() => setActiveTab('rooms')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${
              activeTab === 'rooms'
                ? 'bg-gradient-to-r from-red-500/20 to-violet-500/20 text-white border border-red-500/30 shadow-lg shadow-red-500/10'
                : 'text-white/50 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <Radio className="h-4 w-4" />
            Live Rooms
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${
              activeTab === 'analytics'
                ? 'bg-gradient-to-r from-blue-500/20 to-violet-500/20 text-white border border-blue-500/30 shadow-lg shadow-blue-500/10'
                : 'text-white/50 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            Analytics
          </button>
        </div>

        {/* ─── Rooms Tab ─────────────────────────────────────────────── */}
        {activeTab === 'rooms' && (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Panel - Room List */}
            <div className={`w-full lg:w-[380px] shrink-0 ${isMobile && selectedRoomId ? 'hidden' : ''}`}>
              {/* Search & Filters */}
              <div className="glass-card p-4 mb-4 space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                  <input
                    type="text"
                    placeholder="Search rooms..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="flex-1 px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500/50 appearance-none cursor-pointer"
                  >
                    <option value="all" className="bg-gray-900">All Types</option>
                    {ROOM_TYPES.map((t) => (
                      <option key={t.value} value={t.value} className="bg-gray-900">
                        {t.emoji} {t.label}
                      </option>
                    ))}
                  </select>
                  <select
                    value={filterLevel}
                    onChange={(e) => setFilterLevel(e.target.value)}
                    className="flex-1 px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500/50 appearance-none cursor-pointer"
                  >
                    <option value="all" className="bg-gray-900">All Levels</option>
                    {CEFR_LEVELS.map((l) => (
                      <option key={l} value={l} className="bg-gray-900">{l}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Room List */}
              <div className="space-y-2 max-h-[calc(100vh-320px)] overflow-y-auto custom-scrollbar pr-1">
                {loading && rooms.length === 0 ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 text-violet-400 animate-spin mr-2" />
                    <span className="text-white/40 text-sm">Loading rooms...</span>
                  </div>
                ) : filteredRooms.length === 0 ? (
                  <div className="glass-card p-8 text-center">
                    <Video className="w-10 h-10 text-white/15 mx-auto mb-3" />
                    <p className="text-white/40 text-sm">
                      {search || filterType !== 'all' || filterLevel !== 'all'
                        ? 'No rooms match your filters'
                        : 'No active rooms right now'}
                    </p>
                  </div>
                ) : (
                  filteredRooms.map((room) => {
                    const roomType = getRoomType(room.type);
                    const isSelected = selectedRoomId === room.id;
                    return (
                      <button
                        key={room.id}
                        onClick={() => setSelectedRoomId(room.id)}
                        className={`w-full text-left glass-card p-3 transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'border-violet-500/50 bg-violet-500/10 hover:bg-violet-500/15'
                            : 'hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Type indicator */}
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${roomType.bg}`}>
                            <span className="text-sm">{roomType.emoji}</span>
                          </div>
                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <h3 className="text-sm font-medium text-white truncate">{room.name}</h3>
                              {room.isLiveOnServer && (
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0 animate-pulse" />
                              )}
                              {room.isRecording && (
                                <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0 animate-pulse" />
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-[11px] text-white/40">
                              <span className={roomType.color}>{roomType.label}</span>
                              <span className="flex items-center gap-0.5">
                                <Users className="h-3 w-3" />
                                {room.activeParticipantCount}/{room.maxParticipants}
                              </span>
                              {room.cefrLevel && <span>{room.cefrLevel}</span>}
                              <span>{room.hostName}</span>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-white/20 shrink-0 mt-1" />
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Panel - Room Detail */}
            <div className={`flex-1 min-w-0 ${isMobile && !selectedRoomId ? 'hidden' : ''}`}>
              {!selectedRoom ? (
                <div className="glass-card p-12 text-center">
                  <Radio className="w-12 h-12 text-white/15 mx-auto mb-3" />
                  <p className="text-white/40 text-sm">Select a room to view details</p>
                  <p className="text-white/25 text-xs mt-1">Click any room from the left panel</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Mobile back button */}
                  {isMobile && (
                    <button
                      onClick={() => setSelectedRoomId(null)}
                      className="flex items-center gap-2 text-white/50 hover:text-white text-sm mb-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to rooms
                    </button>
                  )}

                  {/* Room Header */}
                  <div className="glass-card p-5">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{getRoomType(selectedRoom.type).emoji}</span>
                          <h2 className="text-lg font-bold text-white truncate">{selectedRoom.name}</h2>
                          {selectedRoom.isLiveOnServer && (
                            <Badge className="bg-green-500/20 text-green-400 text-[10px] border-0 shrink-0">
                              <CircleDot className="h-2.5 w-2.5 mr-1 animate-pulse" />
                              LIVE
                            </Badge>
                          )}
                          {selectedRoom.isRecording && (
                            <Badge className="bg-red-500/20 text-red-400 text-[10px] border-0 shrink-0">
                              <CircleDot className="h-2.5 w-2.5 mr-1 animate-pulse" />
                              REC
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-white/40">
                          <span className={getRoomType(selectedRoom.type).color}>
                            {getRoomType(selectedRoom.type).label}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {selectedRoom.activeParticipantCount}/{selectedRoom.maxParticipants}
                          </span>
                          {selectedRoom.cefrLevel && (
                            <span>{cefrBadge(selectedRoom.cefrLevel)}</span>
                          )}
                          <span>Host: {selectedRoom.hostName}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatJoinTime(selectedRoom.createdAt)}
                          </span>
                        </div>
                        {selectedRoom.description && (
                          <p className="text-white/30 text-xs mt-2 line-clamp-2">{selectedRoom.description}</p>
                        )}
                      </div>
                    </div>

                    {/* Room Actions */}
                    <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-white/10">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleRecording(selectedRoom.roomName, selectedRoom.isRecording)}
                        className={`${
                          selectedRoom.isRecording
                            ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10'
                            : 'text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10'
                        }`}
                      >
                        {selectedRoom.isRecording ? (
                          <>
                            <Monitor className="h-4 w-4 mr-1.5" />
                            Stop Rec
                          </>
                        ) : (
                          <>
                            <Monitor className="h-4 w-4 mr-1.5" />
                            Start Rec
                          </>
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleDownloadCSV}
                        className="text-white/50 hover:text-white hover:bg-white/10"
                      >
                        <Download className="h-4 w-4 mr-1.5" />
                        Export CSV
                      </Button>
                      <div className="flex-1" />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setConfirmAction({
                            type: 'close_room',
                            roomName: selectedRoom.roomName,
                            title: selectedRoom.name,
                            message: `Are you sure you want to close "${selectedRoom.name}"? All ${selectedRoom.activeParticipantCount} participants will be disconnected immediately.`,
                          })
                        }
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4 mr-1.5" />
                        Close Room
                      </Button>
                    </div>
                  </div>

                  {/* Participant Table */}
                  <div className="glass-card p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                        <Users className="h-4 w-4 text-violet-400" />
                        Participants ({selectedRoomParticipants.length})
                      </h3>
                    </div>

                    {selectedRoomParticipants.length === 0 ? (
                      <div className="py-8 text-center">
                        <Users className="w-8 h-8 text-white/15 mx-auto mb-2" />
                        <p className="text-white/30 text-sm">No participants in this room</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-white/10">
                              <th className="text-left py-2 px-3 text-white/40 font-medium text-xs">Name</th>
                              <th className="text-left py-2 px-3 text-white/40 font-medium text-xs">Role</th>
                              <th className="text-left py-2 px-3 text-white/40 font-medium text-xs">Joined</th>
                              <th className="text-left py-2 px-3 text-white/40 font-medium text-xs">Status</th>
                              <th className="text-right py-2 px-3 text-white/40 font-medium text-xs">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedRoomParticipants.map((p) => (
                              <tr
                                key={p.id}
                                className="border-b border-white/5 hover:bg-white/5 transition-colors"
                              >
                                <td className="py-2.5 px-3">
                                  <div className="flex items-center gap-2">
                                    <div className="h-7 w-7 rounded-full bg-gradient-to-br from-violet-500/30 to-blue-500/30 flex items-center justify-center text-[10px] font-bold text-white/70 shrink-0">
                                      {(p.name || 'U')[0].toUpperCase()}
                                    </div>
                                    <span className="text-white text-xs truncate max-w-[120px]">
                                      {p.name || p.userId}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-2.5 px-3">{roleBadge(p.role)}</td>
                                <td className="py-2.5 px-3 text-white/40 text-xs">
                                  {formatJoinTime(p.joinedAt)}
                                </td>
                                <td className="py-2.5 px-3">
                                  {p.isOnline ? (
                                    <span className="inline-flex items-center gap-1 text-green-400 text-[10px]">
                                      <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                      Online
                                    </span>
                                  ) : (
                                    <span className="text-white/30 text-[10px]">Left</span>
                                  )}
                                  {p.hasMic && (
                                    <span className="ml-1.5 text-[10px] text-white/20">
                                      {p.isMuted ? '🔇' : '🎙️'}
                                    </span>
                                  )}
                                </td>
                                <td className="py-2.5 px-3">
                                  <div className="flex items-center justify-end gap-1">
                                    {p.isOnline && p.role !== 'host' && p.hasMic && (
                                      <button
                                        onClick={() => handleMute(selectedRoom.roomName, p.userId, p.isMuted)}
                                        className={`p-1.5 rounded-md transition-colors ${
                                          p.isMuted
                                            ? 'text-green-400 hover:bg-green-500/10'
                                            : 'text-orange-400 hover:bg-orange-500/10'
                                        }`}
                                        title={p.isMuted ? 'Unmute' : 'Mute'}
                                      >
                                        {p.isMuted ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
                                      </button>
                                    )}
                                    {p.isOnline && p.role !== 'host' && (
                                      <button
                                        onClick={() =>
                                          setConfirmAction({
                                            type: 'remove_participant',
                                            roomName: selectedRoom.roomName,
                                            identity: p.userId,
                                            title: p.name || p.userId,
                                            message: `Remove "${p.name || p.userId}" from this room? They will be disconnected immediately.`,
                                          })
                                        }
                                        className="p-1.5 rounded-md text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                        title="Remove"
                                      >
                                        <UserMinus className="h-3.5 w-3.5" />
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── Analytics Tab ─────────────────────────────────────────── */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <StatCard
                icon={Radio}
                label="Rooms Today"
                value={stats?.totalRoomsToday ?? '—'}
                gradient="from-red-500 to-red-700"
              />
              <StatCard
                icon={Users}
                label="Peak Concurrent"
                value={stats?.peakConcurrent ?? '—'}
                gradient="from-violet-500 to-violet-700"
              />
              <StatCard
                icon={Clock}
                label="Avg Duration"
                value={stats?.avgDurationMinutes ? `${stats.avgDurationMinutes}m` : '—'}
                gradient="from-blue-500 to-blue-700"
              />
              <StatCard
                icon={Monitor}
                label="Recordings"
                value={stats?.totalRecordings ?? '—'}
                gradient="from-purple-500 to-purple-700"
              />
              <StatCard
                icon={Activity}
                label="Online Now"
                value={stats?.currentOnline ?? '—'}
                gradient="from-green-500 to-green-700"
              />
            </div>

            {/* Charts */}
            {statsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 text-violet-400 animate-spin mr-2" />
                <span className="text-white/40 text-sm">Loading analytics...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Room Type Distribution */}
                <div className="glass-card p-5">
                  <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-violet-400" />
                    Room Type Distribution
                  </h3>
                  {stats && stats.roomTypeDistribution.length > 0 ? (
                    <BarChart
                      data={stats.roomTypeDistribution.map((d) => ({
                        label: getRoomType(d.type).label.split(' ')[0],
                        value: d.count,
                      }))}
                      colorMap={Object.fromEntries(
                        ROOM_TYPES.map((t) => [t.label.split(' ')[0], t.bg.replace('/10', '/60')])
                      )}
                      height={160}
                    />
                  ) : (
                    <div className="py-8 text-center">
                      <BarChart3 className="w-8 h-8 text-white/15 mx-auto mb-2" />
                      <p className="text-white/30 text-xs">No room type data yet</p>
                    </div>
                  )}
                </div>

                {/* CEFR Level Distribution */}
                <div className="glass-card p-5">
                  <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-violet-400" />
                    Participant CEFR Levels
                  </h3>
                  {stats && stats.cefrLevelDistribution.length > 0 ? (
                    <BarChart
                      data={stats.cefrLevelDistribution.map((d) => ({
                        label: d.level,
                        value: d.count,
                      }))}
                      colorMap={Object.fromEntries(
                        CEFR_LEVELS.map((l) => [l, CEFR_PIE_COLORS[l] ? `opacity-60` : 'bg-violet-500/60'])
                      )}
                      height={160}
                    />
                  ) : (
                    <div className="py-8 text-center">
                      <FileText className="w-8 h-8 text-white/15 mx-auto mb-2" />
                      <p className="text-white/30 text-xs">No CEFR level data yet</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Live Summary */}
            {stats && (
              <div className="glass-card p-5">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <Activity className="h-4 w-4 text-green-400" />
                  Live Summary
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-white/40 text-xs mb-1">Active Rooms</p>
                    <p className="text-2xl font-bold text-white">{stats.activeRooms}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-white/40 text-xs mb-1">Online Participants</p>
                    <p className="text-2xl font-bold text-white">{stats.totalParticipantsNow}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-white/40 text-xs mb-1">Peak Today</p>
                    <p className="text-2xl font-bold text-white">{stats.peakConcurrent}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-white/40 text-xs mb-1">Rooms Created Today</p>
                    <p className="text-2xl font-bold text-white">{stats.totalRoomsToday}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Confirm Modal */}
      {confirmAction && (
        <ConfirmModal
          open={!!confirmAction}
          onClose={() => setConfirmAction(null)}
          title={
            confirmAction.type === 'close_room'
              ? 'Close Room'
              : confirmAction.type === 'remove_participant'
                ? 'Remove Participant'
                : 'Confirm Action'
          }
          message={confirmAction.message}
          confirmLabel={
            confirmAction.type === 'close_room'
              ? 'Close Room'
              : confirmAction.type === 'remove_participant'
                ? 'Remove'
                : 'Confirm'
          }
          variant={confirmAction.type === 'close_room' ? 'danger' : 'warning'}
          loading={actionLoading}
          onConfirm={() => {
            if (confirmAction.type === 'close_room') {
              const room = rooms.find((r) => r.roomName === confirmAction.roomName);
              if (room) handleCloseRoom(room.id, confirmAction.roomName);
            } else if (confirmAction.type === 'remove_participant' && confirmAction.identity) {
              handleRemove(confirmAction.roomName, confirmAction.identity);
            }
          }}
        />
      )}

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
