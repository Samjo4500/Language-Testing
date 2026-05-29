'use client';
import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function CommunityLiveRoomRedirect() {
  const router = useRouter();
  const params = useParams();
  const roomName = params.roomName as string;

  useEffect(() => {
    router.replace(`/speakspace/${roomName}`);
  }, [router, roomName]);

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-gray-400">Redirecting to SpeakSpace...</p>
    </div>
  );
}
