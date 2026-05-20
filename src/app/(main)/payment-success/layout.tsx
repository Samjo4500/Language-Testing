import type { Metadata } from 'next';

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
