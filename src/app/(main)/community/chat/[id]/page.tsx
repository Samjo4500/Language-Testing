'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { useAuthStore } from '@/lib/auth-store';
import { useHydrated } from '@/hooks/use-hydrated';
import { cn } from '@/lib/utils';
import {
  MessageCircle,
  ArrowLeft,
  Loader2,
  Send,
  Languages,
  CheckCheck,
  PenLine,
  X,
} from 'lucide-react';

// ─── Language data ─────────────────────────────────────────
const LANGUAGES: Record<string, string> = {
  en: 'English', es: 'Spanish', fr: 'French', zh: 'Chinese',
  ja: 'Japanese', ko: 'Korean', de: 'German', pt: 'Portuguese',
  ar: 'Arabic', ru: 'Russian', it: 'Italian', hi: 'Hindi',
  tr: 'Turkish', nl: 'Dutch', sv: 'Swedish',
};

export default function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { user, isAuthenticated } = useAuthStore();
  const mounted = useHydrated();
  const router = useRouter();
  const isAuth = mounted && isAuthenticated;

  const [conversationId, setConversationId] = useState<string | null>(null);
  const [partner, setPartner] = useState<{
    userId: string;
    userName: string;
    nativeLanguage: string;
    targetLanguages: string[];
    isOnline: boolean;
    avatarUrl: string | null;
  } | null>(null);

  const [messages, setMessages] = useState<Array<{
    id: string;
    content: string;
    type: string;
    senderId: string;
    correctionOriginal?: string | null;
    correctionExplanation?: string | null;
    isRead: boolean;
    createdAt: string;
  }>>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showCorrection, setShowCorrection] = useState(false);
  const [correctionOriginal, setCorrectionOriginal] = useState('');
  const [correctionExplanation, setCorrectionExplanation] = useState('');

  // Unwrap params
  useEffect(() => {
    params.then((p) => setConversationId(p.id));
  }, [params]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const fetchMessages = useCallback(async () => {
    if (!conversationId) return;
    try {
      const res = await fetch(`/api/community/conversations/${conversationId}/messages?limit=100`, {
        credentials: 'same-origin',
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
        if (data.partner) setPartner(data.partner);
        scrollToBottom();
      } else if (res.status === 403 || res.status === 401) {
        router.push('/community');
      }
    } catch (err) {
      console.error('Fetch messages error:', err);
    } finally {
      setLoadingMessages(false);
    }
  }, [conversationId, scrollToBottom, router]);

  useEffect(() => {
    if (isAuth && conversationId) fetchMessages();
    else if (!isAuth && mounted) router.push('/community');
  }, [isAuth, mounted, conversationId, fetchMessages, router]);

  // Poll for new messages every 3 seconds
  useEffect(() => {
    if (!conversationId || !isAuth) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/community/conversations/${conversationId}/messages?limit=100`, {
          credentials: 'same-origin',
        });
        if (res.ok) {
          const data = await res.json();
          const newMsgs = data.messages || [];
          if (newMsgs.length !== messages.length) {
            setMessages(newMsgs);
            if (data.partner) setPartner(data.partner);
            scrollToBottom();
          }
        }
      } catch {
        // ignore polling errors
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [conversationId, isAuth, messages.length, scrollToBottom]);

  const handleSend = async () => {
    if (!newMessage.trim() || sending || !conversationId) return;
    setSending(true);
    try {
      const res = await fetch(`/api/community/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ content: newMessage.trim(), type: 'text' }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, data.message]);
        setNewMessage('');
        scrollToBottom();
      }
    } catch (err) {
      console.error('Send message error:', err);
    } finally {
      setSending(false);
    }
  };

  const handleSendCorrection = async () => {
    if (!newMessage.trim() || !correctionOriginal.trim() || sending || !conversationId) return;
    setSending(true);
    try {
      const res = await fetch(`/api/community/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          content: newMessage.trim(),
          type: 'correction',
          correctionOriginal: correctionOriginal.trim(),
          correctionExplanation: correctionExplanation.trim() || null,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, data.message]);
        setNewMessage('');
        setCorrectionOriginal('');
        setCorrectionExplanation('');
        setShowCorrection(false);
        scrollToBottom();
      }
    } catch (err) {
      console.error('Send correction error:', err);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (showCorrection) handleSendCorrection();
      else handleSend();
    }
  };

  const formatMessageTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!mounted || loadingMessages) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
      <Navbar />

      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="flex items-center gap-3 p-4 border-b border-white/5 bg-[#0A0618]/50 backdrop-blur-sm">
          <button
            onClick={() => router.push('/community/chat')}
            className="text-white/50 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          {partner && (
            <>
              <div className="relative">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-sm font-bold text-white">
                  {partner.userName[0].toUpperCase()}
                </div>
                {partner.isOnline && (
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-[#0A0618]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm">{partner.userName}</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-emerald-400">
                    {LANGUAGES[partner.nativeLanguage] || partner.nativeLanguage}
                  </span>
                  <span className="text-white/20">→</span>
                  <span className="text-[10px] text-blue-400">
                    {partner.targetLanguages.map((l) => LANGUAGES[l] || l).join(', ')}
                  </span>
                  {partner.isOnline && (
                    <span className="text-[10px] text-emerald-400 ml-1">· Online</span>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageCircle className="h-8 w-8 text-white/10 mx-auto mb-2" />
                <p className="text-white/30 text-xs">Start the conversation!</p>
              </div>
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.senderId === user?.userId;
              const isSystem = msg.type === 'system';
              const isCorrection = msg.type === 'correction';

              if (isSystem) {
                return (
                  <div key={msg.id} className="flex justify-center">
                    <span className="text-[11px] text-white/30 bg-white/5 px-3 py-1 rounded-full">
                      {msg.content}
                    </span>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  className={cn('flex', isMine ? 'justify-end' : 'justify-start')}
                >
                  <div className={cn(
                    'max-w-[75%] sm:max-w-[65%] rounded-2xl px-4 py-2.5',
                    isMine
                      ? 'bg-blue-600/80 text-white rounded-br-md'
                      : 'bg-white/10 text-white rounded-bl-md'
                  )}>
                    {isCorrection && msg.correctionOriginal && (
                      <div className="mb-2 pb-2 border-b border-white/10">
                        <p className="text-[10px] text-white/40 mb-1">Corrected text:</p>
                        <p className="text-xs text-red-300/80 line-through">{msg.correctionOriginal}</p>
                        {msg.correctionExplanation && (
                          <p className="text-[10px] text-white/40 mt-1 italic">{msg.correctionExplanation}</p>
                        )}
                      </div>
                    )}
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    <div className={cn(
                      'flex items-center gap-1 mt-1',
                      isMine ? 'justify-end' : 'justify-start'
                    )}>
                      <span className={cn(
                        'text-[10px]',
                        isMine ? 'text-white/40' : 'text-white/30'
                      )}>
                        {formatMessageTime(msg.createdAt)}
                      </span>
                      {isMine && msg.isRead && (
                        <CheckCheck className="h-3 w-3 text-white/40" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Correction Form */}
        {showCorrection && (
          <div className="p-3 border-t border-white/5 bg-[#0A0618]/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-blue-400 font-medium">Sending a correction</span>
              <button onClick={() => setShowCorrection(false)} className="text-white/30 hover:text-white/60 cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>
            <input
              value={correctionOriginal}
              onChange={(e) => setCorrectionOriginal(e.target.value)}
              placeholder="Original text being corrected..."
              className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500/50 placeholder:text-white/30"
            />
            <input
              value={correctionExplanation}
              onChange={(e) => setCorrectionExplanation(e.target.value)}
              placeholder="Explanation (optional)..."
              className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500/50 placeholder:text-white/30"
            />
          </div>
        )}

        {/* Message Input */}
        <div className="p-3 border-t border-white/5 bg-[#0A0618]/80">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCorrection(!showCorrection)}
              className={cn(
                'p-2 rounded-lg transition-colors cursor-pointer shrink-0',
                showCorrection
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'text-white/30 hover:text-white/60 hover:bg-white/5'
              )}
              title="Send correction"
            >
              <PenLine className="h-4 w-4" />
            </button>
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={showCorrection ? "Type the correction..." : "Type a message..."}
              rows={1}
              className="flex-1 bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25 placeholder:text-white/30 resize-none min-h-[40px] max-h-[120px]"
            />
            <button
              onClick={showCorrection ? handleSendCorrection : handleSend}
              disabled={!newMessage.trim() || sending || (showCorrection && !correctionOriginal.trim())}
              className="p-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
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
