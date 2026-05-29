'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  Video,
  Users,
  Clock,
  Plus,
  Search,
  Radio,
  Calendar,
  Globe,
  BookOpen,
  MessageSquare,
  Loader2,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface LiveRoom {
  id: string;
  title: string;
  description?: string;
  roomName: string;
  level?: string;
  category: string;
  maxParticipants: number;
  status: 'scheduled' | 'live' | 'ended' | 'cancelled';
  isRecorded: boolean;
  scheduledAt?: string;
  startedAt?: string;
  host: {
    id: string;
    name: string;
    avatarUrl?: string;
  } | null;
  activeParticipantCount: number;
  participantCount: number;
  isLiveOnServer: boolean;
  isAdhoc?: boolean;
}

const CATEGORIES = [
  { value: 'all', label: 'All Categories', icon: Globe },
  { value: 'general', label: 'General English', icon: MessageSquare },
  { value: 'conversation', label: 'Conversation Practice', icon: Users },
  { value: 'grammar', label: 'Grammar Workshop', icon: BookOpen },
  { value: 'pronunciation', label: 'Pronunciation', icon: Video },
  { value: 'business', label: 'Business English', icon: BriefcaseIcon },
  { value: 'exam_prep', label: 'Exam Preparation', icon: BookOpen },
  { value: 'tutoring', label: '1-on-1 Tutoring', icon: Users },
];

const LEVELS = [
  { value: 'all', label: 'All Levels' },
  { value: 'A1', label: 'A1 - Beginner' },
  { value: 'A2', label: 'A2 - Elementary' },
  { value: 'B1', label: 'B1 - Intermediate' },
  { value: 'B2', label: 'B2 - Upper Intermediate' },
  { value: 'C1', label: 'C1 - Advanced' },
  { value: 'C2', label: 'C2 - Proficiency' },
];

function BriefcaseIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

export default function LiveRoomsPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<LiveRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [creating, setCreating] = useState(false);

  // Create room form state
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState('general');
  const [newLevel, setNewLevel] = useState('all');
  const [newMaxParticipants, setNewMaxParticipants] = useState('20');

  // Fetch rooms
  const fetchRooms = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filterCategory !== 'all') params.set('category', filterCategory);
      if (filterLevel !== 'all') params.set('level', filterLevel);

      const res = await fetch(`/api/livekit/rooms?${params.toString()}`, {
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Failed to fetch rooms');

      const data = await res.json();
      setRooms(data.rooms || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filterCategory, filterLevel]);

  useEffect(() => {
    fetchRooms();
    // Auto-refresh every 15 seconds to update participant counts
    const interval = setInterval(fetchRooms, 15000);
    return () => clearInterval(interval);
  }, [fetchRooms]);

  // Create a new room
  const handleCreateRoom = async () => {
    if (!newTitle.trim()) return;

    setCreating(true);
    try {
      const res = await fetch('/api/livekit/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: newTitle.trim(),
          description: newDescription.trim() || undefined,
          category: newCategory,
          level: newLevel === 'all' ? null : newLevel,
          maxParticipants: parseInt(newMaxParticipants) || 20,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create room');
      }

      const data = await res.json();
      setShowCreateDialog(false);
      setNewTitle('');
      setNewDescription('');
      router.push(`/community/live/${data.roomName}`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setCreating(false);
    }
  };

  // Filter rooms by search query
  const filteredRooms = rooms.filter((room) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      room.title.toLowerCase().includes(q) ||
      room.description?.toLowerCase().includes(q) ||
      room.host?.name?.toLowerCase().includes(q) ||
      room.category.toLowerCase().includes(q)
    );
  });

  // Separate rooms by status
  const liveRooms = filteredRooms.filter((r) => r.status === 'live');
  const scheduledRooms = filteredRooms.filter((r) => r.status === 'scheduled');
  const endedRooms = filteredRooms.filter((r) => r.status === 'ended');

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Live Video Classes
            </h1>
            <p className="text-gray-400 mt-1">
              Join live English classes, practice conversations, and get real-time feedback
            </p>
          </div>

          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Class
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-800 text-white">
              <DialogHeader>
                <DialogTitle>Create Live Class</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-1 block">
                    Title *
                  </label>
                  <Input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g., Intermediate Conversation Practice"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-1 block">
                    Description
                  </label>
                  <Input
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="What will students learn?"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-1 block">
                      Category
                    </label>
                    <Select value={newCategory} onValueChange={setNewCategory}>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {CATEGORIES.filter((c) => c.value !== 'all').map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-1 block">
                      Level
                    </label>
                    <Select value={newLevel} onValueChange={setNewLevel}>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {LEVELS.map((lvl) => (
                          <SelectItem key={lvl.value} value={lvl.value}>
                            {lvl.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-1 block">
                    Max Participants
                  </label>
                  <Input
                    type="number"
                    value={newMaxParticipants}
                    onChange={(e) => setNewMaxParticipants(e.target.value)}
                    min={2}
                    max={100}
                    className="bg-gray-800 border-gray-700 text-white w-32"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateDialog(false)}
                  className="border-gray-700 text-gray-300"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateRoom}
                  disabled={!newTitle.trim() || creating}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {creating ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating...</>
                  ) : (
                    'Create & Start'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search classes..."
              className="pl-10 bg-gray-900 border-gray-800 text-white"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-48 bg-gray-900 border-gray-800 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-800">
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterLevel} onValueChange={setFilterLevel}>
            <SelectTrigger className="w-44 bg-gray-900 border-gray-800 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-800">
              {LEVELS.map((lvl) => (
                <SelectItem key={lvl.value} value={lvl.value}>
                  {lvl.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            <span className="ml-3 text-gray-400">Loading live classes...</span>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <Card className="bg-red-900/20 border-red-800 mb-6">
            <CardContent className="py-4 text-center text-red-400">
              Failed to load rooms: {error}
            </CardContent>
          </Card>
        )}

        {/* No rooms */}
        {!loading && !error && filteredRooms.length === 0 && (
          <div className="text-center py-20">
            <Video className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No Live Classes Right Now</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              There are no active or scheduled classes at the moment.
              Create one to get started!
            </p>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create a Class
            </Button>
          </div>
        )}

        {/* Live rooms */}
        {liveRooms.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Radio className="w-5 h-5 text-red-500 animate-pulse" />
              <h2 className="text-xl font-semibold text-white">Live Now</h2>
              <Badge variant="secondary" className="bg-red-600/20 text-red-400">
                {liveRooms.length}
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {liveRooms.map((room) => (
                <RoomCard key={room.id || room.roomName} room={room} />
              ))}
            </div>
          </section>
        )}

        {/* Scheduled rooms */}
        {scheduledRooms.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-semibold text-white">Upcoming</h2>
              <Badge variant="secondary" className="bg-blue-600/20 text-blue-400">
                {scheduledRooms.length}
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {scheduledRooms.map((room) => (
                <RoomCard key={room.id || room.roomName} room={room} />
              ))}
            </div>
          </section>
        )}

        {/* Ended rooms (recordings) */}
        {endedRooms.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-gray-500" />
              <h2 className="text-xl font-semibold text-gray-400">Past Classes</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {endedRooms.slice(0, 6).map((room) => (
                <RoomCard key={room.id || room.roomName} room={room} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

/**
 * Room card component for the listing page.
 */
function RoomCard({ room }: { room: LiveRoom }) {
  const categoryInfo = CATEGORIES.find((c) => c.value === room.category);
  const isLive = room.status === 'live';

  const formatTime = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <Link href={`/community/live/${room.roomName}`}>
      <Card className={`bg-gray-900 border-gray-800 hover:border-purple-500/50 transition-all cursor-pointer group ${
        isLive ? 'ring-1 ring-red-500/30' : ''
      }`}>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              {isLive && (
                <Badge variant="secondary" className="bg-red-600/20 text-red-400 text-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1 animate-pulse" />
                  LIVE
                </Badge>
              )}
              {room.level && room.level !== 'all' && (
                <Badge variant="secondary" className="bg-purple-600/20 text-purple-400 text-xs">
                  {room.level}
                </Badge>
              )}
              {room.isRecorded && isLive && (
                <Badge variant="secondary" className="bg-yellow-600/20 text-yellow-400 text-xs">
                  REC
                </Badge>
              )}
            </div>
            <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-purple-400 transition-colors" />
          </div>
          <CardTitle className="text-lg text-white group-hover:text-purple-300 transition-colors">
            {room.title}
          </CardTitle>
          {room.description && (
            <CardDescription className="text-gray-500 line-clamp-2">
              {room.description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {room.activeParticipantCount}/{room.maxParticipants}
              </span>
              <span className="flex items-center gap-1">
                {categoryInfo?.label || room.category}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              {room.host?.name || 'Unknown Host'}
            </div>
          </div>
          {room.scheduledAt && !isLive && (
            <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDate(room.scheduledAt)} at {formatTime(room.scheduledAt)}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
