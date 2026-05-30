'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Mic, MicOff, Play, Square, SkipForward, RotateCcw,
  Volume2, MessageSquare, Star, Lightbulb, CheckCircle2,
  ChevronRight, Brain, Sparkles, Clock, Target
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

/* ── Types ─────────────────────────────────────── */
export interface SpeakingResult {
  prompt: string;
  transcription: string;
  score: number;
  feedback: string;
  duration: number;
}

interface LexiSpeakingPracticeProps {
  onSessionComplete: (results: SpeakingResult[]) => void;
}

/* ── Constants ─────────────────────────────────── */
const TOPICS = [
  { id: 'daily', label: 'Daily Life', icon: '🏠', gradient: 'from-cyan-400 to-blue-500' },
  { id: 'travel', label: 'Travel', icon: '✈️', gradient: 'from-blue-400 to-indigo-500' },
  { id: 'business', label: 'Business', icon: '💼', gradient: 'from-indigo-400 to-purple-500' },
  { id: 'academic', label: 'Academic', icon: '📚', gradient: 'from-purple-400 to-violet-500' },
  { id: 'casual', label: 'Casual', icon: '☕', gradient: 'from-violet-400 to-blue-500' },
];

const PROMPTS: Record<string, { topic: string; question: string }[]> = {
  daily: [
    { topic: 'Morning Routine', question: 'Describe your typical morning routine from the time you wake up until you leave the house.' },
    { topic: 'Cooking', question: 'Explain how to cook your favorite meal, step by step.' },
    { topic: 'Weekend Plans', question: 'What do you usually do on weekends? Describe your ideal weekend.' },
    { topic: 'Shopping', question: 'Talk about your shopping habits. Do you prefer online shopping or going to stores?' },
    { topic: 'Hobbies', question: 'Describe a hobby you enjoy and explain why you find it interesting.' },
  ],
  travel: [
    { topic: 'Dream Destination', question: 'If you could travel anywhere in the world, where would you go and why?' },
    { topic: 'Airport Experience', question: 'Describe a memorable experience you had at an airport.' },
    { topic: 'Cultural Differences', question: 'What cultural differences have you noticed when traveling abroad?' },
    { topic: 'Travel Tips', question: 'What advice would you give to someone traveling to your country for the first time?' },
    { topic: 'Accommodation', question: 'Compare staying in a hotel versus staying with locals when traveling.' },
  ],
  business: [
    { topic: 'Job Interview', question: 'How would you describe your strengths and weaknesses in a job interview?' },
    { topic: 'Meetings', question: 'Describe how you typically prepare for and participate in meetings at work.' },
    { topic: 'Leadership', question: 'What qualities do you think make an effective leader?' },
    { topic: 'Problem Solving', question: 'Describe a challenging situation at work and how you resolved it.' },
    { topic: 'Teamwork', question: 'Explain the importance of teamwork and give an example of successful collaboration.' },
  ],
  academic: [
    { topic: 'Research', question: 'Describe a research topic you find fascinating and explain its significance.' },
    { topic: 'Study Methods', question: 'What study methods work best for you? Explain your approach to learning.' },
    { topic: 'Education System', question: 'Compare the education system in your country with one you admire.' },
    { topic: 'Critical Thinking', question: 'Why is critical thinking important in academic studies? Give an example.' },
    { topic: 'Academic Writing', question: 'Describe the process you follow when writing a research paper.' },
  ],
  casual: [
    { topic: 'Movies', question: 'Talk about a movie that changed your perspective on something.' },
    { topic: 'Music', question: 'What kind of music do you enjoy? How does it make you feel?' },
    { topic: 'Friends', question: 'Describe your best friend and explain what makes your friendship special.' },
    { topic: 'Food Culture', question: 'Describe a traditional dish from your culture and its significance.' },
    { topic: 'Technology', question: 'How has technology changed the way you communicate with others?' },
  ],
};

const MOCK_FEEDBACK: string[] = [
  'Good use of complex sentences. Try to vary your sentence openings more.',
  'Your pronunciation of technical terms could be clearer. Practice stress patterns.',
  'Excellent vocabulary range! Work on linking words for smoother transitions.',
  'Good fluency overall. Pay attention to article usage (a/an/the).',
  'Strong argumentation. Try to include more specific examples to support your points.',
];

/* ── Main Component ────────────────────────────── */
export default function LexiSpeakingPractice({ onSessionComplete }: LexiSpeakingPracticeProps) {
  const [selectedTopic, setSelectedTopic] = useState<string>('daily');
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [transcription, setTranscription] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);
  const [currentFeedback, setCurrentFeedback] = useState('');
  const [results, setResults] = useState<SpeakingResult[]>([]);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [waveformData, setWaveformData] = useState<number[]>(Array(24).fill(4));
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const waveRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const totalPrompts = 5;

  const prompts = PROMPTS[selectedTopic] ?? PROMPTS.daily;
  const currentPrompt = prompts[currentPromptIndex];
  const progressPct = Math.round((results.length / totalPrompts) * 100);

  // Recording timer
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingDuration(p => p + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRecording]);

  // Waveform animation
  const isActive = isRecording || isListening;
  useEffect(() => {
    if (isActive) {
      waveRef.current = setInterval(() => {
        setWaveformData(prev => prev.map(() => Math.floor(Math.random() * 28) + 4));
      }, 120);
    } else if (waveRef.current) {
      clearInterval(waveRef.current);
      waveRef.current = null;
    }
    return () => { if (waveRef.current) clearInterval(waveRef.current); };
  }, [isActive]);

  // Use flat bars when inactive, animated state when active
  const displayWaveform = isActive ? waveformData : Array(24).fill(4);

  const formatDuration = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const handleStartRecording = useCallback(() => {
    setIsRecording(true);
    setIsListening(true);
    setTranscription('');
    setShowFeedback(false);
  }, []);

  const handleStopRecording = useCallback(() => {
    setIsRecording(false);
    setIsListening(false);
    // Simulate transcription
    const mockTranscriptions = [
      'I usually wake up around seven in the morning. First, I brush my teeth and take a quick shower. Then I make breakfast — usually oatmeal with fruits. After that, I check my emails and get ready for work.',
      'My dream destination is Japan because I love the culture and food. I would visit Tokyo and Kyoto to see the temples and try authentic sushi.',
      'In my experience, the most important quality in a leader is empathy. A good leader listens to their team and creates an environment where everyone feels valued.',
    ];
    const newTranscription = mockTranscriptions[currentPromptIndex % mockTranscriptions.length];
    const newScore = Math.floor(Math.random() * 25) + 70; // 70-94
    const newFeedback = MOCK_FEEDBACK[currentPromptIndex % MOCK_FEEDBACK.length];

    setTranscription(newTranscription);
    setCurrentScore(newScore);
    setCurrentFeedback(newFeedback);
    setShowFeedback(true);
  }, [currentPromptIndex]);

  const handleNext = useCallback(() => {
    const newResult: SpeakingResult = {
      prompt: currentPrompt.question,
      transcription,
      score: currentScore,
      feedback: currentFeedback,
      duration: recordingDuration,
    };

    const newResults = [...results, newResult];
    setResults(newResults);

    if (currentPromptIndex + 1 >= totalPrompts) {
      setSessionComplete(true);
      onSessionComplete(newResults);
    } else {
      setCurrentPromptIndex(p => p + 1);
      setTranscription('');
      setShowFeedback(false);
      setRecordingDuration(0);
      setCurrentScore(0);
    }
  }, [currentPrompt, transcription, currentScore, currentFeedback, recordingDuration, results, currentPromptIndex, onSessionComplete]);

  const handleRestart = useCallback(() => {
    setCurrentPromptIndex(0);
    setResults([]);
    setSessionComplete(false);
    setTranscription('');
    setShowFeedback(false);
    setRecordingDuration(0);
    setCurrentScore(0);
    setIsRecording(false);
    setIsListening(false);
  }, []);

  const handleTopicChange = (topic: string) => {
    if (isRecording) return;
    setSelectedTopic(topic);
    setCurrentPromptIndex(0);
    setResults([]);
    setSessionComplete(false);
    setTranscription('');
    setShowFeedback(false);
    setRecordingDuration(0);
    setCurrentScore(0);
  };

  const scoreColor = currentScore >= 85 ? 'text-cyan-400' : currentScore >= 70 ? 'text-blue-400' : 'text-indigo-400';
  const scoreGradient = currentScore >= 85 ? 'from-cyan-400 to-blue-500' : currentScore >= 70 ? 'from-blue-400 to-indigo-500' : 'from-indigo-400 to-purple-500';

  // Session complete view
  if (sessionComplete) {
    const avgScore = Math.round(results.reduce((a, r) => a + r.score, 0) / results.length);
    return (
      <div className="space-y-6">
        <div className="glass-card-neon p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg shadow-blue-500/20">
              <CheckCircle2 className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Session Complete! 🎉</h2>
          <p className="text-white/40 mb-6">You completed {results.length} speaking prompts</p>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
              <p className="text-2xl font-bold text-white">{avgScore}%</p>
              <p className="text-[10px] text-white/30">Avg. Score</p>
            </div>
            <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
              <p className="text-2xl font-bold text-white">{formatDuration(results.reduce((a, r) => a + r.duration, 0))}</p>
              <p className="text-[10px] text-white/30">Total Time</p>
            </div>
            <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
              <p className="text-2xl font-bold text-white">{results.length}</p>
              <p className="text-[10px] text-white/30">Prompts</p>
            </div>
          </div>
          <button
            onClick={handleRestart}
            className="flex items-center gap-2 mx-auto rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" /> Practice Again
          </button>
        </div>

        {/* Results breakdown */}
        <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
          {results.map((r, i) => (
            <div key={i} className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 text-white text-[10px] font-bold">
                  {i + 1}
                </span>
                <span className="text-xs text-white/40 truncate flex-1">{r.prompt.slice(0, 60)}…</span>
                <span className={`text-sm font-bold ${r.score >= 85 ? 'text-cyan-400' : r.score >= 70 ? 'text-blue-400' : 'text-indigo-400'}`}>
                  {r.score}%
                </span>
              </div>
              <p className="text-[10px] text-white/30">{r.feedback}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Header ──────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-indigo-500/20">
            <Mic className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Speaking Practice</h2>
            <p className="text-xs text-white/40">Guided by Lexi · {results.length}/{totalPrompts} completed</p>
          </div>
        </div>
        {results.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="h-2 w-24 rounded-full bg-white/[0.06] overflow-hidden hidden sm:block">
              <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-700" style={{ width: `${progressPct}%` }} />
            </div>
            <span className="text-xs font-medium text-cyan-300">{progressPct}%</span>
          </div>
        )}
      </div>

      {/* ── Topics Selector ─────────────────── */}
      <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {TOPICS.map(topic => (
          <button
            key={topic.id}
            onClick={() => handleTopicChange(topic.id)}
            disabled={isRecording}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-medium whitespace-nowrap transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
              selectedTopic === topic.id
                ? `bg-gradient-to-r ${topic.gradient} text-white shadow-lg`
                : 'bg-white/[0.04] border border-white/5 text-white/50 hover:text-white/70 hover:border-white/10'
            }`}
          >
            <span>{topic.icon}</span> {topic.label}
          </button>
        ))}
      </div>

      {/* ── Lexi Avatar + Speech Bubble ─────── */}
      <div className="glass-card-neon p-5">
        <div className="flex items-start gap-4">
          {/* Lexi Avatar */}
          <div className="relative shrink-0">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-500/20">
              <Brain className="h-7 w-7 text-white" />
            </div>
            {(isListening || isRecording) && (
              <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500 border-2 border-[#0F0A1E]">
                <Volume2 className="h-2.5 w-2.5 text-white" />
              </div>
            )}
          </div>

          {/* Speech bubble */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-blue-300">Lexi</span>
              <span className="text-[10px] text-white/20">AI Speaking Coach</span>
            </div>
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl rounded-tl-sm p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <Target className="h-3 w-3 text-cyan-400" />
                <span className="text-[10px] font-medium text-cyan-300 uppercase tracking-wider">{currentPrompt.topic}</span>
              </div>
              <p className="text-sm text-white/80 leading-relaxed">{currentPrompt.question}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Voice Visualization ─────────────── */}
      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
        <div className="flex items-center justify-center gap-[3px] h-16 mb-4">
          {displayWaveform.map((h, i) => (
            <div
              key={i}
              className={`w-[3px] rounded-full transition-all duration-100 ${
                isRecording
                  ? 'bg-gradient-to-t from-cyan-400 to-blue-500'
                  : isListening
                  ? 'bg-gradient-to-t from-blue-400 to-indigo-500'
                  : 'bg-white/[0.08]'
              }`}
              style={{ height: `${h}px` }}
            />
          ))}
        </div>

        {/* Recording Controls */}
        <div className="flex items-center justify-center gap-4">
          {!isRecording ? (
            <button
              onClick={handleStartRecording}
              disabled={showFeedback}
              className="relative flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <Mic className="h-5 w-5" />
              Start Recording
              {isRecording && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-400" />
                </span>
              )}
            </button>
          ) : (
            <button
              onClick={handleStopRecording}
              className="relative animate-pulse-slow flex items-center gap-2 rounded-2xl bg-red-500/20 border border-red-500/30 px-6 py-3 text-sm font-medium text-red-300 hover:bg-red-500/30 transition-all cursor-pointer"
            >
              <div className="relative">
                <Square className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-400" />
                </span>
              </div>
              Stop Recording
              <span className="ml-2 font-mono text-xs text-red-400/60">{formatDuration(recordingDuration)}</span>
            </button>
          )}
        </div>

        {isRecording && (
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-400" />
            </span>
            <span className="text-xs text-red-300/60">Recording in progress…</span>
          </div>
        )}
      </div>

      {/* ── Transcription Display ───────────── */}
      {transcription && (
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 animate-slide-up">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="h-4 w-4 text-indigo-400" />
            <h4 className="text-sm font-semibold text-white">Your Response</h4>
          </div>
          <p className="text-sm text-white/60 leading-relaxed">{transcription}</p>
        </div>
      )}

      {/* ── Feedback Card ───────────────────── */}
      {showFeedback && (
        <div className="glass-card-neon p-5 animate-slide-up">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <h4 className="text-sm font-semibold text-white">Feedback</h4>
          </div>

          {/* Score */}
          <div className="flex items-center gap-4 mb-4">
            <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${scoreGradient} shadow-lg`}>
              <span className="text-xl font-bold text-white">{currentScore}%</span>
            </div>
            <div className="flex-1">
              <p className={`text-lg font-bold ${scoreColor}`}>Accuracy Score</p>
              <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden mt-1">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${scoreGradient} transition-all duration-700`}
                  style={{ width: `${currentScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* Pronunciation Notes */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-3.5 w-3.5 text-indigo-400" />
              <span className="text-xs font-medium text-indigo-300">Pronunciation Notes</span>
            </div>
            <p className="text-xs text-white/50 leading-relaxed pl-5">
              {currentFeedback}
            </p>
          </div>

          {/* Suggested Improvements */}
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-3.5 w-3.5 text-purple-400" />
              <span className="text-xs font-medium text-purple-300">Suggested Improvements</span>
            </div>
            <ul className="space-y-1.5 pl-5">
              <li className="flex items-start gap-2 text-xs text-white/40">
                <ChevronRight className="h-3 w-3 text-purple-400 shrink-0 mt-0.5" />
                Try using more transitional phrases like &ldquo;Furthermore&rdquo; and &ldquo;In addition&rdquo;
              </li>
              <li className="flex items-start gap-2 text-xs text-white/40">
                <ChevronRight className="h-3 w-3 text-purple-400 shrink-0 mt-0.5" />
                Practice stress patterns on multi-syllable words
              </li>
            </ul>
          </div>

          {/* Next Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-white/30">
              <Clock className="h-3 w-3" />
              {formatDuration(recordingDuration)} recorded
            </div>
            <button
              onClick={handleNext}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all cursor-pointer"
            >
              {currentPromptIndex + 1 >= totalPrompts ? 'Complete Session' : 'Next Prompt'}
              <SkipForward className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Session Progress Bar ────────────── */}
      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-white/40">Session Progress</span>
          <span className="text-xs font-medium text-cyan-300">{results.length}/{totalPrompts}</span>
        </div>
        <div className="flex gap-1.5">
          {Array.from({ length: totalPrompts }).map((_, i) => (
            <div key={i} className="flex-1 h-2 rounded-full overflow-hidden">
              {i < results.length ? (
                <div className="h-full w-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
              ) : i === results.length && (isRecording || showFeedback) ? (
                <div className="h-full w-full rounded-full bg-gradient-to-r from-cyan-400/40 to-blue-500/40 animate-pulse" />
              ) : (
                <div className="h-full w-full rounded-full bg-white/[0.06]" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
