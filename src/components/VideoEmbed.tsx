'use client';

import React, { useState, useEffect } from 'react';
import { Play, Headphones, AlertTriangle } from 'lucide-react';
import AudioLessonPlayer from './AudioLessonPlayer';

interface VideoEmbedProps {
  videoUrl?: string | null;
  lessonTitle?: string;
  lessonContent?: string;
  lessonObjective?: string;
  moduleName?: string;
  title?: string;
  url?: string | null;
}

function getEmbedUrl(rawUrl: string): string {
  // Already an embed URL
  if (rawUrl.includes('/embed/')) return rawUrl;
  // Standard YouTube watch URL
  const match = rawUrl.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/);
  if (match) return `https://www.youtube.com/embed/${match[1]}`;
  // YouTube Shorts
  const shortsMatch = rawUrl.match(/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shortsMatch) return `https://www.youtube.com/embed/${shortsMatch[1]}`;
  return rawUrl;
}

function getVideoId(url: string): string | null {
  const embedMatch = url.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch) return embedMatch[1];
  const watchMatch = url.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return watchMatch[1];
  const shortsMatch = url.match(/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shortsMatch) return shortsMatch[1];
  return null;
}

export default function VideoEmbed({
  videoUrl,
  lessonTitle,
  lessonContent,
  lessonObjective,
  moduleName,
  title,
  url,
}: VideoEmbedProps) {
  // Support both old props (title+url) and new props (videoUrl+lessonTitle)
  const resolvedUrl = videoUrl || url || null;
  const resolvedTitle = lessonTitle || title || '';

  const [mode, setMode] = useState<'loading' | 'video' | 'audio'>(
    resolvedUrl ? 'loading' : 'audio'
  );
  const [userChoseAudio, setUserChoseAudio] = useState(false);

  // Auto-detect unavailable YouTube videos using the oEmbed API
  useEffect(() => {
    if (!resolvedUrl || mode !== 'loading') return;

    const videoId = getVideoId(resolvedUrl);
    if (!videoId) {
      setMode('audio');
      return;
    }

    let cancelled = false;

    fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    )
      .then((res) => {
        if (cancelled) return;
        if (res.ok) {
          setMode('video');
        } else {
          console.warn(`YouTube video ${videoId} is unavailable, falling back to Lexi audio`);
          setMode('audio');
        }
      })
      .catch(() => {
        if (cancelled) return;
        // Network error — try showing the video anyway
        setMode('video');
      });

    const timeout = setTimeout(() => {
      if (!cancelled) setMode('video');
    }, 4000);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [resolvedUrl, mode]);

  // User manually chose audio or video is unavailable
  if (userChoseAudio || mode === 'audio') {
    return (
      <div className="space-y-2">
        {resolvedUrl && (
          <button
            onClick={() => {
              setUserChoseAudio(false);
              setMode('video');
            }}
            className="text-xs text-cyan-400/60 hover:text-cyan-400 transition-colors"
          >
            ← Back to video
          </button>
        )}
        <AudioLessonPlayer
          lessonTitle={resolvedTitle}
          lessonContent={lessonContent || ''}
          lessonObjective={lessonObjective}
          moduleName={moduleName}
        />
      </div>
    );
  }

  // No video URL at all
  if (!resolvedUrl) {
    return (
      <AudioLessonPlayer
        lessonTitle={resolvedTitle}
        lessonContent={lessonContent || ''}
        lessonObjective={lessonObjective}
        moduleName={moduleName}
      />
    );
  }

  const embedUrl = getEmbedUrl(resolvedUrl);

  // Loading state while checking oEmbed
  if (mode === 'loading') {
    return (
      <div className="w-full">
        <div className="relative w-full aspect-video bg-black/50 rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full border-2 border-cyan-400/30 border-t-cyan-400 animate-spin" />
            <p className="text-xs text-white/40">Loading video...</p>
          </div>
        </div>
      </div>
    );
  }

  // Video mode
  return (
    <div className="w-full space-y-2">
      <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-white/10">
        <iframe
          src={embedUrl}
          title={`${resolvedTitle} - Video`}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onError={() => setMode('audio')}
        />
      </div>
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] text-white/20 flex items-center gap-1">
          <Play size={8} /> via YouTube
        </span>
        <button
          onClick={() => setUserChoseAudio(true)}
          className="flex items-center gap-1 text-[10px] text-white/20 hover:text-cyan-400/60 transition-colors"
        >
          <Headphones size={8} /> Prefer audio?
        </button>
      </div>
    </div>
  );
}

// Also export as named export for backward compatibility
export { VideoEmbed };
