import type { Metadata } from 'next';

// Force dynamic rendering to avoid prerender issues with client components
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'English Speaking Test',
  description:
    'Perfect your English speaking skills with our AI-powered assessment using advanced speech recognition. Evaluate pronunciation, fluency, and coherence for an accurate CEFR A1–C2 level rating.',
  keywords: [
    'English speaking test',
    'CEFR speaking assessment',
    'speaking skills',
    'pronunciation test',
    'English fluency test',
    'AI speaking assessment',
    'speech recognition English',
  ],
  openGraph: {
    images: ["https://www.testcefr.com/og-image.png"],
    title: 'English Speaking Test | TestCEFR',
    description:
      'Perfect your English speaking skills with our AI-powered assessment using advanced speech recognition. Get an accurate CEFR A1–C2 level rating.',
  },
  alternates: {
    canonical: 'https://www.testcefr.com/speaking',
  },
};

export default function SpeakingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
