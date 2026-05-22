/* ======================================================
   SHARED CONSTANTS FOR HOME PAGE COMPONENTS
   ====================================================== */

export const CEFR_LEVEL_COLORS: Record<string, string> = {
  A1: '#3b82f6', A2: '#22c55e', B1: '#eab308', B2: '#f97316', C1: '#ef4444', C2: '#a855f7',
};

export const CEFR_LEVEL_DESCS: Record<string, string> = {
  A1: 'Beginner', A2: 'Elementary', B1: 'Intermediate', B2: 'Upper Intermediate', C1: 'Advanced', C2: 'Proficient',
};

export const WAVEFORM_HEIGHTS = Array.from({ length: 30 }, (_, i) =>
  `${(6 + Math.sin(i * 0.4) * 5 + 5).toFixed(2)}px`
);

export const WAVEFORM_DELAYS = Array.from({ length: 30 }, (_, i) =>
  `${(i * 0.06).toFixed(2)}s`
);

export const CEFR_DIMENSIONS = [
  { letter: 'G', label: 'Grammar', color: 'from-purple-500 to-violet-500' },
  { letter: 'V', label: 'Vocabulary', color: 'from-pink-500 to-rose-500' },
  { letter: 'F', label: 'Fluency', color: 'from-blue-500 to-cyan-500' },
  { letter: 'P', label: 'Pronunciation', color: 'from-green-500 to-emerald-500' },
  { letter: 'C', label: 'Coherence', color: 'from-orange-500 to-amber-500' },
  { letter: 'I', label: 'Interaction', color: 'from-red-500 to-pink-500' },
];

export const CEFR_LEVELS = [
  { level: 'A1', title: 'Beginner', percentage: 17, desc: 'Can understand and use familiar everyday expressions and very basic phrases. Can introduce themselves and others.', items: ['Basic greetings', 'Numbers & dates', 'Simple questions', 'Common words'], color: '#3b82f6' },
  { level: 'A2', title: 'Elementary', percentage: 33, desc: 'Can communicate in simple and routine tasks requiring a direct exchange of information on familiar and routine matters.', items: ['Shopping & directions', 'Simple conversations', 'Basic descriptions', 'Routine situations'], color: '#22c55e' },
  { level: 'B1', title: 'Intermediate', percentage: 50, desc: 'Can deal with most situations likely to arise while travelling in an area where the language is spoken. Can produce simple connected text on familiar topics.', items: ['Travel situations', 'Opinions & preferences', 'Past events', 'Future plans'], color: '#eab308' },
  { level: 'B2', title: 'Upper Intermediate', percentage: 67, desc: 'Can interact with a degree of fluency and spontaneity that makes regular interaction with native speakers quite possible without strain for either party.', items: ['Complex discussions', 'Abstract topics', 'News & media', 'Professional contexts'], color: '#f97316' },
  { level: 'C1', title: 'Advanced', percentage: 83, desc: 'Can express ideas fluently and spontaneously without much obvious searching for expressions. Can use language flexibly and effectively for social, academic, and professional purposes.', items: ['Academic writing', 'Implicit meaning', 'Cultural nuance', 'Extended discourse'], color: '#ef4444' },
  { level: 'C2', title: 'Proficient', percentage: 100, desc: 'Can understand virtually everything heard or read with ease. Can express themselves spontaneously, very fluently, and precisely, differentiating finer shades of meaning.', items: ['Near-native fluency', 'Complex argumentation', 'Literary analysis', 'Complete mastery'], color: '#a855f7' },
];
