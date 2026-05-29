'use client';

import React, { useState, useCallback } from 'react';
import { LocalParticipant, RoomEvent, Track } from 'livekit-client';
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
  ControlBar,
  useRoomContext,
  useLocalParticipant,
  useTracks,
  GridLayout,
  ParticipantTile,
} from '@livekit/components-react';
import '@livekit/components-styles';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  PhoneOff,
  Settings,
  Loader2,
  AlertCircle,
  Check,
} from 'lucide-react';

interface PreJoinScreenProps {
  roomName: string;
  userName: string;
  onJoin: (options: { audioEnabled: boolean; videoEnabled: boolean }) => void;
  onCancel?: () => void;
}

/**
 * Pre-join screen where users can test their camera/mic before entering.
 */
export default function PreJoinScreen({
  roomName,
  userName,
  onJoin,
  onCancel,
}: PreJoinScreenProps) {
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [isJoining, setIsJoining] = useState(false);

  const handleJoin = useCallback(() => {
    setIsJoining(true);
    onJoin({ audioEnabled, videoEnabled });
  }, [audioEnabled, videoEnabled, onJoin]);

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Room info */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Join Live Class</h1>
          <p className="text-gray-400">
            Room: <span className="text-purple-400 font-mono">{roomName}</span>
          </p>
          <p className="text-gray-400">
            Joining as: <span className="text-white">{userName}</span>
          </p>
        </div>

        {/* Camera preview */}
        <Card className="bg-gray-900 border-gray-800 mb-6 overflow-hidden">
          <CardContent className="p-0">
            <div className="aspect-video bg-gray-800 relative flex items-center justify-center">
              {videoEnabled ? (
                <div className="text-center text-gray-500">
                  <VideoIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Camera preview will appear here</p>
                </div>
              ) : (
                <div className="text-center text-gray-600">
                  <VideoOff className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Camera is off</p>
                </div>
              )}

              {/* Name overlay */}
              <div className="absolute bottom-3 left-3">
                <Badge variant="secondary" className="bg-gray-900/80 text-white">
                  {userName}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Device toggles */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <Button
            variant={audioEnabled ? 'default' : 'outline'}
            size="lg"
            className={audioEnabled ? 'bg-purple-600 hover:bg-purple-700' : 'border-red-600 text-red-400'}
            onClick={() => setAudioEnabled(!audioEnabled)}
          >
            {audioEnabled ? <Mic className="w-5 h-5 mr-2" /> : <MicOff className="w-5 h-5 mr-2" />}
            {audioEnabled ? 'Mic On' : 'Mic Off'}
          </Button>

          <Button
            variant={videoEnabled ? 'default' : 'outline'}
            size="lg"
            className={videoEnabled ? 'bg-purple-600 hover:bg-purple-700' : 'border-red-600 text-red-400'}
            onClick={() => setVideoEnabled(!videoEnabled)}
          >
            {videoEnabled ? <VideoIcon className="w-5 h-5 mr-2" /> : <VideoOff className="w-5 h-5 mr-2" />}
            {videoEnabled ? 'Camera On' : 'Camera Off'}
          </Button>
        </div>

        {/* Join/Cancel buttons */}
        <div className="flex gap-3">
          {onCancel && (
            <Button
              variant="outline"
              size="lg"
              className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
              onClick={onCancel}
              disabled={isJoining}
            >
              Cancel
            </Button>
          )}
          <Button
            size="lg"
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
            onClick={handleJoin}
            disabled={isJoining}
          >
            {isJoining ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Joining...
              </>
            ) : (
              <>
                <Check className="w-5 h-5 mr-2" />
                Join Now
              </>
            )}
          </Button>
        </div>

        {/* Privacy notice */}
        <p className="text-center text-gray-600 text-xs mt-4">
          By joining, you agree that the session may be recorded for quality purposes.
          Your camera and microphone will only be active while you are in the room.
        </p>
      </div>
    </div>
  );
}
