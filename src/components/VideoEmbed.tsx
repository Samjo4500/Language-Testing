'use client';

interface VideoEmbedProps {
  url: string;
  title: string;
}

export function VideoEmbed({ url, title }: VideoEmbedProps) {
  // Extract YouTube video ID from various URL formats
  const videoId = url.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/)?.[1];
  
  if (!videoId) {
    return (
      <div className="aspect-video rounded-xl bg-[#131328] flex items-center justify-center text-gray-400">
        <p>Invalid video URL</p>
      </div>
    );
  }

  return (
    <div className="aspect-video rounded-xl overflow-hidden bg-[#0a0a1a]">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
        loading="lazy"
      />
    </div>
  );
}
