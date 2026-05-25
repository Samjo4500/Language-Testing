import type { Metadata } from 'next';

// FORCE DYNAMIC: Prevent Next.js from statically generating and caching
// course pages. This was the root cause of the "stale PayPal" bug —
// ISR cached pages for 1 year (s-maxage=31536000) and served outdated HTML
// even after code changes.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'CEFR English Courses | TestCEFR',
  description: 'Learn English from A1 to C2 with structured CEFR-aligned courses.',
};

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
