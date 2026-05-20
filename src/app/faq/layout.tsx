import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions about TestCEFR English proficiency assessments, certificates, pricing, and more.',
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children;
}
