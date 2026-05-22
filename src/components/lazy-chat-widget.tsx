'use client';

import dynamic from 'next/dynamic';

// Lazy-load chat widget — heavy component (318 lines + react-markdown) not needed for initial paint
// Uses ssr: false because the chat widget relies on browser APIs and is purely interactive
export const LazyChatWidget = dynamic(
  () => import('@/components/chat-widget').then(mod => ({ default: mod.ChatWidget })),
  {
    ssr: false,
    loading: () => null,
  }
);
