import type { Metadata } from 'next';

// FORCE DYNAMIC: Prevent Next.js from statically generating and caching
// course pages. This was the root cause of the "stale PayPal" bug —
// ISR cached pages for 1 year (s-maxage=31536000) and served outdated HTML
// even after code changes.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'English Courses',
  description:
    'Learn English from A1 to C2 with structured CEFR-aligned courses. Beginner, Intermediate, and Advanced tiers with interactive lessons, AI-powered exercises, and completion certificates.',
  keywords: [
    'English courses',
    'CEFR courses',
    'learn English online',
    'English course A1 C2',
    'beginner English course',
    'intermediate English course',
    'advanced English course',
    'English lessons',
    'English learning platform',
  ],
  openGraph: {
    images: ['https://testcefr.com/og-image.png'],
    title: 'English Courses | TestCEFR',
    description:
      'Learn English from A1 to C2 with structured CEFR-aligned courses. Interactive lessons, AI-powered exercises, and completion certificates.',
  },
  alternates: {
    canonical: 'https://testcefr.com/courses',
  },
};

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
