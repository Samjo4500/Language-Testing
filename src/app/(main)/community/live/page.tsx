'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Mic,
  GraduationCap,
  Users,
  Presentation,
  Radio,
  BookOpen,
  Eye,
  Search,
  Plus,
  Radio as RadioLive,
  Calendar,
  Clock,
  Loader2,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Zap,
  Volume2,
  Shield,
  Headphones,
  MessageSquare,
  TrendingUp,
  Globe,
  Lock,
  Timer,
  UserCheck,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// ─── Types ──────────────────────────────────────────────
interface LiveRoom {
  id: string;
  name: string;
  description?: string;
  roomName: string;
  type: string;
  status: string;
  cefrLevel?: string;
  topic?: string;
  language: string;
  maxParticipants: number;
  isPrivate: boolean;
  isLocked: boolean;
  isRecording: boolean;
  hostId: string;
  hostName: string;
  hostAvatar?: string;
  participantCount: number;
  totalJoins: number;
  scheduledFor?: string;
  createdAt: string;
  activeParticipantCount?: number;
  isLiveOnServer?: boolean;
}

interface ScheduledEvent {
  id: string;
  title: string;
  description?: string;
  type: string;
  hostId: string;
  hostName: string;
  hostAvatar?: string;
  cefrLevel?: string;
  topic?: string;
  scheduledFor: string;
  duration: number;
  maxParticipants: number;
  rsvpCount: number;
  hasRsvped?: boolean;
}

// ─── Constants ──────────────────────────────────────────
const ROOM_TYPES = [
  { value: 'VOICE_HANGOUT', label: 'Voice Hangout', icon: Mic, emoji: '🎙️', accent: 'purple', gradient: 'from-purple-500 to-violet-600', bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', glow: 'shadow-purple-500/20', ring: 'ring-purple-500/40' },
  { value: 'LIVE_CLASS', label: 'Live Class', icon: GraduationCap, emoji: '🎓', accent: 'blue', gradient: 'from-blue-500 to-cyan-600', bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', glow: 'shadow-blue-500/20', ring: 'ring-blue-500/40' },
  { value: 'ONE_ON_ONE', label: '1-on-1 Match', icon: Users, emoji: '👥', accent: 'green', gradient: 'from-green-500 to-emerald-600', bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400', glow: 'shadow-green-500/20', ring: 'ring-green-500/40' },
  { value: 'LECTURE', label: 'Lecture', icon: Presentation, emoji: '📺', accent: 'red', gradient: 'from-red-500 to-rose-600', bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', glow: 'shadow-red-500/20', ring: 'ring-red-500/40' },
  { value: 'OPEN_MIC', label: 'Open Mic', icon: Radio, emoji: '🎤', accent: 'orange', gradient: 'from-orange-500 to-amber-600', bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', glow: 'shadow-orange-500/20', ring: 'ring-orange-500/40' },
  { value: 'STUDY_GROUP', label: 'Study Group', icon: BookOpen, emoji: '📚', accent: 'teal', gradient: 'from-teal-500 to-cyan-600', bg: 'bg-teal-500/10', border: 'border-teal-500/30', text: 'text-teal-400', glow: 'shadow-teal-500/20', ring: 'ring-teal-500/40' },
  { value: 'WATCH_PARTY', label: 'Watch Party', icon: Eye, emoji: '👀', accent: 'pink', gradient: 'from-pink-500 to-rose-600', bg: 'bg-pink-500/10', border: 'border-pink-500/30', text: 'text-pink-400', glow: 'shadow-pink-500/20', ring: 'ring-pink-500/40' },
];

const LEVELS = [
  { value: 'all', label: 'All Levels' },
  { value: 'A1', label: 'A1 — Beginner' },
  { value: 'A2', label: 'A2 — Elementary' },
  { value: 'B1', label: 'B1 — Intermediate' },
  { value: 'B2', label: 'B2 — Upper Int.' },
  { value: 'C1', label: 'C1 — Advanced' },
  { value: 'C2', label: 'C2 — Mastery' },
];

const TOPICS = [
  { value: 'all', label: 'All Topics' },
  { value: 'Grammar', label: 'Grammar' },
  { value: 'Speaking', label: 'Speaking' },
  { value: 'Business', label: 'Business' },
  { value: 'Travel', label: 'Travel' },
  { value: 'Exam Prep', label: 'Exam Prep' },
  { value: 'Culture', label: 'Culture' },
  { value: 'Idioms', label: 'Idioms' },
];

function getTypeConfig(type: string) {
  return ROOM_TYPES.find(t => t.value === type) || ROOM_TYPES[1];
}

function formatRelativeTime(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 0) return 'Started';
  if (diffMins < 60) return `in ${diffMins}m`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `in ${diffHrs}h`;
  const diffDays = Math.floor(diffHrs / 24);
  return `in ${diffDays}d`;
}

// ─── Main Page ──────────────────────────────────────────
export default function CommunityLivePage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<LiveRoom[]>([]);
  const [events, setEvents] = useState<ScheduledEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('live');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterTopic, setFilterTopic] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [creating, setCreating] = useState(false);

  // Match state
  const [matchLevel, setMatchLevel] = useState('B1');
  const [matchTopic, setMatchTopic] = useState('Speaking');
  const [matchStatus, setMatchStatus] = useState<'idle' | 'searching' | 'matched' | 'waiting'>('idle');
  const [matchRoomName, setMatchRoomName] = useState('');
  const matchPollRef = useRef<NodeJS.Timeout | null>(null);

  // Create room form
  const [newRoom, setNewRoom] = useState({
    name: '',
    description: '',
    type: 'VOICE_HANGOUT',
    cefrLevel: 'B1',
    topic: 'Speaking',
    maxParticipants: '20',
    scheduledFor: '',
    isPrivate: false,
    language: 'English',
  });

  const fetchData = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filterType !== 'all') params.set('type', filterType);
      if (filterLevel !== 'all') params.set('level', filterLevel);
      if (filterTopic !== 'all') params.set('topic', filterTopic);
      if (searchQuery) params.set('search', searchQuery);

      const [roomsRes, eventsRes] = await Promise.all([
        fetch(`/api/live-rooms?${params.toString()}`, { credentials: 'include' }),
        fetch('/api/events?upcoming=true', { credentials: 'include' }),
      ]);

      if (roomsRes.ok) {
        const data = await roomsRes.json();
        setRooms(data.rooms || []);
      }
      if (eventsRes.ok) {
        const data = await eventsRes.json();
        setEvents(data.events || []);
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  }, [filterType, filterLevel, filterTopic, searchQuery]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Cleanup match polling on unmount
  useEffect(() => {
    return () => {
      if (matchPollRef.current) clearInterval(matchPollRef.current);
    };
  }, []);

  const handleCreateRoom = async () => {
    if (!newRoom.name.trim()) return;
    setCreating(true);
    try {
      const res = await fetch('/api/live-rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: newRoom.name.trim(),
          type: newRoom.type,
          description: newRoom.description.trim() || undefined,
          cefrLevel: newRoom.cefrLevel,
          topic: newRoom.topic,
          maxParticipants: parseInt(newRoom.maxParticipants) || 20,
          scheduledFor: newRoom.scheduledFor || undefined,
          isPrivate: newRoom.isPrivate,
          language: newRoom.language,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create room');
      }

      const data = await res.json();
      setShowCreateDialog(false);
      setNewRoom({ name: '', description: '', type: 'VOICE_HANGOUT', cefrLevel: 'B1', topic: 'Speaking', maxParticipants: '20', scheduledFor: '', isPrivate: false, language: 'English' });
      router.push(`/community/live/${data.roomName}`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleMatch = async () => {
    setMatchStatus('searching');
    try {
      const res = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ level: matchLevel, topic: matchTopic }),
      });

      if (!res.ok) throw new Error('Match failed');
      const data = await res.json();

      if (data.status === 'matched') {
        setMatchStatus('matched');
        setMatchRoomName(data.roomName);
        setTimeout(() => router.push(`/community/live/${data.roomName}`), 1500);
      } else {
        setMatchStatus('waiting');
        matchPollRef.current = setInterval(async () => {
          try {
            const qRes = await fetch('/api/match', { credentials: 'include' });
            if (qRes.ok) {
              const qData = await qRes.json();
              if (qData.status === 'matched') {
                setMatchStatus('matched');
                setMatchRoomName(qData.match?.roomName || qData.roomName || '');
                if (matchPollRef.current) clearInterval(matchPollRef.current);
                setTimeout(() => router.push(`/community/live/${qData.match?.roomName || qData.roomName}`), 1500);
              }
            }
          } catch {}
        }, 3000);
      }
    } catch {
      setMatchStatus('idle');
    }
  };

  const handleCancelMatch = async () => {
    if (matchPollRef.current) {
      clearInterval(matchPollRef.current);
      matchPollRef.current = null;
    }
    try {
      await fetch('/api/match', { method: 'DELETE', credentials: 'include' });
    } catch {}
    setMatchStatus('idle');
  };

  const liveRooms = rooms.filter(r => r.status === 'active');
  const scheduledRooms = rooms.filter(r => r.status === 'scheduled');

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* ─── Header ─── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Link href="/community" className="w-11 h-11 rounded-xl bg-gray-800/80 hover:bg-gray-700 flex items-center justify-center transition-colors shrink-0" title="Back to Community">
                <ArrowLeft className="w-5 h-5 text-gray-400" />
              </Link>
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <RadioLive className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-violet-400 bg-clip-text text-transparent">
                Community Live
              </h1>
            </div>
            <p className="text-gray-400 mt-1 text-sm sm:text-base ml-28">
              Join live rooms, practice conversations, and learn together
            </p>
          </div>
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/20 shrink-0"
            size="lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Room
          </Button>
        </div>

        {/* ─── Quick Stats ─── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { icon: RadioLive, label: 'Live Now', value: liveRooms.length, color: 'text-red-400', bg: 'bg-red-500/10', ring: 'ring-red-500/20' },
            { icon: Calendar, label: 'Upcoming', value: events.length, color: 'text-blue-400', bg: 'bg-blue-500/10', ring: 'ring-blue-500/20' },
            { icon: Users, label: 'Active Users', value: liveRooms.reduce((a, r) => a + (r.activeParticipantCount || r.participantCount || 0), 0), color: 'text-green-400', bg: 'bg-green-500/10', ring: 'ring-green-500/20' },
            { icon: TrendingUp, label: 'Room Types', value: new Set(rooms.map(r => r.type)).size, color: 'text-purple-400', bg: 'bg-purple-500/10', ring: 'ring-purple-500/20' },
          ].map((stat, i) => (
            <Card key={i} className="bg-gray-900/50 border-gray-800/50 ring-1 ring-inset ring-gray-800/30">
              <CardContent className="p-3 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg ${stat.bg} ring-1 ring-inset ${stat.ring} flex items-center justify-center`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <div>
                  <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ─── Tabs ─── */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="bg-gray-900 border border-gray-800">
            <TabsTrigger value="live" className="data-[state=active]:bg-red-600/20 data-[state=active]:text-red-400">
              <RadioLive className="w-4 h-4 mr-1.5" />
              Live Now
              {liveRooms.length > 0 && (
                <Badge variant="secondary" className="ml-1.5 bg-red-600/20 text-red-400 text-[10px] px-1.5 min-w-[20px] text-center">
                  {liveRooms.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-400">
              <Calendar className="w-4 h-4 mr-1.5" />
              Upcoming
              {events.length > 0 && (
                <Badge variant="secondary" className="ml-1.5 bg-blue-600/20 text-blue-400 text-[10px] px-1.5 min-w-[20px] text-center">
                  {events.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="match" className="data-[state=active]:bg-green-600/20 data-[state=active]:text-green-400">
              <Users className="w-4 h-4 mr-1.5" />
              1-on-1 Match
            </TabsTrigger>
          </TabsList>

          {/* ─── Filter Bar ─── */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search rooms..."
                className="pl-10 bg-gray-900 border-gray-800 text-white placeholder:text-gray-600 h-9 focus-visible:ring-purple-500/40"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-[160px] bg-gray-900 border-gray-800 text-white h-9">
                <SelectValue placeholder="Room Type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-800">
                <SelectItem value="all">All Types</SelectItem>
                {ROOM_TYPES.map(t => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.emoji} {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterLevel} onValueChange={setFilterLevel}>
              <SelectTrigger className="w-full sm:w-[150px] bg-gray-900 border-gray-800 text-white h-9">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-800">
                {LEVELS.map(l => (
                  <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterTopic} onValueChange={setFilterTopic}>
              <SelectTrigger className="w-full sm:w-[140px] bg-gray-900 border-gray-800 text-white h-9">
                <SelectValue placeholder="Topic" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-800">
                {TOPICS.map(t => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* ─── Live Now Tab ─── */}
          <TabsContent value="live" className="mt-6 space-y-8">
            {/* 1-on-1 Matching Quick Card */}
            <Card className="bg-gradient-to-br from-green-500/5 via-emerald-500/5 to-teal-500/5 border-green-500/20 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-40 h-40 bg-green-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500/5 rounded-full translate-y-1/2 -translate-x-1/2" />
              <CardContent className="p-6 relative">
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                      <Users className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">Find a Conversation Partner</h3>
                      <p className="text-sm text-gray-400">Get matched with someone at your level for a live 1-on-1 practice</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 lg:ml-auto">
                    <Select value={matchLevel} onValueChange={setMatchLevel}>
                      <SelectTrigger className="w-[90px] bg-gray-900 border-gray-700 text-white h-9 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700">
                        {['A1','A2','B1','B2','C1','C2'].map(l => (
                          <SelectItem key={l} value={l}>{l}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={matchTopic} onValueChange={setMatchTopic}>
                      <SelectTrigger className="w-[130px] bg-gray-900 border-gray-700 text-white h-9 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700">
                        {['Speaking','Grammar','Business','Travel','Exam Prep'].map(t => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {matchStatus === 'idle' ? (
                      <Button onClick={handleMatch} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/20">
                        <Zap className="w-4 h-4 mr-1.5" /> Match Me
                      </Button>
                    ) : matchStatus === 'searching' || matchStatus === 'waiting' ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-green-400" />
                        <span className="text-sm text-green-400">{matchStatus === 'searching' ? 'Searching...' : 'Waiting for partner...'}</span>
                        <Button variant="ghost" size="sm" onClick={handleCancelMatch} className="text-gray-400 text-xs hover:text-red-400">
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-green-400 font-medium">Matched! Connecting...</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Live Rooms Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <Card key={i} className="bg-gray-900 border-gray-800 animate-pulse">
                    <CardContent className="p-5">
                      <div className="flex gap-2 mb-3">
                        <div className="h-5 w-20 bg-gray-800 rounded" />
                        <div className="h-5 w-12 bg-gray-800 rounded" />
                      </div>
                      <div className="h-4 bg-gray-800 rounded w-3/4 mb-3" />
                      <div className="h-3 bg-gray-800 rounded w-1/2 mb-2" />
                      <div className="h-3 bg-gray-800 rounded w-1/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : liveRooms.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center mx-auto mb-6 ring-1 ring-gray-700/50">
                  <RadioLive className="w-12 h-12 text-gray-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-300 mb-2">No Active Rooms Right Now</h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  Be the first to start a room! Choose a type and invite others to join your conversation.
                </p>
                <Button onClick={() => setShowCreateDialog(true)} size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/20">
                  <Plus className="w-4 h-4 mr-2" /> Create a Room
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {liveRooms.map(room => (
                  <RoomCard key={room.id} room={room} />
                ))}
              </div>
            )}

            {/* Scheduled rooms on Live tab */}
            {scheduledRooms.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  <h2 className="text-lg font-semibold text-white">Starting Soon</h2>
                  <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 text-[10px]">
                    {scheduledRooms.length}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {scheduledRooms.slice(0, 6).map(room => (
                    <RoomCard key={room.id} room={room} />
                  ))}
                </div>
              </section>
            )}
          </TabsContent>

          {/* ─── Upcoming Tab ─── */}
          <TabsContent value="upcoming" className="mt-6 space-y-6">
            {/* Weekly mini-calendar */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  This Week
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 text-center">
                  {Array.from({ length: 7 }, (_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() - d.getDay() + i);
                    const dayEvents = events.filter(e => {
                      const eDate = new Date(e.scheduledFor);
                      return eDate.toDateString() === d.toDateString();
                    });
                    const isToday = d.toDateString() === new Date().toDateString();
                    return (
                      <div key={i} className={`p-2 rounded-lg transition-colors ${isToday ? 'bg-purple-500/20 border border-purple-500/30' : 'bg-gray-800/50'}`}>
                        <div className="text-xs text-gray-500 mb-1">{d.toLocaleDateString('en', { weekday: 'short' })}</div>
                        <div className={`text-sm font-medium ${isToday ? 'text-purple-400' : 'text-gray-300'}`}>{d.getDate()}</div>
                        {dayEvents.length > 0 && (
                          <div className="flex justify-center gap-0.5 mt-1">
                            {dayEvents.slice(0, 3).map((_, ei) => (
                              <div key={ei} className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                            ))}
                            {dayEvents.length > 3 && (
                              <span className="text-[8px] text-blue-400 ml-0.5">+{dayEvents.length - 3}</span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Events list */}
            {events.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center mx-auto mb-4 ring-1 ring-gray-700/50">
                  <Calendar className="w-10 h-10 text-gray-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-300 mb-2">No Upcoming Events</h3>
                <p className="text-gray-500 mb-6">Be the first to schedule a live session for the community.</p>
                <Button variant="outline" size="lg" className="border-gray-700 text-gray-300 hover:bg-gray-800" onClick={() => setShowCreateDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" /> Schedule an Event
                </Button>
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
                {events.map(event => (
                  <EventCard key={event.id} event={event} onRsvpChange={fetchData} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* ─── 1-on-1 Match Tab ─── */}
          <TabsContent value="match" className="mt-6">
            <div className="max-w-2xl mx-auto space-y-6">
              <Card className="bg-gradient-to-br from-green-500/5 via-emerald-500/5 to-teal-500/5 border-green-500/20 overflow-hidden">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30">
                      <Users className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">1-on-1 Conversation Match</h2>
                    <p className="text-gray-400">Practice speaking with a partner at your level. 15-minute focused conversations.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">Your Level</label>
                      <Select value={matchLevel} onValueChange={setMatchLevel}>
                        <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-700">
                          {['A1','A2','B1','B2','C1','C2'].map(l => (
                            <SelectItem key={l} value={l}>{l}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">Topic</label>
                      <Select value={matchTopic} onValueChange={setMatchTopic}>
                        <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-700">
                          {['Speaking','Grammar','Business','Travel','Exam Prep'].map(t => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Feature highlights */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {[
                      { icon: Shield, label: 'Safe & Moderated', desc: 'All sessions monitored' },
                      { icon: Headphones, label: 'Voice Only', desc: 'No camera pressure' },
                      { icon: MessageSquare, label: 'Chat Support', desc: 'Text chat available' },
                    ].map((f, i) => (
                      <div key={i} className="text-center p-3 rounded-lg bg-gray-900/50">
                        <f.icon className="w-5 h-5 text-green-400 mx-auto mb-1.5" />
                        <div className="text-xs font-medium text-white">{f.label}</div>
                        <div className="text-[10px] text-gray-500">{f.desc}</div>
                      </div>
                    ))}
                  </div>

                  {matchStatus === 'idle' ? (
                    <Button onClick={handleMatch} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white h-12 text-base font-semibold shadow-lg shadow-green-500/20">
                      <Zap className="w-5 h-5 mr-2" /> Find a Partner
                    </Button>
                  ) : matchStatus === 'searching' || matchStatus === 'waiting' ? (
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full border-4 border-green-500/30 border-t-green-500 animate-spin mx-auto mb-4" />
                      <p className="text-green-400 font-medium mb-2">{matchStatus === 'searching' ? 'Searching for a partner...' : 'Waiting for a partner...'}</p>
                      <p className="text-gray-500 text-sm mb-4">This usually takes less than 30 seconds</p>
                      <Button variant="outline" onClick={handleCancelMatch} className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-red-400">
                        <XCircle className="w-4 h-4 mr-2" /> Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Sparkles className="w-12 h-12 text-yellow-400 mx-auto mb-3 animate-bounce" />
                      <p className="text-green-400 font-bold text-lg mb-1">Partner Found!</p>
                      <p className="text-gray-400 text-sm">Connecting you now...</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* How it works */}
              <Card className="bg-gray-900/50 border-gray-800/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-white">How 1-on-1 Matching Works</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { step: '1', icon: UserCheck, title: 'Set Your Level', desc: 'Choose your CEFR level and preferred topic' },
                      { step: '2', icon: Zap, title: 'Get Matched', desc: 'We pair you with a partner at your level' },
                      { step: '3', icon: Volume2, title: 'Start Talking', desc: 'Join a private voice room for 15 minutes' },
                    ].map((s, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="w-8 h-8 rounded-lg bg-green-500/10 ring-1 ring-green-500/20 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-green-400">{s.step}</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{s.title}</div>
                          <div className="text-xs text-gray-500">{s.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* ─── Room Type Quick Access ─── */}
        <section className="mt-8 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Browse by Room Type</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            {ROOM_TYPES.map(type => {
              const count = rooms.filter(r => r.type === type.value && r.status === 'active').length;
              return (
                <button
                  key={type.value}
                  onClick={() => { setFilterType(type.value); setActiveTab('live'); }}
                  className={`group p-4 rounded-xl border transition-all duration-200 hover:scale-[1.03] hover:shadow-lg ${type.bg} ${type.border} hover:border-opacity-60 ${type.glow}`}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">{type.emoji}</div>
                    <div className={`text-xs font-medium ${type.text}`}>{type.label}</div>
                    {count > 0 && (
                      <Badge variant="secondary" className={`mt-2 text-[10px] ${type.bg} ${type.text}`}>
                        {count} live
                      </Badge>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      {/* ─── Create Room Dialog ─── */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              Create a Room
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {/* Room type selector */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Room Type</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ROOM_TYPES.map(type => (
                  <button
                    key={type.value}
                    onClick={() => setNewRoom(prev => ({ ...prev, type: type.value }))}
                    className={`p-3 rounded-lg border text-center transition-all duration-200 ${
                      newRoom.type === type.value
                        ? `${type.bg} ${type.border} ring-2 ${type.ring} ${type.text} shadow-sm`
                        : 'bg-gray-800/50 border-gray-700/50 text-gray-400 hover:border-gray-600 hover:bg-gray-800'
                    }`}
                  >
                    <div className="text-xl mb-1">{type.emoji}</div>
                    <div className="text-[11px] font-medium leading-tight">{type.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300 mb-1 block">Room Name *</label>
              <Input
                value={newRoom.name}
                onChange={(e) => setNewRoom(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Intermediate Conversation Practice"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-600 focus-visible:ring-purple-500/40"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300 mb-1 block">Description</label>
              <Input
                value={newRoom.description}
                onChange={(e) => setNewRoom(prev => ({ ...prev, description: e.target.value }))}
                placeholder="What will participants learn or discuss?"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-600 focus-visible:ring-purple-500/40"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-1 block">Level</label>
                <Select value={newRoom.cefrLevel} onValueChange={v => setNewRoom(prev => ({ ...prev, cefrLevel: v }))}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {['A1','A2','B1','B2','C1','C2'].map(l => (
                      <SelectItem key={l} value={l}>{l}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300 mb-1 block">Topic</label>
                <Select value={newRoom.topic} onValueChange={v => setNewRoom(prev => ({ ...prev, topic: v }))}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {['Grammar','Speaking','Business','Travel','Exam Prep','Culture','Idioms'].map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-1 block">Max Participants</label>
                <Input
                  type="number"
                  value={newRoom.maxParticipants}
                  onChange={(e) => setNewRoom(prev => ({ ...prev, maxParticipants: e.target.value }))}
                  min={2}
                  max={200}
                  className="bg-gray-800 border-gray-700 text-white focus-visible:ring-purple-500/40"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300 mb-1 block">Schedule for Later</label>
                <Input
                  type="datetime-local"
                  value={newRoom.scheduledFor}
                  onChange={(e) => setNewRoom(prev => ({ ...prev, scheduledFor: e.target.value }))}
                  className="bg-gray-800 border-gray-700 text-white focus-visible:ring-purple-500/40"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setNewRoom(prev => ({ ...prev, isPrivate: !prev.isPrivate }))}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors duration-200 ${
                  newRoom.isPrivate ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'bg-gray-800 text-gray-400 border border-gray-700'
                }`}
              >
                {newRoom.isPrivate ? <Lock className="w-3.5 h-3.5" /> : <Globe className="w-3.5 h-3.5" />}
                {newRoom.isPrivate ? 'Private' : 'Public'}
              </button>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowCreateDialog(false)}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateRoom}
              disabled={!newRoom.name.trim() || creating}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {creating ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating...</>
              ) : (
                <><Sparkles className="w-4 h-4 mr-2" />Create & Start</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #374151;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #4b5563;
        }
      `}</style>
    </div>
  );
}

// ─── Room Card ──────────────────────────────────────────
function RoomCard({ room }: { room: LiveRoom }) {
  const config = getTypeConfig(room.type);
  const Icon = config.icon;
  const isLive = room.status === 'active';
  const isScheduled = room.status === 'scheduled';
  const participants = room.activeParticipantCount ?? room.participantCount ?? 0;
  const spotsLeft = room.maxParticipants - participants;

  return (
    <Link href={`/community/live/${room.roomName}`} className="block">
      <Card className={`bg-gray-900/80 border-gray-800 hover:border-gray-700 transition-all duration-200 cursor-pointer group hover:scale-[1.01] hover:shadow-lg ${config.glow} ${
        isLive ? 'ring-1 ring-red-500/20' : ''
      }`}>
        {/* Color accent bar */}
        <div className={`h-1 rounded-t-lg bg-gradient-to-r ${config.gradient}`} />
        <CardHeader className="pb-2 pt-4">
          <div className="flex items-start justify-between mb-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Badge variant="secondary" className={`${config.bg} ${config.text} text-[11px] gap-1`}>
                <Icon className="w-3 h-3" />
                {config.label}
              </Badge>
              {isLive && (
                <Badge variant="secondary" className="bg-red-600/20 text-red-400 text-[11px] gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  LIVE
                </Badge>
              )}
              {isScheduled && (
                <Badge variant="secondary" className="bg-blue-600/20 text-blue-400 text-[11px] gap-1">
                  <Clock className="w-3 h-3" />
                  {room.scheduledFor ? formatRelativeTime(room.scheduledFor) : 'Scheduled'}
                </Badge>
              )}
              {room.isRecording && isLive && (
                <Badge variant="secondary" className="bg-yellow-600/20 text-yellow-400 text-[11px]">
                  REC
                </Badge>
              )}
              {room.cefrLevel && (
                <Badge variant="secondary" className="bg-violet-600/20 text-violet-400 text-[11px]">
                  {room.cefrLevel}
                </Badge>
              )}
              {room.isPrivate && (
                <Badge variant="secondary" className="bg-yellow-600/10 text-yellow-500 text-[11px] gap-0.5">
                  <Lock className="w-2.5 h-2.5" />
                </Badge>
              )}
            </div>
            <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors shrink-0 ml-2" />
          </div>
          <CardTitle className="text-base text-white group-hover:text-gray-200 transition-colors line-clamp-1">
            {room.name}
          </CardTitle>
          {room.description && (
            <CardDescription className="text-gray-500 line-clamp-2 text-xs">
              {room.description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {participants}/{room.maxParticipants}
              </span>
              {spotsLeft > 0 && spotsLeft <= 5 && (
                <span className={`${config.text} font-medium`}>
                  {spotsLeft} spot{spotsLeft !== 1 ? 's' : ''} left
                </span>
              )}
              {spotsLeft === 0 && (
                <span className="text-red-400 font-medium">Full</span>
              )}
              {config.value === 'VOICE_HANGOUT' && (
                <span className="flex items-center gap-1 text-purple-400">
                  <Volume2 className="w-3 h-3" /> Voice
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              {room.hostAvatar ? (
                <div className="w-5 h-5 rounded-full bg-gray-700 overflow-hidden ring-1 ring-gray-600">
                  <img src={room.hostAvatar} alt="" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center ring-1 ring-gray-600">
                  <span className="text-[9px] text-gray-400">{room.hostName?.[0] || '?'}</span>
                </div>
              )}
              <span className="text-gray-500 truncate max-w-[80px]">{room.hostName}</span>
            </div>
          </div>
          {room.topic && (
            <div className="mt-2 flex items-center gap-1.5">
              <Badge variant="outline" className="text-[10px] border-gray-700/50 text-gray-500 py-0">
                {room.topic}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

// ─── Event Card ─────────────────────────────────────────
function EventCard({ event, onRsvpChange }: { event: ScheduledEvent; onRsvpChange: () => void }) {
  const config = getTypeConfig(event.type);
  const [rsvping, setRsvping] = useState(false);
  const [hasRsvped, setHasRsvped] = useState(event.hasRsvped || false);

  const handleRsvp = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setRsvping(true);
    try {
      const res = await fetch(`/api/events/${event.id}/rsvp`, {
        method: hasRsvped ? 'DELETE' : 'POST',
        credentials: 'include',
      });
      if (res.ok) {
        setHasRsvped(!hasRsvped);
        onRsvpChange();
      }
    } catch {}
    setRsvping(false);
  };

  const eventDate = new Date(event.scheduledFor);
  const formattedDate = eventDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
  const formattedTime = eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const isPast = eventDate.getTime() < Date.now();

  return (
    <Card className="bg-gray-900/80 border-gray-800 hover:border-gray-700 transition-all group">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Date badge */}
          <div className="flex-shrink-0 w-16 text-center">
            <div className={`rounded-lg p-2 ${isPast ? 'bg-gray-800/50' : 'bg-blue-500/10 ring-1 ring-blue-500/20'}`}>
              <div className={`text-[10px] font-medium ${isPast ? 'text-gray-500' : 'text-blue-400'}`}>
                {eventDate.toLocaleDateString('en', { weekday: 'short' })}
              </div>
              <div className={`text-lg font-bold ${isPast ? 'text-gray-400' : 'text-blue-300'}`}>
                {eventDate.getDate()}
              </div>
              <div className={`text-[10px] ${isPast ? 'text-gray-600' : 'text-blue-400/60'}`}>
                {formattedTime}
              </div>
            </div>
          </div>

          {/* Event info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-medium text-white text-sm line-clamp-1 group-hover:text-gray-200 transition-colors">
                  {event.title}
                </h3>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <Badge variant="secondary" className={`${config.bg} ${config.text} text-[10px] gap-0.5`}>
                    {config.emoji} {config.label}
                  </Badge>
                  {event.cefrLevel && (
                    <Badge variant="secondary" className="bg-violet-600/20 text-violet-400 text-[10px]">
                      {event.cefrLevel}
                    </Badge>
                  )}
                  <span className="flex items-center gap-1 text-[10px] text-gray-500">
                    <Timer className="w-3 h-3" />
                    {event.duration}min
                  </span>
                </div>
              </div>
              <Button
                size="sm"
                onClick={handleRsvp}
                disabled={rsvping}
                className={`shrink-0 transition-all duration-200 ${
                  hasRsvped
                    ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30 border border-green-500/30 hover:border-green-500/50'
                    : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-sm'
                }`}
              >
                {rsvping ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : hasRsvped ? (
                  <><CheckCircle2 className="w-3 h-3 mr-1" /> Going</>
                ) : (
                  'RSVP'
                )}
              </Button>
            </div>
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                {event.hostAvatar ? (
                  <div className="w-3.5 h-3.5 rounded-full bg-gray-700 overflow-hidden">
                    <img src={event.hostAvatar} alt="" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full bg-gray-700 flex items-center justify-center">
                    <span className="text-[7px] text-gray-400">{event.hostName?.[0] || '?'}</span>
                  </div>
                )}
                {event.hostName}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {event.rsvpCount}/{event.maxParticipants}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
