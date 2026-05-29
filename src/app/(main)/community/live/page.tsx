'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CommunityLiveRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/speakspace');
  }, [router]);
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-gray-400">Redirecting to SpeakSpace...</p>
    </div>
  );
}
