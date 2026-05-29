import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SpeakSpace — Live Voice Rooms for English Practice | TestCEFR',
  description:
    'Join live voice rooms to practice English with real people. 1-on-1 matching, group conversations, live classes, and study groups for all CEFR levels.',
  keywords: [
    'SpeakSpace',
    'English speaking practice',
    'live voice rooms',
    'English conversation',
    'language exchange',
    'CEFR speaking practice',
    'English speaking online',
    '1-on-1 English practice',
  ],
  openGraph: {
    title: 'SpeakSpace — Live Voice Rooms for English Practice | TestCEFR',
    description:
      'Join live voice rooms to practice English with real people. 1-on-1 matching, group conversations, and study groups for all levels.',
  },
  alternates: {
    canonical: 'https://testcefr.com/speakspace',
  },
};

export default function SpeakSpaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
