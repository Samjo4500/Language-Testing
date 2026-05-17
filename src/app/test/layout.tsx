import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CEFR Assessment',
  description: 'Take your comprehensive CEFR English proficiency assessment.',
  robots: { index: false, follow: false },
};

export default function TestLayout({ children }: { children: React.ReactNode }) {
  return children;
}
