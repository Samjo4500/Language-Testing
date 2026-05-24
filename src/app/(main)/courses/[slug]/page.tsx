'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useHydrated } from '@/hooks/use-hydrated';
import { useAuthStore } from '@/lib/auth-store';
import { COURSE_TIERS, type CourseTier } from '@/lib/courses';
import { trackPurchase } from '@/lib/analytics';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import {
  CheckCircle2,
  Loader2,
  CreditCard,
  Star,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Clock,
  BookOpen,
  Layers,
  Play,
  Shield,
  Award,
  Users,
  Globe,
  Headphones,
  MessageSquare,
  FileText,
  Mic,
  Lock,
  Sprout,
  TrendingUp,
  Crown,
  Zap,
  X,
} from 'lucide-react';

/* ============================================================
   ICON MAP
   ============================================================ */
const ICON_MAP: Record<string, React.ReactNode> = {
  Sprout: <Sprout className="h-6 w-6" />,
  TrendingUp: <TrendingUp className="h-6 w-6" />,
  Crown: <Crown className="h-6 w-6" />,
};

/* ============================================================
   COLOR CONFIG PER TIER
   ============================================================ */
const TIER_COLORS: Record<string, {
  gradient: string;
  orb1: string;
  orb2: string;
  text: string;
  badge: string;
  checkColor: string;
  shadowColor: string;
  buttonGradient: string;
  statBg: string;
  ringColor: string;
}> = {
  beginner: {
    gradient: 'from-sky-400 to-blue-500',
    orb1: 'orb-blue',
    orb2: 'orb-cyan',
    text: 'text-sky-400',
    badge: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    checkColor: 'text-sky-400',
    shadowColor: 'shadow-sky-500/20',
    buttonGradient: 'from-sky-500 to-blue-500',
    statBg: 'bg-sky-500/10 border-sky-500/20',
    ringColor: 'ring-sky-500/30',
  },
  intermediate: {
    gradient: 'from-blue-500 to-indigo-600',
    orb1: 'orb-blue',
    orb2: 'orb-blue',
    text: 'text-blue-400',
    badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    checkColor: 'text-blue-400',
    shadowColor: 'shadow-blue-500/20',
    buttonGradient: 'from-blue-600 to-indigo-500',
    statBg: 'bg-blue-500/10 border-blue-500/20',
    ringColor: 'ring-blue-500/30',
  },
  advanced: {
    gradient: 'from-indigo-500 to-blue-700',
    orb1: 'orb-blue',
    orb2: 'orb-blue',
    text: 'text-indigo-400',
    badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    checkColor: 'text-indigo-400',
    shadowColor: 'shadow-indigo-500/25',
    buttonGradient: 'from-indigo-600 to-blue-700',
    statBg: 'bg-indigo-500/10 border-indigo-500/20',
    ringColor: 'ring-indigo-500/30',
  },
};

/* ============================================================
   STATIC CURRICULUM DATA (fallback)
   ============================================================ */
const CURRICULUM_DATA: Record<string, Array<{
  title: string;
  lessons: Array<{ title: string; type: string; minutes: number }>;
}>> = {
  beginner: [
    {
      title: 'Module 1: Hello English! — Greetings & Introductions',
      lessons: [
        { title: 'Meeting New People', type: 'video', minutes: 15 },
        { title: 'Introducing Yourself', type: 'interactive', minutes: 20 },
        { title: 'Numbers & Alphabet', type: 'practice', minutes: 15 },
        { title: 'Listening: First Conversations', type: 'listening', minutes: 10 },
        { title: 'Quiz: Module 1 Review', type: 'quiz', minutes: 10 },
      ],
    },
    {
      title: 'Module 2: Daily Life — Routines & Activities',
      lessons: [
        { title: 'Daily Routines', type: 'video', minutes: 15 },
        { title: 'Telling Time & Dates', type: 'interactive', minutes: 20 },
        { title: 'Hobbies & Free Time', type: 'practice', minutes: 15 },
        { title: 'Listening: Everyday Situations', type: 'listening', minutes: 10 },
        { title: 'Quiz: Module 2 Review', type: 'quiz', minutes: 10 },
      ],
    },
    {
      title: 'Module 3: At Home — Family & Rooms',
      lessons: [
        { title: 'Family Members', type: 'video', minutes: 15 },
        { title: 'Rooms & Furniture', type: 'interactive', minutes: 20 },
        { title: 'Describing Your Home', type: 'practice', minutes: 15 },
        { title: 'Listening: At Home', type: 'listening', minutes: 10 },
        { title: 'Quiz: Module 3 Review', type: 'quiz', minutes: 10 },
      ],
    },
    {
      title: 'Module 4: Food & Drink — Ordering & Cooking',
      lessons: [
        { title: 'Food Vocabulary', type: 'video', minutes: 15 },
        { title: 'At a Restaurant', type: 'interactive', minutes: 20 },
        { title: 'Recipes & Instructions', type: 'practice', minutes: 15 },
        { title: 'Listening: Ordering Food', type: 'listening', minutes: 10 },
        { title: 'Quiz: Module 4 Review', type: 'quiz', minutes: 10 },
      ],
    },
    {
      title: 'Module 5: Shopping — Clothes & Money',
      lessons: [
        { title: 'Clothing & Colors', type: 'video', minutes: 15 },
        { title: 'Asking Prices & Sizes', type: 'interactive', minutes: 20 },
        { title: 'Making Purchases', type: 'practice', minutes: 15 },
        { title: 'Listening: At the Store', type: 'listening', minutes: 10 },
        { title: 'Quiz: Module 5 Review', type: 'quiz', minutes: 10 },
      ],
    },
    {
      title: 'Module 6: Getting Around — Directions & Transport',
      lessons: [
        { title: 'Modes of Transport', type: 'video', minutes: 15 },
        { title: 'Asking for Directions', type: 'interactive', minutes: 20 },
        { title: 'Reading Maps & Signs', type: 'practice', minutes: 15 },
        { title: 'Listening: On the Move', type: 'listening', minutes: 10 },
        { title: 'Quiz: Module 6 Review', type: 'quiz', minutes: 10 },
      ],
    },
    {
      title: 'Module 7: Health — Body & Doctor Visits',
      lessons: [
        { title: 'Body Parts & Feelings', type: 'video', minutes: 15 },
        { title: 'At the Doctor', type: 'interactive', minutes: 20 },
        { title: 'Healthy Habits', type: 'practice', minutes: 15 },
        { title: 'Listening: Health Advice', type: 'listening', minutes: 10 },
        { title: 'Quiz: Module 7 Review', type: 'quiz', minutes: 10 },
      ],
    },
    {
      title: 'Module 8: Review & Certificate Prep',
      lessons: [
        { title: 'Comprehensive Grammar Review', type: 'video', minutes: 20 },
        { title: 'Vocabulary Blitz (500+ Words)', type: 'interactive', minutes: 25 },
        { title: 'Listening Mastery Practice', type: 'listening', minutes: 15 },
        { title: 'Final Assessment Prep', type: 'practice', minutes: 20 },
        { title: 'Final Quiz: Course Completion', type: 'quiz', minutes: 15 },
      ],
    },
  ],
  intermediate: [
    {
      title: 'Module 1: Professional Communication — Email & Meetings',
      lessons: [
        { title: 'Writing Professional Emails', type: 'video', minutes: 20 },
        { title: 'Meeting Etiquette & Phrases', type: 'interactive', minutes: 25 },
        { title: 'Presenting Your Ideas', type: 'practice', minutes: 20 },
        { title: 'Listening: Business Conversations', type: 'listening', minutes: 15 },
        { title: 'Quiz: Module 1 Review', type: 'quiz', minutes: 10 },
      ],
    },
    {
      title: 'Module 2: Complex Grammar — Tenses & Conditionals',
      lessons: [
        { title: 'Perfect Tenses Deep Dive', type: 'video', minutes: 25 },
        { title: 'Conditionals & Hypotheticals', type: 'interactive', minutes: 25 },
        { title: 'Reported Speech', type: 'practice', minutes: 20 },
        { title: 'Listening: Grammar in Context', type: 'listening', minutes: 15 },
        { title: 'Quiz: Module 2 Review', type: 'quiz', minutes: 10 },
      ],
    },
    {
      title: 'Module 3: Academic English — Essays & Research',
      lessons: [
        { title: 'Essay Structure & Thesis', type: 'video', minutes: 25 },
        { title: 'Academic Vocabulary', type: 'interactive', minutes: 20 },
        { title: 'Citing & Referencing', type: 'practice', minutes: 20 },
        { title: 'Listening: Academic Lectures', type: 'listening', minutes: 15 },
        { title: 'Quiz: Module 3 Review', type: 'quiz', minutes: 10 },
      ],
    },
    {
      title: 'Module 4: Culture & Society — Discussions & Debates',
      lessons: [
        { title: 'Expressing Opinions', type: 'video', minutes: 20 },
        { title: 'Agreeing & Disagreeing Politely', type: 'interactive', minutes: 25 },
        { title: 'Cultural Idioms & Expressions', type: 'practice', minutes: 20 },
        { title: 'Listening: Panel Discussions', type: 'listening', minutes: 15 },
        { title: 'Quiz: Module 4 Review', type: 'quiz', minutes: 10 },
      ],
    },
    {
      title: 'Module 5: Travel & Global English',
      lessons: [
        { title: 'Airport & Hotel English', type: 'video', minutes: 20 },
        { title: 'Navigating Foreign Cities', type: 'interactive', minutes: 20 },
        { title: 'Cultural Sensitivity', type: 'practice', minutes: 15 },
        { title: 'Listening: Travel Stories', type: 'listening', minutes: 15 },
        { title: 'Quiz: Module 5 Review', type: 'quiz', minutes: 10 },
      ],
    },
    {
      title: 'Module 6: Storytelling & Narrative',
      lessons: [
        { title: 'Narrative Tenses', type: 'video', minutes: 20 },
        { title: 'Building a Compelling Story', type: 'interactive', minutes: 25 },
        { title: 'Descriptive Language', type: 'practice', minutes: 20 },
        { title: 'Listening: Audiobook Excerpts', type: 'listening', minutes: 15 },
        { title: 'Quiz: Module 6 Review', type: 'quiz', minutes: 10 },
      ],
    },
    {
      title: 'Module 7: Technology & Innovation',
      lessons: [
        { title: 'Tech Vocabulary & Jargon', type: 'video', minutes: 20 },
        { title: 'Explaining Processes', type: 'interactive', minutes: 25 },
        { title: 'Reading Tech Articles', type: 'practice', minutes: 20 },
        { title: 'Listening: Tech Podcasts', type: 'listening', minutes: 15 },
        { title: 'Quiz: Module 7 Review', type: 'quiz', minutes: 10 },
      ],
    },
    {
      title: 'Module 8: Media & Current Events',
      lessons: [
        { title: 'Reading News critically', type: 'video', minutes: 20 },
        { title: 'Analyzing Headlines', type: 'interactive', minutes: 20 },
        { title: 'Writing Summaries', type: 'practice', minutes: 20 },
        { title: 'Listening: News Broadcasts', type: 'listening', minutes: 15 },
        { title: 'Quiz: Module 8 Review', type: 'quiz', minutes: 10 },
      ],
    },
    {
      title: 'Module 9: Advanced Listening & Comprehension',
      lessons: [
        { title: 'Understanding Fast Speech', type: 'video', minutes: 20 },
        { title: 'Note-taking Strategies', type: 'interactive', minutes: 20 },
        { title: 'Inference & Implication', type: 'practice', minutes: 20 },
        { title: 'Listening: TED Talks', type: 'listening', minutes: 20 },
        { title: 'Quiz: Module 9 Review', type: 'quiz', minutes: 10 },
      ],
    },
    {
      title: 'Module 10: Review & Certificate Prep',
      lessons: [
        { title: 'Comprehensive Grammar Review', type: 'video', minutes: 25 },
        { title: 'Vocabulary & Idioms Blitz', type: 'interactive', minutes: 25 },
        { title: 'Writing Workshop', type: 'practice', minutes: 25 },
        { title: 'Listening Mastery Practice', type: 'listening', minutes: 20 },
        { title: 'Final Quiz: Course Completion', type: 'quiz', minutes: 15 },
      ],
    },
  ],
  advanced: [
    {
      title: 'Module 1: Rhetoric & Persuasion',
      lessons: [
        { title: 'Classical Rhetoric Foundations', type: 'video', minutes: 25 },
        { title: 'Ethos, Pathos, Logos in Practice', type: 'interactive', minutes: 30 },
        { title: 'Crafting Persuasive Arguments', type: 'practice', minutes: 25 },
        { title: 'Listening: Great Speeches', type: 'listening', minutes: 20 },
        { title: 'Quiz: Module 1 Review', type: 'quiz', minutes: 10 },
      ],
    },
    {
      title: 'Module 2: Literary English — Poetry & Prose',
      lessons: [
        { title: 'Analyzing Poetry', type: 'video', minutes: 25 },
        { title: 'Literary Devices & Techniques', type: 'interactive', minutes: 25 },
        { title: 'Close Reading Practice', type: 'practice', minutes: 25 },
        { title: 'Listening: Literature Readings', type: 'listening', minutes: 20 },
        { title: 'Quiz: Module 2 Review', type: 'quiz', minutes: 10 },
      ],
    },
    {
      title: 'Module 3: Scientific & Technical English',
      lessons: [
        { title: 'Scientific Writing Conventions', type: 'video', minutes: 25 },
        { title: 'Technical Reports & Papers', type: 'interactive', minutes: 25 },
        { title: 'Data Presentation Language', type: 'practice', minutes: 25 },
        { title: 'Listening: Research Presentations', type: 'listening', minutes: 20 },
        { title: 'Quiz: Module 3 Review', type: 'quiz', minutes: 10 },
      ],
    },
    {
      title: 'Module 4: Phonological Precision',
      lessons: [
        { title: 'Advanced Pronunciation Patterns', type: 'video', minutes: 25 },
        { title: 'Stress, Rhythm & Intonation', type: 'interactive', minutes: 30 },
        { title: 'Accent Modification Techniques', type: 'practice', minutes: 25 },
        { title: 'Listening: Accent Diversity', type: 'listening', minutes: 20 },
        { title: 'Quiz: Module 4 Review', type: 'quiz', minutes: 10 },
      ],
    },
    {
      title: 'Module 5: Diplomatic & Negotiation English',
      lessons: [
        { title: 'Diplomatic Language', type: 'video', minutes: 25 },
        { title: 'Negotiation Strategies', type: 'interactive', minutes: 25 },
        { title: 'Conflict Resolution Language', type: 'practice', minutes: 25 },
        { title: 'Listening: Diplomatic Dialogues', type: 'listening', minutes: 20 },
        { title: 'Quiz: Module 5 Review', type: 'quiz', minutes: 10 },
      ],
    },
    {
      title: 'Module 6: Advanced Academic Writing',
      lessons: [
        { title: 'Dissertation-Level Writing', type: 'video', minutes: 25 },
        { title: 'Critical Analysis Frameworks', type: 'interactive', minutes: 25 },
        { title: 'Publishing & Peer Review', type: 'practice', minutes: 25 },
        { title: 'Listening: Academic Defenses', type: 'listening', minutes: 20 },
        { title: 'Quiz: Module 6 Review', type: 'quiz', minutes: 10 },
      ],
    },
    {
      title: 'Module 7: Media & Journalism English',
      lessons: [
        { title: 'Investigative Writing', type: 'video', minutes: 25 },
        { title: 'Editorial & Opinion Pieces', type: 'interactive', minutes: 25 },
        { title: 'Media Ethics Language', type: 'practice', minutes: 20 },
        { title: 'Listening: Press Conferences', type: 'listening', minutes: 20 },
        { title: 'Quiz: Module 7 Review', type: 'quiz', minutes: 10 },
      ],
    },
    {
      title: 'Module 8: Philosophical & Abstract English',
      lessons: [
        { title: 'Philosophical Discourse', type: 'video', minutes: 25 },
        { title: 'Abstract Concept Expression', type: 'interactive', minutes: 25 },
        { title: 'Socratic Dialogue Practice', type: 'practice', minutes: 25 },
        { title: 'Listening: Philosophy Lectures', type: 'listening', minutes: 20 },
        { title: 'Quiz: Module 8 Review', type: 'quiz', minutes: 10 },
      ],
    },
    {
      title: 'Module 9: Creative & Expressive English',
      lessons: [
        { title: 'Creative Writing Workshop', type: 'video', minutes: 25 },
        { title: 'Humor & Wit in English', type: 'interactive', minutes: 25 },
        { title: 'Playwriting & Dialogue', type: 'practice', minutes: 25 },
        { title: 'Listening: Dramatic Performances', type: 'listening', minutes: 20 },
        { title: 'Quiz: Module 9 Review', type: 'quiz', minutes: 10 },
      ],
    },
    {
      title: 'Module 10: Mastery Review & Certificate Prep',
      lessons: [
        { title: 'C2-Level Grammar Mastery', type: 'video', minutes: 30 },
        { title: 'Comprehensive Vocabulary Challenge', type: 'interactive', minutes: 30 },
        { title: 'Multi-Skill Integration Exercise', type: 'practice', minutes: 30 },
        { title: 'Listening: Native-Speed Content', type: 'listening', minutes: 25 },
        { title: 'Final Quiz: Course Completion', type: 'quiz', minutes: 15 },
      ],
    },
  ],
};

/* ============================================================
   TESTIMONIALS
   ============================================================ */
const TESTIMONIALS: Record<string, Array<{
  name: string;
  location: string;
  text: string;
  rating: number;
  avatar: string;
}>> = {
  beginner: [
    { name: 'Maria S.', location: 'Spain', text: 'I started with zero English and now I can have basic conversations! The interactive lessons make learning fun and not intimidating at all.', rating: 5, avatar: 'M' },
    { name: 'Yuki T.', location: 'Japan', text: 'The AI voice exercises are incredible. I can practice listening anytime and the quizzes keep me motivated. Best beginner course I\'ve tried!', rating: 5, avatar: 'Y' },
    { name: 'Ahmed K.', location: 'Egypt', text: 'After completing this course, I passed my A2 certification on the first try. The structured approach really works.', rating: 5, avatar: 'A' },
  ],
  intermediate: [
    { name: 'Chen W.', location: 'China', text: 'This course took me from hesitant speaker to confident communicator. The business English modules helped me get a promotion!', rating: 5, avatar: 'C' },
    { name: 'Sofia R.', location: 'Brazil', text: 'The academic English introduction was exactly what I needed for my university application. The grammar mastery section is outstanding.', rating: 5, avatar: 'S' },
    { name: 'Lars P.', location: 'Germany', text: 'I tried many courses but this one finally helped me break through the intermediate plateau. The listening exercises with AI are game-changing.', rating: 5, avatar: 'L' },
  ],
  advanced: [
    { name: 'Dr. Elena V.', location: 'Russia', text: 'The rhetoric and persuasion modules are brilliant. I now give presentations at international conferences with confidence.', rating: 5, avatar: 'E' },
    { name: 'James O.', location: 'Nigeria', text: 'The phonological precision module transformed my pronunciation. The literary English section opened up a whole new world of expression.', rating: 5, avatar: 'J' },
    { name: 'Priya M.', location: 'India', text: 'As a C1 speaker, I thought I knew it all. This course proved me wrong. The scientific writing and philosophical English modules are exceptional.', rating: 5, avatar: 'P' },
  ],
};

/* ============================================================
   COURSE FAQ
   ============================================================ */
const COURSE_FAQ = [
  {
    q: 'How long do I have access to the course?',
    a: 'You get lifetime access! Once you purchase a course, it\'s yours forever. You can learn at your own pace and revisit lessons anytime. There are no deadlines or expiration dates.',
  },
  {
    q: 'Can I access the course on mobile devices?',
    a: 'Absolutely! Our platform is fully responsive and works beautifully on smartphones, tablets, and desktop computers. Learn on the go with the same great experience across all devices.',
  },
  {
    q: 'Do I receive a certificate upon completion?',
    a: 'Yes! Upon completing all modules and passing the final assessment, you\'ll receive a CEFR-aligned completion certificate with a QR verification code. You can download it as a PDF and share it with employers or institutions.',
  },
  {
    q: 'What if the course level doesn\'t match my ability?',
    a: 'If you find the course too easy or too difficult, contact us within 14 days of purchase and we\'ll help you switch to a more appropriate level. We want you in the course that gives you the best learning experience.',
  },
  {
    q: 'Are the lessons interactive or just videos?',
    a: 'Our courses feature a mix of interactive lessons, video content, AI-powered listening exercises, quizzes, and practice activities. The interactive approach ensures active learning and better retention compared to passive video-only courses.',
  },
  {
    q: 'Is there a refund policy?',
    a: 'We offer a full refund within 14 days of purchase if you\'ve completed less than 25% of the course. We want you to be completely satisfied with your learning experience. PayPal\'s buyer protection also applies.',
  },
];

/* ============================================================
   PAYPAL SCRIPT LOADER
   ============================================================ */
function usePayPalScript(clientId: string | null) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'loaded'>('idle');
  const mounted = useHydrated();
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    if (window.paypal) {
      const timer = setTimeout(() => setStatus('loaded'), 0);
      return () => clearTimeout(timer);
    }
    if (!clientId) return;
    if (document.querySelector('script[src*="paypal.com/sdk/js"]')) {
      const checkTimer = setInterval(() => {
        if (window.paypal) {
          setStatus('loaded');
          clearInterval(checkTimer);
        }
      }, 200);
      return () => clearInterval(checkTimer);
    }

    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&intent=capture`;
    script.async = true;
    script.onload = () => setStatus('loaded');
    script.onerror = () => setStatus('idle');

    document.body.appendChild(script);
    scriptRef.current = script;

    return () => {
      if (scriptRef.current && !window.paypal) scriptRef.current.remove();
    };
  }, [clientId]);

  return { isLoaded: status === 'loaded', isLoading: status === 'loading' };
}

/* ============================================================
   COURSE PAYPAL BUTTON
   ============================================================ */
function CoursePayPalButton({
  isAuthenticated,
  slug,
  amount,
  courseLabel,
}: {
  isAuthenticated: boolean;
  slug: string;
  amount: number;
  courseLabel: string;
}) {
  const paypalContainerRef = useRef<HTMLDivElement>(null);
  const [paypalClientId, setPaypalClientId] = useState<string | null>(null);
  const [isFetchingClientId, setIsFetchingClientId] = useState(false);
  const mounted = useHydrated();
  const [error, setError] = useState('');
  const { isLoaded, isLoading: isScriptLoading } = usePayPalScript(paypalClientId);
  const { setUser } = useAuthStore();
  const router = useRouter();
  const renderedRef = useRef(false);

  useEffect(() => {
    setIsFetchingClientId(true);
    const fetchClientId = async () => {
      try {
        const response = await fetch('/api/payments/client-id/', { credentials: 'same-origin' });
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
    if (!isLoaded || !window.paypal || !paypalContainerRef.current || !isAuthenticated || renderedRef.current) return;
    renderedRef.current = true;

    window.paypal.Buttons({
      style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay', height: 45 },
      createOrder: async () => {
        try {
          const response = await fetch('/api/courses/create-order/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin',
            body: JSON.stringify({ slug, currency: 'USD' }),
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
      onApprove: async (data: { orderID: string }) => {
        try {
          setError('');
          const response = await fetch('/api/courses/enroll/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin',
            body: JSON.stringify({ slug, orderID: data.orderID }),
          });
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Enrollment failed');
          }
          const enrollData = await response.json();
          // Track purchase event
          trackPurchase({
            transaction_id: data.orderID,
            value: amount,
            currency: 'USD',
            plan_type: `course-${slug}`,
            items: courseLabel,
          });
          // Refresh user data
          try {
            const meRes = await fetch('/api/auth/me/', { credentials: 'same-origin' });
            if (meRes.ok) {
              const meData = await meRes.json();
              if (meData.user) setUser(meData.user);
            }
          } catch {}
          router.push(`/payment-success?plan=course-${slug}`);
        } catch (err) {
          console.error('Enroll error:', err);
          setError(err instanceof Error ? err.message : 'Payment failed. Please contact support.');
        }
      },
      onError: (err: unknown) => {
        console.error('PayPal button error:', err);
        setError('Payment process encountered an error. Please try again.');
      },
    }).render(paypalContainerRef.current);
  }, [isLoaded, isAuthenticated, slug, amount]);

  return (
    <div>
      {!mounted || isFetchingClientId || isScriptLoading ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin mr-2 text-blue-400" />
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

/* ============================================================
   SCROLL ANIMATION HOOK
   ============================================================ */
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

/* ============================================================
   ACCORDION MODULE ITEM
   ============================================================ */
function ModuleAccordion({ module, index, colors }: {
  module: { title: string; lessons: Array<{ title: string; type: string; minutes: number }> };
  index: number;
  colors: typeof TIER_COLORS['beginner'];
}) {
  const [open, setOpen] = useState(false);
  const totalMinutes = module.lessons.reduce((s, l) => s + l.minutes, 0);

  const lessonTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play className="h-3.5 w-3.5" />;
      case 'interactive': return <Zap className="h-3.5 w-3.5" />;
      case 'listening': return <Headphones className="h-3.5 w-3.5" />;
      case 'practice': return <FileText className="h-3.5 w-3.5" />;
      case 'quiz': return <Award className="h-3.5 w-3.5" />;
      default: return <BookOpen className="h-3.5 w-3.5" />;
    }
  };

  const lessonTypeLabel = (type: string) => {
    switch (type) {
      case 'video': return 'Video';
      case 'interactive': return 'Interactive';
      case 'listening': return 'Listening';
      case 'practice': return 'Practice';
      case 'quiz': return 'Quiz';
      default: return type;
    }
  };

  return (
    <div className="glass-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 sm:p-5 text-left cursor-pointer hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <div className={`flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${colors.gradient} text-white text-sm font-bold shadow-lg`}>
            {index + 1}
          </div>
          <div className="min-w-0">
            <span className="font-medium text-sm text-white block truncate">{module.title}</span>
            <span className="text-xs text-white/40 mt-0.5 block">{module.lessons.length} lessons · {Math.round(totalMinutes / 60 * 10) / 10}h</span>
          </div>
        </div>
        {open ? (
          <ChevronUp className="h-4 w-4 text-blue-400 shrink-0 ml-2" />
        ) : (
          <ChevronDown className="h-4 w-4 text-white/40 shrink-0 ml-2" />
        )}
      </button>
      {open && (
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0">
          <div className="space-y-2 border-t border-white/5 pt-3">
            {module.lessons.map((lesson, i) => (
              <div key={i} className="flex items-center gap-3 py-1.5 px-2 rounded-lg hover:bg-white/[0.03] transition-colors">
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/5 ${colors.checkColor}`}>
                  {lessonTypeIcon(lesson.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-white/70 block truncate">{lesson.title}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-white/30 uppercase tracking-wider hidden sm:block">{lessonTypeLabel(lesson.type)}</span>
                  <span className="text-xs text-white/30">{lesson.minutes}m</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   FAQ ITEM
   ============================================================ */
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
          <ChevronUp className="h-4 w-4 text-blue-400 shrink-0" />
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

/* ============================================================
   WHAT YOU'LL LEARN DATA
   ============================================================ */
const LEARNING_OUTCOMES: Record<string, Array<{ icon: React.ReactNode; title: string; desc: string }>> = {
  beginner: [
    { icon: <MessageSquare className="h-5 w-5" />, title: 'Basic Conversations', desc: 'Introduce yourself, order food, ask for directions, and handle everyday situations with confidence.' },
    { icon: <BookOpen className="h-5 w-5" />, title: '500+ Core Words', desc: 'Build a solid vocabulary foundation covering family, food, shopping, health, and daily life.' },
    { icon: <FileText className="h-5 w-5" />, title: 'Grammar Fundamentals', desc: 'Master present, past, and future tenses along with essential sentence structures.' },
    { icon: <Headphones className="h-5 w-5" />, title: 'Listening Comprehension', desc: 'Understand slow to moderate speech in familiar contexts with AI-powered exercises.' },
    { icon: <Mic className="h-5 w-5" />, title: 'Pronunciation Basics', desc: 'Develop clear pronunciation of English sounds, stress patterns, and intonation.' },
    { icon: <Award className="h-5 w-5" />, title: 'A2 Certification Ready', desc: 'Be fully prepared to pass A1/A2 level CEFR certification exams.' },
  ],
  intermediate: [
    { icon: <MessageSquare className="h-5 w-5" />, title: 'Professional Communication', desc: 'Write emails, lead meetings, and present ideas effectively in business contexts.' },
    { icon: <BookOpen className="h-5 w-5" />, title: 'Complex Grammar Mastery', desc: 'Master perfect tenses, conditionals, reported speech, and advanced sentence structures.' },
    { icon: <FileText className="h-5 w-5" />, title: 'Academic Writing', desc: 'Structure essays, cite sources, and express complex ideas in academic English.' },
    { icon: <Headphones className="h-5 w-5" />, title: 'Native-Speed Listening', desc: 'Understand podcasts, lectures, and conversations at natural speed with varied accents.' },
    { icon: <Globe className="h-5 w-5" />, title: 'Cultural Fluency', desc: 'Navigate idioms, cultural references, and nuanced expressions across English-speaking cultures.' },
    { icon: <Award className="h-5 w-5" />, title: 'B2 Certification Ready', desc: 'Be fully prepared to pass B1/B2 level CEFR certification exams.' },
  ],
  advanced: [
    { icon: <MessageSquare className="h-5 w-5" />, title: 'Rhetoric & Persuasion', desc: 'Master ethos, pathos, and logos. Craft compelling arguments and influence through language.' },
    { icon: <BookOpen className="h-5 w-5" />, title: 'Literary & Scientific English', desc: 'Analyze poetry, write research papers, and navigate both creative and technical discourse.' },
    { icon: <FileText className="h-5 w-5" />, title: 'Diplomatic Communication', desc: 'Use precise language for negotiations, conflict resolution, and high-stakes discussions.' },
    { icon: <Headphones className="h-5 w-5" />, title: 'Phonological Precision', desc: 'Perfect your pronunciation with advanced stress, rhythm, and intonation training.' },
    { icon: <Globe className="h-5 w-5" />, title: 'Philosophical & Abstract English', desc: 'Express complex abstract concepts, engage in philosophical discourse, and think in English.' },
    { icon: <Award className="h-5 w-5" />, title: 'C2 Certification Ready', desc: 'Be fully prepared to pass C1/C2 level CEFR certification exams with confidence.' },
  ],
};

/* ============================================================
   404 NOT FOUND COMPONENT
   ============================================================ */
function CourseNotFound({ slug }: { slug: string }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="glass-card p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 mb-6">
              <X className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Course Not Found</h1>
            <p className="text-sm text-white/40 mb-6">
              The course &quot;{slug}&quot; doesn&apos;t exist. Choose from Beginner, Intermediate, or Advanced.
            </p>
            <Link href="/">
              <button className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-blue-500/25 cursor-pointer">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

/* ============================================================
   MAIN PAGE COMPONENT
   ============================================================ */
export default function CourseDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const mounted = useHydrated();
  const isAuth = mounted && isAuthenticated;

  const [isEnrolled, setIsEnrolled] = useState(false);
  const [checkingEnrollment, setCheckingEnrollment] = useState(true);
  const [apiCourseData, setApiCourseData] = useState<any>(null);

  // Validate slug
  const validSlugs = ['beginner', 'intermediate', 'advanced'];
  const isValidSlug = validSlugs.includes(slug);

  // Check enrollment status
  useEffect(() => {
    if (!isAuth || !isValidSlug) {
      setCheckingEnrollment(false);
      return;
    }
    const checkEnrollment = async () => {
      try {
        const res = await fetch('/api/courses/my-courses/', { credentials: 'same-origin' });
        if (res.ok) {
          const data = await res.json();
          const enrolled = data.enrollments?.some(
            (e: any) => e.course?.slug === slug && (e.status === 'active' || e.status === 'completed')
          );
          setIsEnrolled(enrolled);
        }
      } catch {
        // Silently fail — show purchase button
      } finally {
        setCheckingEnrollment(false);
      }
    };
    checkEnrollment();
  }, [isAuth, slug, isValidSlug]);

  // Fetch dynamic course data from API (optional)
  useEffect(() => {
    if (!isValidSlug) return;
    const fetchCourseData = async () => {
      try {
        const res = await fetch(`/api/courses/${slug}`, { credentials: 'same-origin' });
        if (res.ok) {
          const data = await res.json();
          setApiCourseData(data.course);
        }
      } catch {
        // Use static fallback data
      }
    };
    fetchCourseData();
  }, [slug, isValidSlug]);

  // Early return for invalid slug — after all hooks
  if (!isValidSlug) {
    return <CourseNotFound slug={slug} />;
  }

  // Get course data
  const course: CourseTier = COURSE_TIERS[slug];
  const colors = TIER_COLORS[slug];
  const curriculum = CURRICULUM_DATA[slug];
  const testimonials = TESTIMONIALS[slug];
  const learningOutcomes = LEARNING_OUTCOMES[slug];

  // Use API data for curriculum if available, else static
  const displayModules = apiCourseData?.modules?.length
    ? apiCourseData.modules.map((mod: any) => ({
        title: `Module ${mod.moduleNumber}: ${mod.title}`,
        lessons: mod.lessons?.map((lesson: any) => ({
          title: lesson.title,
          type: lesson.contentType || 'video',
          minutes: lesson.estimatedMinutes || 15,
        })) || [],
      }))
    : curriculum;

  const discount = course.compareAtPrice
    ? Math.round((1 - course.price / course.compareAtPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
      <Navbar />

      {/* ===== HERO SECTION ===== */}
      <section className="relative dark-section hero-pattern noise-overlay overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className={`orb ${colors.orb1} w-[500px] h-[500px] -top-32 -right-32 animate-float-slow`} />
          <div className={`orb ${colors.orb2} w-[400px] h-[400px] bottom-0 left-1/4 animate-float-reverse`} />
          <div className="orb orb-blue w-[250px] h-[250px] top-1/2 right-1/3 animate-float" />
        </div>

        <div className="container relative mx-auto px-4 pt-8 pb-20 md:pt-12 md:pb-28">
          {/* Back link */}
          <Link
            href="/#courses"
            className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors mb-8 group"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            Back to Courses
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Course info */}
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${colors.badge}`}>
                  Level {course.level}
                </span>
                {course.badgeText && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/20 border border-blue-500/30 px-3 py-1 text-xs font-semibold text-blue-300">
                    <Star className="h-3 w-3" />
                    {course.badgeText}
                  </span>
                )}
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                {course.title.split(' ').slice(0, -1).join(' ')}{' '}
                <span className="gradient-text-static">{course.title.split(' ').slice(-1)}</span>
              </h1>

              <p className="mt-4 text-lg sm:text-xl text-white/50 max-w-lg">
                {course.subtitle}
              </p>

              {/* Stats row */}
              <div className="flex flex-wrap items-center gap-4 mt-8">
                <div className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 ${colors.statBg}`}>
                  <Layers className={`h-4 w-4 ${colors.text}`} />
                  <span className="text-sm font-medium text-white/80">{course.modulesCount} Modules</span>
                </div>
                <div className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 ${colors.statBg}`}>
                  <BookOpen className={`h-4 w-4 ${colors.text}`} />
                  <span className="text-sm font-medium text-white/80">{course.lessonsCount} Lessons</span>
                </div>
                <div className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 ${colors.statBg}`}>
                  <Clock className={`h-4 w-4 ${colors.text}`} />
                  <span className="text-sm font-medium text-white/80">{course.estimatedHours} Hours</span>
                </div>
              </div>

              {/* Enrollment count */}
              <div className="flex items-center gap-2 mt-5">
                <Users className="h-4 w-4 text-white/30" />
                <span className="text-sm text-white/30">
                  {apiCourseData?._count?.enrollments
                    ? `${apiCourseData._count.enrollments.toLocaleString()} students enrolled`
                    : 'Join hundreds of learners worldwide'}
                </span>
              </div>
            </div>

            {/* Right: Pricing card */}
            <div>
              <AnimatedSection>
                <div className="glass-card-neon p-6 sm:p-8 max-w-md mx-auto lg:mx-0 lg:ml-auto">
                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-3">
                      <span className="text-4xl sm:text-5xl font-bold gradient-text-static">${course.price}</span>
                      {course.compareAtPrice && (
                        <span className="text-xl text-white/30 line-through">${course.compareAtPrice}</span>
                      )}
                    </div>
                    {discount > 0 && (
                      <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-blue-500/15 border border-blue-500/25 px-3 py-1">
                        <Zap className="h-3 w-3 text-blue-400" />
                        <span className="text-xs font-semibold text-blue-400">Save {discount}%</span>
                      </div>
                    )}
                    <p className="text-xs text-white/30 mt-2">One-time payment · Lifetime access</p>
                  </div>

                  <div className="section-divider mb-6" />

                  {/* Quick features */}
                  <ul className="space-y-2.5 mb-6">
                    {course.features.slice(0, 5).map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm">
                        <CheckCircle2 className={`h-4 w-4 ${colors.checkColor} mt-0.5 shrink-0`} />
                        <span className="text-white/60">{feature}</span>
                      </li>
                    ))}
                    {course.features.length > 5 && (
                      <li className="text-xs text-white/30 pl-6">+{course.features.length - 5} more features</li>
                    )}
                  </ul>

                  {/* CTA */}
                  {checkingEnrollment ? (
                    <div className="flex items-center justify-center py-3">
                      <Loader2 className="h-5 w-5 animate-spin mr-2 text-blue-400" />
                      <span className="text-sm text-white/50">Checking enrollment...</span>
                    </div>
                  ) : isEnrolled ? (
                    <Link href="/learn" className="block">
                      <button className={`w-full flex items-center justify-center gap-2 rounded-xl py-3.5 bg-gradient-to-r ${colors.buttonGradient} hover:opacity-90 text-white font-semibold text-sm transition-all duration-300 shadow-lg ${colors.shadowColor} cursor-pointer`}>
                        <Play className="h-4 w-4" />
                        Continue Learning
                      </button>
                    </Link>
                  ) : isAuth ? (
                    <CoursePayPalButton
                      isAuthenticated={isAuth}
                      slug={slug}
                      amount={course.price}
                      courseLabel={course.title}
                    />
                  ) : (
                    <Link href={`/login?redirect=/courses/${slug}`} className="block">
                      <button className={`w-full flex items-center justify-center gap-2 rounded-xl py-3.5 bg-gradient-to-r ${colors.buttonGradient} hover:opacity-90 text-white font-semibold text-sm transition-all duration-300 shadow-lg ${colors.shadowColor} cursor-pointer`}>
                        <CreditCard className="h-4 w-4" />
                        Sign in to Purchase
                      </button>
                    </Link>
                  )}

                  {/* Trust badge */}
                  <div className="mt-5 flex items-center justify-center gap-2">
                    <Lock className="h-3.5 w-3.5 text-blue-400" />
                    <span className="text-xs text-white/30">Secure payment via PayPal · 14-day refund policy</span>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0F0A1E] to-transparent" />
      </section>

      {/* ===== COURSE OVERVIEW ===== */}
      <section className="relative py-16 md:py-24">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 rounded-full glass-light px-4 py-1.5 mb-4">
                <BookOpen className={`h-3.5 w-3.5 ${colors.text}`} />
                <span className="text-xs text-blue-300 font-medium uppercase tracking-wider">Course Overview</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Why Choose <span className="gradient-text-static">{course.title}</span>?
              </h2>
              <p className="text-white/50 text-base sm:text-lg leading-relaxed max-w-3xl">
                Our {course.title} course is designed by experienced English teachers and powered by AI technology.
                With {course.modulesCount} comprehensive modules and {course.lessonsCount} interactive lessons,
                you&apos;ll progress from {course.level.split('–')[0]} to {course.level.split('–')[1] || 'mastery'} through
                a carefully structured curriculum that adapts to your learning pace.
                Every lesson includes AI-powered listening exercises, vocabulary building, and quizzes to reinforce your knowledge.
              </p>
            </div>
          </AnimatedSection>

          {/* Key stats */}
          <AnimatedSection delay={100}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-12">
              {[
                { icon: <Layers className="h-5 w-5" />, value: course.modulesCount.toString(), label: 'Modules' },
                { icon: <BookOpen className="h-5 w-5" />, value: course.lessonsCount.toString(), label: 'Lessons' },
                { icon: <Clock className="h-5 w-5" />, value: `${course.estimatedHours}h`, label: 'Est. Time' },
                { icon: <Award className="h-5 w-5" />, value: course.level, label: 'CEFR Level' },
              ].map((stat) => (
                <div key={stat.label} className="glass-card p-5 text-center">
                  <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${colors.gradient} text-white mb-3`}>
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-white/40 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <div className="section-divider max-w-4xl mx-auto" />

      {/* ===== WHAT YOU'LL LEARN ===== */}
      <section className="relative py-16 md:py-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className={`orb ${colors.orb1} w-[300px] h-[300px] top-1/4 -right-20 animate-float-slow opacity-20`} />
        </div>

        <div className="container relative mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full glass-light px-4 py-1.5 mb-4">
                <Sparkles className={`h-3.5 w-3.5 ${colors.text}`} />
                <span className="text-xs text-blue-300 font-medium uppercase tracking-wider">Learning Outcomes</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                What You&apos;ll <span className="gradient-text-static">Learn</span>
              </h2>
              <p className="mt-4 text-white/50 max-w-2xl mx-auto">
                Master these core skills and be ready for real-world English communication.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {learningOutcomes.map((outcome, i) => (
              <AnimatedSection key={i} delay={i * 100}>
                <div className="glass-card p-6 h-full">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${colors.gradient} text-white mb-4 shadow-lg ${colors.shadowColor}`}>
                    {outcome.icon}
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">{outcome.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{outcome.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider max-w-4xl mx-auto" />

      {/* ===== FEATURES ===== */}
      <section className="relative py-16 md:py-24">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full glass-light px-4 py-1.5 mb-4">
                <Shield className={`h-3.5 w-3.5 ${colors.text}`} />
                <span className="text-xs text-blue-300 font-medium uppercase tracking-wider">Included Features</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Everything You <span className="gradient-text-static">Need</span>
              </h2>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={100}>
            <div className="glass-card p-6 sm:p-8 max-w-3xl mx-auto">
              <ul className="space-y-3">
                {course.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckCircle2 className={`h-5 w-5 ${colors.checkColor} mt-0.5 shrink-0`} />
                    <span className="text-white/60 text-sm sm:text-base">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <div className="section-divider max-w-4xl mx-auto" />

      {/* ===== CURRICULUM ===== */}
      <section className="relative py-16 md:py-24 dark-section-alt hero-pattern noise-overlay">
        <div className="absolute inset-0 pointer-events-none">
          <div className={`orb ${colors.orb2} w-[350px] h-[350px] top-0 left-1/4 animate-float-reverse opacity-20`} />
        </div>

        <div className="container relative mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full glass-light px-4 py-1.5 mb-4">
                <Layers className={`h-3.5 w-3.5 ${colors.text}`} />
                <span className="text-xs text-blue-300 font-medium uppercase tracking-wider">Curriculum</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Course <span className="gradient-text-static">Curriculum</span>
              </h2>
              <p className="mt-4 text-white/50 max-w-2xl mx-auto">
                {course.modulesCount} modules · {course.lessonsCount} lessons · ~{course.estimatedHours} hours of content
              </p>
            </div>
          </AnimatedSection>

          <div className="max-w-3xl mx-auto space-y-3">
            {displayModules.map((mod: { title: string; lessons: Array<{ title: string; type: string; minutes: number }> }, i: number) => (
              <AnimatedSection key={i} delay={i * 60}>
                <ModuleAccordion module={mod} index={i} colors={colors} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider max-w-4xl mx-auto" />

      {/* ===== TESTIMONIALS ===== */}
      <section className="relative py-16 md:py-24">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full glass-light px-4 py-1.5 mb-4">
                <Users className={`h-3.5 w-3.5 ${colors.text}`} />
                <span className="text-xs text-blue-300 font-medium uppercase tracking-wider">Student Reviews</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                What Our <span className="gradient-text-static">Students</span> Say
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {testimonials.map((testimonial, i) => (
              <AnimatedSection key={i} delay={i * 100}>
                <div className="glass-card p-6 h-full flex flex-col">
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-blue-400 text-blue-400" />
                    ))}
                  </div>
                  {/* Quote */}
                  <p className="text-sm text-white/60 leading-relaxed flex-1 mb-5">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${colors.gradient} text-white text-sm font-bold`}>
                      {testimonial.avatar}
                    </div>
                    <div>
                      <span className="text-sm font-medium text-white">{testimonial.name}</span>
                      <span className="text-xs text-white/30 block">{testimonial.location}</span>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider max-w-4xl mx-auto" />

      {/* ===== FAQ ===== */}
      <section className="relative py-16 md:py-24">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full glass-light px-4 py-1.5 mb-4">
                <Sparkles className={`h-3.5 w-3.5 ${colors.text}`} />
                <span className="text-xs text-blue-300 font-medium uppercase tracking-wider">FAQ</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Frequently Asked <span className="gradient-text-static">Questions</span>
              </h2>
            </div>
          </AnimatedSection>

          <div className="max-w-3xl mx-auto space-y-3">
            {COURSE_FAQ.map((faq, i) => (
              <AnimatedSection key={i} delay={i * 60}>
                <FAQItem q={faq.q} a={faq.a} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider max-w-4xl mx-auto" />

      {/* ===== FINAL CTA ===== */}
      <section className="relative py-16 md:py-24 dark-section-alt hero-pattern noise-overlay">
        <div className="absolute inset-0 pointer-events-none">
          <div className={`orb ${colors.orb1} w-[400px] h-[400px] top-1/4 -right-20 animate-float-slow opacity-20`} />
          <div className={`orb ${colors.orb2} w-[300px] h-[300px] bottom-0 left-1/3 animate-float-reverse opacity-20`} />
        </div>

        <div className="container relative mx-auto px-4">
          <AnimatedSection>
            <div className="glass-card-neon p-8 sm:p-12 max-w-2xl mx-auto text-center">
              <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${colors.gradient} text-white mb-6 shadow-lg ${colors.shadowColor}`}>
                {ICON_MAP[course.icon] || <BookOpen className="h-6 w-6" />}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Start <span className="gradient-text-static">{course.title}</span>?
              </h2>
              <p className="text-white/50 mb-8 max-w-lg mx-auto">
                Join thousands of learners who have improved their English with our structured courses.
                Get lifetime access for just <span className="gradient-text-static font-semibold">${course.price}</span>
                {course.compareAtPrice && (
                  <span className="text-white/30 line-through ml-2">${course.compareAtPrice}</span>
                )}.
              </p>

              {checkingEnrollment ? (
                <div className="flex items-center justify-center py-3">
                  <Loader2 className="h-5 w-5 animate-spin mr-2 text-blue-400" />
                </div>
              ) : isEnrolled ? (
                <Link href="/learn" className="inline-block">
                  <button className={`inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 bg-gradient-to-r ${colors.buttonGradient} hover:opacity-90 text-white font-semibold text-sm transition-all duration-300 shadow-lg ${colors.shadowColor} cursor-pointer`}>
                    <Play className="h-4 w-4" />
                    Continue Learning
                  </button>
                </Link>
              ) : isAuth ? (
                <div className="max-w-sm mx-auto">
                  <CoursePayPalButton
                    isAuthenticated={isAuth}
                    slug={slug}
                    amount={course.price}
                    courseLabel={course.title}
                  />
                </div>
              ) : (
                <Link href={`/login?redirect=/courses/${slug}`} className="inline-block">
                  <button className={`inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 bg-gradient-to-r ${colors.buttonGradient} hover:opacity-90 text-white font-semibold text-sm transition-all duration-300 shadow-lg ${colors.shadowColor} cursor-pointer`}>
                    <CreditCard className="h-4 w-4" />
                    Sign in to Purchase
                  </button>
                </Link>
              )}

              <div className="mt-6 flex items-center justify-center gap-4 text-xs text-white/30">
                <div className="flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-blue-400" />
                  <span>Secure checkout</span>
                </div>
                <span className="text-white/10">·</span>
                <div className="flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-blue-400" />
                  <span>14-day refund</span>
                </div>
                <span className="text-white/10">·</span>
                <div className="flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5 text-blue-300" />
                  <span>Certificate included</span>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </div>
  );
}
