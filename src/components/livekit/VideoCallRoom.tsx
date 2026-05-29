'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  LiveKitRoom,
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
  RoomEvent,
} from 'livekit-client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Mic,
  MessageSquare,
  Users,
  Clock,
  AlertCircle,
  Loader2,
  Volume2,
  BookOpen,
  Timer,
  List,
} from 'lucide-react';

interface VideoCallRoomProps {
  token: string;
  serverUrl: string;
  roomName: string;
  identity: string;
  role: 'host' | 'co_host' | 'participant' | 'admin';
  roomType?: string;
  onDisconnected?: () => void;
  className?: string;
}

/**
 * Custom video conference layout with room type awareness.
 */
function CustomVideoConference({ roomType }: { roomType?: string }) {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );

  const [showChat, setShowChat] = useState(false);
  const [showSpeakerQueue, setShowSpeakerQueue] = useState(false);

  const screenShareTrack = tracks.find(
    (t) => t.source === Track.Source.ScreenShare && t.participant.isScreenShareEnabled,
  );

  // Voice-only mode for VOICE_HANGOUT
  const isVoiceOnly = roomType === 'VOICE_HANGOUT';
  // Lecture mode — spotlight layout
  const isLecture = roomType === 'LECTURE';
  // Open Mic — show speaker queue
  const isOpenMic = roomType === 'OPEN_MIC';
  // 1-on-1
  const isOneOnOne = roomType === 'ONE_ON_ONE';
  // Study group
  const isStudyGroup = roomType === 'STUDY_GROUP';

  return (
    <div className="flex flex-col h-full bg-gray-950">
      {/* Room type banner */}
      {isVoiceOnly && (
        <div className="bg-purple-500/10 border-b border-purple-500/20 px-4 py-1.5 flex items-center gap-2">
          <Volume2 className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-xs text-purple-300 font-medium">Voice Only Mode</span>
          <span className="text-[10px] text-purple-400/60">— Camera is disabled for this room type</span>
        </div>
      )}
      {isOneOnOne && (
        <div className="bg-green-500/10 border-b border-green-500/20 px-4 py-1.5 flex items-center gap-2">
          <Timer className="w-3.5 h-3.5 text-green-400" />
          <span className="text-xs text-green-300 font-medium">1-on-1 Conversation</span>
          <OneOnOneTimer />
        </div>
      )}
      {isLecture && (
        <div className="bg-red-500/10 border-b border-red-500/20 px-4 py-1.5 flex items-center gap-2">
          <MessageSquare className="w-3.5 h-3.5 text-red-400" />
          <span className="text-xs text-red-300 font-medium">Lecture Mode</span>
          <span className="text-[10px] text-red-400/60">— Use chat for questions</span>
        </div>
      )}
      {isStudyGroup && (
        <div className="bg-teal-500/10 border-b border-teal-500/20 px-4 py-1.5 flex items-center gap-2">
          <BookOpen className="w-3.5 h-3.5 text-teal-400" />
          <span className="text-xs text-teal-300 font-medium">Study Group</span>
          <span className="text-[10px] text-teal-400/60">— Collaborate and learn together</span>
        </div>
      )}

      {/* Main video area */}
      <div className="flex-1 flex">
        <div className="flex-1 p-2">
          {isLecture || screenShareTrack ? (
            <FocusLayoutContainer>
              {screenShareTrack && <FocusLayout trackRef={screenShareTrack} />}
            </FocusLayoutContainer>
          ) : isVoiceOnly ? (
            /* Voice-only: show audio tiles only, hide video */
            <div className="flex items-center justify-center h-full gap-4 flex-wrap">
              {tracks.map((track, i) => (
                <div key={i} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-900/50 border border-gray-800">
                  <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <Mic className="w-6 h-6 text-purple-400" />
                  </div>
                  <span className="text-sm text-gray-300">
                    {track.participant.name || track.participant.identity}
                  </span>
                  <Badge variant="secondary" className="bg-green-600/20 text-green-400 text-[10px]">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 mr-1 animate-pulse" />
                    Speaking
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <GridLayout tracks={tracks} style={{ height: '100%' }}>
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

        {/* Speaker queue for Open Mic */}
        {isOpenMic && showSpeakerQueue && (
          <div className="w-64 border-l border-gray-800 bg-gray-900 p-4">
            <h3 className="text-sm font-medium text-orange-400 flex items-center gap-2 mb-3">
              <List className="w-4 h-4" />
              Speaker Queue
            </h3>
            <div className="space-y-2">
              <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <p className="text-xs text-orange-300 font-medium">Current Speaker</p>
                <p className="text-sm text-white">Waiting for speaker...</p>
              </div>
              <p className="text-xs text-gray-500 text-center">Raise hand to join the queue</p>
            </div>
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
              camera: !isVoiceOnly,
              screenShare: !isVoiceOnly,
              leave: true,
            }}
          />
          <Button
            variant={showChat ? 'default' : 'ghost'}
            size="sm"
            onClick={() => { setShowChat(!showChat); setShowSpeakerQueue(false); }}
            className="text-white hover:bg-gray-800"
          >
            <MessageSquare className="w-4 h-4 mr-1" />
            Chat
          </Button>
          {isOpenMic && (
            <Button
              variant={showSpeakerQueue ? 'default' : 'ghost'}
              size="sm"
              onClick={() => { setShowSpeakerQueue(!showSpeakerQueue); setShowChat(false); }}
              className="text-white hover:bg-gray-800"
            >
              <List className="w-4 h-4 mr-1" />
              Queue
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <ParticipantCount />
        </div>
      </div>

      <RoomAudioRenderer />
    </div>
  );
}

/**
 * Timer for 1-on-1 conversations (15 min default).
 */
function OneOnOneTimer() {
  const [elapsed, setElapsed] = useState(0);
  const maxMinutes = 15;

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  const remaining = maxMinutes * 60 - elapsed;
  const isWarning = remaining < 120 && remaining > 0;

  return (
    <span className={`text-xs ${isWarning ? 'text-yellow-400' : 'text-green-400/60'}`}>
      {mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
      {remaining > 0 && (
        <span className="ml-1">({Math.floor(remaining / 60)}:{(remaining % 60).toString().padStart(2, '0')} left)</span>
      )}
    </span>
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
      setCount(room.remoteParticipants.size + 1);
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
  roomType,
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

  if (!token || !serverUrl) {
    return (
      <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
        <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
        <h3 className="text-lg font-semibold text-red-600 mb-2">LiveKit Not Configured</h3>
        <p className="text-sm text-gray-500 text-center max-w-md">
          The video call feature requires LiveKit to be configured.
        </p>
      </div>
    );
  }

  return (
    <div className={`relative h-full ${className || ''}`}>
      <LiveKitRoom
        serverUrl={serverUrl}
        token={token}
        connect={true}
        audio={true}
        video={roomType !== 'VOICE_HANGOUT'}
        onConnected={handleConnected}
        onDisconnected={handleDisconnected}
        onError={handleConnectionError}
        data-lk-theme="default"
        style={{ height: '100%' }}
      >
        <CustomVideoConference roomType={roomType} />
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
              onClick={() => { setError(null); window.location.reload(); }}
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
