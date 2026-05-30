'use client';

import { useState, useSyncExternalStore } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import PWAOfflineMode, { OfflineContent } from '@/components/PWAOfflineMode';

function useOfflineStatus() {
  return useSyncExternalStore(
    (callback) => {
      window.addEventListener('online', callback);
      window.addEventListener('offline', callback);
      return () => {
        window.removeEventListener('online', callback);
        window.removeEventListener('offline', callback);
      };
    },
    () => navigator.onLine,
    () => true, // server snapshot — assume online
  );
}

const INITIAL_DOWNLOADED: OfflineContent[] = [
  {
    id: 'cp1',
    title: 'B1 Essential Vocabulary',
    type: 'vocabulary',
    size: 12,
    downloadedAt: 'Mar 4, 2025',
    lastSyncedAt: '2 hours ago',
  },
  {
    id: 'cp4',
    title: 'Grammar Fundamentals',
    type: 'quiz',
    size: 8,
    downloadedAt: 'Mar 3, 2025',
    lastSyncedAt: '1 day ago',
  },
];

const CONTENT_PACK_SIZES: Record<string, number> = {
  cp1: 12,
  cp2: 24,
  cp3: 45,
  cp4: 8,
  cp5: 32,
};

export default function OfflinePage() {
  const isOnline = useOfflineStatus();
  const [downloadedContent, setDownloadedContent] = useState<OfflineContent[]>(INITIAL_DOWNLOADED);
  const [storageUsed, setStorageUsed] = useState(20); // MB

  const handleDownload = (id: string) => {
    // Simulate downloading a content pack
    const titles: Record<string, { title: string; type: OfflineContent['type'] }> = {
      cp1: { title: 'B1 Essential Vocabulary', type: 'vocabulary' },
      cp2: { title: 'Travel English Pack', type: 'lesson' },
      cp3: { title: 'Listening Practice A2', type: 'audio' },
      cp4: { title: 'Grammar Fundamentals', type: 'quiz' },
      cp5: { title: 'Business English B2', type: 'lesson' },
    };

    const pack = titles[id];
    if (!pack) return;
    const size = CONTENT_PACK_SIZES[id] ?? 10;

    setDownloadedContent((prev) => [
      ...prev,
      {
        id,
        title: pack.title,
        type: pack.type,
        size,
        downloadedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        lastSyncedAt: 'Just now',
      },
    ]);
    setStorageUsed((prev) => prev + size);
  };

  const handleSync = () => {
    // Simulate sync — update lastSyncedAt timestamps
    setDownloadedContent((prev) =>
      prev.map((item) => ({ ...item, lastSyncedAt: 'Just now' }))
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
      <Navbar />
      <main className="flex-1 py-8 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Offline Mode</h1>
            <p className="text-white/50">Download content for offline access and keep learning anywhere</p>
          </div>
          <PWAOfflineMode
            isOnline={isOnline}
            downloadedContent={downloadedContent}
            onDownload={handleDownload}
            onSync={handleSync}
            storageUsed={storageUsed}
            storageTotal={200}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
