import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sample CEFR Assessment Report',
  description:
    'Preview a detailed CEFR assessment report from TestCEFR. See how our AI-powered analysis breaks down your reading, writing, listening, speaking, grammar, and vocabulary skills.',
  keywords: [
    'CEFR sample report',
    'CEFR assessment report',
    'English proficiency report',
    'sample English test results',
  ],
  openGraph: {
    title: 'Sample CEFR Assessment Report | TestCEFR',
    description:
      'Preview a detailed CEFR assessment report. See how our AI-powered analysis breaks down your English skills.',
  },
  alternates: {
    canonical: 'https://www.testcefr.com/sample-report',
  },
};

export default function SampleReportLayout({ children }: { children: React.ReactNode }) {
  return children;
}
