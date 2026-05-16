import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard — TestCEFR',
  description:
    'View your CEFR assessment results, certificates, and test history.',
  openGraph: {
    title: 'Dashboard — TestCEFR',
    description:
      'View your CEFR assessment results, certificates, and test history.',
    url: 'https://www.testcefr.com/dashboard',
    siteName: 'TestCEFR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dashboard — TestCEFR',
    description:
      'View your CEFR assessment results, certificates, and test history.',
  },
  alternates: {
    canonical: 'https://www.testcefr.com/dashboard',
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
