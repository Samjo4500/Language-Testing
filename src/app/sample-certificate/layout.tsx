import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sample Certificate',
  description:
    'Preview a sample CEFR proficiency certificate from TestCEFR. Each certificate includes a QR verification code, skill breakdown, and is shareable with employers and institutions worldwide.',
  keywords: [
    'CEFR certificate sample',
    'sample English certificate',
    'QR verified certificate',
    'CEFR proficiency certificate',
    'English test certificate',
    'language certification',
  ],
  openGraph: {
    title: 'Sample Certificate | TestCEFR',
    description:
      'Preview a sample CEFR proficiency certificate with QR verification, skill breakdown, and professional design.',
  },
  alternates: {
    canonical: 'https://www.testcefr.com/sample-certificate',
  },
};

export default function SampleCertificateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
