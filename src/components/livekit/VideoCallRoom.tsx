'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
  ControlBar,
  GridLayout,
  ParticipantTile,
  useTracks,
  useRoomContext,
  Chat,
  FocusLayout,
  FocusLayoutContainer,
} from '@livekit/components-react';
import '@livekit/components-styles';
import {
  Track,
  ConnectionState as LiveKitConnectionState,
  Participant,
  RoomEvent,
  DataPacket_Kind,
} from 'livekit-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  ScreenShare,
  ScreenShareOff,
  PhoneOff,
  MessageSquare,
  Users,
  Settings,
  Hand,
  Clock,
  AlertCircle,
  Loader2,
} from 'lucide-react';

interface VideoCallRoomProps {
  token: string;
  serverUrl: string;
  roomName: string;
  identity: string;
  role: 'host' | 'co_host' | 'participant' | 'admin';
  onDisconnected?: () => void;
  className?: string;
}

/**
 * Custom video conference layout with TestCEFR branding.
 */
function CustomVideoConference() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );

  const [showChat, setShowChat] = useState(false);
  const [focusedTrack, setFocusedTrack] = useState<any>(null);

  // If there's a screen share, focus on it
  const screenShareTrack = tracks.find(
    (t) => t.source === Track.Source.ScreenShare && t.participant.isScreenShareEnabled,
  );

  const displayTracks = screenShareTrack
    ? [screenShareTrack, ...tracks.filter((t) => t !== screenShareTrack)]
    : tracks;

  return (
    <div className="flex flex-col h-full bg-gray-950">
      {/* Main video area */}
      <div className="flex-1 flex">
        <div className="flex-1 p-2">
          {screenShareTrack ? (
            <FocusLayoutContainer>
              <FocusLayout trackRef={screenShareTrack} />
            </FocusLayoutContainer>
          ) : (
            <GridLayout tracks={displayTracks} style={{ height: '100%' }}>
              <ParticipantTile />
            </GridLayout>
          )}
        </div>

        {/* Chat sidebar */}
        {showChat && (
          <div className="w-80 border-l border-gray-800 bg-gray-900">
            <Chat />
          </div>
        )}
      </div>

      {/* Bottom bar with custom controls */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-t border-gray-800">
        <div className="flex items-center gap-2">
          <RoomStatus />
        </div>
        <div className="flex items-center gap-1">
          <ControlBar
            variation="minimal"
            controls={{
              microphone: true,
              camera: true,
              screenShare: true,
              leave: true,
            }}
          />
          <Button
            variant={showChat ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setShowChat(!showChat)}
            className="text-white hover:bg-gray-800"
          >
            <MessageSquare className="w-4 h-4 mr-1" />
            Chat
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <ParticipantCount />
        </div>
      </div>

      {/* Audio renderer for remote participants */}
      <RoomAudioRenderer />
    </div>
  );
}

/**
 * Shows room connection status and duration.
 */
function RoomStatus() {
  const room = useRoomContext();
  const [duration, setDuration] = useState('00:00');

  useEffect(() => {
    let startTime = Date.now();
    const interval = setInterval(() => {
      if (room.state === LiveKitConnectionState.Connected) {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const mins = Math.floor(elapsed / 60).toString().padStart(2, '0');
        const secs = (elapsed % 60).toString().padStart(2, '0');
        setDuration(`${mins}:${secs}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [room]);

  if (room.state === LiveKitConnectionState.Connecting) {
    return (
      <Badge variant="secondary" className="bg-yellow-600/20 text-yellow-400">
        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
        Connecting...
      </Badge>
    );
  }

  if (room.state === LiveKitConnectionState.Connected) {
    return (
      <Badge variant="secondary" className="bg-green-600/20 text-green-400">
        <div className="w-2 h-2 rounded-full bg-green-400 mr-1 animate-pulse" />
        <Clock className="w-3 h-3 mr-1" />
        {duration}
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className="bg-red-600/20 text-red-400">
      <AlertCircle className="w-3 h-3 mr-1" />
      Disconnected
    </Badge>
  );
}

/**
 * Shows the number of participants in the room.
 */
function ParticipantCount() {
  const room = useRoomContext();
  const [count, setCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      setCount(room.remoteParticipants.size + 1); // +1 for local participant
    };

    updateCount();

    room.on(RoomEvent.ParticipantConnected, updateCount);
    room.on(RoomEvent.ParticipantDisconnected, updateCount);

    return () => {
      room.off(RoomEvent.ParticipantConnected, updateCount);
      room.off(RoomEvent.ParticipantDisconnected, updateCount);
    };
  }, [room]);

  return (
    <Badge variant="secondary" className="bg-gray-800 text-gray-300">
      <Users className="w-3 h-3 mr-1" />
      {count} {count === 1 ? 'participant' : 'participants'}
    </Badge>
  );
}

/**
 * Main VideoCallRoom component.
 * Wraps LiveKit's LiveKitRoom with TestCEFR-specific UI and logic.
 */
export default function VideoCallRoom({
  token,
  serverUrl,
  roomName,
  identity,
  role,
  onDisconnected,
  className,
}: VideoCallRoomProps) {
  const [connectionState, setConnectionState] = useState<LiveKitConnectionState>(
    LiveKitConnectionState.Disconnected,
  );
  const [error, setError] = useState<string | null>(null);

  const handleConnected = useCallback(() => {
    setConnectionState(LiveKitConnectionState.Connected);
    setError(null);
    console.log(`[LiveKit] Connected to room: ${roomName} as ${identity} (${role})`);
  }, [roomName, identity, role]);

  const handleDisconnected = useCallback(() => {
    setConnectionState(LiveKitConnectionState.Disconnected);
    console.log(`[LiveKit] Disconnected from room: ${roomName}`);
    onDisconnected?.();
  }, [roomName, onDisconnected]);

  const handleConnectionError = useCallback((err: Error) => {
    setConnectionState(LiveKitConnectionState.Disconnected);
    setError(err.message);
    console.error(`[LiveKit] Connection error:`, err);
  }, []);

  // If no token or URL, show error
  if (!token || !serverUrl) {
    return (
      <Card className={`border-red-200 ${className}`}>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
          <h3 className="text-lg font-semibold text-red-600 mb-2">
            LiveKit Not Configured
          </h3>
          <p className="text-sm text-gray-500 text-center max-w-md">
            The video call feature requires LiveKit to be configured.
            Please set the NEXT_PUBLIC_LIVEKIT_URL and LIVEKIT_API_KEY environment variables.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`relative h-full ${className || ''}`}>
      <LiveKitRoom
        serverUrl={serverUrl}
        token={token}
        connect={true}
        audio={true}
        video={true}
        onConnected={handleConnected}
        onDisconnected={handleDisconnected}
        onError={handleConnectionError}
        data-lk-theme="default"
        style={{ height: '100%' }}
      >
        <CustomVideoConference />
      </LiveKitRoom>

      {/* Connection overlay */}
      {connectionState === LiveKitConnectionState.Connecting && (
        <div className="absolute inset-0 bg-gray-950/80 flex items-center justify-center z-50">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
            <p className="text-white text-lg font-medium">Connecting to room...</p>
            <p className="text-gray-400 text-sm mt-1">Setting up audio and video</p>
          </div>
        </div>
      )}

      {/* Error overlay */}
      {error && (
        <div className="absolute inset-0 bg-gray-950/90 flex items-center justify-center z-50">
          <div className="text-center max-w-md">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-white text-lg font-medium mb-2">Connection Failed</p>
            <p className="text-gray-400 text-sm mb-4">{error}</p>
            <Button
              onClick={() => {
                setError(null);
                window.location.reload();
              }}
              variant="outline"
            >
              Try Again
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
