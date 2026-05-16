import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sample Certificate - TestCEFR | CEFR Proficiency Certificate Preview',
  description:
    'Preview a sample CEFR proficiency certificate from TestCEFR. Our QR-verified certificates are trusted by employers and institutions worldwide.',
  keywords: [
    'CEFR certificate sample',
    'English proficiency certificate',
    'QR verified certificate',
    'CEFR level certificate',
    'language certification preview',
  ],
  openGraph: {
    title: 'Sample Certificate - TestCEFR',
    description:
      'Preview a QR-verified CEFR proficiency certificate trusted worldwide',
    url: 'https://www.testcefr.com/sample-certificate',
    siteName: 'TestCEFR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sample Certificate - TestCEFR',
    description:
      'Preview a QR-verified CEFR proficiency certificate trusted worldwide',
  },
  alternates: {
    canonical: 'https://www.testcefr.com/sample-certificate',
  },
};

export default function SampleCertificateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
