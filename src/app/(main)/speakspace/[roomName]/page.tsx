'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import VideoCallRoom from '@/components/livekit/VideoCallRoom';
import PreJoinScreen from '@/components/livekit/PreJoinScreen';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertCircle,
  ArrowLeft,
  Loader2,
  Shield,
  Mic,
  GraduationCap,
  Users,
  Presentation,
  Radio,
  BookOpen,
  Eye,
  Volume2,
  MessageSquare,
  Clock,
  Video,
  Headphones,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

const ROOM_TYPE_INFO: Record<string, {
  icon: any;
  label: string;
  emoji: string;
  color: string;
  bgColor: string;
  borderColor: string;
  gradientBg: string;
  prejoinMessage: string;
  prejoinTip: string;
  features: { icon: any; label: string }[];
}> = {
  VOICE_HANGOUT: {
    icon: Mic,
    label: 'Voice Hangout',
    emoji: '🎙️',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    gradientBg: 'from-purple-500/10 to-violet-500/10',
    prejoinMessage: 'Voice Only — No Camera Needed',
    prejoinTip: 'Join with just your microphone. Perfect for casual conversations!',
    features: [
      { icon: Volume2, label: 'Voice Only' },
      { icon: MessageSquare, label: 'Text Chat' },
      { icon: Users, label: 'Group Chat' },
    ],
  },
  LIVE_CLASS: {
    icon: GraduationCap,
    label: 'Live Class',
    emoji: '🎓',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    gradientBg: 'from-blue-500/10 to-cyan-500/10',
    prejoinMessage: 'Interactive Live Class',
    prejoinTip: 'Your camera and mic will be available. The teacher may ask you to speak.',
    features: [
      { icon: Video, label: 'Video & Audio' },
      { icon: MessageSquare, label: 'Ask Questions' },
      { icon: GraduationCap, label: 'Learn Live' },
    ],
  },
  ONE_ON_ONE: {
    icon: Users,
    label: '1-on-1 Match',
    emoji: '👥',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    gradientBg: 'from-green-500/10 to-emerald-500/10',
    prejoinMessage: 'Conversation Partner Match',
    prejoinTip: "You'll be paired with a practice partner. 15-minute conversation sessions.",
    features: [
      { icon: Headphones, label: 'Voice Practice' },
      { icon: Zap, label: '15 Min Sessions' },
      { icon: Shield, label: 'Safe & Monitored' },
    ],
  },
  LECTURE: {
    icon: Presentation,
    label: 'Lecture',
    emoji: '📺',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    gradientBg: 'from-red-500/10 to-rose-500/10',
    prejoinMessage: 'Lecture Mode — Listen & Learn',
    prejoinTip: 'The presenter will lead the session. Use text chat for questions.',
    features: [
      { icon: Volume2, label: 'Listen Only' },
      { icon: MessageSquare, label: 'Chat Questions' },
      { icon: Clock, label: 'Recorded' },
    ],
  },
  OPEN_MIC: {
    icon: Radio,
    label: 'Open Mic',
    emoji: '🎤',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
    gradientBg: 'from-orange-500/10 to-amber-500/10',
    prejoinMessage: 'Open Mic — Take the Stage',
    prejoinTip: 'Join the speaker queue to present. Listen and learn from others.',
    features: [
      { icon: Mic, label: 'Present' },
      { icon: Users, label: 'Speaker Queue' },
      { icon: MessageSquare, label: 'Feedback' },
    ],
  },
  STUDY_GROUP: {
    icon: BookOpen,
    label: 'Study Group',
    emoji: '📚',
    color: 'text-teal-400',
    bgColor: 'bg-teal-500/10',
    borderColor: 'border-teal-500/30',
    gradientBg: 'from-teal-500/10 to-cyan-500/10',
    prejoinMessage: 'Collaborative Study Session',
    prejoinTip: 'Work together on exercises and discuss topics as a group.',
    features: [
      { icon: BookOpen, label: 'Study Together' },
      { icon: MessageSquare, label: 'Discuss' },
      { icon: Users, label: 'Small Group' },
    ],
  },
  WATCH_PARTY: {
    icon: Eye,
    label: 'Watch Party',
    emoji: '👀',
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/30',
    gradientBg: 'from-pink-500/10 to-rose-500/10',
    prejoinMessage: 'Watch Together — Synchronized',
    prejoinTip: 'Watch content together in sync. Chat and react with others.',
    features: [
      { icon: Eye, label: 'Watch Together' },
      { icon: MessageSquare, label: 'Live Chat' },
      { icon: Users, label: 'Reactions' },
    ],
  },
};

interface RoomData {
  token: string;
  url: string;
  roomName: string;
  identity: string;
  role: 'host' | 'co_host' | 'participant' | 'admin';
  roomType?: string;
}

export default function LiveRoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomName = params.roomName as string;

  const [phase, setPhase] = useState<'loading' | 'prejoin' | 'connected' | 'error'>('loading');
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState('Anonymous');
  const [roomType, setRoomType] = useState<string>('LIVE_CLASS');
  const [roomInfo, setRoomInfo] = useState<{ cefrLevel?: string; topic?: string; hostName?: string; name?: string; maxParticipants?: number } | null>(null);

  // Get current user info
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setUserName(data.user?.name || data.user?.email || 'Anonymous');
        }
      } catch {}
    }
    fetchUser();
  }, []);

  // Try to get room info and token
  const fetchToken = useCallback(async () => {
    try {
      // First try to find room in our DB to get the room type
      try {
        const roomsRes = await fetch('/api/live-rooms', { credentials: 'include' });
        if (roomsRes.ok) {
          const roomsData = await roomsRes.json();
          const found = (roomsData.rooms || []).find((r: any) => r.roomName === roomName);
          if (found) {
            setRoomType(found.type || 'LIVE_CLASS');
            setRoomInfo({
              cefrLevel: found.cefrLevel,
              topic: found.topic,
              hostName: found.hostName,
              name: found.name,
              maxParticipants: found.maxParticipants,
            });
          }
        }
      } catch {}

      // Get LiveKit token
      const res = await fetch('/api/livekit/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ roomName, role: 'participant' }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to get room access');
      }

      const data = await res.json();
      setRoomData(data);
      setPhase('prejoin');
    } catch (err: any) {
      setError(err.message);
      setPhase('error');
    }
  }, [roomName]);

  useEffect(() => {
    if (roomName) {
      fetchToken();
    }
  }, [roomName, fetchToken]);

  const handleJoin = useCallback(() => {
    setPhase('connected');
  }, []);

  const handleDisconnected = useCallback(() => {
    setPhase('prejoin');
    setRoomData(null);
    fetchToken();
  }, [fetchToken]);

  const typeInfo = ROOM_TYPE_INFO[roomType] || ROOM_TYPE_INFO.LIVE_CLASS;
  const TypeIcon = typeInfo.icon;

  // Loading state
  if (phase === 'loading') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400 mb-6">Loading room...</p>
          <Button
            variant="outline"
            onClick={() => router.push('/speakspace')}
            className="border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Rooms
          </Button>
        </div>
      </div>
    );
  }

  // Error state
  if (phase === 'error') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <Card className="bg-gray-900 border-gray-800 max-w-md w-full">
          <CardContent className="py-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Cannot Join Room</h2>
            <p className="text-gray-400 mb-6">{error}</p>
            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => router.push('/speakspace')}
                className="border-gray-700 text-gray-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Rooms
              </Button>
              <Button
                onClick={() => { setError(null); setPhase('loading'); fetchToken(); }}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Pre-join screen
  if (phase === 'prejoin' && roomData) {
    return (
      <div className="relative min-h-screen bg-gray-950">
        {/* Top bar with back button and room type */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-gray-950/90 backdrop-blur-sm border-b border-gray-800 px-4 py-2">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/speakspace')}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Leave
            </Button>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className={`${typeInfo.bgColor} ${typeInfo.color} text-xs`}>
                <TypeIcon className="w-3 h-3 mr-1" />
                {typeInfo.label}
              </Badge>
              {roomData.role === 'host' && (
                <Badge variant="secondary" className="bg-yellow-600/20 text-yellow-400">
                  <Shield className="w-3 h-3 mr-1" />
                  Host
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Pre-join content */}
        <div className="pt-16 flex flex-col items-center justify-center min-h-screen px-4">
          {/* Room info card */}
          <Card className={`bg-gradient-to-br ${typeInfo.gradientBg} ${typeInfo.borderColor} border max-w-md w-full mb-6`}>
            <CardContent className="p-6 text-center">
              <div className="text-5xl mb-3">{typeInfo.emoji}</div>
              <h2 className="text-xl font-bold text-white mb-1">
                {roomInfo?.name || roomName}
              </h2>
              <p className={`text-sm font-medium ${typeInfo.color} mb-3`}>
                {typeInfo.prejoinMessage}
              </p>
              <p className="text-xs text-gray-400 mb-4">
                {typeInfo.prejoinTip}
              </p>

              {/* Room metadata */}
              {roomInfo && (
                <div className="flex items-center justify-center gap-2 flex-wrap mb-4">
                  {roomInfo.cefrLevel && (
                    <Badge variant="secondary" className="bg-violet-600/20 text-violet-400 text-[10px]">
                      {roomInfo.cefrLevel}
                    </Badge>
                  )}
                  {roomInfo.topic && (
                    <Badge variant="secondary" className="bg-gray-800 text-gray-300 text-[10px]">
                      {roomInfo.topic}
                    </Badge>
                  )}
                  <Badge variant="secondary" className="bg-gray-800 text-gray-300 text-[10px]">
                    <Users className="w-3 h-3 mr-1" />
                    {roomInfo.maxParticipants || 20} max
                  </Badge>
                </div>
              )}

              {/* Type-specific features */}
              <div className="grid grid-cols-3 gap-3">
                {typeInfo.features.map((f, i) => (
                  <div key={i} className="bg-gray-950/50 rounded-lg p-2 text-center">
                    <f.icon className={`w-4 h-4 ${typeInfo.color} mx-auto mb-1`} />
                    <span className="text-[10px] text-gray-400">{f.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pre-join screen */}
          <div className="max-w-md w-full">
            <PreJoinScreen
              roomName={roomName}
              userName={userName}
              onJoin={handleJoin}
              onCancel={() => router.push('/speakspace')}
            />
          </div>
        </div>
      </div>
    );
  }

  // Connected — show video room
  if (phase === 'connected' && roomData) {
    return (
      <div className="h-screen bg-gray-950">
        {/* Minimal top bar */}
        <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-2 bg-gradient-to-b from-gray-950/80 to-transparent pointer-events-none">
          <div className="pointer-events-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/speakspace')}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Leave Room
            </Button>
          </div>
          <div className="pointer-events-auto flex items-center gap-2">
            <Badge variant="secondary" className={`${typeInfo.color} bg-gray-800/80 text-xs`}>
              {typeInfo.emoji} {typeInfo.label}
            </Badge>
            {roomData.role === 'host' && (
              <Badge variant="secondary" className="bg-yellow-600/20 text-yellow-400 text-xs">
                <Shield className="w-3 h-3 mr-1" />
                Host
              </Badge>
            )}
          </div>
        </div>

        <VideoCallRoom
          token={roomData.token}
          serverUrl={roomData.url}
          roomName={roomData.roomName}
          identity={roomData.identity}
          role={roomData.role}
          roomType={roomType}
          onDisconnected={handleDisconnected}
          className="h-full"
        />
      </div>
    );
  }

  return null;
}
