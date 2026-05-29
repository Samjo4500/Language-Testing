'use client';

import { useState, useEffect, useCallback } from 'react';
import { StatCard } from '@/components/admin/shared';
import { ConfirmModal } from '@/components/admin/shared';
import {
  Video,
  Radio,
  Users,
  Clock,
  Loader2,
  Play,
  Square,
  Trash2,
  ExternalLink,
  RefreshCw,
  Monitor,
  AlertCircle,
  CheckCircle2,
  XCircle,
  UserCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LiveRoom {
  id: string | null;
  title: string;
  description?: string;
  roomName: string;
  level?: string;
  category: string;
  maxParticipants: number;
  status: string;
  isRecorded: boolean;
  recordingUrl?: string;
  scheduledAt?: string;
  startedAt?: string;
  endedAt?: string;
  host: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  } | null;
  activeParticipantCount: number;
  participantCount: number;
  isLiveOnServer: boolean;
  isAdhoc?: boolean;
  createdAt?: string;
}

interface Recording {
  id: string;
  title: string;
  roomName: string;
  recordingUrl?: string;
  recordingDuration?: number;
  host: { id: string; name: string };
  startedAt?: string;
  endedAt?: string;
  participants: { userId: string }[];
}

interface LiveKitTabProps {
  onToast: (message: string, type: 'success' | 'error') => void;
}

export function LiveKitTab({ onToast }: LiveKitTabProps) {
  const [rooms, setRooms] = useState<LiveRoom[]>([]);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [activeRecordings, setActiveRecordings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [subTab, setSubTab] = useState<'rooms' | 'recordings'>('rooms');
  const [confirmAction, setConfirmAction] = useState<{
    type: 'end_room';
    roomName: string;
    title: string;
  } | null>(null);

  const fetchRooms = useCallback(async () => {
    try {
      const res = await fetch('/api/livekit/rooms?includeParticipants=true', {
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

  const fetchRecordings = useCallback(async () => {
    try {
      const res = await fetch('/api/livekit/recordings', {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setRecordings(data.recordings || []);
        setActiveRecordings(data.activeRecordings || []);
      }
    } catch (err) {
      console.error('Failed to fetch recordings:', err);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchRooms(), fetchRecordings()]);
    setLoading(false);
  }, [fetchRooms, fetchRecordings]);

  useEffect(() => {
    refreshAll();
    const interval = setInterval(refreshAll, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, [refreshAll]);

  // End a room
  const handleEndRoom = async (roomName: string) => {
    try {
      const res = await fetch(`/api/livekit/rooms?roomName=${encodeURIComponent(roomName)}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
        onToast('Room ended successfully', 'success');
        refreshAll();
      } else {
        const err = await res.json();
        onToast(err.error || 'Failed to end room', 'error');
      }
    } catch (err) {
      onToast('Failed to end room', 'error');
    }
    setConfirmAction(null);
  };

  // Start recording
  const handleStartRecording = async (roomName: string) => {
    try {
      const res = await fetch('/api/livekit/recordings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action: 'start', roomName }),
      });

      if (res.ok) {
        onToast('Recording started', 'success');
        refreshAll();
      } else {
        const err = await res.json();
        onToast(err.error || 'Failed to start recording', 'error');
      }
    } catch (err) {
      onToast('Failed to start recording', 'error');
    }
  };

  // Stop recording
  const handleStopRecording = async (roomName: string, egressId: string) => {
    try {
      const res = await fetch('/api/livekit/recordings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action: 'stop', roomName, egressId }),
      });

      if (res.ok) {
        onToast('Recording stopped', 'success');
        refreshAll();
      } else {
        const err = await res.json();
        onToast(err.error || 'Failed to stop recording', 'error');
      }
    } catch (err) {
      onToast('Failed to stop recording', 'error');
    }
  };

  // Stats
  const liveCount = rooms.filter((r) => r.status === 'live').length;
  const scheduledCount = rooms.filter((r) => r.status === 'scheduled').length;
  const totalParticipants = rooms
    .filter((r) => r.status === 'live')
    .reduce((sum, r) => sum + r.activeParticipantCount, 0);
  const recordingCount = recordings.length;

  const formatDuration = (seconds?: number | null) => {
    if (!seconds) return '—';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Live Now"
          value={liveCount}
          icon={Radio}
          gradient={liveCount > 0 ? 'from-red-500 to-red-700' : 'from-gray-500 to-gray-700'}
        />
        <StatCard
          label="Scheduled"
          value={scheduledCount}
          icon={Clock}
          gradient="from-blue-500 to-blue-700"
        />
        <StatCard
          label="Participants Online"
          value={totalParticipants}
          icon={Users}
          gradient="from-green-500 to-green-700"
        />
        <StatCard
          label="Recordings"
          value={recordingCount}
          icon={Monitor}
          gradient="from-purple-500 to-purple-700"
        />
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setSubTab('rooms')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            subTab === 'rooms'
              ? 'bg-white/10 text-white'
              : 'text-white/40 hover:text-white/60'
          }`}
        >
          <Radio className="w-4 h-4 inline mr-1" />
          Rooms ({rooms.length})
        </button>
        <button
          onClick={() => setSubTab('recordings')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            subTab === 'recordings'
              ? 'bg-white/10 text-white'
              : 'text-white/40 hover:text-white/60'
          }`}
        >
          <Monitor className="w-4 h-4 inline mr-1" />
          Recordings ({recordings.length})
        </button>
        <div className="flex-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={refreshAll}
          className="text-white/40 hover:text-white"
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {/* Rooms tab */}
      {subTab === 'rooms' && (
        <div className="space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-violet-400 animate-spin mr-2" />
              <span className="text-white/40">Loading rooms...</span>
            </div>
          ) : rooms.length === 0 ? (
            <Card className="bg-white/5 border-white/10">
              <CardContent className="py-12 text-center">
                <Video className="w-12 h-12 text-white/20 mx-auto mb-3" />
                <p className="text-white/40">No live classes found.</p>
                <p className="text-white/30 text-sm mt-1">
                  Classes will appear here when created by users or hosts.
                </p>
              </CardContent>
            </Card>
          ) : (
            rooms.map((room) => (
              <Card
                key={room.id || room.roomName}
                className={`bg-white/5 border-white/10 hover:border-white/20 transition-colors ${
                  room.status === 'live' ? 'ring-1 ring-red-500/20' : ''
                }`}
              >
                <CardContent className="py-4">
                  <div className="flex items-start gap-4">
                    {/* Status indicator */}
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      room.status === 'live'
                        ? 'bg-red-500/20 text-red-400'
                        : room.status === 'scheduled'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-white/10 text-white/40'
                    }`}>
                      {room.status === 'live' ? (
                        <Radio className="w-5 h-5 animate-pulse" />
                      ) : room.status === 'scheduled' ? (
                        <Clock className="w-5 h-5" />
                      ) : (
                        <Video className="w-5 h-5" />
                      )}
                    </div>

                    {/* Room info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-white truncate">{room.title}</h3>
                        {room.status === 'live' && (
                          <Badge className="bg-red-500/20 text-red-400 text-xs border-0 shrink-0">LIVE</Badge>
                        )}
                        {room.isLiveOnServer && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                        )}
                        {room.isAdhoc && (
                          <Badge className="bg-yellow-500/20 text-yellow-400 text-xs border-0 shrink-0">Ad-hoc</Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-white/40">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {room.activeParticipantCount}/{room.maxParticipants}
                        </span>
                        <span>Room: <code className="text-white/60">{room.roomName}</code></span>
                        {room.level && <span className="text-purple-400">{room.level}</span>}
                        <span>{room.category}</span>
                        {room.host && (
                          <span className="flex items-center gap-1">
                            <UserCircle className="w-3 h-3" />
                            {room.host.name}
                          </span>
                        )}
                        <span>Started: {formatDate(room.startedAt)}</span>
                        {room.isRecorded && (
                          <Badge className="bg-yellow-500/20 text-yellow-400 text-xs border-0 shrink-0">REC</Badge>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {room.status === 'live' && (
                        <>
                          {!room.isRecorded && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStartRecording(room.roomName)}
                              className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10"
                              title="Start recording"
                            >
                              <Monitor className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setConfirmAction({
                              type: 'end_room',
                              roomName: room.roomName,
                              title: room.title,
                            })}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            title="End room"
                          >
                            <Square className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      <a
                        href={`/speakspace/${room.roomName}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/40 hover:text-white/60 p-2"
                        title="Open room"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Recordings tab */}
      {subTab === 'recordings' && (
        <div className="space-y-3">
          {/* Active recordings */}
          {activeRecordings.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-white/60 mb-3 flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                Active Recordings
              </h3>
              {activeRecordings.map((rec: any) => (
                <Card key={rec.egressId} className="bg-red-500/5 border-red-500/20 mb-2">
                  <CardContent className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-red-500/20 flex items-center justify-center">
                        <Radio className="w-4 h-4 text-red-400 animate-pulse" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{rec.roomName}</p>
                        <p className="text-white/40 text-xs">Egress ID: {rec.egressId}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleStopRecording(rec.roomName, rec.egressId)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Square className="w-4 h-4 mr-1" />
                      Stop
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Past recordings */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-violet-400 animate-spin mr-2" />
              <span className="text-white/40">Loading recordings...</span>
            </div>
          ) : recordings.length === 0 ? (
            <Card className="bg-white/5 border-white/10">
              <CardContent className="py-12 text-center">
                <Monitor className="w-12 h-12 text-white/20 mx-auto mb-3" />
                <p className="text-white/40">No recordings yet.</p>
                <p className="text-white/30 text-sm mt-1">
                  Recordings will appear here when classes are recorded.
                </p>
              </CardContent>
            </Card>
          ) : (
            recordings.map((rec) => (
              <Card key={rec.id} className="bg-white/5 border-white/10">
                <CardContent className="py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
                      <Monitor className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white truncate">{rec.title}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-white/40 mt-1">
                        <span>Duration: {formatDuration(rec.recordingDuration)}</span>
                        <span>Participants: {rec.participants.length}</span>
                        <span>Host: {rec.host?.name || 'Unknown'}</span>
                        <span>{formatDate(rec.startedAt)}</span>
                      </div>
                    </div>
                    {rec.recordingUrl && (
                      <a
                        href={rec.recordingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300 p-2"
                        title="Download recording"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Confirm modal */}
      {confirmAction && (
        <ConfirmModal
          open={!!confirmAction}
          onClose={() => setConfirmAction(null)}
          title={confirmAction.type === 'end_room' ? 'End Live Class' : 'Confirm Action'}
          message={
            confirmAction.type === 'end_room'
              ? `Are you sure you want to end "${confirmAction.title}"? All participants will be disconnected.`
              : 'Are you sure?'
          }
          confirmLabel="End Room"
          onConfirm={() => handleEndRoom(confirmAction.roomName)}
        />
      )}
    </div>
  );
}
