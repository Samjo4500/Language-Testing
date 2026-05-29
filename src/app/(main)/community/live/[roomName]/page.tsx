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
} from 'lucide-react';
import Link from 'next/link';

interface RoomData {
  token: string;
  url: string;
  roomName: string;
  identity: string;
  role: 'host' | 'co_host' | 'participant' | 'admin';
  classId?: string;
}

export default function LiveRoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomName = params.roomName as string;

  const [phase, setPhase] = useState<'loading' | 'prejoin' | 'connected' | 'error'>('loading');
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState('Anonymous');

  // Get current user info
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setUserName(data.user?.name || data.user?.email || 'Anonymous');
        }
      } catch {
        // Not logged in — will be handled by token fetch
      }
    }
    fetchUser();
  }, []);

  // Fetch token for the room
  const fetchToken = useCallback(async (role: string = 'participant') => {
    try {
      const res = await fetch('/api/livekit/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ roomName, role }),
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

  // Handle join from pre-join screen
  const handleJoin = useCallback((options: { audioEnabled: boolean; videoEnabled: boolean }) => {
    setPhase('connected');
  }, []);

  // Handle disconnection
  const handleDisconnected = useCallback(() => {
    setPhase('prejoin');
    setRoomData(null);
    // Re-fetch token
    fetchToken();
  }, [fetchToken]);

  // Loading state
  if (phase === 'loading') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading room...</p>
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
                onClick={() => router.push('/community/live')}
                className="border-gray-700 text-gray-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Rooms
              </Button>
              <Button
                onClick={() => {
                  setError(null);
                  setPhase('loading');
                  fetchToken();
                }}
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
      <div className="relative">
        {/* Top bar with back button */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-gray-950/90 backdrop-blur-sm border-b border-gray-800 px-4 py-2">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/community/live')}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Leave
            </Button>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-purple-600/20 text-purple-400">
                {roomData.role}
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
        <PreJoinScreen
          roomName={roomName}
          userName={userName}
          onJoin={handleJoin}
          onCancel={() => router.push('/community/live')}
        />
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
              onClick={() => router.push('/community/live')}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Leave Room
            </Button>
          </div>
          <div className="pointer-events-auto flex items-center gap-2">
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
          onDisconnected={handleDisconnected}
          className="h-full"
        />
      </div>
    );
  }

  // Fallback
  return null;
}
