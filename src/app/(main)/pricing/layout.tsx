import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing — TestCEFR',
  description:
    'Choose the right plan for your English proficiency test. Single tests, premium packs, and enterprise solutions available.',
  openGraph: {
    title: 'Pricing — TestCEFR',
    description:
      'Choose the right plan for your English proficiency test. Single tests, premium packs, and enterprise solutions available.',
    url: 'https://www.testcefr.com/pricing',
    siteName: 'TestCEFR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing — TestCEFR',
    description:
      'Choose the right plan for your English proficiency test. Single tests, premium packs, and enterprise solutions available.',
  },
  alternates: {
    canonical: 'https://www.testcefr.com/pricing',
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
