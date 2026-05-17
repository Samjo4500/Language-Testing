import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset Password',
  description:
    'Set a new password for your TestCEFR account to regain access to your English proficiency assessments and certificates.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
