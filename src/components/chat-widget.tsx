'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import ReactMarkdown from 'react-markdown';
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Trash2,
  ChevronDown,
} from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const QUICK_PROMPTS = [
  'What is my CEFR level?',
  'How does the test work?',
  'Tell me about pricing',
  'What certificates do I get?',
];

function getPageGreeting(pathname: string, userName?: string): string {
  const name = userName || '';
  const greeting = name ? `Hi ${name}!` : 'Hello!';

  if (pathname === '/listening') {
    return `${greeting} 🎧 Ready to test your listening skills? I can explain how our listening assessment works or give you tips to improve!`;
  }
  if (pathname === '/writing') {
    return `${greeting} ✍️ Looking to improve your writing? I can help you understand our writing evaluation and share tips for better scores!`;
  }
  if (pathname === '/speaking') {
    return `${greeting} 🎤 Want to practice speaking? I can walk you through our speech recognition assessment and pronunciation tips!`;
  }
  if (pathname === '/test') {
    return `${greeting} 📝 Ready to take an assessment? I can help you prepare and explain what to expect!`;
  }
  if (pathname === '/pricing') {
    return `${greeting} 💎 Exploring our plans? I can help you choose the right one for your needs!`;
  }
  if (pathname === '/dashboard') {
    return `${greeting} 📊 Welcome to your dashboard! I can help you understand your results or guide you to your next assessment.`;
  }
  if (pathname === '/' || pathname === '') {
    return `${greeting} 👋 Welcome to TestCEFR! I'm your AI assistant — I can help you understand CEFR levels, take assessments, and get certified. What would you like to know?`;
  }
  return `${greeting} 👋 I'm your TestCEFR AI assistant. I can help with CEFR levels, assessments, certificates, and more. What would you like to know?`;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [showPrompts, setShowPrompts] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const { user } = useAuthStore();

  // Auto-greeting when chat opens for the first time
  useEffect(() => {
    if (isOpen && !hasGreeted) {
      setHasGreeted(true);
      const greeting = getPageGreeting(pathname, user?.name || undefined);
      setMessages([{ role: 'assistant', content: greeting }]);
    }
  }, [isOpen, hasGreeted, pathname, user?.name]);

  // Update greeting when pathname changes (if no user messages yet)
  useEffect(() => {
    if (isOpen && hasGreeted && messages.length <= 1) {
      const greeting = getPageGreeting(pathname, user?.name || undefined);
      setMessages([{ role: 'assistant', content: greeting }]);
    }
  }, [pathname]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isTyping) return;

    const userMessage: Message = { role: 'user', content: content.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setShowPrompts(false);
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          currentPage: pathname,
          userName: user?.name || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Chat request failed');
      }

      const data = await response.json();
      const assistantMessage: Message = { role: 'assistant', content: data.reply };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again in a moment.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }, [messages, isTyping, pathname, user?.name]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleQuickPrompt = (prompt: string) => {
    sendMessage(prompt);
  };

  const clearChat = () => {
    const greeting = getPageGreeting(pathname, user?.name || undefined);
    setMessages([{ role: 'assistant', content: greeting }]);
    setShowPrompts(true);
  };

  return (
    <>
      {/* Chat Bubble */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`chat-widget-bubble ${isOpen ? 'chat-widget-bubble-open' : ''}`}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6 text-white" />
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#1a1a2e]" />
          </>
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="chat-widget-panel">
          {/* Header */}
          <div className="chat-widget-header">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-purple-600" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">TestCEFR Assistant</h3>
                <p className="text-green-300 text-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  Online — AI Powered
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={clearChat}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                aria-label="Clear chat"
                title="Clear chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                aria-label="Minimize chat"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="chat-widget-messages">
            <div className="p-4 space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div className="shrink-0 mt-1">
                    {msg.role === 'user' ? (
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <User className="w-3.5 h-3.5 text-white" />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
                        <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                      </div>
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-tr-sm'
                        : 'bg-white/[0.07] border border-white/10 text-gray-200 rounded-tl-sm'
                    }`}
                  >
                    {msg.role === 'assistant' ? (
                      <div className="chat-markdown prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex gap-2.5">
                  <div className="shrink-0 mt-1">
                    <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
                      <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                    </div>
                  </div>
                  <div className="bg-white/[0.07] border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1.5">
                      <span className="chat-typing-dot w-2 h-2 bg-purple-400 rounded-full" style={{ animationDelay: '0ms' }} />
                      <span className="chat-typing-dot w-2 h-2 bg-purple-400 rounded-full" style={{ animationDelay: '150ms' }} />
                      <span className="chat-typing-dot w-2 h-2 bg-purple-400 rounded-full" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Quick Prompts */}
          {showPrompts && messages.length <= 1 && (
            <div className="px-4 pb-2">
              <div className="flex flex-wrap gap-1.5">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleQuickPrompt(prompt)}
                    className="text-xs px-3 py-1.5 rounded-full bg-white/[0.07] border border-white/10 text-purple-300 hover:bg-white/[0.12] hover:border-purple-500/30 hover:text-purple-200 transition-all"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-white/[0.06]">
            <form onSubmit={handleSubmit} className="chat-widget-input">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about CEFR..."
                className="flex-1 bg-transparent text-white text-sm placeholder-gray-500 outline-none"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple-500/20 transition-all"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <p className="text-[10px] text-gray-600 text-center mt-2">
              AI responses may not always be accurate. Verify important information.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
