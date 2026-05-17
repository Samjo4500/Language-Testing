import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us - TestCEFR | Get Support & Sales Inquiries',
  description:
    'Reach the TestCEFR team for support, sales inquiries, or partnership opportunities. We respond within 24 hours to help with your English proficiency assessment needs.',
  keywords: [
    'contact testcefr',
    'English test support',
    'CEFR assessment help',
    'language test inquiries',
    'testcefr support',
  ],
  openGraph: {
    title: 'Contact Us - TestCEFR',
    description:
      'Get support and sales inquiries — we respond within 24 hours',
    url: 'https://www.testcefr.com/contact',
    siteName: 'TestCEFR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us - TestCEFR',
    description:
      'Get support and sales inquiries — we respond within 24 hours',
  },
  alternates: {
    canonical: 'https://www.testcefr.com/contact',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
