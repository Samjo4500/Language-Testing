'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/auth-store';
import { Navbar } from '@/components/navbar';
import {
  Headphones, Mic, BookOpen, PenTool, Play, Square, Volume2,
  ChevronRight, ChevronLeft, Clock, AlertCircle, CheckCircle2,
  Loader2, ArrowRight, Award, Sparkles, RotateCcw, VolumeX,
  MicOff, Send, X, LogIn
} from 'lucide-react';

/* ======================================================
   TYPES
   ====================================================== */
interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  level: string;
  category: string;
}

interface ListeningItem {
  id: string;
  script: string;
  question: string;
  options: string[];
  correctIndex: number;
  level: string;
}

interface SpeakingPrompt {
  id: string;
  prompt: string;
  level: string;
  preparationTime: number; // seconds
  responseTime: number; // seconds
}

interface WritingPrompt {
  id: string;
  prompt: string;
  level: string;
  minWords: number;
  maxWords: number;
}

interface SpeakingEvaluation {
  cefrLevel: string;
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  dimensions: {
    grammar: { score: number; feedback: string };
    vocabulary: { score: number; feedback: string };
    fluency: { score: number; feedback: string };
    pronunciation: { score: number; feedback: string };
    coherence: { score: number; feedback: string };
    interaction: { score: number; feedback: string };
  };
}

interface WritingEvaluation {
  cefrLevel: string;
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

type TestPhase = 'select' | 'reading' | 'listening' | 'speaking' | 'writing' | 'results';
type SkillStatus = 'pending' | 'in_progress' | 'completed';

/* ======================================================
   CEFR TEST CONTENT DATA
   ====================================================== */
const LISTENING_ITEMS: ListeningItem[] = [
  {
    id: 'l-a1',
    script: 'Hello, my name is Sarah. I am a student at the university. I study English every day because I want to travel to London next summer.',
    question: 'Why does Sarah study English?',
    options: ['For her job', 'To travel to London', 'For an exam', 'To teach others'],
    correctIndex: 1,
    level: 'A1',
  },
  {
    id: 'l-a2',
    script: 'Excuse me, could you tell me how to get to the train station? Go straight down this road for two blocks, then turn left at the traffic light. You will see the station on your right.',
    question: 'Where is the train station?',
    options: ['On the left after two blocks', 'On the right after turning left', 'Straight ahead', 'Behind the traffic light'],
    correctIndex: 1,
    level: 'A2',
  },
  {
    id: 'l-b1',
    script: 'I have been working at the company for three years now, and I really enjoy the collaborative atmosphere. However, the commute is getting quite long, so I am considering asking my manager if I could work from home two days a week.',
    question: 'What is the speaker considering?',
    options: ['Finding a new job', 'Asking to work from home part-time', 'Moving closer to work', 'Reducing work hours'],
    correctIndex: 1,
    level: 'B1',
  },
  {
    id: 'l-b2',
    script: 'The recent study published in the Journal of Environmental Science suggests that urban green spaces not only improve air quality but also have a significant impact on residents mental health. Researchers found that people living within 300 metres of a park reported 25 percent lower stress levels compared to those without easy access to green areas.',
    question: 'What does the study primarily suggest about urban green spaces?',
    options: [
      'They should be expanded to cover more area',
      'They benefit both environmental and psychological well-being',
      'They are more effective than medication for stress',
      'They only help people who live very close to them',
    ],
    correctIndex: 1,
    level: 'B2',
  },
  {
    id: 'l-c1',
    script: 'While the government touts the new infrastructure bill as a panacea for the nations crumbling bridges and roads, critics argue that the allocated funds are merely a drop in the ocean. The bipartisan compromise, they contend, sacrifices long-term sustainability for short-term political gains, leaving future generations to grapple with the consequences of deferred maintenance and inadequate investment in resilient design.',
    question: 'What is the critics main argument against the infrastructure bill?',
    options: [
      'It focuses too much on bridges and ignores other infrastructure',
      'It is politically motivated and insufficient for long-term needs',
      'It adequately addresses all infrastructure concerns',
      'It should have been passed earlier to prevent current problems',
    ],
    correctIndex: 1,
    level: 'C1',
  },
  {
    id: 'l-c2',
    script: 'The paradox of modern globalization lies in its simultaneous capacity to homogenize and fragment. As transnational corporations impose a veneer of cultural uniformity through ubiquitous branding and algorithmically curated content, local identities undergo a complex process of renegotiation rather than mere erasure. Scholars of cultural hybridity argue that this dialectic produces novel syncretic forms, which neither conform to the dominant global template nor replicate pre-globalization traditions, but instead inhabit an interstitial space that defies conventional categorization.',
    question: 'According to the passage, what is the key insight about cultural globalization?',
    options: [
      'It inevitably destroys local cultures completely',
      'It creates entirely new cultural forms that blend global and local elements',
      'It has no meaningful impact on cultural identity',
      'It strengthens traditional cultures against external influence',
    ],
    correctIndex: 1,
    level: 'C2',
  },
];

const SPEAKING_PROMPTS: SpeakingPrompt[] = [
  { id: 's-a1', prompt: 'Introduce yourself. Tell me your name, where you are from, and what you like to do in your free time.', level: 'A1', preparationTime: 15, responseTime: 60 },
  { id: 's-a2', prompt: 'Describe your daily routine. What do you usually do from morning to night? Include at least three activities.', level: 'A2', preparationTime: 20, responseTime: 90 },
  { id: 's-b1', prompt: 'Talk about a memorable trip you have taken. Where did you go, what did you do, and why was it memorable?', level: 'B1', preparationTime: 25, responseTime: 120 },
  { id: 's-b2', prompt: 'Some people believe that technology has made our lives easier, while others argue it has created more problems than it has solved. What is your opinion? Provide specific examples to support your view.', level: 'B2', preparationTime: 30, responseTime: 150 },
  { id: 's-c1', prompt: 'Discuss the ethical implications of artificial intelligence in the workplace. Consider both the potential benefits and the concerns, and propose how society might balance innovation with worker protection.', level: 'C1', preparationTime: 40, responseTime: 180 },
  { id: 's-c2', prompt: 'Critically evaluate the assertion that economic growth should be the primary objective of national policy. In your response, address the tensions between growth, sustainability, and social equity, drawing on examples from different economic models.', level: 'C2', preparationTime: 45, responseTime: 240 },
];

const WRITING_PROMPTS: WritingPrompt[] = [
  { id: 'w-a1', prompt: 'Write a short email to a friend telling them about your weekend. What did you do? Did you enjoy it?', level: 'A1', minWords: 30, maxWords: 80 },
  { id: 'w-a2', prompt: 'Write about your favourite hobby. Explain what it is, how often you do it, and why you enjoy it. Give specific details.', level: 'A2', minWords: 50, maxWords: 120 },
  { id: 'w-b1', prompt: 'Some people prefer living in a city, while others prefer living in the countryside. Compare the advantages and disadvantages of each, and explain which you prefer and why.', level: 'B1', minWords: 80, maxWords: 180 },
  { id: 'w-b2', prompt: 'In many countries, the cost of higher education continues to rise. Discuss the arguments for and against free university education, and give your own opinion on how this issue should be addressed.', level: 'B2', minWords: 120, maxWords: 250 },
  { id: 'w-c1', prompt: 'The rapid development of social media has transformed how people access information and form opinions. Analyze the impact of this transformation on democratic discourse, considering both the democratization of information and the proliferation of misinformation. Propose measures that could mitigate the negative effects while preserving the benefits.', level: 'C1', minWords: 180, maxWords: 350 },
  { id: 'w-c2', prompt: 'Critically examine the proposition that universal basic income is the most viable solution to the economic disruption caused by automation and artificial intelligence. In your essay, evaluate the theoretical justifications, practical challenges of implementation, and alternative policy approaches, drawing on empirical evidence from pilot programs where available.', level: 'C2', minWords: 250, maxWords: 500 },
];

const READING_PASSAGES = [
  {
    id: 'r-a1',
    level: 'A1',
    passage: 'My name is Tom. I am 25 years old. I live in a small apartment in the city centre. Every morning, I wake up at 7 oclock and have breakfast. I usually eat toast and drink coffee. Then I take the bus to work. I work in a shop. I like my job because I meet many people. In the evening, I go home and cook dinner. After dinner, I watch TV or read a book. I go to bed at 10 oclock.',
    questions: [
      { question: 'Where does Tom live?', options: ['In a house', 'In an apartment', 'On a farm', 'With his parents'], correctIndex: 1 },
      { question: 'How does Tom go to work?', options: ['By car', 'On foot', 'By bus', 'By bike'], correctIndex: 2 },
    ],
  },
  {
    id: 'r-a2',
    level: 'A2',
    passage: 'Last weekend, Maria decided to try a new restaurant that had just opened near her office. The restaurant, called The Green Table, specializes in vegetarian food. Maria is not a vegetarian, but she wanted to eat something healthy. She ordered a mixed salad as a starter and a mushroom risotto for the main course. The food was delicious, and the service was friendly. The only problem was that the restaurant was quite busy, so she had to wait 20 minutes for a table. She said she would definitely go back, but next time she would make a reservation.',
    questions: [
      { question: 'Why did Maria choose The Green Table?', options: ['She is vegetarian', 'She wanted healthy food', 'Her friend recommended it', 'It was the cheapest option'], correctIndex: 1 },
      { question: 'What was the problem with the restaurant?', options: ['The food was bad', 'The service was slow', 'It was too busy', 'It was too expensive'], correctIndex: 2 },
    ],
  },
  {
    id: 'r-b1',
    level: 'B1',
    passage: 'Working from home has become increasingly common in recent years, and the trend accelerated dramatically during the global pandemic. While many employees appreciate the flexibility and time saved by not commuting, remote work also presents significant challenges. Studies have shown that remote workers often struggle to separate their professional and personal lives, leading to longer working hours and increased stress. Additionally, the lack of face-to-face interaction can make collaboration more difficult and reduce the sense of belonging within a team. Some companies have adopted hybrid models, allowing employees to split their time between home and office, as a compromise that aims to capture the benefits of both arrangements.',
    questions: [
      { question: 'According to the passage, what is one major challenge of remote work?', options: ['Higher transportation costs', 'Difficulty separating work and personal life', 'Reduced salary', 'Lack of technology'], correctIndex: 1 },
      { question: 'What solution do some companies offer?', options: ['Fully remote work', 'Returning to the office', 'Hybrid models', 'Shorter working hours'], correctIndex: 2 },
    ],
  },
  {
    id: 'r-b2',
    level: 'B2',
    passage: 'The concept of a circular economy has gained considerable traction among policymakers and business leaders seeking alternatives to the traditional linear model of take-make-dispose. In a circular economy, products and materials are designed for durability, reuse, and recyclability, thereby minimizing waste and reducing the extraction of virgin resources. Proponents argue that this approach not only addresses environmental concerns but also creates economic opportunities through new business models such as product-as-a-service, where consumers lease rather than own products. Critics, however, contend that the transition to a circular economy is hindered by entrenched consumer habits, inadequate infrastructure for recycling and remanufacturing, and the economic incentives that still favour linear production. Despite these obstacles, several multinational corporations have begun incorporating circular principles into their operations, suggesting that incremental progress is possible even without a complete systemic overhaul.',
    questions: [
      { question: 'What is the primary advantage of the product-as-a-service model according to the passage?', options: ['It eliminates the need for recycling', 'It reduces consumer costs significantly', 'It supports circular economy principles by changing ownership patterns', 'It is the only viable circular economy approach'], correctIndex: 2 },
      { question: 'What do critics identify as barriers to the circular economy?', options: ['Lack of scientific evidence', 'Consumer habits, poor infrastructure, and existing economic incentives', 'Resistance from environmental groups', 'Technological limitations only'], correctIndex: 1 },
    ],
  },
  {
    id: 'r-c1',
    level: 'C1',
    passage: 'The burgeoning field of neuroethics confronts a constellation of dilemmas arising from advances in neurotechnology. Brain-computer interfaces, once confined to science fiction, now enable individuals with severe motor disabilities to control prosthetic limbs and communication devices through neural signals alone. While these developments are laudable, they raise profound questions about cognitive liberty, the right to mental privacy, and the potential for coercion if such technologies become commodified. Moreover, the capacity for neural manipulation, whether for therapeutic or enhancement purposes, blurs the boundary between treatment and augmentation, compelling society to re-examine longstanding assumptions about identity, agency, and authenticity. As regulatory frameworks struggle to keep pace with technological innovation, neuroethicists advocate for a precautionary yet progressive approach that safeguards fundamental cognitive rights without stifling innovation that could alleviate suffering.',
    questions: [
      { question: 'What fundamental tension does the passage identify in the field of neuroethics?', options: [
        'The cost of neurotechnology versus its benefits',
        'The conflict between treating medical conditions and enhancing human capabilities',
        'The competition between different neurotechnology companies',
        'The disagreement between scientists and ethicists about research methods',
      ], correctIndex: 1 },
      { question: 'What approach do neuroethicists recommend?', options: [
        'Complete prohibition of neural manipulation',
        'Unrestricted development of neurotechnology',
        'A balanced approach that protects rights while allowing beneficial innovation',
        'Deferring all decisions to international regulatory bodies',
      ], correctIndex: 2 },
    ],
  },
  {
    id: 'r-c2',
    level: 'C2',
    passage: 'The epistemological implications of large language models extend far beyond their practical applications, challenging foundational assumptions about the nature of knowledge, understanding, and meaning. When a language model generates a coherent and seemingly insightful response, it raises the question of whether this output constitutes genuine understanding or merely sophisticated pattern matching. The philosopher John Searles Chinese Room argument, originally formulated to critique symbolic AI, finds renewed relevance: just as Searles hypothetical room occupant can manipulate Chinese symbols without understanding Chinese, a language model processes tokens without, by most philosophical accounts, apprehending their referential content. Yet critics of this analogy contend that it relies on an unduly individualistic conception of cognition, one that neglects the distributed and relational character of meaning-making. From a pragmatic standpoint, if a models outputs are indistinguishable from those of a competent language user, and if they reliably facilitate communication and problem-solving, the question of internal understanding may be moot. This position, however, risks conflating functional equivalence with ontological identity, a conflation that has historically underwritten pernicious simplifications in the philosophy of mind. The debate thus mirrors broader tensions between instrumentalist and realist approaches to knowledge, with significant implications for how we conceptualize artificial intelligence and its place in the epistemic landscape.',
    questions: [
      { question: 'How does the passage characterize the central philosophical debate regarding large language models?', options: [
        'Whether they will replace human intelligence entirely',
        'Whether their outputs constitute genuine understanding or merely sophisticated pattern matching',
        'Whether they should be regulated by governments',
        'Whether they are more efficient than traditional computing methods',
      ], correctIndex: 1 },
      { question: 'What criticism does the passage level against the pragmatic position?', options: [
        'It overestimates the capabilities of language models',
        'It conflates functional equivalence with ontological identity',
        'It relies too heavily on Searles Chinese Room argument',
        'It fails to consider the practical benefits of language models',
      ], correctIndex: 1 },
    ],
  },
];

/* ======================================================
   HELPER: SPEECH SYNTHESIS (Google TTS)
   ====================================================== */
function speakText(text: string, rate: number = 0.9): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      reject(new Error('Speech synthesis not supported'));
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = 1;
    utterance.lang = 'en-US';

    // Try to get an English voice
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google')) ||
                         voices.find(v => v.lang.startsWith('en-')) ||
                         voices.find(v => v.lang.startsWith('en'));
    if (englishVoice) utterance.voice = englishVoice;

    utterance.onend = () => resolve();
    utterance.onerror = (e) => reject(e);
    window.speechSynthesis.speak(utterance);
  });
}

/* ======================================================
   MAIN TEST PAGE
   ====================================================== */
export default function TestPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authIsLoading, user, accessToken } = useAuthStore();

  // Test state
  const [phase, setPhase] = useState<TestPhase>('select');
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resumingAssessment, setResumingAssessment] = useState(false);

  // Check for in-progress assessment on mount (resume capability)
  // SECURITY: Use GET (read-only) instead of POST to avoid consuming a credit on page load
  useEffect(() => {
    if (!isAuthenticated || !accessToken) return;
    const checkForResumableAssessment = async () => {
      try {
        const res = await fetch('/api/assessments/start', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.hasInProgress && data.assessment) {
            setAssessmentId(data.assessment.id);
            setResumingAssessment(true);
          }
        }
      } catch {}
    };
    checkForResumableAssessment();
  }, [isAuthenticated, accessToken]);

  // Skill tracking
  const [skillStatuses, setSkillStatuses] = useState<Record<string, SkillStatus>>({
    reading: 'pending',
    listening: 'pending',
    speaking: 'pending',
    writing: 'pending',
  });

  // Reading state
  const [readingIdx, setReadingIdx] = useState(0);
  const [readingAnswers, setReadingAnswers] = useState<Record<string, number>>({});

  // Listening state
  const [listeningIdx, setListeningIdx] = useState(0);
  const [listeningAnswers, setListeningAnswers] = useState<Record<string, number>>({});
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Speaking state
  const [speakingIdx, setSpeakingIdx] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPrepTime, setIsPrepTime] = useState(false);
  const [prepTimeLeft, setPrepTimeLeft] = useState(0);
  const [speakingTranscript, setSpeakingTranscript] = useState('');
  const [speakingEvaluations, setSpeakingEvaluations] = useState<Record<string, SpeakingEvaluation>>({});
  const [evaluatingSpeaking, setEvaluatingSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Writing state
  const [writingIdx, setWritingIdx] = useState(0);
  const [writingTexts, setWritingTexts] = useState<Record<string, string>>({});
  const [writingEvaluations, setWritingEvaluations] = useState<Record<string, WritingEvaluation>>({});
  const [evaluatingWriting, setEvaluatingWriting] = useState(false);

  // Browser speech recognition support (for speaking test warning)
  const [speechSupported, setSpeechSupported] = useState(true);
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setSpeechSupported(!!SpeechRecognition);
  }, []);

  // Results state
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState<any>(null);

  // ── Session persistence: save test progress to sessionStorage ──
  const SESSION_KEY = assessmentId ? `test-progress-${assessmentId}` : null;

  // Restore saved progress on mount
  useEffect(() => {
    if (!SESSION_KEY || typeof window === 'undefined') return;
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (saved) {
        const state = JSON.parse(saved);
        if (state.readingAnswers) setReadingAnswers(state.readingAnswers);
        if (state.listeningAnswers) setListeningAnswers(state.listeningAnswers);
        if (state.writingTexts) setWritingTexts(state.writingTexts);
        if (state.speakingTranscript) setSpeakingTranscript(state.speakingTranscript);
        if (state.speakingEvaluations) setSpeakingEvaluations(state.speakingEvaluations);
        if (state.writingEvaluations) setWritingEvaluations(state.writingEvaluations);
        if (state.skillStatuses) setSkillStatuses(state.skillStatuses);
        if (state.phase && state.phase !== 'select') setPhase(state.phase);
        if (state.readingIdx) setReadingIdx(state.readingIdx);
        if (state.listeningIdx) setListeningIdx(state.listeningIdx);
        if (state.speakingIdx) setSpeakingIdx(state.speakingIdx);
        if (state.writingIdx) setWritingIdx(state.writingIdx);
      }
    } catch {}
  }, [SESSION_KEY]);

  // Save progress to sessionStorage whenever test state changes
  useEffect(() => {
    if (!SESSION_KEY || typeof window === 'undefined' || phase === 'select' || phase === 'results') return;
    try {
      const state = {
        readingAnswers, listeningAnswers, writingTexts, speakingTranscript,
        speakingEvaluations, writingEvaluations, skillStatuses, phase,
        readingIdx, listeningIdx, speakingIdx, writingIdx,
      };
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(state));
    } catch {}
  }, [SESSION_KEY, readingAnswers, listeningAnswers, writingTexts, speakingTranscript,
      speakingEvaluations, writingEvaluations, skillStatuses, phase,
      readingIdx, listeningIdx, speakingIdx, writingIdx]);

  // Warn user before leaving/refreshing during an active test
  const isInActiveTest = phase !== 'select' && phase !== 'results';
  useEffect(() => {
    if (!isInActiveTest) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = 'Your test is in progress. Are you sure you want to leave?';
      return e.returnValue;
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isInActiveTest]);

  // Load voices for TTS
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
    };
  }, []);

  /* ======================================================
     START ASSESSMENT
     ====================================================== */
  const startAssessment = async () => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/assessments/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.code === 'NO_CREDITS') {
          setError('You have no test credits remaining. Please upgrade your plan to continue.');
        } else {
          setError(data.message || 'Failed to start assessment.');
        }
        setLoading(false);
        return;
      }
      setAssessmentId(data.assessment.id);
      setResumingAssessment(false);
      setLoading(false);
    } catch {
      setError('Failed to start assessment. Please try again.');
      setLoading(false);
    }
  };

  /* ======================================================
     SKILL SELECTION HANDLER
     ====================================================== */
  const startSkill = async (skill: TestPhase) => {
    // If we already have an assessmentId (from resume or previous start), use it
    if (!assessmentId) {
      await startAssessment();
      // Note: assessmentId will be set via setState, but it won't be available
      // in this render cycle. We'll proceed anyway since submitAssessment
      // checks assessmentId again.
    }
    setPhase(skill);
    setSkillStatuses(prev => ({ ...prev, [skill]: 'in_progress' }));
  };

  /* ======================================================
     COMPLETE SKILL HELPER
     ====================================================== */
  const completeSkill = (skill: string) => {
    setSkillStatuses(prev => ({ ...prev, [skill]: 'completed' }));
  };

  /* ======================================================
     READING LOGIC
     ====================================================== */
  const currentReading = READING_PASSAGES[readingIdx];

  const submitReading = () => {
    completeSkill('reading');
    const allDone = Object.values({ ...skillStatuses, reading: 'completed' }).every(s => s === 'completed');
    if (allDone) {
      submitAssessment();
    } else {
      setPhase('select');
    }
  };

  /* ======================================================
     LISTENING LOGIC
     ====================================================== */
  const currentListening = LISTENING_ITEMS[listeningIdx];

  const playAudio = async () => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    try {
      await speakText(currentListening.script);
    } catch (e) {
      console.error('TTS error:', e);
    } finally {
      setIsSpeaking(false);
    }
  };

  const stopAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const submitListening = () => {
    completeSkill('listening');
    const allDone = Object.values({ ...skillStatuses, listening: 'completed' }).every(s => s === 'completed');
    if (allDone) {
      submitAssessment();
    } else {
      setPhase('select');
    }
  };

  /* ======================================================
     SPEAKING LOGIC
     ====================================================== */
  const currentSpeakingPrompt = SPEAKING_PROMPTS[speakingIdx];

  const startPrepTime = () => {
    setIsPrepTime(true);
    setPrepTimeLeft(currentSpeakingPrompt.preparationTime);
    timerRef.current = setInterval(() => {
      setPrepTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setIsPrepTime(false);
          startRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startRecording = () => {
    setSpeakingTranscript('');
    setRecordingTime(0);

    // Web Speech API for transcription
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      let finalTranscript = '';
      recognition.onresult = (event: any) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + ' ';
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        setSpeakingTranscript(finalTranscript + interim);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error !== 'no-speech') {
          stopRecording();
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    }

    setIsRecording(true);
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => {
        if (prev >= currentSpeakingPrompt.responseTime) {
          stopRecording();
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const stopRecording = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRecording(false);
    setIsPrepTime(false);
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }
  }, []);

  const evaluateSpeaking = async () => {
    if (!speakingTranscript.trim() || !accessToken) return;
    setEvaluatingSpeaking(true);
    try {
      const res = await fetch('/api/assessments/speaking/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          transcript: speakingTranscript,
          prompt: currentSpeakingPrompt.prompt,
          level: currentSpeakingPrompt.level,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSpeakingEvaluations(prev => ({ ...prev, [currentSpeakingPrompt.id]: data }));
      }
    } catch (e) {
      console.error('Speaking evaluation error:', e);
    } finally {
      setEvaluatingSpeaking(false);
    }
  };

  const submitSpeaking = () => {
    completeSkill('speaking');
    const allDone = Object.values({ ...skillStatuses, speaking: 'completed' }).every(s => s === 'completed');
    if (allDone) {
      submitAssessment();
    } else {
      setPhase('select');
    }
  };

  /* ======================================================
     WRITING LOGIC
     ====================================================== */
  const currentWritingPrompt = WRITING_PROMPTS[writingIdx];
  const currentWritingText = writingTexts[currentWritingPrompt?.id] || '';

  const evaluateWriting = async () => {
    if (!currentWritingText.trim() || !accessToken) return;
    setEvaluatingWriting(true);
    try {
      const res = await fetch('/api/assessments/writing/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          text: currentWritingText,
          prompt: currentWritingPrompt.prompt,
          level: currentWritingPrompt.level,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setWritingEvaluations(prev => ({ ...prev, [currentWritingPrompt.id]: data }));
      }
    } catch (e) {
      console.error('Writing evaluation error:', e);
    } finally {
      setEvaluatingWriting(false);
    }
  };

  const submitWriting = () => {
    completeSkill('writing');
    const allDone = Object.values({ ...skillStatuses, writing: 'completed' }).every(s => s === 'completed');
    if (allDone) {
      submitAssessment();
    } else {
      setPhase('select');
    }
  };

  /* ======================================================
     SUBMIT ASSESSMENT
     ====================================================== */
  const submitAssessment = async () => {
    if (!assessmentId || !accessToken) return;
    setSubmitting(true);

    // Build responses from all skills
    const responses: any[] = [];

    // Reading responses
    READING_PASSAGES.forEach(passage => {
      passage.questions.forEach((q, qi) => {
        const answer = readingAnswers[`${passage.id}-${qi}`];
        responses.push({
          questionId: `${passage.id}-${qi}`,
          answer: answer !== undefined ? String(answer) : '',
          isCorrect: answer === q.correctIndex,
          level: passage.level,
          category: 'reading',
        });
      });
    });

    // Listening responses
    LISTENING_ITEMS.forEach(item => {
      const answer = listeningAnswers[item.id];
      responses.push({
        questionId: item.id,
        answer: answer !== undefined ? String(answer) : '',
        isCorrect: answer === item.correctIndex,
        level: item.level,
        category: 'listening',
      });
    });

    // Speaking - evaluate against prompt
    SPEAKING_PROMPTS.forEach(prompt => {
      const eval_ = speakingEvaluations[prompt.id];
      responses.push({
        questionId: prompt.id,
        answer: speakingTranscript || 'No response',
        isCorrect: eval_ ? eval_.score >= 50 : false,
        level: prompt.level,
        category: 'speaking',
      });
    });

    // Writing - evaluate against prompt
    WRITING_PROMPTS.forEach(prompt => {
      const eval_ = writingEvaluations[prompt.id];
      const text = writingTexts[prompt.id] || '';
      responses.push({
        questionId: prompt.id,
        answer: text || 'No response',
        isCorrect: eval_ ? eval_.score >= 50 : false,
        level: prompt.level,
        category: 'writing',
      });
    });

    try {
      const res = await fetch('/api/assessments/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ assessmentId, responses }),
      });
      const data = await res.json();
      if (res.ok) {
        setResults(data);
        setPhase('results');
      } else {
        setError(data.message || 'Failed to submit assessment.');
      }
    } catch {
      setError('Failed to submit assessment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  /* ======================================================
     FORMAT TIME
     ====================================================== */
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  /* ======================================================
     WORD COUNT
     ====================================================== */
  const wordCount = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

  /* ======================================================
     LOADING / AUTH GUARD
     ====================================================== */
  if (authIsLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-purple-400 animate-spin" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            <div className="glass-card p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white mb-4 shadow-lg shadow-purple-500/25">
                <LogIn className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Sign in to take the test</h1>
              <p className="text-sm text-white/50 mb-6">
                You need to be signed in to start your CEFR assessment.
              </p>
              <Link href="/login">
                <button className="w-full flex items-center justify-center gap-2 rounded-xl py-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold transition-all duration-300 shadow-lg shadow-purple-500/25 cursor-pointer">
                  <Sparkles className="h-4 w-4" />
                  Sign in
                </button>
              </Link>
              <p className="text-xs text-white/30 mt-4">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="text-purple-400 hover:text-purple-300 transition-colors">
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ======================================================
     SKILL SELECT PHASE
     ====================================================== */
  if (phase === 'select') {
    const skills = [
      {
        key: 'reading',
        title: 'Reading',
        desc: 'Read passages at different CEFR levels and answer comprehension questions.',
        icon: <BookOpen className="h-7 w-7" />,
        gradient: 'from-blue-500 to-cyan-500',
        bgGlow: 'rgba(59,130,246,0.15)',
        levels: 'A1 - C2',
        questions: READING_PASSAGES.length,
      },
      {
        key: 'listening',
        title: 'Listening',
        desc: 'Listen to audio passages using text-to-speech and answer questions about what you heard.',
        icon: <Headphones className="h-7 w-7" />,
        gradient: 'from-green-500 to-emerald-500',
        bgGlow: 'rgba(34,197,94,0.15)',
        levels: 'A1 - C2',
        questions: LISTENING_ITEMS.length,
      },
      {
        key: 'speaking',
        title: 'Speaking',
        desc: 'Respond to prompts using your microphone. AI evaluates 6 dimensions of your speech.',
        icon: <Mic className="h-7 w-7" />,
        gradient: 'from-orange-500 to-amber-500',
        bgGlow: 'rgba(249,115,22,0.15)',
        levels: 'A1 - C2',
        questions: SPEAKING_PROMPTS.length,
      },
      {
        key: 'writing',
        title: 'Writing',
        desc: 'Write responses to prompts at different levels. AI evaluates grammar, vocabulary, coherence, and more.',
        icon: <PenTool className="h-7 w-7" />,
        gradient: 'from-violet-500 to-purple-500',
        bgGlow: 'rgba(139,92,246,0.15)',
        levels: 'A1 - C2',
        questions: WRITING_PROMPTS.length,
      },
    ];

    const completedCount = Object.values(skillStatuses).filter(s => s === 'completed').length;

    return (
      <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
        <Navbar />
        <div className="flex-1 py-8 px-4">
          <div className="container max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                <span className="text-xs text-purple-300 font-medium uppercase tracking-wider">CEFR Assessment</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Take Your <span className="gradient-text-static">CEFR Test</span>
              </h1>
              <p className="mt-3 text-white/50 max-w-xl mx-auto">
                Complete all four skill sections to receive your comprehensive CEFR proficiency score and certificate.
              </p>
            </div>

            {/* Progress */}
            <div className="glass-card p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white/60">Progress</span>
                <span className="text-sm font-medium text-white">{completedCount}/4 skills completed</span>
              </div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                  style={{ width: `${(completedCount / 4) * 100}%` }}
                />
              </div>
            </div>

            {/* Resume Assessment Banner */}
            {resumingAssessment && (
              <div className="glass-card p-4 mb-6 border-amber-500/30 bg-amber-500/5">
                <div className="flex items-start gap-3">
                  <RotateCcw className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-amber-300 font-medium">You have an assessment in progress</p>
                    <p className="text-xs text-white/40 mt-1">
                      It looks like you started a test but didn&apos;t finish. Complete all four skills below to submit your results.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Browser Compatibility Warning for Speaking */}
            {!speechSupported && (
              <div className="glass-card p-4 mb-6 border-amber-500/30 bg-amber-500/5">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-amber-300 font-medium">Speaking test requires Chrome</p>
                    <p className="text-xs text-white/40 mt-1">
                      The speaking section uses speech recognition that is only supported in Google Chrome. Please use Chrome for the best experience.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="glass-card p-4 mb-6 border-red-500/30">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-red-300">{error}</p>
                    {error.includes('credits') && (
                      <button
                        onClick={() => router.push('/pricing')}
                        className="mt-2 text-sm text-purple-400 hover:text-purple-300 underline cursor-pointer"
                      >
                        Upgrade your plan
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Skill Cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              {skills.map(skill => {
                const status = skillStatuses[skill.key];
                return (
                  <div
                    key={skill.key}
                    className={`glass-card p-6 cursor-pointer group transition-all duration-300 ${
                      status === 'completed'
                        ? 'border-green-500/30'
                        : 'hover:border-purple-500/30'
                    }`}
                    onClick={() => status !== 'completed' && startSkill(skill.key as TestPhase)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${skill.gradient} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                        {skill.icon}
                      </div>
                      {status === 'completed' ? (
                        <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                          <CheckCircle2 className="h-3 w-3" /> Completed
                        </span>
                      ) : status === 'in_progress' ? (
                        <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          In Progress
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium bg-white/10 text-white/50 border border-white/10">
                          {skill.levels}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-1">{skill.title}</h3>
                    <p className="text-sm text-white/50 leading-relaxed">{skill.desc}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-white/30">{skill.questions} prompts</span>
                      {status !== 'completed' && (
                        <span className="flex items-center text-sm text-purple-400 font-medium">
                          Start <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Submit All */}
            {completedCount === 4 && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => submitAssessment()}
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-xl px-8 py-3.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold text-base transition-all duration-300 shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Award className="h-5 w-5" />}
                  {submitting ? 'Submitting...' : 'Submit & Get Results'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ======================================================
     READING PHASE
     ====================================================== */
  if (phase === 'reading' && currentReading) {
    const totalQuestions = READING_PASSAGES.reduce((sum, p) => sum + p.questions.length, 0);
    const answeredCount = Object.keys(readingAnswers).length;

    return (
      <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
        <Navbar />
        <div className="flex-1 py-8 px-4">
          <div className="container max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Reading Comprehension</h2>
                  <p className="text-xs text-white/40">Passage {readingIdx + 1} of {READING_PASSAGES.length}</p>
                </div>
              </div>
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border border-blue-500/30`}>
                {currentReading.level}
              </span>
            </div>

            {/* Progress */}
            <div className="glass-card p-3 mb-6">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-white/50">Progress</span>
                <span className="text-xs text-white/70">{answeredCount}/{totalQuestions} answered</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all" style={{ width: `${(answeredCount / totalQuestions) * 100}%` }} />
              </div>
            </div>

            {/* Passage */}
            <div className="glass-card p-6 mb-6">
              <p className="text-xs text-white/40 uppercase tracking-wider mb-3">Read the passage carefully</p>
              <p className="text-white/80 leading-relaxed text-[15px]">{currentReading.passage}</p>
            </div>

            {/* Questions */}
            <div className="space-y-4 mb-6">
              {currentReading.questions.map((q, qi) => {
                const qKey = `${currentReading.id}-${qi}`;
                const selected = readingAnswers[qKey];
                return (
                  <div key={qi} className="glass-card p-5">
                    <p className="text-sm font-medium text-white mb-3">{qi + 1}. {q.question}</p>
                    <div className="space-y-2">
                      {q.options.map((opt, oi) => (
                        <button
                          key={oi}
                          onClick={() => setReadingAnswers(prev => ({ ...prev, [qKey]: oi }))}
                          className={`w-full text-left p-3 rounded-xl text-sm transition-all duration-300 cursor-pointer ${
                            selected === oi
                              ? 'bg-gradient-to-r from-purple-600/30 to-pink-500/30 border border-purple-500/40 text-white'
                              : 'bg-white/5 border border-white/5 text-white/60 hover:bg-white/8 hover:text-white/80'
                          }`}
                        >
                          <span className="font-medium mr-2">{String.fromCharCode(65 + oi)}.</span>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setReadingIdx(Math.max(0, readingIdx - 1))}
                disabled={readingIdx === 0}
                className="flex items-center gap-2 rounded-xl px-5 py-2.5 glass-button text-white text-sm font-medium cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </button>
              {readingIdx < READING_PASSAGES.length - 1 ? (
                <button
                  onClick={() => setReadingIdx(readingIdx + 1)}
                  className="flex items-center gap-2 rounded-xl px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white text-sm font-medium transition-all shadow-lg shadow-purple-500/25 cursor-pointer"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={submitReading}
                  className="flex items-center gap-2 rounded-xl px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white text-sm font-medium transition-all shadow-lg cursor-pointer"
                >
                  <CheckCircle2 className="h-4 w-4" /> Complete Reading
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ======================================================
     LISTENING PHASE
     ====================================================== */
  if (phase === 'listening' && currentListening) {
    const answeredCount = Object.keys(listeningAnswers).length;

    return (
      <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
        <Navbar />
        <div className="flex-1 py-8 px-4">
          <div className="container max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg">
                  <Headphones className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Listening Comprehension</h2>
                  <p className="text-xs text-white/40">Audio {listeningIdx + 1} of {LISTENING_ITEMS.length}</p>
                </div>
              </div>
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border border-green-500/30`}>
                {currentListening.level}
              </span>
            </div>

            {/* Progress */}
            <div className="glass-card p-3 mb-6">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-white/50">Progress</span>
                <span className="text-xs text-white/70">{answeredCount}/{LISTENING_ITEMS.length} answered</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all" style={{ width: `${(answeredCount / LISTENING_ITEMS.length) * 100}%` }} />
              </div>
            </div>

            {/* Audio Player */}
            <div className="glass-card p-6 mb-6">
              <p className="text-xs text-white/40 uppercase tracking-wider mb-3">Listen to the audio</p>
              <div className="flex items-center gap-4">
                <button
                  onClick={isSpeaking ? stopAudio : playAudio}
                  className={`flex h-14 w-14 items-center justify-center rounded-full transition-all duration-300 cursor-pointer ${
                    isSpeaking
                      ? 'bg-gradient-to-br from-red-500 to-red-600 shadow-2xl shadow-red-500/40 animate-pulse'
                      : 'bg-gradient-to-br from-green-500 to-emerald-500 shadow-2xl shadow-green-500/40 hover:scale-110'
                  }`}
                >
                  {isSpeaking ? <Square className="h-6 w-6 text-white" /> : <Play className="h-6 w-6 text-white ml-1" />}
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {isSpeaking ? (
                      <span className="text-sm text-green-300 font-medium flex items-center gap-1">
                        <Volume2 className="h-4 w-4" /> Playing audio...
                      </span>
                    ) : (
                      <span className="text-sm text-white/50 flex items-center gap-1">
                        <VolumeX className="h-4 w-4" /> Click play to listen
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/30 mt-1">You can play the audio multiple times</p>
                </div>
              </div>

              {/* Transcript (hidden by default, can toggle) */}
              <details className="mt-4">
                <summary className="text-xs text-white/30 cursor-pointer hover:text-white/50 transition-colors">
                  Show transcript (for accessibility)
                </summary>
                <p className="mt-2 text-sm text-white/50 italic leading-relaxed">{currentListening.script}</p>
              </details>
            </div>

            {/* Question */}
            <div className="glass-card p-5 mb-6">
              <p className="text-sm font-medium text-white mb-3">{currentListening.question}</p>
              <div className="space-y-2">
                {currentListening.options.map((opt, oi) => {
                  const selected = listeningAnswers[currentListening.id];
                  return (
                    <button
                      key={oi}
                      onClick={() => setListeningAnswers(prev => ({ ...prev, [currentListening.id]: oi }))}
                      className={`w-full text-left p-3 rounded-xl text-sm transition-all duration-300 cursor-pointer ${
                        selected === oi
                          ? 'bg-gradient-to-r from-purple-600/30 to-pink-500/30 border border-purple-500/40 text-white'
                          : 'bg-white/5 border border-white/5 text-white/60 hover:bg-white/8 hover:text-white/80'
                      }`}
                    >
                      <span className="font-medium mr-2">{String.fromCharCode(65 + oi)}.</span>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setListeningIdx(Math.max(0, listeningIdx - 1))}
                disabled={listeningIdx === 0}
                className="flex items-center gap-2 rounded-xl px-5 py-2.5 glass-button text-white text-sm font-medium cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </button>
              {listeningIdx < LISTENING_ITEMS.length - 1 ? (
                <button
                  onClick={() => setListeningIdx(listeningIdx + 1)}
                  className="flex items-center gap-2 rounded-xl px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white text-sm font-medium transition-all shadow-lg shadow-purple-500/25 cursor-pointer"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={submitListening}
                  className="flex items-center gap-2 rounded-xl px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white text-sm font-medium transition-all shadow-lg cursor-pointer"
                >
                  <CheckCircle2 className="h-4 w-4" /> Complete Listening
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ======================================================
     SPEAKING PHASE
     ====================================================== */
  if (phase === 'speaking' && currentSpeakingPrompt) {
    const hasEvaluation = !!speakingEvaluations[currentSpeakingPrompt.id];
    const evaluation = speakingEvaluations[currentSpeakingPrompt.id];
    const dimensions = evaluation?.dimensions
      ? [
          { key: 'grammar', label: 'Grammar (G)', ...evaluation.dimensions.grammar, color: 'from-purple-500 to-violet-500' },
          { key: 'vocabulary', label: 'Vocabulary (V)', ...evaluation.dimensions.vocabulary, color: 'from-pink-500 to-rose-500' },
          { key: 'fluency', label: 'Fluency (F)', ...evaluation.dimensions.fluency, color: 'from-blue-500 to-cyan-500' },
          { key: 'pronunciation', label: 'Pronunciation (P)', ...evaluation.dimensions.pronunciation, color: 'from-green-500 to-emerald-500' },
          { key: 'coherence', label: 'Coherence (C)', ...evaluation.dimensions.coherence, color: 'from-orange-500 to-amber-500' },
          { key: 'interaction', label: 'Interaction (I)', ...evaluation.dimensions.interaction, color: 'from-red-500 to-pink-500' },
        ]
      : [];

    return (
      <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
        <Navbar />
        <div className="flex-1 py-8 px-4">
          <div className="container max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg">
                  <Mic className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Speaking Assessment</h2>
                  <p className="text-xs text-white/40">Prompt {speakingIdx + 1} of {SPEAKING_PROMPTS.length}</p>
                </div>
              </div>
              <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-300 border border-orange-500/30">
                {currentSpeakingPrompt.level}
              </span>
            </div>

            {/* Prompt */}
            <div className="glass-card p-6 mb-6">
              <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Speaking Prompt</p>
              <p className="text-white/80 text-[15px] leading-relaxed italic">&ldquo;{currentSpeakingPrompt.prompt}&rdquo;</p>
            </div>

            {/* Mic Controls */}
            {!hasEvaluation ? (
              <div className="glass-card p-6 mb-6">
                <div className="flex flex-col items-center">
                  {/* Status */}
                  <div className="flex items-center gap-2 mb-6">
                    {isRecording ? (
                      <>
                        <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-pulse" />
                        <span className="text-sm text-red-300 font-medium">RECORDING</span>
                        <span className="text-sm text-white/50 ml-2">{formatTime(recordingTime)} / {formatTime(currentSpeakingPrompt.responseTime)}</span>
                      </>
                    ) : isPrepTime ? (
                      <>
                        <Clock className="h-4 w-4 text-amber-400" />
                        <span className="text-sm text-amber-300 font-medium">PREPARATION TIME</span>
                        <span className="text-sm text-white/50 ml-2">{prepTimeLeft}s remaining</span>
                      </>
                    ) : (
                      <>
                        <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                        <span className="text-sm text-green-300 font-medium">READY</span>
                      </>
                    )}
                  </div>

                  {/* Waveform visualization */}
                  <div className="flex items-center justify-center gap-[3px] h-12 mb-6">
                    {Array.from({ length: 24 }).map((_, i) => (
                      <div
                        key={i}
                        className={`waveform-bar ${isRecording ? (i % 2 === 0 ? 'active' : 'waveform-bar-alt active') : ''}`}
                        style={{
                          height: isRecording ? undefined : `${6 + Math.sin(i * 0.5) * 4 + 4}px`,
                          animationDelay: `${i * 0.06}s`,
                          opacity: isRecording ? 1 : 0.25,
                        }}
                      />
                    ))}
                  </div>

                  {/* Mic button */}
                  <div className="relative mb-6">
                    {isRecording && (
                      <>
                        <div className="absolute inset-[-8px] rounded-full border-2 border-red-400/30 animate-ripple" />
                        <div className="absolute inset-[-8px] rounded-full border-2 border-red-400/20 animate-ripple" style={{ animationDelay: '0.5s' }} />
                      </>
                    )}
                    <div className={`absolute -inset-6 rounded-full transition-all duration-500 ${isRecording ? 'bg-red-500/15 blur-2xl' : 'bg-purple-500/15 blur-2xl'}`} />
                    <button
                      onClick={() => {
                        if (isRecording) {
                          stopRecording();
                        } else if (!isPrepTime) {
                          startPrepTime();
                        }
                      }}
                      disabled={isPrepTime}
                      className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer disabled:cursor-not-allowed ${
                        isRecording
                          ? 'bg-gradient-to-br from-red-500 to-red-600 shadow-2xl shadow-red-500/40 animate-recording-pulse'
                          : isPrepTime
                          ? 'bg-gradient-to-br from-amber-500 to-amber-600 shadow-2xl shadow-amber-500/40'
                          : 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-2xl shadow-purple-500/40 hover:shadow-purple-500/60 hover:scale-110 animate-mic-glow'
                      }`}
                    >
                      {isRecording ? (
                        <Square className="h-8 w-8 text-white" />
                      ) : isPrepTime ? (
                        <Clock className="h-8 w-8 text-white animate-pulse" />
                      ) : (
                        <Mic className="h-8 w-8 text-white" />
                      )}
                    </button>
                  </div>

                  {/* Transcript */}
                  {speakingTranscript && (
                    <div className="w-full mb-4">
                      <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Your Response (Live)</p>
                      <div className="glass-card p-4">
                        <p className="text-sm text-white/70 leading-relaxed">{speakingTranscript}</p>
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-white/30 text-center">
                    {isPrepTime
                      ? 'Get ready to speak when the timer runs out...'
                      : isRecording
                      ? 'Click stop when you are done speaking'
                      : 'Click the microphone to start (prep time included)'}
                  </p>

                  {/* Evaluate button */}
                  {speakingTranscript && !isRecording && !isPrepTime && (
                    <button
                      onClick={evaluateSpeaking}
                      disabled={evaluatingSpeaking}
                      className="mt-4 flex items-center gap-2 rounded-xl px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white text-sm font-medium transition-all shadow-lg cursor-pointer disabled:opacity-50"
                    >
                      {evaluatingSpeaking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      {evaluatingSpeaking ? 'Evaluating...' : 'Evaluate Response'}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Evaluation Results */
              <div className="glass-card p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="h-5 w-5 text-purple-400" />
                  <h3 className="text-lg font-semibold text-white">Speaking Evaluation</h3>
                  <span className="ml-auto inline-flex items-center rounded-full px-3 py-1 text-xs font-bold bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30">
                    {evaluation!.cefrLevel} - Score: {evaluation!.score}/100
                  </span>
                </div>

                <p className="text-sm text-white/60 mb-4">{evaluation!.feedback}</p>

                {/* 6 Dimensions */}
                <div className="grid gap-3 sm:grid-cols-2 mb-4">
                  {dimensions.map(dim => (
                    <div key={dim.key} className="glass-card p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white">{dim.label}</span>
                        <span className="text-sm font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                          {dim.score}/100
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${dim.color} transition-all duration-1000`}
                          style={{ width: `${dim.score}%` }}
                        />
                      </div>
                      <p className="text-xs text-white/40 mt-1">{dim.feedback}</p>
                    </div>
                  ))}
                </div>

                {/* Strengths & Improvements */}
                <div className="grid gap-3 sm:grid-cols-2">
                  {evaluation!.strengths.length > 0 && (
                    <div>
                      <p className="text-xs text-green-400 uppercase tracking-wider mb-2">Strengths</p>
                      {evaluation!.strengths.map((s, i) => (
                        <div key={i} className="flex items-start gap-2 mb-1">
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-400 shrink-0 mt-0.5" />
                          <span className="text-xs text-white/60">{s}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {evaluation!.improvements.length > 0 && (
                    <div>
                      <p className="text-xs text-amber-400 uppercase tracking-wider mb-2">Improvements</p>
                      {evaluation!.improvements.map((s, i) => (
                        <div key={i} className="flex items-start gap-2 mb-1">
                          <AlertCircle className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span className="text-xs text-white/60">{s}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSpeakingIdx(Math.max(0, speakingIdx - 1))}
                disabled={speakingIdx === 0}
                className="flex items-center gap-2 rounded-xl px-5 py-2.5 glass-button text-white text-sm font-medium cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </button>
              {speakingIdx < SPEAKING_PROMPTS.length - 1 ? (
                <button
                  onClick={() => setSpeakingIdx(speakingIdx + 1)}
                  className="flex items-center gap-2 rounded-xl px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white text-sm font-medium transition-all shadow-lg shadow-purple-500/25 cursor-pointer"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={submitSpeaking}
                  className="flex items-center gap-2 rounded-xl px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white text-sm font-medium transition-all shadow-lg cursor-pointer"
                >
                  <CheckCircle2 className="h-4 w-4" /> Complete Speaking
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ======================================================
     WRITING PHASE
     ====================================================== */
  if (phase === 'writing' && currentWritingPrompt) {
    const wc = wordCount(currentWritingText);
    const hasEvaluation = !!writingEvaluations[currentWritingPrompt.id];
    const evaluation = writingEvaluations[currentWritingPrompt.id];

    return (
      <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
        <Navbar />
        <div className="flex-1 py-8 px-4">
          <div className="container max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 text-white shadow-lg">
                  <PenTool className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Writing Assessment</h2>
                  <p className="text-xs text-white/40">Prompt {writingIdx + 1} of {WRITING_PROMPTS.length}</p>
                </div>
              </div>
              <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-violet-300 border border-violet-500/30">
                {currentWritingPrompt.level}
              </span>
            </div>

            {/* Prompt */}
            <div className="glass-card p-6 mb-6">
              <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Writing Prompt</p>
              <p className="text-white/80 text-[15px] leading-relaxed">{currentWritingPrompt.prompt}</p>
              <p className="text-xs text-white/30 mt-3">
                Suggested word count: {currentWritingPrompt.minWords} - {currentWritingPrompt.maxWords} words
              </p>
            </div>

            {/* Writing Area */}
            {!hasEvaluation ? (
              <div className="glass-card p-6 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-white/40 uppercase tracking-wider">Your Response</p>
                  <span className={`text-xs font-medium ${wc < currentWritingPrompt.minWords ? 'text-amber-400' : wc > currentWritingPrompt.maxWords ? 'text-red-400' : 'text-green-400'}`}>
                    {wc} words
                  </span>
                </div>
                <textarea
                  value={currentWritingText}
                  onChange={(e) => setWritingTexts(prev => ({ ...prev, [currentWritingPrompt.id]: e.target.value }))}
                  placeholder="Start writing your response here..."
                  className="w-full h-64 bg-white/5 border border-white/10 rounded-xl p-4 text-white/80 text-sm leading-relaxed placeholder-white/20 focus:outline-none focus:border-purple-500/40 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                />
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={evaluateWriting}
                    disabled={evaluatingWriting || wc < 10}
                    className="flex items-center gap-2 rounded-xl px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white text-sm font-medium transition-all shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {evaluatingWriting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    {evaluatingWriting ? 'Evaluating...' : 'Evaluate Writing'}
                  </button>
                </div>
              </div>
            ) : (
              /* Writing Evaluation */
              <div className="glass-card p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="h-5 w-5 text-purple-400" />
                  <h3 className="text-lg font-semibold text-white">Writing Evaluation</h3>
                  <span className="ml-auto inline-flex items-center rounded-full px-3 py-1 text-xs font-bold bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-violet-300 border border-violet-500/30">
                    {evaluation!.cefrLevel} - Score: {evaluation!.score}/100
                  </span>
                </div>

                <p className="text-sm text-white/60 mb-4">{evaluation!.feedback}</p>

                <div className="grid gap-3 sm:grid-cols-2 mb-4">
                  {evaluation!.strengths.length > 0 && (
                    <div>
                      <p className="text-xs text-green-400 uppercase tracking-wider mb-2">Strengths</p>
                      {evaluation!.strengths.map((s, i) => (
                        <div key={i} className="flex items-start gap-2 mb-1">
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-400 shrink-0 mt-0.5" />
                          <span className="text-xs text-white/60">{s}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {evaluation!.improvements.length > 0 && (
                    <div>
                      <p className="text-xs text-amber-400 uppercase tracking-wider mb-2">Improvements</p>
                      {evaluation!.improvements.map((s, i) => (
                        <div key={i} className="flex items-start gap-2 mb-1">
                          <AlertCircle className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span className="text-xs text-white/60">{s}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Show the written text */}
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Your Response</p>
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-sm text-white/60 leading-relaxed">{currentWritingText}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setWritingIdx(Math.max(0, writingIdx - 1))}
                disabled={writingIdx === 0}
                className="flex items-center gap-2 rounded-xl px-5 py-2.5 glass-button text-white text-sm font-medium cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </button>
              {writingIdx < WRITING_PROMPTS.length - 1 ? (
                <button
                  onClick={() => setWritingIdx(writingIdx + 1)}
                  className="flex items-center gap-2 rounded-xl px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white text-sm font-medium transition-all shadow-lg shadow-purple-500/25 cursor-pointer"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={submitWriting}
                  className="flex items-center gap-2 rounded-xl px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white text-sm font-medium transition-all shadow-lg cursor-pointer"
                >
                  <CheckCircle2 className="h-4 w-4" /> Complete Writing
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ======================================================
     RESULTS PHASE
     ====================================================== */
  if (phase === 'results' && results) {
    const cefrGradients: Record<string, string> = {
      A1: 'from-blue-400 to-blue-600',
      A2: 'from-green-400 to-green-600',
      B1: 'from-yellow-400 to-yellow-600',
      B2: 'from-orange-400 to-orange-600',
      C1: 'from-red-400 to-red-600',
      C2: 'from-purple-400 to-purple-600',
    };

    return (
      <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
        <Navbar />
        <div className="flex-1 py-8 px-4">
          <div className="container max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                <Award className="h-3.5 w-3.5 text-purple-400" />
                <span className="text-xs text-purple-300 font-medium uppercase tracking-wider">Assessment Complete</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Your <span className="gradient-text-static">CEFR Results</span>
              </h1>
            </div>

            {/* Main Result */}
            <div className="glass-card-neon p-8 mb-6 text-center">
              <div className={`inline-flex items-center justify-center h-24 w-24 rounded-2xl bg-gradient-to-br ${cefrGradients[results.assessment.cefrLevel] || 'from-purple-400 to-purple-600'} text-white text-4xl font-black shadow-2xl mb-4`}>
                {results.assessment.cefrLevel}
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">CEFR Level: {results.assessment.cefrLevel}</h2>
              <p className="text-lg text-white/60">Overall Score: {results.assessment.score}/100</p>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="glass-card p-4">
                  <p className="text-2xl font-bold text-white">{results.results.correctCount}</p>
                  <p className="text-xs text-white/40">Correct</p>
                </div>
                <div className="glass-card p-4">
                  <p className="text-2xl font-bold text-white">{results.results.totalQuestions}</p>
                  <p className="text-xs text-white/40">Total Questions</p>
                </div>
                <div className="glass-card p-4">
                  <p className="text-2xl font-bold text-white">{results.results.percentage}%</p>
                  <p className="text-xs text-white/40">Accuracy</p>
                </div>
              </div>
            </div>

            {/* Certificate */}
            {results.certificate && (
              <div className="glass-card p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <Award className="h-5 w-5 text-purple-400" />
                  <h3 className="text-lg font-semibold text-white">Your Certificate</h3>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                  <div>
                    <p className="font-medium text-white">CEFR {results.certificate.cefrLevel} Certificate</p>
                    <p className="text-xs text-white/40">Score: {results.certificate.score}/100 | ID: {results.certificate.verificationId}</p>
                  </div>
                  <a href={`/api/certificates/download/${results.certificate.verificationId}`} target="_blank" rel="noopener noreferrer">
                    <button className="flex items-center gap-1 rounded-lg px-4 py-2 text-xs font-medium bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg cursor-pointer">
                      Download PDF
                    </button>
                  </a>
                </div>
              </div>
            )}

            {/* Message */}
            <div className="glass-card p-6 mb-6">
              <p className="text-sm text-white/60 text-center">{results.message}</p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center justify-center gap-2 rounded-xl px-6 py-3 glass-button text-white font-medium cursor-pointer"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => {
                  setPhase('select');
                  setAssessmentId(null);
                  setSkillStatuses({ reading: 'pending', listening: 'pending', speaking: 'pending', writing: 'pending' });
                  setReadingIdx(0);
                  setListeningIdx(0);
                  setSpeakingIdx(0);
                  setWritingIdx(0);
                  setReadingAnswers({});
                  setListeningAnswers({});
                  setSpeakingTranscript('');
                  setSpeakingEvaluations({});
                  setWritingTexts({});
                  setWritingEvaluations({});
                  setResults(null);
                  setError(null);
                }}
                className="flex items-center justify-center gap-2 rounded-xl px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-medium transition-all shadow-lg cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" /> Retake Test
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ======================================================
     FALLBACK - LOADING
     ====================================================== */
  return (
    <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-purple-400 animate-spin" />
      </div>
    </div>
  );
}
