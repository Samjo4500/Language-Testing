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
  Clock,
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

// ─── Types ─────────────────────────────────────────────────
interface Conversation {
  id: string;
  partner: {
    userId: string;
    userName: string;
    nativeLanguage: string;
    targetLanguages: string[];
    isOnline: boolean;
    avatarUrl: string | null;
  };
  lastMessage: {
    id: string;
    content: string;
    type: string;
    senderId: string;
    createdAt: string;
  } | null;
  unreadCount: number;
  lastMessageAt: string;
}

// ─── Main Component ────────────────────────────────────────
export default function ChatPage() {
  const { user, isAuthenticated } = useAuthStore();
  const mounted = useHydrated();
  const router = useRouter();
  const isAuth = mounted && isAuthenticated;

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);

  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch('/api/community/conversations', { credentials: 'same-origin' });
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations || []);
      }
    } catch (err) {
      console.error('Fetch conversations error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuth) fetchConversations();
    else setLoading(false);
  }, [isAuth, fetchConversations]);

  // Refresh conversations every 5 seconds
  useEffect(() => {
    if (!isAuth || !mounted) return;
    const interval = setInterval(fetchConversations, 5000);
    return () => clearInterval(interval);
  }, [isAuth, mounted, fetchConversations]);

  const formatTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />
        </div>
      </div>
    );
  }

  if (!isAuth) {
    router.push('/community');
    return null;
  }

  const selectedConv = conversations.find((c) => c.id === selectedConvId);

  return (
    <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
      <Navbar />
      <div className="flex-1 flex flex-col lg:flex-row mt-0">
        {/* Sidebar - Conversations List */}
        <div className={cn(
          'lg:w-80 xl:w-96 border-r border-white/5 bg-[#0A0618]/80 flex flex-col shrink-0',
          selectedConvId ? 'hidden lg:flex' : 'flex'
        )}>
          <div className="p-4 border-b border-white/5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-white font-semibold text-sm flex items-center gap-2">
                <Languages className="h-4 w-4 text-blue-400" />
                Language Partners
              </h2>
              <button
                onClick={() => router.push('/community')}
                className="text-xs text-white/40 hover:text-white/70 transition-colors cursor-pointer"
              >
                Find Partners
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-6 text-center">
                <MessageCircle className="h-8 w-8 text-white/20 mx-auto mb-2" />
                <p className="text-white/40 text-xs">No conversations yet</p>
                <button
                  onClick={() => router.push('/community')}
                  className="mt-3 text-xs text-blue-400 hover:text-blue-300 cursor-pointer"
                >
                  Find a partner
                </button>
              </div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConvId(conv.id)}
                  className={cn(
                    'w-full p-4 flex items-center gap-3 border-b border-white/5 text-left transition-all cursor-pointer',
                    selectedConvId === conv.id
                      ? 'bg-white/5 border-l-2 border-l-blue-500'
                      : 'hover:bg-white/[0.03]'
                  )}
                >
                  <div className="relative shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-sm font-bold text-white">
                      {conv.partner.userName[0].toUpperCase()}
                    </div>
                    {conv.partner.isOnline && (
                      <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-[#0A0618]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-white font-medium text-sm truncate">{conv.partner.userName}</p>
                      <span className="text-white/30 text-[10px] shrink-0 ml-2">
                        {conv.lastMessage ? formatTimeAgo(conv.lastMessage.createdAt) : ''}
                      </span>
                    </div>
                    {conv.lastMessage && (
                      <p className="text-white/40 text-xs mt-0.5 truncate">
                        {conv.lastMessage.type === 'system'
                          ? '🤝 Connected'
                          : conv.lastMessage.content}
                      </p>
                    )}
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="flex items-center justify-center h-4.5 min-w-4.5 px-1 rounded-full bg-blue-500 text-[10px] font-bold text-white shrink-0">
                      {conv.unreadCount}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className={cn(
          'flex-1 flex flex-col',
          selectedConvId ? 'flex' : 'hidden lg:flex'
        )}>
          {selectedConv ? (
            <ChatConversation
              conversationId={selectedConv.id}
              partner={selectedConv.partner}
              currentUserId={user?.userId || ''}
              onBack={() => setSelectedConvId(null)}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 text-white/10 mx-auto mb-3" />
                <p className="text-white/30 text-sm">Select a conversation to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Chat Conversation Component ──────────────────────────
function ChatConversation({
  conversationId,
  partner,
  currentUserId,
  onBack,
}: {
  conversationId: string;
  partner: Conversation['partner'];
  currentUserId: string;
  onBack: () => void;
}) {
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

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/community/conversations/${conversationId}/messages?limit=100`, {
        credentials: 'same-origin',
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
        scrollToBottom();
      }
    } catch (err) {
      console.error('Fetch messages error:', err);
    } finally {
      setLoadingMessages(false);
    }
  }, [conversationId, scrollToBottom]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Poll for new messages every 3 seconds
  useEffect(() => {
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
            scrollToBottom();
          }
        }
      } catch {
        // ignore polling errors
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [conversationId, messages.length, scrollToBottom]);

  const handleSend = async () => {
    if (!newMessage.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch(`/api/community/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          content: newMessage.trim(),
          type: 'text',
        }),
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
    if (!newMessage.trim() || !correctionOriginal.trim() || sending) return;
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
      if (showCorrection) {
        handleSendCorrection();
      } else {
        handleSend();
      }
    }
  };

  const formatMessageTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-4 border-b border-white/5 bg-[#0A0618]/50 backdrop-blur-sm">
        <button
          onClick={onBack}
          className="lg:hidden text-white/50 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
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
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loadingMessages ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-6 w-6 text-blue-400 animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <MessageCircle className="h-8 w-8 text-white/10 mx-auto mb-2" />
              <p className="text-white/30 text-xs">Start the conversation!</p>
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isMine = msg.senderId === currentUserId;
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
    </>
  );
}
