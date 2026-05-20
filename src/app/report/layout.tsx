import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CEFR Assessment Report — TestCEFR',
  description: 'View your detailed CEFR English proficiency assessment report with skill-by-skill breakdown and performance analytics.',
  openGraph: {
    title: 'CEFR Assessment Report — TestCEFR',
    description: 'Detailed CEFR English proficiency assessment report with skill breakdown.',
    type: 'article',
  },
  alternates: {
    canonical: '/report',
  },
};

export default function ReportLayout({ children }: { children: React.ReactNode }) {
  return children;
}
