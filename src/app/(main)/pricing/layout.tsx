import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Choose the perfect plan for your English proficiency needs. Start free or upgrade to Premium for full CEFR assessments with QR-verified certificates. Individual and team plans available.',
  keywords: [
    'CEFR test pricing',
    'English assessment plans',
    'Premium English test',
    'CEFR certification cost',
    'language test pricing',
    'team English assessment',
    'business English testing',
  ],
  openGraph: {
    images: ["https://testcefr.com/og-image.png"],
    title: 'Pricing | TestCEFR',
    description:
      'Choose the perfect plan for your English proficiency needs. Start free or upgrade to Premium for full CEFR assessments with QR-verified certificates.',
  },
  alternates: {
    canonical: 'https://testcefr.com/pricing',
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
