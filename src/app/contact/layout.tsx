import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us — TestCEFR',
  description:
    'Get in touch with the TestCEFR team for support, partnerships, or inquiries about our English proficiency testing platform.',
  openGraph: {
    title: 'Contact Us — TestCEFR',
    description:
      'Get in touch with the TestCEFR team for support, partnerships, or inquiries about our English proficiency testing platform.',
    url: 'https://www.testcefr.com/contact',
    siteName: 'TestCEFR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us — TestCEFR',
    description:
      'Get in touch with the TestCEFR team for support, partnerships, or inquiries about our English proficiency testing platform.',
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
