'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

/* ============================================================
   TYPES
   ============================================================ */
interface ConversationEntry {
  id: string;
  timestamp: string;
  userMessage: string;
  lexiResponse: string;
  topic: string;
  sentiment: 'positive' | 'neutral' | 'negative' | 'frustrated';
}

interface WeakArea {
  skill: string;
  topic: string;
  score: number;
  lastUpdated: string;
  attempts: number;
}

interface UserPreferences {
  cefrLevel: string;
  nativeLanguage: string;
  learningGoals: string[];
  preferredStudyTime: string;
  dailyGoalMinutes: number;
  notificationsEnabled: boolean;
}

interface LearningGoal {
  id: string;
  title: string;
  targetDate: string;
  progress: number;
  completed: boolean;
}

interface LexiMemoryState {
  conversations: ConversationEntry[];
  weakAreas: WeakArea[];
  preferences: UserPreferences;
  learningGoals: LearningGoal[];
  userId: string;
  createdAt: string;
  lastActiveAt: string;
}

interface LexiMemoryContextType {
  // State
  conversations: ConversationEntry[];
  weakAreas: WeakArea[];
  preferences: UserPreferences;
  learningGoals: LearningGoal[];

  // Actions
  addConversation: (userMsg: string, lexiResponse: string, topic: string, sentiment: ConversationEntry['sentiment']) => void;
  updateWeakArea: (skill: string, topic: string, score: number) => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  addLearningGoal: (goal: Omit<LearningGoal, 'id'>) => void;
  updateLearningGoal: (id: string, progress: number) => void;

  // Getters
  getPersonalizedGreeting: () => string;
  getSuggestedPractice: () => { skill: string; topic: string; reason: string }[];
  getConversationContext: () => string;
}

/* ============================================================
   DEFAULTS
   ============================================================ */
const DEFAULT_PREFERENCES: UserPreferences = {
  cefrLevel: 'A2',
  nativeLanguage: '',
  learningGoals: [],
  preferredStudyTime: 'morning',
  dailyGoalMinutes: 30,
  notificationsEnabled: true,
};

const MAX_CONVERSATIONS = 100;
const MAX_WEAK_AREAS = 20;

/* ============================================================
   CONTEXT
   ============================================================ */
const LexiMemoryContext = createContext<LexiMemoryContextType | null>(null);

/* ============================================================
   STORAGE HELPERS
   ============================================================ */
function getStorageKey(userId: string): string {
  return `lexi-memory-${userId}`;
}

function loadState(userId: string): LexiMemoryState {
  if (typeof window === 'undefined') {
    return createDefaultState(userId);
  }
  try {
    const raw = localStorage.getItem(getStorageKey(userId));
    if (raw) {
      return JSON.parse(raw) as LexiMemoryState;
    }
  } catch {
    // ignore
  }
  return createDefaultState(userId);
}

function createDefaultState(userId: string): LexiMemoryState {
  return {
    conversations: [],
    weakAreas: [],
    preferences: DEFAULT_PREFERENCES,
    learningGoals: [],
    userId,
    createdAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
  };
}

function saveState(state: LexiMemoryState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(getStorageKey(state.userId), JSON.stringify(state));
  } catch {
    // ignore
  }
}

/* ============================================================
   GREETING LOGIC
   ============================================================ */
function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 6) return 'Burning the midnight oil';
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 21) return 'Good evening';
  return 'Still studying at this hour';
}

/* ============================================================
   PROVIDER
   ============================================================ */
export function LexiMemoryProvider({
  children,
  userId = 'default',
}: {
  children: React.ReactNode;
  userId?: string;
}) {
  const [state, setState] = useState<LexiMemoryState>(() => loadState(userId));

  // Persist on change
  useEffect(() => {
    saveState(state);
  }, [state]);

  /* ---- addConversation ---- */
  const addConversation = useCallback(
    (userMsg: string, lexiResponse: string, topic: string, sentiment: ConversationEntry['sentiment']) => {
      const entry: ConversationEntry = {
        id: `conv-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        timestamp: new Date().toISOString(),
        userMessage: userMsg,
        lexiResponse,
        topic,
        sentiment,
      };

      setState((prev) => {
        const conversations = [entry, ...prev.conversations].slice(0, MAX_CONVERSATIONS);
        return { ...prev, conversations };
      });
    },
    []
  );

  /* ---- updateWeakArea ---- */
  const updateWeakArea = useCallback((skill: string, topic: string, score: number) => {
    setState((prev) => {
      const existingIndex = prev.weakAreas.findIndex(
        (wa) => wa.skill === skill && wa.topic === topic
      );

      let weakAreas: WeakArea[];
      if (existingIndex >= 0) {
        weakAreas = prev.weakAreas.map((wa, i) =>
          i === existingIndex
            ? {
                ...wa,
                score: (wa.score * wa.attempts + score) / (wa.attempts + 1),
                attempts: wa.attempts + 1,
                lastUpdated: new Date().toISOString(),
              }
            : wa
        );
      } else {
        const newArea: WeakArea = {
          skill,
          topic,
          score,
          lastUpdated: new Date().toISOString(),
          attempts: 1,
        };
        weakAreas = [newArea, ...prev.weakAreas].slice(0, MAX_WEAK_AREAS);
      }

      // Sort by score ascending (weakest first)
      weakAreas.sort((a, b) => a.score - b.score);

      return { ...prev, weakAreas };
    });
  }, []);

  /* ---- updatePreferences ---- */
  const updatePreferences = useCallback((prefs: Partial<UserPreferences>) => {
    setState((prev) => ({
      ...prev,
      preferences: { ...prev.preferences, ...prefs },
    }));
  }, []);

  /* ---- addLearningGoal ---- */
  const addLearningGoal = useCallback((goal: Omit<LearningGoal, 'id'>) => {
    const newGoal: LearningGoal = {
      ...goal,
      id: `goal-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    };
    setState((prev) => ({
      ...prev,
      learningGoals: [...prev.learningGoals, newGoal],
    }));
  }, []);

  /* ---- updateLearningGoal ---- */
  const updateLearningGoal = useCallback((id: string, progress: number) => {
    setState((prev) => ({
      ...prev,
      learningGoals: prev.learningGoals.map((g) =>
        g.id === id
          ? { ...g, progress, completed: progress >= 100 }
          : g
      ),
    }));
  }, []);

  /* ---- getPersonalizedGreeting ---- */
  const getPersonalizedGreeting = useCallback((): string => {
    const timeGreeting = getTimeGreeting();
    const convCount = state.conversations.length;
    const streak = calculateStreak(state.conversations);

    if (convCount === 0) {
      return `${timeGreeting}! Welcome to your English learning journey. I'm Lexi, your AI tutor. Let's get started!`;
    }

    const lastConv = state.conversations[0];
    const daysSinceLastChat = Math.floor(
      (Date.now() - new Date(lastConv.timestamp).getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceLastChat > 7) {
      return `${timeGreeting}! It's been a while since our last chat. Let's jump back in — your skills are waiting!`;
    }

    if (streak >= 7) {
      return `${timeGreeting}! Amazing ${streak}-day streak! Your dedication is paying off. Keep it up!`;
    }

    if (streak >= 3) {
      return `${timeGreeting}! ${streak} days strong. Consistency is the key to fluency!`;
    }

    const weakestSkill = state.weakAreas[0];
    if (weakestSkill) {
      return `${timeGreeting}! Ready to work on ${weakestSkill.skill.toLowerCase()} — ${weakestSkill.topic}? I have some great exercises for you.`;
    }

    return `${timeGreeting}! What would you like to practice today?`;
  }, [state.conversations, state.weakAreas]);

  /* ---- getSuggestedPractice ---- */
  const getSuggestedPractice = useCallback((): { skill: string; topic: string; reason: string }[] => {
    const suggestions: { skill: string; topic: string; reason: string }[] = [];

    // Based on weak areas
    state.weakAreas.slice(0, 3).forEach((wa) => {
      suggestions.push({
        skill: wa.skill,
        topic: wa.topic,
        reason: `Score: ${Math.round(wa.score * 100)}% — needs improvement (${wa.attempts} attempts)`,
      });
    });

    // If not enough weak areas, suggest based on what's missing
    const coveredSkills = new Set(state.weakAreas.map((wa) => wa.skill));
    const allSkills = ['Reading', 'Writing', 'Listening', 'Speaking', 'Grammar', 'Vocabulary'];
    allSkills.forEach((skill) => {
      if (!coveredSkills.has(skill) && suggestions.length < 5) {
        suggestions.push({
          skill,
          topic: 'General Practice',
          reason: 'No recent practice data — try a diagnostic exercise',
        });
      }
    });

    return suggestions.slice(0, 5);
  }, [state.weakAreas]);

  /* ---- getConversationContext ---- */
  const getConversationContext = useCallback((): string => {
    const recent = state.conversations.slice(0, 10);
    if (recent.length === 0) return 'No previous conversation history.';

    return recent
      .map(
        (c, i) =>
          `[${i + 1}] (${new Date(c.timestamp).toLocaleDateString()}) User: "${c.userMessage}" → Lexi: "${c.lexiResponse.slice(0, 200)}" [${c.topic}, ${c.sentiment}]`
      )
      .join('\n');
  }, [state.conversations]);

  /* ---- Context value ---- */
  const contextValue = useMemo<LexiMemoryContextType>(
    () => ({
      conversations: state.conversations,
      weakAreas: state.weakAreas,
      preferences: state.preferences,
      learningGoals: state.learningGoals,
      addConversation,
      updateWeakArea,
      updatePreferences,
      addLearningGoal,
      updateLearningGoal,
      getPersonalizedGreeting,
      getSuggestedPractice,
      getConversationContext,
    }),
    [
      state.conversations,
      state.weakAreas,
      state.preferences,
      state.learningGoals,
      addConversation,
      updateWeakArea,
      updatePreferences,
      addLearningGoal,
      updateLearningGoal,
      getPersonalizedGreeting,
      getSuggestedPractice,
      getConversationContext,
    ]
  );

  return (
    <LexiMemoryContext.Provider value={contextValue}>
      {children}
    </LexiMemoryContext.Provider>
  );
}

/* ============================================================
   HOOK
   ============================================================ */
export function useLexiMemory(): LexiMemoryContextType {
  const context = useContext(LexiMemoryContext);
  if (!context) {
    throw new Error('useLexiMemory must be used within a LexiMemoryProvider');
  }
  return context;
}

/* ============================================================
   HELPER: Calculate streak from conversations
   ============================================================ */
function calculateStreak(conversations: ConversationEntry[]): number {
  if (conversations.length === 0) return 0;

  const uniqueDays = new Set<string>();
  conversations.forEach((c) => {
    uniqueDays.add(new Date(c.timestamp).toISOString().split('T')[0]);
  });

  const sortedDays = Array.from(uniqueDays).sort().reverse();
  const today = new Date().toISOString().split('T')[0];

  // Check if active today or yesterday
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (sortedDays[0] !== today && sortedDays[0] !== yesterdayStr) return 0;

  let streak = 1;
  for (let i = 1; i < sortedDays.length; i++) {
    const curr = new Date(sortedDays[i - 1]);
    const prev = new Date(sortedDays[i]);
    const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
    if (Math.round(diff) === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
