import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Navbar } from '@/components/navbar';
import {
  Sparkles, Award, Clock, BarChart3, Shield, Globe,
  CheckCircle2, QrCode, Headphones, Mic, PenTool,
  ArrowRight, Zap, Star, BookOpen, Users, TrendingUp,
  FileCheck, AudioWaveform, Activity, Brain,
  MessageSquareText, Cpu, ClipboardCheck,
  Play, Volume2, ChevronDown, ChevronRight,
  Building2, CreditCard, Mail, Phone, MapPin,
  Twitter, Linkedin, Github, HelpCircle,
  Circle, CircleDot, Settings
} from 'lucide-react';
import { AnimatedSection } from '@/components/home/animated-section';
import { HeroCTA } from '@/components/home/hero-cta';
import { FinalCTAButtons } from '@/components/home/final-cta-buttons';
import { FAQItem } from '@/components/home/faq-item';
import { PricingTracker } from '@/components/home/pricing-tracker';
import { LazySection } from '@/components/lazy-section';

// Client-side dynamic imports (ssr:false requires 'use client' boundary)
import {
  AnimatedCEFRBadge,
  AnimatedPillars,
  TypewriterBadge,
  BackgroundOrbsDynamic,
  LiveVoiceDemo,
  InteractiveCEFRLevels,
} from '@/components/home/dynamic-imports';

// Lazy-load footer — below the fold, no ssr:false needed
const Footer = dynamic(
  () => import('@/components/footer').then(mod => ({ default: mod.Footer })),
  { loading: () => <div className="h-40" /> }
);

/* ======================================================
   6 DIMENSIONS OF ENGLISH PROFICIENCY SECTION
   ====================================================== */
const DIMENSIONS_DATA = [
  {
    icon: <BookOpen className="h-6 w-6" />,
    title: 'Reading',
    level: 'A1–C2',
    gradient: 'from-blue-500 to-blue-400',
    items: ['Main ideas and detailed comprehension', 'Understanding implicit meaning', 'Analyzing text structure', 'Vocabulary inference', 'Reading speed and accuracy'],
  },
  {
    icon: <PenTool className="h-6 w-6" />,
    title: 'Writing',
    level: 'A1–C2',
    gradient: 'from-blue-500 to-blue-600',
    items: ['Cohesion and coherence', 'Grammatical accuracy', 'Lexical resource', 'Task achievement', 'Writing mechanics'],
  },
  {
    icon: <Headphones className="h-6 w-6" />,
    title: 'Listening',
    level: 'A1–C2',
    gradient: 'from-amber-500 to-amber-400',
    items: ['Main ideas and details', 'Understanding speakers\' attitude', 'Following complex arguments', 'Multiple speaker comprehension', 'Accent familiarity'],
  },
  {
    icon: <Mic className="h-6 w-6" />,
    title: 'Speaking',
    level: 'A1–C2',
    gradient: 'from-amber-500 to-amber-400',
    items: ['Fluency and coherence', 'Lexical resource', 'Grammatical range', 'Pronunciation clarity', 'Interactive communication'],
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: 'Grammar',
    level: 'A1–C2',
    gradient: 'from-blue-500 to-blue-400',
    items: ['Sentence formation', 'Tense accuracy', 'Complex structures', 'Error patterns', 'Grammar application'],
  },
  {
    icon: <Award className="h-6 w-6" />,
    title: 'Vocabulary',
    level: 'A1–C2',
    gradient: 'from-blue-500 to-blue-600',
    items: ['Word range', 'Precision', 'Collocations', 'Register awareness', 'Topic-specific vocabulary'],
  },
];

/* ======================================================
   HOW IT WORKS SECTION
   ====================================================== */
const STEPS = [
  { number: '1', title: 'Create Account', desc: 'Sign up in seconds with just your email. No lengthy registration required.', icon: <Users className="h-6 w-6" /> },
  { number: '2', title: 'Take Assessment', desc: 'Complete the 6-skill test at your own pace. Each section takes about 10 minutes.', icon: <ClipboardCheck className="h-6 w-6" /> },
  { number: '3', title: 'Get AI Results', desc: 'Receive instant CEFR scores with detailed AI feedback on all 6 core skills.', icon: <Brain className="h-6 w-6" /> },
  { number: '4', title: 'Download Certificate', desc: 'Get your official CEFR certificate and detailed improvement report instantly.', icon: <FileCheck className="h-6 w-6" /> },
];

/* ======================================================
   PRICING SECTION — Individual Plans
   ====================================================== */
const INDIVIDUAL_PLANS = [
  {
    name: 'Free',
    desc: 'Perfect for getting started',
    price: '$0',
    priceNum: 0,
    features: ['1 comprehensive assessment', 'Basic CEFR level result', 'Skill breakdown scores', 'Watermarked certificate'],
    cta: 'Start Free',
    ctaLink: '/register',
    popular: false,
  },
  {
    name: 'Single Test',
    desc: 'Full assessment with detailed report',
    price: '$12.99',
    priceNum: 12.99,
    features: ['Complete 6-skill assessment', 'Detailed CEFR score', 'AI-powered feedback', 'Downloadable PDF certificate'],
    cta: 'Buy Test',
    ctaLink: '/courses',
    popular: false,
  },
  {
    name: 'Premium Pack',
    desc: '3 tests — best value for learners',
    price: '$29.99',
    priceNum: 29.99,
    features: ['3 full assessments', 'Progress tracking dashboard', 'Priority AI analysis', 'Unlimited certificate downloads', 'Email support'],
    cta: 'Get Premium',
    ctaLink: '/courses',
    popular: true,
  },
  {
    name: 'Pro Pack',
    desc: '6 tests — complete learning solution',
    price: '$49.99',
    priceNum: 49.99,
    features: ['6 assessments', 'Full analytics suite', 'Detailed skill improvement tips', 'Comparison with peers', 'Priority support'],
    cta: 'Go Pro',
    ctaLink: '/courses',
    popular: false,
  },
];

/* ======================================================
   ORGANIZATION PLANS
   ====================================================== */
const ORG_PLANS = [
  {
    tier: 'Team',
    desc: 'Up to 5 users',
    subdesc: 'Perfect for small schools & tutors',
    price: '$49',
    period: '/month',
    features: ['Up to 5 team members', 'Group dashboard & analytics', 'Export results as CSV', 'Shared question bank access', 'Email support'],
    bestFor: 'Small schools, tutors, study groups',
    cta: 'Start Team Trial',
    ctaLink: '/contact',
  },
  {
    tier: 'Business',
    desc: 'Up to 25 users',
    subdesc: 'For language schools & test centers',
    price: '$199',
    period: '/month',
    features: ['Up to 25 team members', 'White-label certificates', 'API access for results', 'Bulk user import via CSV', 'Priority support'],
    bestFor: 'Language schools, test prep centers',
    cta: 'Start Business Trial',
    ctaLink: '/contact',
    popular: true,
  },
  {
    tier: 'Enterprise',
    desc: 'Unlimited users',
    subdesc: 'For universities, corporations & government',
    price: 'Custom',
    period: '',
    features: ['Unlimited users & assessments', 'SSO (Google, Microsoft, Okta)', 'Dedicated account manager', 'SLA guarantee', 'On-premise or dedicated cloud'],
    bestFor: 'Universities, corporations, government',
    cta: 'Contact Sales',
    ctaLink: '/contact',
  },
];

/* ======================================================
   TESTIMONIALS
   ====================================================== */
const TESTIMONIALS = [
  {
    quote: 'CEFR Test helped me prepare for my university applications. The detailed feedback showed me exactly where to improve, and I jumped from A1 to B2 in just 3 months!',
    name: 'Sarah Chen',
    role: 'University Student',
    location: 'Hanoi',
    progress: 'A1 → B2',
    initials: 'S',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    quote: 'As a business professional, I needed to improve my English for presentations. The AI analysis identified my speaking patterns and gave me actionable tips that actually worked.',
    name: 'Marcus Rodriguez',
    role: 'Business Professional',
    location: 'Mexico City',
    progress: 'B1 → C1',
    initials: 'M',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    quote: 'I use CEFR Test with my students to track their progress. The CEFR alignment is accurate, and the comprehensive reports help me tailor my lessons effectively.',
    name: 'Yuki Tanaka',
    role: 'English Teacher',
    location: 'Tokyo',
    progress: 'B2 → C2',
    initials: 'Y',
    color: 'from-sky-500 to-blue-500',
  },
  {
    quote: 'We assessed over 800 students in a single semester. The bulk import and CSV export saved our department dozens of hours.',
    name: 'Dr. Laura Pham',
    role: 'Head of Language Dept, Hanoi University',
    location: 'Hanoi',
    progress: 'B2 → C1',
    initials: 'L',
    color: 'from-blue-500 to-indigo-500',
  },
];

/* ======================================================
   ENTERPRISE SECTION
   ====================================================== */
const ENTERPRISE_STATS = [
  { label: 'Most Common Level', value: 'B2+', icon: <BarChart3 className="h-5 w-5" /> },
  { label: 'Avg. Test Time', value: '30m', icon: <Clock className="h-5 w-5" /> },
  { label: 'Skills Assessed', value: '6', icon: <Brain className="h-5 w-5" /> },
  { label: 'Certificate Format', value: 'PDF', icon: <FileCheck className="h-5 w-5" /> },
  { label: 'Verification Code', value: 'QR', icon: <QrCode className="h-5 w-5" /> },
  { label: 'Scoring Engine', value: 'AI', icon: <Cpu className="h-5 w-5" /> },
];

const ENTERPRISE_TESTIMONIALS = [
  {
    quote: 'We assessed over 800 students in a single semester. The bulk import and CSV export saved our department dozens of hours.',
    name: 'Dr. Laura Pham',
    role: 'Head of Language Dept, Hanoi University',
    initials: 'DL',
    color: 'from-sky-500 to-blue-500',
  },
  {
    quote: 'White-label certificates with our academy logo made a huge difference. Our students trust the result because it feels professional.',
    name: 'Ahmed Malik',
    role: 'CEO, ProEnglish Academy',
    initials: 'AM',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    quote: 'The API integration let us automatically sync scores into our HR system. The Enterprise tier paid for itself in the first month.',
    name: 'Sofia Tanner',
    role: 'L&D Manager, Nexura Corp',
    initials: 'ST',
    color: 'from-indigo-500 to-blue-600',
  },
];

/* ======================================================
   FAQ SECTION
   ====================================================== */
const FAQ_DATA = [
  {
    question: 'How does the AI scoring work?',
    answer: 'Our AI scoring engine uses advanced natural language processing and machine learning models trained on thousands of CEFR-graded responses. For speaking assessments, it analyzes pronunciation, fluency, vocabulary range, and grammatical accuracy in real-time. For writing, it evaluates coherence, lexical resource, and task achievement. The system provides consistent, objective scoring aligned with CEFR descriptors.',
  },
  {
    question: 'Is the certificate officially recognized?',
    answer: 'Our certificates are aligned with the Common European Framework of Reference (CEFR), which is the international standard for language proficiency. While not issued by a government body, our certificates include QR verification codes that allow employers and institutions to validate results online. Many universities, employers, and immigration authorities accept CEFR-aligned assessments as evidence of language proficiency.',
  },
  {
    question: 'How long does the assessment take?',
    answer: 'The full assessment typically takes 30–45 minutes to complete. Each of the 6 skill sections takes approximately 5–10 minutes. You can pause and resume the test at any time — your progress is saved automatically. The speaking and listening sections require a microphone and speakers or headphones.',
  },
  {
    question: 'Can I retake the test?',
    answer: 'Yes! Free users get 1 assessment, Single Test purchasers get 1, Premium Pack users get 3, and Pro Pack users get 6 assessments. You can retake the test at any time if you have remaining credits. Additional credits can be purchased from your dashboard at any time.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'During our preview period, all features and assessments are completely free. No payment information is required — just sign up and start learning!',
  },
  {
    question: 'Is my data secure?',
    answer: 'Absolutely. We use industry-standard encryption (TLS 1.3) for all data in transit and AES-256 encryption for data at rest. Your audio recordings are processed in real-time and deleted after scoring — we never store your voice data. Personal information is handled in compliance with GDPR and other privacy regulations. You can request data deletion at any time.',
  },
];

/* ======================================================
   MAIN PAGE — Server Component
   ====================================================== */
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
      <Navbar />

      <main>
      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden dark-section hero-pattern noise-overlay mesh-gradient">
        <BackgroundOrbsDynamic />

        <div className="container relative mx-auto px-4 py-20 md:py-28">
          <div className="mx-auto max-w-6xl">
            {/* Typewriter badge */}
            <TypewriterBadge />

            {/* Main headline */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1] animate-slide-up text-center">
              Master English with AI
            </h1>

            {/* Animated Three Pillars */}
            <div className="mt-4 flex justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <AnimatedPillars />
            </div>

            {/* Subheadline */}
            <p className="mt-6 text-lg md:text-xl text-white/60 leading-relaxed max-w-2xl mx-auto animate-fade-in delay-300 text-center">
              The all-in-one platform to assess your CEFR level, follow structured courses from A1 to C2, and practice with language partners worldwide — powered by AI at every step.
            </p>

            {/* CTA Buttons */}
            <HeroCTA />

            {/* Animated CEFR Badge */}
            <div className="mt-10 flex justify-center animate-scale-in delay-400">
              <AnimatedCEFRBadge />
            </div>

            {/* Stats bar — 4 glass cards */}
            <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {[
                { value: 'A1–C2', label: 'All CEFR Levels', icon: <Globe className="h-5 w-5" /> },
                { value: '6', label: 'Core Skills', icon: <Brain className="h-5 w-5" /> },
                { value: 'AI', label: 'Powered Scoring', icon: <Cpu className="h-5 w-5" /> },
                { value: 'Free', label: 'To Get Started', icon: <Zap className="h-5 w-5" /> },
              ].map((stat, i) => (
                <AnimatedSection key={stat.label} delay={i * 100}>
                  <div className="glass-card p-3 sm:p-5 text-center group">
                    <div className="flex justify-center mb-2 text-blue-400 group-hover:text-blue-300 transition-colors">
                      {stat.icon}
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-xs text-white/50">{stat.label}</div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0F0A1E] to-transparent" />
      </section>

      {/* ===== LIVE VOICE DEMO ===== */}
      <section className="relative py-20 md:py-28 speaking-bg-5 overflow-hidden">
        <LiveVoiceDemo />
      </section>

      {/* ===== 6 DIMENSIONS OF ENGLISH PROFICIENCY ===== */}
      <section className="relative py-20 md:py-28 bg-[#0F0A1E] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb orb-blue w-[400px] h-[400px] top-1/4 right-0 animate-float-slow" />
        </div>

        <div className="container relative mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 px-4 py-1.5 mb-4">
                <BookOpen className="h-3.5 w-3.5 text-blue-400" />
                <span className="text-xs text-blue-300 font-medium uppercase tracking-wider">Comprehensive Coverage</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white">
                6 Dimensions of English Proficiency
              </h2>
              <p className="mt-4 text-white/50 max-w-2xl mx-auto text-base">
                Our AI evaluates every aspect of your English proficiency with granular precision.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {DIMENSIONS_DATA.map((skill, index) => (
              <AnimatedSection key={skill.title} delay={index * 100}>
                <div className="glass-card p-6 h-full group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${skill.gradient} text-white shadow-lg shadow-black/20 transition-transform duration-300 group-hover:scale-110`}>
                      {skill.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{skill.title}</h3>
                      <span className="text-xs text-white/40">{skill.level}</span>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {skill.items.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <CheckCircle2 className={`h-3.5 w-3.5 shrink-0`} style={{color: skill.title === 'Grammar' ? '#3b82f6' : skill.title === 'Vocabulary' ? '#7c5cff' : skill.title === 'Reading' ? '#3b82f6' : skill.title === 'Listening' ? '#f59e0b' : skill.title === 'Speaking' ? '#f59e0b' : '#8b5cf6'}} />
                        <span className="text-sm text-white/60">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== INTERACTIVE CEFR LEVELS ===== */}
      <section id="cefr-levels" className="relative py-20 md:py-28 dark-section-alt hero-pattern noise-overlay">
        <InteractiveCEFRLevels />
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="relative py-20 md:py-28 bg-[#0F0A1E] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb orb-cyan w-[400px] h-[400px] bottom-0 left-0 animate-float-slow" />
        </div>

        <div className="container relative mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 px-4 py-1.5 mb-4">
                <ClipboardCheck className="h-3.5 w-3.5 text-blue-400" />
                <span className="text-xs text-blue-300 font-medium uppercase tracking-wider">Simple Process</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white">
                How It Works
              </h2>
              <p className="mt-4 text-white/50 max-w-2xl mx-auto text-base">
                Get your CEFR score in just 4 simple steps.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
            {STEPS.map((step, index) => (
              <AnimatedSection key={step.number} delay={index * 150}>
                <div className="glass-card p-6 text-center h-full group">
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/20 text-blue-400 group-hover:border-blue-500/40 transition-all duration-300">
                        {step.icon}
                      </div>
                      <div className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-white text-xs font-bold shadow-lg">
                        {step.number}
                      </div>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{step.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING — Individual ===== */}
      <LazySection placeholderHeight={600} className="contents">
      <PricingTracker>
        <div className="relative py-20 md:py-28 dark-section-alt hero-pattern noise-overlay" id="pricing">
          <div className="container relative mx-auto px-4">
            <AnimatedSection>
              <div className="text-center mb-14">
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 px-4 py-1.5 mb-4">
                  <CreditCard className="h-3.5 w-3.5 text-blue-400" />
                  <span className="text-xs text-blue-300 font-medium uppercase tracking-wider">Get Started</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-white">
                  Start Learning Today
                </h2>
                <p className="mt-4 text-white/50 max-w-2xl mx-auto text-base">
                  Start free and upgrade as you grow. All plans include our AI-powered scoring engine.
                </p>
              </div>
            </AnimatedSection>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
              {INDIVIDUAL_PLANS.map((plan, index) => (
                <AnimatedSection key={plan.name} delay={index * 100}>
                  <div className={`relative glass-card p-6 h-full flex flex-col ${plan.popular ? 'ring-2 ring-blue-500/50' : ''}`}>
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                          Most Popular
                        </span>
                      </div>
                    )}
                    <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                    <p className="text-xs text-white/40 mt-1">{plan.desc}</p>
                    <div className="mt-4 mb-6">
                      <span className="text-2xl sm:text-3xl font-bold text-white">{plan.price}</span>
                    </div>
                    <ul className="space-y-2.5 flex-1">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                          <span className="text-sm text-white/60">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href={plan.ctaLink} className="mt-6 block">
                      <button className={`w-full py-2.5 rounded-xl font-medium text-sm transition-all duration-300 cursor-pointer ${
                        plan.popular
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-lg shadow-blue-500/25 hover:-translate-y-0.5'
                          : plan.price === '$0'
                            ? 'glass-button text-white'
                            : 'glass-button text-white hover:bg-blue-500/20'
                        }`}>
                        {plan.cta}
                      </button>
                    </Link>
                  </div>
                </AnimatedSection>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link href="/courses" className="group inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors">
                Browse Courses
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </PricingTracker>
      </LazySection>

      {/* ===== FOR ORGANIZATIONS ===== */}
      <LazySection placeholderHeight={500} className="contents">
      <section className="relative py-20 md:py-28 bg-[#0F0A1E] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb orb-blue w-[500px] h-[500px] top-0 right-0 animate-float-slow" />
          <div className="orb orb-cyan w-[300px] h-[300px] bottom-0 left-1/4 animate-float-reverse" />
        </div>

        <div className="container relative mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 px-4 py-1.5 mb-4">
                <Building2 className="h-3.5 w-3.5 text-blue-400" />
                <span className="text-xs text-blue-300 font-medium uppercase tracking-wider">For Organizations</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white">
                Scale English Testing
                <br />
                Across Your Team
              </h2>
              <p className="mt-4 text-white/50 max-w-2xl mx-auto text-base">
                Purpose-built plans for schools, businesses, and institutions — with the tools your team actually needs.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {ORG_PLANS.map((plan, index) => (
              <AnimatedSection key={plan.tier} delay={index * 150}>
                <div className={`relative glass-card p-6 h-full flex flex-col ${plan.popular ? 'ring-2 ring-blue-500/50' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-white">{plan.tier}</h3>
                  <p className="text-xs text-white/40 mt-1">{plan.desc}</p>
                  <p className="text-xs text-white/30 mt-0.5">{plan.subdesc}</p>
                  <div className="mt-4 mb-6">
                    <span className="text-2xl sm:text-3xl font-bold text-white">{plan.price}</span>
                    {plan.period && <span className="text-sm text-white/40">{plan.period}</span>}
                  </div>
                  <ul className="space-y-2.5 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                        <span className="text-sm text-white/60">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-white/30 mt-4">Best for: {plan.bestFor}</p>
                  <Link href={plan.ctaLink} className="mt-4 block">
                    <button className={`w-full py-2.5 rounded-xl font-medium text-sm transition-all duration-300 cursor-pointer ${
                      plan.popular
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-lg shadow-blue-500/25 hover:-translate-y-0.5'
                        : 'glass-button text-white'
                    }`}>
                      {plan.cta}
                    </button>
                  </Link>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="relative py-20 md:py-28 dark-section-alt overflow-hidden">
        <div className="container relative mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 px-4 py-1.5 mb-4">
                <Star className="h-3.5 w-3.5 text-blue-400" />
                <span className="text-xs text-blue-300 font-medium uppercase tracking-wider">Success Stories</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white">
                Trusted by Thousands of Learners
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            {TESTIMONIALS.map((testimonial, index) => (
              <AnimatedSection key={testimonial.name} delay={index * 100}>
                <div className="glass-card p-6 h-full">
                  <p className="text-sm text-white/70 leading-relaxed mb-4 italic">&ldquo;{testimonial.quote}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${testimonial.color} text-white font-bold text-sm shadow-lg`}>
                      {testimonial.initials}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">{testimonial.name}</p>
                      <p className="text-xs text-white/40">{testimonial.role}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-white/30">{testimonial.location}</p>
                      <span className="text-xs font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">{testimonial.progress}</span>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ENTERPRISE SECTION ===== */}
      <section className="relative py-20 md:py-28 bg-[#0F0A1E] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb orb-blue w-[500px] h-[500px] top-0 -left-24 animate-float-slow" />
        </div>

        <div className="container relative mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 px-4 py-1.5 mb-4">
                <Building2 className="h-3.5 w-3.5 text-blue-400" />
                <span className="text-xs text-blue-300 font-medium uppercase tracking-wider">Enterprise</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white">
                Built for Teams and Organisations
              </h2>
              <p className="mt-4 text-white/50 max-w-2xl mx-auto text-base">
                From universities to corporate training — CEFR Test scales to meet your team&apos;s English assessment needs.
              </p>
            </div>
          </AnimatedSection>

          {/* Stats grid */}
          <AnimatedSection delay={100}>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto mb-14">
              {ENTERPRISE_STATS.map((stat, i) => (
                <div key={stat.label} className="glass-card p-4 text-center">
                  <div className="flex justify-center mb-2 text-blue-400">{stat.icon}</div>
                  <div className="text-lg font-bold text-white">{stat.value}</div>
                  <div className="text-[10px] text-white/40">{stat.label}</div>
                </div>
              ))}
            </div>
          </AnimatedSection>

          {/* Enterprise testimonials */}
          <div className="max-w-4xl mx-auto space-y-6">
            {ENTERPRISE_TESTIMONIALS.map((testimonial, index) => (
              <AnimatedSection key={testimonial.name} delay={index * 100}>
                <div className="glass-card p-6">
                  <div className="flex items-start gap-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${testimonial.color} text-white font-bold text-sm shadow-lg`}>
                      {testimonial.initials}
                    </div>
                    <div>
                      <p className="text-sm text-white/70 leading-relaxed italic mb-3">&ldquo;{testimonial.quote}&rdquo;</p>
                      <div>
                        <p className="text-sm font-semibold text-white">{testimonial.name}</p>
                        <p className="text-xs text-white/40">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
      </LazySection>

      {/* ===== FAQ SECTION ===== */}
      <LazySection placeholderHeight={500} className="contents">
      <section className="relative py-20 md:py-28 dark-section-alt overflow-hidden">
        <div className="container relative mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 px-4 py-1.5 mb-4">
                <HelpCircle className="h-3.5 w-3.5 text-blue-400" />
                <span className="text-xs text-blue-300 font-medium uppercase tracking-wider">FAQ</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white">
                Frequently Asked Questions
              </h2>
            </div>
          </AnimatedSection>

          <div className="max-w-3xl mx-auto space-y-4">
            {FAQ_DATA.map((faq, index) => (
              <AnimatedSection key={faq.question} delay={index * 50}>
                <FAQItem question={faq.question} answer={faq.answer} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA SECTION ===== */}
      <section className="relative py-20 md:py-28 bg-[#0F0A1E] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb orb-blue w-[600px] h-[600px] top-1/4 left-1/4 animate-float-slow" />
          <div className="orb orb-cyan w-[400px] h-[400px] bottom-1/4 right-1/4 animate-float-reverse" />
        </div>

        <div className="container relative mx-auto px-4">
          <AnimatedSection>
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                Ready to Transform
                <br />
                <span className="text-blue-400">Your English?</span>
              </h2>
              <p className="mt-6 text-lg text-white/50 leading-relaxed">
                Get your official CEFR level in minutes — free to start, with detailed AI feedback on all 6 core skills.
              </p>
              <FinalCTAButtons />
            </div>
          </AnimatedSection>
        </div>
      </section>
      </LazySection>

      {/* ===== FOOTER ===== */}
      </main>
      <Footer />
    </div>
  );
}
