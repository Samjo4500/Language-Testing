import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Community — Language Partners',
  description:
    'Find language partners worldwide and practice English together. Connect with native speakers, join the global chatroom, share moments, and improve your speaking skills through real conversations.',
  keywords: [
    'language exchange',
    'language partners',
    'English conversation partner',
    'find language partner',
    'practice English online',
    'language community',
    'English chatroom',
    'speaking practice',
  ],
  openGraph: {
    images: ['https://testcefr.com/og-image.png'],
    title: 'Community — Language Partners | TestCEFR',
    description:
      'Find language partners worldwide and practice English together. Connect with native speakers and join the global chatroom.',
  },
  alternates: {
    canonical: 'https://testcefr.com/community',
  },
};

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return children;
}
