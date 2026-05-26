import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lexi AI Tutor',
  description:
    'Practice English conversation with Lexi, your AI-powered English tutor. Choose from Casual, Business, Exam Prep, or Travel modes. Get real-time feedback adapted to your CEFR level.',
  keywords: [
    'AI English tutor',
    'English conversation practice',
    'AI language partner',
    'Lexi AI',
    'English speaking practice',
    'IELTS speaking prep',
    'business English chat',
    'CEFR conversation',
  ],
  openGraph: {
    images: ['https://testcefr.com/og-image.png'],
    title: 'Lexi AI Tutor | TestCEFR',
    description:
      'Practice English conversation with Lexi, your AI-powered tutor. Choose from Casual, Business, Exam Prep, or Travel modes adapted to your CEFR level.',
  },
  alternates: {
    canonical: 'https://testcefr.com/ai-tutor',
  },
};

export default function AiTutorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
