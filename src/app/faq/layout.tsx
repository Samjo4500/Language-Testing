import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ',
  description:
    'Frequently asked questions about TestCEFR. Learn about our AI-powered English proficiency assessments, CEFR certification, pricing, security, and how to get your English level certificate.',
  keywords: [
    'TestCEFR FAQ',
    'English test questions',
    'CEFR certification FAQ',
    'English assessment help',
    'how English test works',
    'CEFR test pricing',
    'certificate verification',
  ],
  openGraph: {
    title: 'FAQ | TestCEFR',
    description:
      'Frequently asked questions about TestCEFR English proficiency assessments, certificates, pricing, and more.',
  },
  alternates: {
    canonical: 'https://testcefr.com/faq',
  },
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children;
}
