'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/auth-store';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import {
  CheckCircle2,
  Loader2,
  CreditCard,
  Star,
  Sparkles,
  ArrowRight,
  Zap,
  HelpCircle,
  Building2,
  Users,
  Globe,
  Phone,
  ChevronDown,
  ChevronUp,
  Crown,
  Rocket,
  BadgeCheck,
  Lock,
} from 'lucide-react';

/* PayPal script loader with loading state */
function usePayPalScript(clientId: string | null) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'loaded'>('idle');
  const [mounted, setMounted] = useState(false);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    setMounted(true);
    if (window.paypal) setStatus('loaded');
  }, []);

  useEffect(() => {
    if (!clientId) return;
    if (window.paypal || document.querySelector('script[src*="paypal.com/sdk/js"]')) return;

    const loadingTimer = setTimeout(() => setStatus('loaded'), 0);
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&intent=capture`;
    script.async = true;
    script.onload = () => { clearTimeout(loadingTimer); setStatus('loaded'); };
    script.onerror = () => { clearTimeout(loadingTimer); setStatus('idle'); };

    document.body.appendChild(script);
    scriptRef.current = script;

    return () => {
      clearTimeout(loadingTimer);
      if (scriptRef.current && !window.paypal) scriptRef.current.remove();
    };
  }, [clientId]);

  return { isLoaded: status === 'loaded', isLoading: status === 'loading' };
}

/* PayPal button component — supports different amounts */
function PayPalCheckoutButton({ accessToken, amount, description }: { accessToken: string | null; amount: number; description: string }) {
  const paypalContainerRef = useRef<HTMLDivElement>(null);
  const [paypalClientId, setPaypalClientId] = useState<string | null>(null);
  const [isFetchingClientId, setIsFetchingClientId] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState('');
  const { isLoaded, isLoading: isScriptLoading } = usePayPalScript(paypalClientId);
  const { updatePlan } = useAuthStore();
  const router = useRouter();
  const renderedRef = useRef(false);

  useEffect(() => {
    setMounted(true);
    setIsFetchingClientId(true);
    const fetchClientId = async () => {
      try {
        const response = await fetch('/api/payments/client-id');
        if (response.ok) {
          const data = await response.json();
          setPaypalClientId(data.clientId);
        } else {
          setError('Failed to load payment configuration.');
        }
      } catch {
        setError('Failed to connect to payment service.');
      } finally {
        setIsFetchingClientId(false);
      }
    };
    fetchClientId();
  }, []);

  useEffect(() => {
    if (!isLoaded || !window.paypal || !paypalContainerRef.current || !accessToken || renderedRef.current) return;
    renderedRef.current = true;

    window.paypal.Buttons({
      style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay', height: 45 },
      createOrder: async () => {
        try {
          const response = await fetch('/api/payments/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
            body: JSON.stringify({ amount, currency: 'USD' }),
          });
          if (!response.ok) throw new Error('Failed to create order');
          const data = await response.json();
          return data.orderID;
        } catch (err) {
          console.error('Create order error:', err);
          setError('Failed to create payment. Please try again.');
          throw err;
        }
      },
      onApprove: async (data) => {
        try {
          setError('');
          const response = await fetch('/api/payments/capture', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
            body: JSON.stringify({ orderID: data.orderID }),
          });
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Payment capture failed');
          }
          updatePlan('premium');
          router.push(`/payment-success?plan=${selectedPlan.id}`);
        } catch (err) {
          console.error('Capture error:', err);
          setError(err instanceof Error ? err.message : 'Payment failed. Please contact support.');
        }
      },
      onError: (err) => {
        console.error('PayPal button error:', err);
        setError('Payment process encountered an error. Please try again.');
      },
    }).render(paypalContainerRef.current);
  }, [isLoaded, accessToken, amount]);

  /* Always render the same structure on server and client to avoid hydration mismatch.
     PayPal content is only populated after mount via useEffect. */
  return (
    <div>
      {!mounted || isFetchingClientId || isScriptLoading ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin mr-2 text-purple-400" />
          <span className="text-xs text-white/50">Loading payment...</span>
        </div>
      ) : null}
      {mounted && error && (
        <div className="mb-3 rounded-xl bg-red-500/10 border border-red-500/20 p-3">
          <p className="text-xs text-red-400">{error}</p>
        </div>
      )}
      <div
        ref={paypalContainerRef}
        className={!mounted || isFetchingClientId || isScriptLoading ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100 transition-opacity'}
      />
    </div>
  );
}

/* Scroll animation hook */
function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); observer.unobserve(el); } },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    observer.observe(el);
    // Immediately mark as visible if already in viewport on mount
    if (el.getBoundingClientRect().top < window.innerHeight) {
      el.classList.add('visible');
      observer.unobserve(el);
    }
    return () => observer.disconnect();
  }, []);
  return ref;
}

function AnimatedSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useScrollAnimation();
  return (
    <div ref={ref} className={`scroll-animate ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* FAQ Accordion Item */
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left cursor-pointer"
      >
        <span className="font-medium text-sm text-white pr-4">{q}</span>
        {open ? (
          <ChevronUp className="h-4 w-4 text-purple-400 shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-white/40 shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-5 pt-0">
          <p className="text-sm text-white/50 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

/* ======================================================
   PLAN DATA
   ====================================================== */
const INDIVIDUAL_PLANS = [
  {
    id: 'free',
    name: 'Free',
    subtitle: 'Perfect for getting started',
    price: '$0',
    priceSuffix: '',
    icon: <Zap className="h-5 w-5" />,
    iconBg: 'bg-white/10',
    features: [
      '1 comprehensive assessment',
      'Basic CEFR level result',
      'Skill breakdown scores',
      'Watermarked certificate',
      'AI-powered feedback',
      'Downloadable PDF certificate',
      'Progress tracking',
    ],
    cta: 'Start Free',
    ctaLink: '/register',
    popular: false,
    gradient: '',
    amount: 0,
  },
  {
    id: 'single',
    name: 'Single Test',
    subtitle: 'Full assessment with detailed report',
    price: '$12.99',
    priceSuffix: '/ one-time',
    icon: <BadgeCheck className="h-5 w-5" />,
    iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-500',
    features: [
      'Complete 6-skill assessment',
      'Detailed CEFR score',
      'AI-powered feedback',
      'Downloadable PDF certificate',
      'Progress tracking',
      'Priority AI analysis',
      'Email support',
    ],
    cta: 'Buy Test',
    ctaLink: '',
    popular: false,
    gradient: 'from-blue-500 to-cyan-500',
    amount: 12.99,
  },
  {
    id: 'premium',
    name: 'Premium Pack',
    subtitle: 'Best value for serious learners',
    price: '$29.99',
    priceSuffix: '/ 3 tests',
    icon: <Crown className="h-5 w-5" />,
    iconBg: 'bg-gradient-to-br from-purple-500 to-pink-500',
    features: [
      '3 full assessments',
      'Progress tracking dashboard',
      'Priority AI analysis',
      'Unlimited certificate downloads',
      'Email support',
      'Peer comparison',
      'Full analytics suite',
    ],
    cta: 'Get Premium',
    ctaLink: '',
    popular: true,
    gradient: 'from-purple-500 to-pink-500',
    amount: 29.99,
  },
  {
    id: 'pro',
    name: 'Pro Pack',
    subtitle: 'Complete learning solution',
    price: '$49.99',
    priceSuffix: '/ 6 tests',
    icon: <Rocket className="h-5 w-5" />,
    iconBg: 'bg-gradient-to-br from-amber-500 to-orange-500',
    features: [
      '6 assessments',
      'Full analytics suite',
      'Detailed skill improvement tips',
      'Comparison with peers',
      'Priority support',
      'Unlimited certificate downloads',
      'Progress tracking dashboard',
    ],
    cta: 'Go Pro',
    ctaLink: '',
    popular: false,
    gradient: 'from-amber-500 to-orange-500',
    amount: 49.99,
  },
];

const B2B_PLANS = [
  {
    name: 'Team',
    subtitle: 'Up to 5 users',
    desc: 'Perfect for small schools & tutors',
    monthlyPrice: 49,
    yearlyPrice: 39,
    features: [
      'Up to 5 team members',
      'Group dashboard & analytics',
      'Export all student results as CSV',
      'Shared question bank access',
      'Email support',
    ],
    bestFor: 'Small schools, tutors, study groups',
    cta: 'Start Team Trial',
    icon: <Users className="h-5 w-5" />,
    gradient: 'from-purple-500 to-indigo-500',
  },
  {
    name: 'Business',
    subtitle: 'Up to 25 users',
    desc: 'For language schools & test centers',
    monthlyPrice: 199,
    yearlyPrice: 159,
    features: [
      'Up to 25 team members',
      'White-label certificates (your logo)',
      'API access for results',
      'Custom question bank upload',
      'Bulk user import via CSV',
      'Priority support',
    ],
    bestFor: 'Language schools, test prep centers',
    cta: 'Start Business Trial',
    icon: <Building2 className="h-5 w-5" />,
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    name: 'Enterprise',
    subtitle: 'Unlimited users',
    desc: 'For universities, corporations & government',
    monthlyPrice: null,
    yearlyPrice: null,
    features: [
      'Unlimited users & assessments',
      'SSO (Google, Microsoft, Okta)',
      'Dedicated account manager',
      'SLA guarantee',
      'On-premise or dedicated cloud',
      'Custom feature development',
    ],
    bestFor: 'Universities, corporations, government',
    cta: 'Contact Sales',
    icon: <Globe className="h-5 w-5" />,
    gradient: 'from-cyan-500 to-blue-500',
  },
];

const FAQ_ITEMS = [
  {
    q: 'What is your refund policy?',
    a: 'We offer a full refund within 14 days of purchase if you have not completed any assessments. If you have completed an assessment but are unsatisfied with the experience, please contact our support team and we will work with you to find a fair resolution. PayPal also provides buyer protection for your peace of mind.',
  },
  {
    q: 'How long are test credits valid?',
    a: 'Test credits never expire. Once you purchase a plan, your test credits remain in your account indefinitely. You can take assessments at your own pace without worrying about losing access. This applies to all paid plans including Single Test, Premium Pack, and Pro Pack.',
  },
  {
    q: 'Are group discounts available?',
    a: 'Yes! Our Team and Business plans offer significant per-user savings compared to individual plans. For larger organizations, our Enterprise plan includes volume discounts and custom pricing tailored to your needs. Contact our sales team for a personalized quote.',
  },
  {
    q: 'Can I upgrade my plan later?',
    a: 'Absolutely. You can upgrade from any plan at any time. When upgrading, you will only pay the difference between your current plan and the new one. Your existing test credits and progress data will be preserved and carried over to your upgraded plan seamlessly.',
  },
  {
    q: 'Is my payment information secure?',
    a: 'All transactions are processed through PayPal, which uses industry-leading encryption and fraud prevention systems. Your payment details are never stored on our servers. We also use TLS encryption for all data transmission, ensuring your information is protected end-to-end.',
  },
  {
    q: 'What happens after I complete an assessment?',
    a: 'Immediately after completing an assessment, you will receive your CEFR level (A1-C2), detailed skill breakdown scores for all six competencies, AI-powered feedback with specific improvement suggestions, and a downloadable PDF certificate with a QR verification code. You can share your results with employers or institutions right away.',
  },
];

/* ======================================================
   MAIN PRICING PAGE
   ====================================================== */
export default function PricingPage() {
  const { isAuthenticated, accessToken, user } = useAuthStore();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  /* Use false for isAuthenticated until client mounts to avoid hydration mismatch */
  const isAuth = mounted && isAuthenticated;

  return (
    <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
      <Navbar />

      {/* ===== HERO SECTION ===== */}
      <section className="relative dark-section hero-pattern noise-overlay overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb orb-purple w-[400px] h-[400px] -top-20 -right-20 animate-float-slow" />
          <div className="orb orb-pink w-[300px] h-[300px] bottom-0 left-1/4 animate-float-reverse" />
          <div className="orb orb-blue w-[250px] h-[250px] top-1/2 right-1/3 animate-float" />
        </div>

        <div className="container relative mx-auto px-4 py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full glass-light px-5 py-2 mb-6 animate-border-glow">
              <Sparkles className="h-4 w-4 text-purple-300" />
              <span className="text-sm text-purple-200 font-medium">Simple Pricing</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white">
              Choose Your <span className="gradient-text">Perfect Plan</span>
            </h1>
            <p className="mt-4 text-lg text-white/50 max-w-2xl mx-auto">
              Start free and upgrade as you grow. All plans include our AI-powered scoring engine.
            </p>
            <p className="mt-2 text-sm text-white/30">All prices in USD</p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0F0A1E] to-transparent" />
      </section>

      {/* ===== INDIVIDUAL PRICING CARDS ===== */}
      <section className="relative py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 max-w-7xl mx-auto md:grid-cols-2 lg:grid-cols-4">

            {/* Free Plan */}
            <AnimatedSection delay={100}>
              <div className="glass-card p-7 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white">
                    <Zap className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Free</h3>
                </div>
                <p className="text-xs text-white/40 mb-5">Perfect for getting started</p>
                <div className="mb-5">
                  <span className="text-2xl sm:text-4xl font-bold text-white">$0</span>
                </div>
                <div className="section-divider mb-5" />
                <ul className="space-y-2.5 mb-7 flex-1">
                  {INDIVIDUAL_PLANS[0].features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-white/30 mt-0.5 shrink-0" />
                      <span className="text-white/60">{feature}</span>
                    </li>
                  ))}
                </ul>
                {!isAuth ? (
                  <Link href="/register" className="block">
                    <button className="w-full rounded-xl py-3 glass-button text-white font-medium cursor-pointer">
                      Start Free
                    </button>
                  </Link>
                ) : (
                  <button className="w-full rounded-xl py-3 bg-white/5 text-white/30 font-medium cursor-not-allowed" disabled>
                    Current Plan
                  </button>
                )}
              </div>
            </AnimatedSection>

            {/* Single Test */}
            <AnimatedSection delay={200}>
              <div className="glass-card p-7 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/20">
                    <BadgeCheck className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Single Test</h3>
                </div>
                <p className="text-xs text-white/40 mb-5">Full assessment with detailed report</p>
                <div className="mb-5">
                  <span className="text-2xl sm:text-4xl font-bold gradient-text-static">$12.99</span>
                  <span className="text-white/40 ml-1 text-sm">/ one-time</span>
                </div>
                <div className="section-divider mb-5" />
                <ul className="space-y-2.5 mb-7 flex-1">
                  {INDIVIDUAL_PLANS[1].features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                      <span className="text-white/65">{feature}</span>
                    </li>
                  ))}
                </ul>
                {isAuth ? (
                  user?.plan === 'premium' ? (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                      <span className="text-xs font-medium text-green-400">You already have Premium!</span>
                    </div>
                  ) : (
                    <PayPalCheckoutButton accessToken={accessToken} amount={12.99} description="Single Test" />
                  )
                ) : (
                  <Link href="/login" className="block">
                    <button className="w-full flex items-center justify-center gap-2 rounded-xl py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-blue-500/20 cursor-pointer">
                      <CreditCard className="h-4 w-4" />
                      Log in to Purchase
                    </button>
                  </Link>
                )}
              </div>
            </AnimatedSection>

            {/* Premium Pack — Most Popular */}
            <AnimatedSection delay={300}>
              <div className="relative animate-pulse-glow rounded-2xl">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-purple-500/60 via-pink-500/40 to-purple-500/60 p-[1px]" />
                <div className="relative glass-card p-7 h-full flex flex-col border-transparent">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-1 text-xs font-semibold text-white shadow-lg shadow-purple-500/25">
                      <Star className="h-3 w-3" />
                      Most Popular
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mb-1">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25">
                      <Crown className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Premium Pack</h3>
                  </div>
                  <p className="text-xs text-white/40 mb-5">Best value for serious learners</p>
                  <div className="mb-5">
                    <span className="text-2xl sm:text-4xl font-bold gradient-text-static">$29.99</span>
                    <span className="text-white/40 ml-1 text-sm">/ 3 tests</span>
                  </div>
                  <div className="section-divider mb-5" />
                  <ul className="space-y-2.5 mb-7 flex-1">
                    {INDIVIDUAL_PLANS[2].features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-purple-400 mt-0.5 shrink-0" />
                        <span className="text-white/70">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {isAuth ? (
                    user?.plan === 'premium' ? (
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                        <span className="text-xs font-medium text-green-400">You already have Premium!</span>
                      </div>
                    ) : (
                      <PayPalCheckoutButton accessToken={accessToken} amount={29.99} description="Premium Pack (3 tests)" />
                    )
                  ) : (
                    <Link href="/login" className="block">
                      <button className="w-full flex items-center justify-center gap-2 rounded-xl py-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-purple-500/25 cursor-pointer">
                        <CreditCard className="h-4 w-4" />
                        Log in to Purchase
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </AnimatedSection>

            {/* Pro Pack */}
            <AnimatedSection delay={400}>
              <div className="relative rounded-2xl">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-amber-500/40 via-orange-500/30 to-amber-500/40 p-[1px]" />
                <div className="relative glass-card p-7 h-full flex flex-col border-transparent">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20">
                      <Rocket className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Pro Pack</h3>
                  </div>
                  <p className="text-xs text-white/40 mb-5">Complete learning solution</p>
                  <div className="mb-5">
                    <span className="text-2xl sm:text-4xl font-bold gradient-text-static">$49.99</span>
                    <span className="text-white/40 ml-1 text-sm">/ 6 tests</span>
                  </div>
                  <div className="section-divider mb-5" />
                  <ul className="space-y-2.5 mb-7 flex-1">
                    {INDIVIDUAL_PLANS[3].features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                        <span className="text-white/65">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {isAuth ? (
                    user?.plan === 'premium' ? (
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                        <span className="text-xs font-medium text-green-400">You already have Premium!</span>
                      </div>
                    ) : (
                      <PayPalCheckoutButton accessToken={accessToken} amount={49.99} description="Pro Pack (6 tests)" />
                    )
                  ) : (
                    <Link href="/login" className="block">
                      <button className="w-full flex items-center justify-center gap-2 rounded-xl py-3 bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-amber-500/20 cursor-pointer">
                        <CreditCard className="h-4 w-4" />
                        Log in to Purchase
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </AnimatedSection>

          </div>

          {/* Secure payment badge */}
          <div className="mt-10 text-center">
            <div className="inline-flex items-center gap-2 glass px-5 py-2.5 rounded-full">
              <Lock className="h-4 w-4 text-green-400" />
              <span className="text-sm text-white/50">Secure payment powered by PayPal</span>
              <span className="text-white/20">·</span>
              <span className="text-sm text-white/40">All prices in USD</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== B2B SECTION ===== */}
      <section className="relative py-20 md:py-28 dark-section-alt hero-pattern noise-overlay">
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb orb-purple w-[400px] h-[400px] top-0 right-1/4 animate-float-slow" />
          <div className="orb orb-blue w-[300px] h-[300px] bottom-0 left-1/4 animate-float-reverse" />
        </div>

        <div className="container relative mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                <Building2 className="h-3.5 w-3.5 text-purple-400" />
                <span className="text-xs text-purple-300 font-medium uppercase tracking-wider">For Organizations</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Scale English Testing <span className="gradient-text-static">Across Your Team</span>
              </h2>
              <p className="mt-4 text-white/50 max-w-2xl mx-auto text-base">
                Purpose-built plans for schools, businesses, and institutions — with the tools your team actually needs.
              </p>

              {/* Billing Toggle */}
              <div className="mt-8 inline-flex items-center gap-3 glass-light rounded-full px-2 py-1.5">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
                    billingCycle === 'monthly'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/25'
                      : 'text-white/50 hover:text-white/70'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
                    billingCycle === 'yearly'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/25'
                      : 'text-white/50 hover:text-white/70'
                  }`}
                >
                  Yearly
                  <span className="ml-1.5 text-[10px] font-semibold text-green-300 bg-green-500/20 px-1.5 py-0.5 rounded-full">
                    Save 20%
                  </span>
                </button>
              </div>
            </div>
          </AnimatedSection>

          <div className="grid gap-8 max-w-5xl mx-auto md:grid-cols-3">
            {B2B_PLANS.map((plan, index) => (
              <AnimatedSection key={plan.name} delay={index * 150}>
                <div className="glass-card p-7 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-1">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${plan.gradient} text-white shadow-lg`}>
                      {plan.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                      <p className="text-xs text-white/40">{plan.subtitle}</p>
                    </div>
                  </div>
                  <p className="text-xs text-white/35 mt-1 mb-5">{plan.desc}</p>

                  <div className="mb-5">
                    {plan.monthlyPrice ? (
                      <>
                        <span className="text-2xl sm:text-4xl font-bold text-white">
                          ${billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                        </span>
                        <span className="text-white/40 ml-1 text-sm">/month</span>
                        {billingCycle === 'yearly' && (
                          <p className="text-xs text-green-400 mt-1">
                            Billed ${plan.yearlyPrice * 12}/year — Save ${(plan.monthlyPrice - plan.yearlyPrice) * 12}/year
                          </p>
                        )}
                      </>
                    ) : (
                      <>
                        <span className="text-2xl sm:text-3xl font-bold text-white">Custom</span>
                      </>
                    )}
                  </div>

                  <div className="section-divider mb-5" />
                  <ul className="space-y-2.5 mb-5 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-purple-400 mt-0.5 shrink-0" />
                        <span className="text-white/60">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-white/30 mb-5">
                    Best for: {plan.bestFor}
                  </p>

                  {plan.name === 'Enterprise' ? (
                    <Link href="/contact" className="block">
                      <button className="w-full flex items-center justify-center gap-2 rounded-xl py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-cyan-500/20 cursor-pointer">
                        <Phone className="h-4 w-4" />
                        Contact Sales
                      </button>
                    </Link>
                  ) : (
                    <Link href="/contact" className="block">
                      <button className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 bg-gradient-to-r ${plan.gradient} hover:opacity-90 text-white font-semibold text-sm transition-all duration-300 shadow-lg cursor-pointer`}>
                        {plan.cta}
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </Link>
                  )}
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* B2B links */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-4">
              <Link href="/contact" className="text-sm text-purple-300 hover:text-purple-200 transition-colors">
                Learn more about Team & Business plans
              </Link>
              <span className="text-white/20">·</span>
              <Link href="/contact" className="text-sm text-purple-300 hover:text-purple-200 transition-colors">
                Enterprise solutions
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ SECTION ===== */}
      <section className="relative py-20 bg-[#0F0A1E]">
        <div className="absolute inset-0 hero-pattern pointer-events-none" />
        <div className="container relative mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                <HelpCircle className="h-3.5 w-3.5 text-purple-400" />
                <span className="text-xs text-purple-300 font-medium uppercase tracking-wider">FAQ</span>
              </div>
              <h2 className="text-3xl font-bold text-white">
                Frequently Asked <span className="gradient-text-static">Questions</span>
              </h2>
            </div>
          </AnimatedSection>

          <div className="max-w-2xl mx-auto space-y-3">
            {FAQ_ITEMS.map((faq, index) => (
              <AnimatedSection key={index} delay={index * 80}>
                <FAQItem q={faq.q} a={faq.a} />
              </AnimatedSection>
            ))}
          </div>

          {/* Contact CTA */}
          <AnimatedSection delay={500}>
            <div className="mt-14 text-center">
              <div className="glass-card-neon p-8 max-w-lg mx-auto light-streak">
                <HelpCircle className="h-8 w-8 text-purple-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">Have questions about which plan is right for you?</h3>
                <p className="text-sm text-white/40 mb-5">Our team is here to help you find the perfect fit.</p>
                <Link href="/contact">
                  <button className="inline-flex items-center gap-2 rounded-xl px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-purple-500/25 cursor-pointer">
                    Contact Us
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </div>
  );
}
