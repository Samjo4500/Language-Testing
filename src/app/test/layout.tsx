import type { Metadata } from 'next';

// Force dynamic rendering to avoid prerender issues with client components
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'CEFR Assessment',
  description: 'Take your comprehensive CEFR English proficiency assessment.',
  robots: { index: false, follow: false },
};

export default function TestLayout({ children }: { children: React.ReactNode }) {
  return children;
}
