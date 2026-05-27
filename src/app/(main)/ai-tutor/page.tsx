'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { useAuthStore } from '@/lib/auth-store';
import { useHydrated } from '@/hooks/use-hydrated';
import { cn } from '@/lib/utils';
import {
  Bot,
  Send,
  Loader2,
  Sparkles,
  MessageCircle,
  Briefcase,
  GraduationCap,
  Plane,
  ChevronDown,
  Volume2,
  RotateCcw,
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

// ─── Persona Config ─────────────────────────────────────────
interface PersonaConfig {
  id: string;
  label: string;
  icon: React.ElementType;
  emoji: string;
  gradient: string;
  bg: string;
  border: string;
  text: string;
  hoverBg: string;
  shadow: string;
  description: string;
}

const PERSONAS: PersonaConfig[] = [
  {
    id: 'casual',
    label: 'Casual',
    icon: MessageCircle,
    emoji: '😊',
    gradient: 'from-cyan-500 to-blue-500',
    bg: 'bg-cyan-500/15',
    border: 'border-cyan-500/30',
    text: 'text-cyan-400',
    hoverBg: 'hover:bg-cyan-500/10',
    shadow: 'shadow-cyan-500/25',
    description: 'Friendly everyday chat',
  },
  {
    id: 'business',
    label: 'Business',
    icon: Briefcase,
    emoji: '💼',
    gradient: 'from-amber-500 to-yellow-500',
    bg: 'bg-amber-500/15',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    hoverBg: 'hover:bg-amber-500/10',
    shadow: 'shadow-amber-500/25',
    description: 'Professional English coach',
  },
  {
    id: 'exam',
    label: 'Exam Prep',
    icon: GraduationCap,
    emoji: '📝',
    gradient: 'from-violet-500 to-violet-500',
    bg: 'bg-violet-500/15',
    border: 'border-violet-500/30',
    text: 'text-violet-400',
    hoverBg: 'hover:bg-violet-500/10',
    shadow: 'shadow-violet-500/25',
    description: 'IELTS & TOEFL prep',
  },
  {
    id: 'travel',
    label: 'Travel',
    icon: Plane,
    emoji: '✈️',
    gradient: 'from-emerald-500 to-green-500',
    bg: 'bg-emerald-500/15',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    hoverBg: 'hover:bg-emerald-500/10',
    shadow: 'shadow-emerald-500/25',
    description: 'Travel English helper',
  },
];

const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const SUGGESTED_STARTERS: Record<string, string[]> = {
  casual: [
    "Let's practice introducing ourselves!",
    "Tell me about your hobbies and interests.",
    "What did you do last weekend?",
    "Let's talk about our favorite movies!",
  ],
  business: [
    "Help me prepare for a job interview.",
    "How should I write a professional email?",
    "Let's practice a business meeting scenario.",
    "Teach me negotiation phrases.",
  ],
  exam: [
    "Let's practice IELTS Speaking Part 2.",
    "Help me improve my essay writing.",
    "Give me a TOEFL speaking practice task.",
    "What vocabulary boosts my IELTS band score?",
  ],
  travel: [
    "Teach me travel vocabulary for airports.",
    "How do I ask for directions in English?",
    "Let's practice ordering food at a restaurant.",
    "Help me with hotel check-in phrases.",
  ],
};

// ─── Main Component ────────────────────────────────────────
export default function AiTutorPage() {
  const { user, isAuthenticated } = useAuthStore();
  const mounted = useHydrated();
  const router = useRouter();
  const isAuth = mounted && isAuthenticated;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [sending, setSending] = useState(false);
  const [activePersona, setActivePersona] = useState<string>('casual');
  const [activeLevel, setActiveLevel] = useState<string>('B1');
  const [levelDropdownOpen, setLevelDropdownOpen] = useState(false);
  const [ttsLoading, setTtsLoading] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const levelDropdownRef = useRef<HTMLDivElement>(null);

  // Get active persona config
  const persona = PERSONAS.find(p => p.id === activePersona) || PERSONAS[0];
  const PersonaIcon = persona.icon;

  // Redirect if not authenticated
  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/login');
    }
  }, [mounted, isAuthenticated, router]);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, sending, scrollToBottom]);

  // Close level dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (levelDropdownRef.current && !levelDropdownRef.current.contains(e.target as Node)) {
        setLevelDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Send message to AI
  const handleSend = async (overrideMessage?: string) => {
    const text = overrideMessage || messageInput.trim();
    if (!text || sending) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setMessageInput('');
    setSending(true);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      const chatHistory = [...messages, userMessage].map(m => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          messages: chatHistory,
          persona: activePersona,
          level: activeLevel,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const aiMessage: ChatMessage = {
          role: 'assistant',
          content: data.message?.content || data.reply || "I'm having trouble responding right now. Please try again!",
          timestamp: Date.now(),
        };
        setMessages(prev => [...prev, aiMessage]);
      } else if (res.status === 401) {
        router.push('/login');
      } else {
        const errorData = await res.json().catch(() => ({}));
        const aiMessage: ChatMessage = {
          role: 'assistant',
          content: "I'm having a moment — could you try that again? 😅",
          timestamp: Date.now(),
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch {
      const aiMessage: ChatMessage = {
        role: 'assistant',
        content: "Oops, something went wrong on my end. Let's try again! 🔄",
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Text-to-speech for a message
  const handleSpeak = async (text: string, msgTimestamp: number) => {
    if (ttsLoading) return;
    setTtsLoading(String(msgTimestamp));
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ text }),
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audio.onended = () => {
          URL.revokeObjectURL(url);
          setTtsLoading(null);
        };
        audio.onerror = () => setTtsLoading(null);
        audio.play();
      } else {
        setTtsLoading(null);
      }
    } catch {
      setTtsLoading(null);
    }
  };

  // Clear chat
  const handleClearChat = () => {
    setMessages([]);
  };

  // Format message content with basic markdown
  const formatContent = (content: string) => {
    // Bold
    let formatted = content.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    // Italic
    formatted = formatted.replace(/\*(.+?)\*/g, '<em>$1</em>');
    // Code
    formatted = formatted.replace(/`(.+?)`/g, '<code>$1</code>');
    // Line breaks
    formatted = formatted.replace(/\n/g, '<br/>');
    return formatted;
  };

  // Loading state
  if (!mounted) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-cyan-400 animate-spin" />
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuth) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="glass-card p-8 max-w-md text-center">
            <Bot className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Lexi AI</h2>
            <p className="text-white/50 text-sm mb-6">
              Sign in to start practicing English with your AI conversation partner.
            </p>
            <a href="/login">
              <button className="w-full rounded-xl py-3 bg-gradient-to-r from-cyan-600 to-blue-500 text-white font-medium text-sm hover:from-cyan-500 hover:to-blue-400 transition-all">
                Sign In
              </button>
            </a>
          </div>
        </div>
      </div>
    );
  }

  const starters = SUGGESTED_STARTERS[activePersona] || SUGGESTED_STARTERS.casual;

  return (
    <div className="h-screen flex flex-col bg-[#0F0A1E] overflow-hidden">
      <Navbar />

      {/* ─── Chat Container ─── */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* ─── Header ─── */}
        <div className={cn(
          'shrink-0 border-b backdrop-blur-sm px-3 md:px-6 py-3 transition-colors',
          persona.border.replace('/30', '/20')
        )}
          style={{ background: 'rgba(10, 6, 24, 0.5)' }}
        >
          <div className="flex items-center justify-between gap-3">
            {/* Left: Lexi AI Badge */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={cn(
                'h-9 w-9 rounded-lg flex items-center justify-center shrink-0',
                persona.bg
              )}>
                <Bot className={cn('h-5 w-5', persona.text)} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-white truncate">Lexi AI</h3>
                  <span className={cn(
                    'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border whitespace-nowrap',
                    persona.bg, persona.border, persona.text
                  )}>
                    <Sparkles className="h-2.5 w-2.5" />
                    {persona.emoji} {persona.label}
                  </span>
                </div>
                <p className="text-[11px] text-white/35 truncate">{persona.description}</p>
              </div>
            </div>

            {/* Right: Persona Tabs + Level Selector + Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Persona tabs - hidden on small screens */}
              <div className="hidden md:flex items-center gap-1 bg-white/[0.03] rounded-lg p-0.5 border border-white/[0.05]">
                {PERSONAS.map(p => {
                  const Icon = p.icon;
                  const isActive = activePersona === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        setActivePersona(p.id);
                      }}
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer whitespace-nowrap',
                        isActive
                          ? cn(p.bg, p.text, 'border', p.border)
                          : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {p.label}
                    </button>
                  );
                })}
              </div>

              {/* Level Selector Dropdown */}
              <div className="relative" ref={levelDropdownRef}>
                <button
                  onClick={() => setLevelDropdownOpen(!levelDropdownOpen)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border',
                    persona.bg, persona.border, persona.text,
                    'hover:bg-white/[0.08]'
                  )}
                >
                  {activeLevel}
                  <ChevronDown className={cn(
                    'h-3 w-3 transition-transform duration-200',
                    levelDropdownOpen && 'rotate-180'
                  )} />
                </button>
                {levelDropdownOpen && (
                  <div className="absolute right-0 top-full mt-1.5 z-50 py-1 rounded-xl border border-white/[0.08] min-w-[80px] shadow-xl shadow-black/60"
                    style={{ background: 'rgba(15, 10, 30, 0.95)', backdropFilter: 'blur(24px)' }}
                  >
                    {CEFR_LEVELS.map(level => (
                      <button
                        key={level}
                        onClick={() => {
                          setActiveLevel(level);
                          setLevelDropdownOpen(false);
                        }}
                        className={cn(
                          'w-full text-left px-3 py-2 text-xs font-medium transition-colors cursor-pointer',
                          activeLevel === level
                            ? cn(persona.text, persona.bg)
                            : 'text-white/50 hover:text-white hover:bg-white/[0.04]'
                        )}
                      >
                        {level}
                        {activeLevel === level && (
                          <span className="float-right">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Clear Chat */}
              {messages.length > 0 && (
                <button
                  onClick={handleClearChat}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-all cursor-pointer"
                  title="Clear chat"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Mobile persona tabs */}
          <div className="md:hidden mt-2 flex items-center gap-1 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
            {PERSONAS.map(p => {
              const Icon = p.icon;
              const isActive = activePersona === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setActivePersona(p.id)}
                  className={cn(
                    'flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap shrink-0',
                    isActive
                      ? cn(p.bg, p.text, 'border', p.border)
                      : 'text-white/40 hover:text-white/70 bg-white/[0.02] border border-white/[0.05]'
                  )}
                >
                  <Icon className="h-3 w-3" />
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── Messages Area ─── */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4"
        >
          {messages.length === 0 ? (
            /* ─── Welcome Screen ─── */
            <div className="h-full flex items-center justify-center">
              <div className="max-w-lg w-full text-center space-y-6 animate-fade-in">
                {/* AI Avatar */}
                <div className="relative inline-block">
                  <div className={cn(
                    'h-20 w-20 rounded-2xl flex items-center justify-center mx-auto',
                    'bg-gradient-to-br',
                    persona.gradient,
                    'shadow-lg',
                    persona.shadow
                  )}>
                    <Bot className="h-10 w-10 text-white" />
                  </div>
                  <div className={cn(
                    'absolute -bottom-1 -right-1 h-6 w-6 rounded-full flex items-center justify-center text-xs',
                    'bg-[#0F0A1E] border-2',
                    persona.border
                  )}>
                    <Sparkles className={cn('h-3 w-3', persona.text)} />
                  </div>
                </div>

                {/* Welcome text */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Hi{user?.name ? `, ${user.name}` : ''}! I&apos;m Lexi 👋
                  </h2>
                  <p className="text-white/40 text-sm leading-relaxed max-w-sm mx-auto">
                    Your 24/7 AI English conversation partner. I&apos;ll adapt to your level and help you improve through natural conversation.
                  </p>
                </div>

                {/* Current settings badge */}
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <span className={cn(
                    'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border',
                    persona.bg, persona.border, persona.text
                  )}>
                    {persona.emoji} {persona.label} Mode
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border bg-white/[0.04] border-white/[0.08] text-white/50">
                    Level {activeLevel}
                  </span>
                </div>

                {/* Suggested starters */}
                <div className="space-y-2">
                  <p className="text-white/20 text-xs uppercase tracking-wider font-semibold">Try saying...</p>
                  <div className="grid gap-2">
                    {starters.map((starter, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(starter)}
                        className={cn(
                          'w-full text-left p-3 rounded-xl border transition-all cursor-pointer group',
                          'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12]',
                          'hover:bg-white/[0.04]'
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={cn(
                            'h-7 w-7 rounded-lg flex items-center justify-center shrink-0',
                            persona.bg,
                            'group-hover:scale-110 transition-transform'
                          )}>
                            <PersonaIcon className={cn('h-3.5 w-3.5', persona.text)} />
                          </div>
                          <span className="text-sm text-white/50 group-hover:text-white/80 transition-colors">
                            {starter}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ─── Chat Messages ─── */
            <>
              {messages.map((msg, idx) => {
                const isUser = msg.role === 'user';
                const isLast = idx === messages.length - 1;

                return (
                  <div
                    key={msg.timestamp + idx}
                    className={cn(
                      'flex gap-2.5 md:gap-3',
                      isUser ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {/* AI Avatar */}
                    {!isUser && (
                      <div className={cn(
                        'h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5',
                        'bg-gradient-to-br',
                        persona.gradient,
                        'shadow-md',
                        persona.shadow
                      )}>
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div className={cn(
                      'max-w-[80%] md:max-w-[70%] group',
                    )}>
                      <div className={cn(
                        'rounded-2xl px-4 py-2.5 text-sm leading-relaxed break-words',
                        isUser
                          ? cn('bg-gradient-to-r', persona.gradient, 'text-white rounded-br-md')
                          : 'bg-white/[0.06] text-white/80 rounded-bl-md border border-white/[0.06]'
                      )}>
                        {isUser ? (
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        ) : (
                          <div
                            className="chat-markdown whitespace-pre-wrap"
                            dangerouslySetInnerHTML={{ __html: formatContent(msg.content) }}
                          />
                        )}
                      </div>

                      {/* Message actions for AI messages */}
                      {!isUser && (
                        <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleSpeak(msg.content, msg.timestamp)}
                            disabled={ttsLoading === String(msg.timestamp)}
                            className={cn(
                              'flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] transition-all cursor-pointer',
                              persona.text, 'opacity-50 hover:opacity-100',
                              'hover:bg-white/[0.04]'
                            )}
                          >
                            {ttsLoading === String(msg.timestamp) ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Volume2 className="h-3 w-3" />
                            )}
                            Listen
                          </button>
                        </div>
                      )}
                    </div>

                    {/* User Avatar */}
                    {isUser && (
                      <div className={cn(
                        'h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5',
                        'bg-white/10 border border-white/[0.1]'
                      )}>
                        <span className="text-xs font-bold text-white/60">
                          {(user?.name || user?.email || 'U')[0].toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Typing Indicator */}
              {sending && (
                <div className="flex gap-2.5 md:gap-3 justify-start">
                  <div className={cn(
                    'h-8 w-8 rounded-lg flex items-center justify-center shrink-0',
                    'bg-gradient-to-br',
                    persona.gradient,
                    'shadow-md',
                    persona.shadow
                  )}>
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-white/[0.06] border border-white/[0.06] rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className={cn('h-2 w-2 rounded-full', persona.bg, 'chat-typing-dot')} style={{ animationDelay: '0s' }} />
                      <div className={cn('h-2 w-2 rounded-full', persona.bg, 'chat-typing-dot')} style={{ animationDelay: '0.2s' }} />
                      <div className={cn('h-2 w-2 rounded-full', persona.bg, 'chat-typing-dot')} style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* ─── Message Input ─── */}
        <div className={cn(
          'shrink-0 border-t backdrop-blur-sm p-3 md:p-4 transition-colors',
          persona.border.replace('/30', '/20')
        )}
          style={{ background: 'rgba(10, 6, 24, 0.5)' }}
        >
          <div className="flex items-end gap-2 max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value.slice(0, 1000))}
                onKeyDown={handleKeyDown}
                placeholder={`Chat with Lexi in ${persona.label} mode...`}
                rows={1}
                disabled={sending}
                className={cn(
                  'w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm',
                  'focus:outline-none resize-none min-h-[42px] max-h-[120px]',
                  'placeholder:text-white/25 disabled:opacity-50',
                  sending ? 'opacity-50 cursor-not-allowed' : '',
                  'focus:border-white/20 focus:ring-1 focus:ring-white/10'
                )}
                style={{ height: 'auto', overflow: 'hidden' }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                }}
              />
              <span className={cn(
                'absolute bottom-1 right-2 text-[10px]',
                messageInput.length > 900 ? 'text-red-400/70' : 'text-white/20'
              )}>
                {messageInput.length}/1000
              </span>
            </div>
            <button
              onClick={() => handleSend()}
              disabled={!messageInput.trim() || sending}
              className={cn(
                'shrink-0 flex items-center justify-center h-[42px] w-[42px] rounded-xl',
                'bg-gradient-to-r text-white transition-all duration-300',
                'shadow-lg disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer',
                `from-${persona.gradient.split(' ')[0].replace('from-', '')} to-${persona.gradient.split(' ')[1].replace('to-', '')}`,
                persona.shadow,
                // Explicit gradient classes for Tailwind
                activePersona === 'casual' && 'from-cyan-500 to-blue-500 shadow-cyan-500/25 hover:from-cyan-400 hover:to-blue-400',
                activePersona === 'business' && 'from-amber-500 to-yellow-500 shadow-amber-500/25 hover:from-amber-400 hover:to-yellow-400',
                activePersona === 'exam' && 'from-violet-500 to-violet-500 shadow-violet-500/25 hover:from-violet-400 hover:to-violet-400',
                activePersona === 'travel' && 'from-emerald-500 to-green-500 shadow-emerald-500/25 hover:from-emerald-400 hover:to-green-400',
              )}
            >
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
