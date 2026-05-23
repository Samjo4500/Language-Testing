import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
  description:
    'Manage your CEFR assessment, view certificates, and track your English proficiency progress from your TestCEFR dashboard.',
  keywords: [
    'CEFR dashboard',
    'English test dashboard',
    'assessment management',
    'certificate management',
    'proficiency tracking',
  ],
  openGraph: {
    title: 'Dashboard | TestCEFR',
    description:
      'Manage your CEFR assessment, view certificates, and track your English proficiency progress.',
  },
  alternates: {
    canonical: 'https://testcefr.com/dashboard',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
