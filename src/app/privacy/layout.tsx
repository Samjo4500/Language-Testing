import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — TestCEFR',
  description:
    'Read our privacy policy to understand how TestCEFR handles your data and protects your privacy.',
  openGraph: {
    title: 'Privacy Policy — TestCEFR',
    description:
      'Read our privacy policy to understand how TestCEFR handles your data and protects your privacy.',
    url: 'https://www.testcefr.com/privacy',
    siteName: 'TestCEFR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy — TestCEFR',
    description:
      'Read our privacy policy to understand how TestCEFR handles your data and protects your privacy.',
  },
  alternates: {
    canonical: 'https://www.testcefr.com/privacy',
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
