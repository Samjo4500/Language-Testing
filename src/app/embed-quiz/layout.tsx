import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free English Quiz Widget — Embed on Your Site | TestCEFR',
  description:
    'Add a free CEFR English quiz widget to your website or blog. Engages visitors, adds interactivity, and links back to TestCEFR. Copy and paste — no signup required.',
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: 'https://testcefr.com/embed-quiz',
  },
  openGraph: {
    title: 'Free English Quiz Widget — Embed on Your Site | TestCEFR',
    description:
      'Add a free CEFR English quiz widget to your website or blog. Engages visitors, adds interactivity, and links back to TestCEFR.',
  },
};

export default function EmbedQuizLayout({ children }: { children: React.ReactNode }) {
  return children;
}
