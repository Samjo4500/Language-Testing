import type { Metadata } from 'next';

// Force dynamic rendering — never cache this page (fixes stale pre-render cache)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Admin Dashboard v2.0 — Modular',
  description:
    'Super Admin dashboard for managing the TestCEFR platform — users, payments, assessments, question bank, and system health.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
