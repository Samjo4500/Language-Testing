/* ======================================================
   SHARED CONSTANTS FOR HOME PAGE COMPONENTS
   ====================================================== */

export const CEFR_LEVEL_COLORS: Record<string, string> = {
  A1: '#3b82f6', A2: '#38bdf8', B1: '#0ea5e9', B2: '#6366f1', C1: '#4f46e5', C2: '#1e40af',
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
  { letter: 'G', label: 'Grammar', color: 'from-indigo-500 to-blue-600' },
  { letter: 'V', label: 'Vocabulary', color: 'from-blue-500 to-indigo-500' },
  { letter: 'F', label: 'Fluency', color: 'from-blue-500 to-cyan-500' },
  { letter: 'P', label: 'Pronunciation', color: 'from-sky-500 to-blue-500' },
  { letter: 'C', label: 'Coherence', color: 'from-blue-500 to-cyan-500' },
  { letter: 'I', label: 'Interaction', color: 'from-indigo-500 to-blue-600' },
];

export const CEFR_LEVELS = [
  { level: 'A1', title: 'Beginner', percentage: 17, desc: 'Can understand and use familiar everyday expressions and very basic phrases. Can introduce themselves and others.', items: ['Basic greetings', 'Numbers & dates', 'Simple questions', 'Common words'], color: '#3b82f6' },
  { level: 'A2', title: 'Elementary', percentage: 33, desc: 'Can communicate in simple and routine tasks requiring a direct exchange of information on familiar and routine matters.', items: ['Shopping & directions', 'Simple conversations', 'Basic descriptions', 'Routine situations'], color: '#38bdf8' },
  { level: 'B1', title: 'Intermediate', percentage: 50, desc: 'Can deal with most situations likely to arise while travelling in an area where the language is spoken. Can produce simple connected text on familiar topics.', items: ['Travel situations', 'Opinions & preferences', 'Past events', 'Future plans'], color: '#0ea5e9' },
  { level: 'B2', title: 'Upper Intermediate', percentage: 67, desc: 'Can interact with a degree of fluency and spontaneity that makes regular interaction with native speakers quite possible without strain for either party.', items: ['Complex discussions', 'Abstract topics', 'News & media', 'Professional contexts'], color: '#6366f1' },
  { level: 'C1', title: 'Advanced', percentage: 83, desc: 'Can express ideas fluently and spontaneously without much obvious searching for expressions. Can use language flexibly and effectively for social, academic, and professional purposes.', items: ['Academic writing', 'Implicit meaning', 'Cultural nuance', 'Extended discourse'], color: '#4f46e5' },
  { level: 'C2', title: 'Proficient', percentage: 100, desc: 'Can understand virtually everything heard or read with ease. Can express themselves spontaneously, very fluently, and precisely, differentiating finer shades of meaning.', items: ['Near-native fluency', 'Complex argumentation', 'Literary analysis', 'Complete mastery'], color: '#1e40af' },
];
