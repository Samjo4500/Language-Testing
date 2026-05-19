import type { Metadata } from 'next';

// Force dynamic rendering to avoid prerender issues with client components
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Payment Successful',
  description:
    'Your payment was successful! Your TestCEFR account has been upgraded to Premium. Start your full CEFR English proficiency assessment now.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function PaymentSuccessLayout({ children }: { children: React.ReactNode }) {
  return children;
}
