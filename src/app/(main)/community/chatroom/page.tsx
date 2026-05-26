'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { useAuthStore } from '@/lib/auth-store';
import { useHydrated } from '@/hooks/use-hydrated';
import { cn } from '@/lib/utils';
import {
  Globe,
  Send,
  Loader2,
  MessageCircle,
  Users,
  ChevronLeft,
  Hash,
  ArrowRight,
  PanelLeftClose,
  PanelLeft,
  Clock,
  Sprout,
  Zap,
  Flame,
  Target,
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────
interface ChatRoomData {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  language: string | null;
  levelRange: string | null;
  imageUrl: string | null;
  isPublic: boolean;
  messageCount: number;
  createdAt: string;
}

interface ChatMessage {
  id: string;
  roomId: string;
  userId: string;
  userName: string;
  userAvatar: string | null;
  content: string;
  type: string;
  imageUrl: string | null;
  createdAt: string;
}

interface OnlineUser {
  userId: string;
  userName: string;
  userAvatar: string | null;
  englishLevel: string | null;
  lastSeenAt: string;
}

// ─── Room color scheme ─────────────────────────────────────
interface RoomColorScheme {
  icon: React.ElementType;
  emoji: string;
  bg: string;
  border: string;
  text: string;
  hover: string;
  activeBg: string;
  gradient: string;
  shadow: string;
  focusRing: string;
  badge: string;
}

const ROOM_COLORS: Record<string, RoomColorScheme> = {
  global: {
    icon: Globe,
    emoji: '🌍',
    bg: 'bg-blue-500/15',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    hover: 'hover:bg-blue-500/10',
    activeBg: 'bg-blue-500/15',
    gradient: 'from-blue-600 to-cyan-500',
    shadow: 'shadow-blue-500/25',
    focusRing: 'focus:border-blue-500/50 focus:ring-blue-500/25',
    badge: 'bg-blue-500/15 border-blue-500/30 text-blue-400',
  },
  beginners: {
    icon: Sprout,
    emoji: '🌱',
    bg: 'bg-emerald-500/15',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    hover: 'hover:bg-emerald-500/10',
    activeBg: 'bg-emerald-500/15',
    gradient: 'from-emerald-600 to-green-500',
    shadow: 'shadow-emerald-500/25',
    focusRing: 'focus:border-emerald-500/50 focus:ring-emerald-500/25',
    badge: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
  },
  intermediate: {
    icon: Zap,
    emoji: '⚡',
    bg: 'bg-amber-500/15',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    hover: 'hover:bg-amber-500/10',
    activeBg: 'bg-amber-500/15',
    gradient: 'from-amber-600 to-yellow-500',
    shadow: 'shadow-amber-500/25',
    focusRing: 'focus:border-amber-500/50 focus:ring-amber-500/25',
    badge: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
  },
  advanced: {
    icon: Flame,
    emoji: '🔥',
    bg: 'bg-purple-500/15',
    border: 'border-purple-500/30',
    text: 'text-purple-400',
    hover: 'hover:bg-purple-500/10',
    activeBg: 'bg-purple-500/15',
    gradient: 'from-purple-600 to-violet-500',
    shadow: 'shadow-purple-500/25',
    focusRing: 'focus:border-purple-500/50 focus:ring-purple-500/25',
    badge: 'bg-purple-500/15 border-purple-500/30 text-purple-400',
  },
  'study-partners': {
    icon: Target,
    emoji: '🎯',
    bg: 'bg-cyan-500/15',
    border: 'border-cyan-500/30',
    text: 'text-cyan-400',
    hover: 'hover:bg-cyan-500/10',
    activeBg: 'bg-cyan-500/15',
    gradient: 'from-cyan-600 to-teal-500',
    shadow: 'shadow-cyan-500/25',
    focusRing: 'focus:border-cyan-500/50 focus:ring-cyan-500/25',
    badge: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400',
  },
};

const DEFAULT_ROOM_COLOR: RoomColorScheme = ROOM_COLORS.global;

function getRoomColor(slug: string): RoomColorScheme {
  return ROOM_COLORS[slug] || DEFAULT_ROOM_COLOR;
}

const LEVEL_COLORS: Record<string, string> = {
  'A1-A2': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'B1-B2': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  'C1-C2': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  all: 'bg-white/10 text-white/60 border-white/10',
};

// ─── Main Component ────────────────────────────────────────
export default function ChatroomPage() {
  const { user, isAuthenticated } = useAuthStore();
  const mounted = useHydrated();
  const router = useRouter();
  const isAuth = mounted && isAuthenticated;

  const [rooms, setRooms] = useState<ChatRoomData[]>([]);
  const [activeRoom, setActiveRoom] = useState<ChatRoomData | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Get active room's color scheme
  const activeColor = activeRoom ? getRoomColor(activeRoom.slug) : DEFAULT_ROOM_COLOR;
  const ActiveIcon = activeColor.icon;

  // Fetch rooms
  const fetchRooms = useCallback(async () => {
    try {
      const res = await fetch('/api/community/chatroom', { credentials: 'same-origin' });
      if (res.ok) {
        const data = await res.json();
        setRooms(data.rooms || []);
        // Auto-select global room if none selected
        if (data.rooms?.length > 0 && !activeRoom) {
          setActiveRoom(data.rooms[0]);
        }
      }
    } catch (err) {
      console.error('Fetch rooms error:', err);
    } finally {
      setLoadingRooms(false);
    }
  }, [activeRoom]);

  useEffect(() => {
    if (isAuth) fetchRooms();
    else setLoadingRooms(false);
  }, [isAuth, fetchRooms]);

  // Fetch messages
  const fetchMessages = useCallback(async (roomId: string, cursor?: string) => {
    if (!cursor) setLoadingMessages(true);
    try {
      const params = new URLSearchParams({ limit: '50' });
      if (cursor) params.set('cursor', cursor);
      const res = await fetch(`/api/community/chatroom/${roomId}/messages?${params.toString()}`, { credentials: 'same-origin' });
      if (res.ok) {
        const data = await res.json();
        if (cursor) {
          // Prepend older messages
          setMessages((prev) => [...data.messages, ...prev]);
        } else {
          setMessages(data.messages);
        }
        setHasMore(data.hasMore);
      }
    } catch (err) {
      console.error('Fetch messages error:', err);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  // Load more on scroll up
  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container || !hasMore || !activeRoom) return;
    if (container.scrollTop < 50) {
      fetchMessages(activeRoom.id, messages[0]?.createdAt);
    }
  }, [hasMore, activeRoom, fetchMessages, messages]);

  // Select room
  const selectRoom = useCallback((room: ChatRoomData) => {
    setActiveRoom(room);
    setMessages([]);
    setHasMore(false);
    fetchMessages(room.id);
  }, [fetchMessages]);

  // Load messages when room changes
  useEffect(() => {
    if (activeRoom) {
      fetchMessages(activeRoom.id);
    }
  }, [activeRoom?.id]);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, scrollToBottom]);

  // Polling for new messages
  useEffect(() => {
    if (!activeRoom) return;

    if (pollingRef.current) clearInterval(pollingRef.current);

    pollingRef.current = setInterval(async () => {
      try {
        const lastMsg = messages[messages.length - 1];
        const params = new URLSearchParams({ limit: '50' });
        if (lastMsg) {
          // Only fetch messages newer than the newest we have
          params.set('after', lastMsg.createdAt);
        }
        const res = await fetch(`/api/community/chatroom/${activeRoom.id}/messages?${params.toString()}`, { credentials: 'same-origin' });
        if (res.ok) {
          const data = await res.json();
          if (data.messages?.length > 0) {
            setMessages((prev) => [...prev, ...data.messages]);
          }
        }
      } catch {
        // Silently fail on polling errors
      }
    }, 3000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [activeRoom?.id, messages]);

  // Fetch online users (active in last 15 min)
  useEffect(() => {
    if (!activeRoom) return;

    const fetchOnlineUsers = async () => {
      try {
        // Get recent messages to derive online users
        const res = await fetch(`/api/community/chatroom/${activeRoom.id}/messages?limit=50`, { credentials: 'same-origin' });
        if (res.ok) {
          const data = await res.json();
          const fifteenMinAgo = new Date(Date.now() - 15 * 60 * 1000);
          const recentMsgs = (data.messages as ChatMessage[]).filter(
            (m) => new Date(m.createdAt) > fifteenMinAgo
          );

          // Deduplicate users
          const userMap = new Map<string, OnlineUser>();
          recentMsgs.forEach((m) => {
            if (!userMap.has(m.userId)) {
              userMap.set(m.userId, {
                userId: m.userId,
                userName: m.userName,
                userAvatar: m.userAvatar,
                englishLevel: null,
                lastSeenAt: m.createdAt,
              });
            }
          });
          setOnlineUsers(Array.from(userMap.values()));
        }
      } catch {
        // Silently fail
      }
    };

    fetchOnlineUsers();
    const interval = setInterval(fetchOnlineUsers, 15000);
    return () => clearInterval(interval);
  }, [activeRoom?.id]);

  // Send message
  const handleSend = async () => {
    if (!messageInput.trim() || !activeRoom || sending) return;
    setSending(true);
    try {
      const res = await fetch(`/api/community/chatroom/${activeRoom.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ content: messageInput.trim(), type: 'text' }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, data.message]);
        setMessageInput('');
      }
    } catch (err) {
      console.error('Send message error:', err);
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

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    if (isToday) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  };

  if (!mounted || loadingRooms) {
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
    return (
      <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="glass-card p-8 max-w-md text-center">
            <MessageCircle className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Join the Chat</h2>
            <p className="text-white/50 text-sm mb-6">
              Sign in to chat with English learners worldwide.
            </p>
            <a href="/login">
              <button className="w-full rounded-xl py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium text-sm">
                Sign In
              </button>
            </a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
      <Navbar />

      <div className="flex-1 flex relative overflow-hidden">
        {/* ─── Left Sidebar: Room List ─── */}
        <div
          className={cn(
            'shrink-0 border-r border-white/5 bg-[#0A0618]/50 backdrop-blur-sm transition-all duration-300 flex flex-col',
            sidebarOpen ? 'w-64' : 'w-0 overflow-hidden',
            'md:relative fixed inset-y-0 left-0 z-40 md:z-auto top-14 md:top-auto'
          )}
        >
          {/* Sidebar header */}
          <div className="p-4 border-b border-white/5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <Hash className="h-4 w-4 text-blue-400" />
                Chat Rooms
              </h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-white/40 hover:text-white/70 transition-colors cursor-pointer md:hidden"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Room list */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {rooms.map((room) => {
              const color = getRoomColor(room.slug);
              const Icon = color.icon;
              const isActive = activeRoom?.id === room.id;
              return (
                <button
                  key={room.id}
                  onClick={() => selectRoom(room)}
                  className={cn(
                    'w-full text-left p-3 rounded-lg transition-all cursor-pointer',
                    isActive
                      ? `${color.activeBg} ${color.text} border ${color.border}`
                      : `text-white/60 hover:text-white ${color.hover}`
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={cn(
                      'h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-colors',
                      isActive ? color.bg : 'bg-white/5'
                    )}>
                      <Icon className={cn('h-4 w-4', isActive ? color.text : 'text-white/40')} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{room.name}</p>
                      {room.levelRange && (
                        <span className={cn(
                          'inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold border',
                          color.badge || LEVEL_COLORS[room.levelRange] || LEVEL_COLORS.all
                        )}>
                          {room.levelRange}
                        </span>
                      )}
                    </div>
                  </div>
                  {room.description && (
                    <p className="text-xs text-white/30 mt-1 line-clamp-2 ml-10">{room.description}</p>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── Main Chat Area ─── */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Room header — subtle color accent */}
          <div className={cn(
            'shrink-0 border-b bg-[#0A0618]/50 backdrop-blur-sm p-3 md:p-4 transition-colors',
            activeRoom ? activeColor.border.replace('/30', '/20') : 'border-white/5'
          )}>
            <div className="flex items-center gap-3">
              {!sidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="text-white/40 hover:text-white/70 transition-colors cursor-pointer"
                >
                  <PanelLeft className="h-5 w-5" />
                </button>
              )}
              {sidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-white/40 hover:text-white/70 transition-colors cursor-pointer hidden md:block"
                >
                  <PanelLeftClose className="h-5 w-5" />
                </button>
              )}
              {activeRoom ? (
                <>
                  <div className={cn('h-9 w-9 rounded-lg flex items-center justify-center', activeColor.bg)}>
                    <ActiveIcon className={cn('h-5 w-5', activeColor.text)} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{activeRoom.name}</h3>
                    <div className="flex items-center gap-2">
                      {activeRoom.description && (
                        <p className="text-xs text-white/40 hidden sm:block">{activeRoom.description}</p>
                      )}
                      {activeRoom.levelRange && (
                        <span className={cn(
                          'inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold border',
                          activeColor.badge || LEVEL_COLORS[activeRoom.levelRange] || LEVEL_COLORS.all
                        )}>
                          {activeRoom.levelRange}
                        </span>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <h3 className="text-sm font-semibold text-white/50">Select a room to start chatting</h3>
              )}
            </div>
          </div>

          {/* Messages */}
          <div
            ref={messagesContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-4 space-y-1"
          >
            {loadingMessages && messages.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className={cn('h-6 w-6 animate-spin', activeColor.text)} />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <MessageCircle className="h-10 w-10 text-white/10 mx-auto mb-3" />
                  <p className="text-white/40 text-sm">No messages yet. Be the first to say hello!</p>
                </div>
              </div>
            ) : (
              <>
                {hasMore && (
                  <div className="flex justify-center py-2">
                    <button
                      onClick={() => fetchMessages(activeRoom!.id, messages[0]?.createdAt)}
                      className={cn('text-xs transition-colors cursor-pointer', activeColor.text, 'opacity-70 hover:opacity-100')}
                    >
                      Load earlier messages
                    </button>
                  </div>
                )}
                {messages.map((msg, idx) => {
                  const isOwn = msg.userId === user?.userId;
                  const isSystem = msg.type === 'system';
                  const showHeader = idx === 0 || messages[idx - 1]?.userId !== msg.userId || 
                    (new Date(msg.createdAt).getTime() - new Date(messages[idx - 1]?.createdAt).getTime() > 300000);

                  if (isSystem) {
                    return (
                      <div key={msg.id} className="flex justify-center py-1">
                        <span className="text-xs text-white/30 bg-white/5 px-3 py-1 rounded-full">
                          {msg.content}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <div key={msg.id} className={cn('group flex gap-2.5 py-0.5', showHeader && 'mt-3')}>
                      {/* Avatar */}
                      {showHeader ? (
                        <div className={cn(
                          'h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0',
                          `bg-gradient-to-br ${activeColor.gradient}`
                        )}>
                          {msg.userAvatar ? (
                            <img src={msg.userAvatar} alt={msg.userName} className="h-8 w-8 rounded-full object-cover" />
                          ) : (
                            msg.userName[0].toUpperCase()
                          )}
                        </div>
                      ) : (
                        <div className="w-8 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        {showHeader && (
                          <div className="flex items-baseline gap-2 mb-0.5">
                            <span className={cn('text-sm font-medium', isOwn ? activeColor.text : 'text-white/80')}>
                              {msg.userName}
                              {isOwn && <span className="text-xs text-white/30 ml-1">(you)</span>}
                            </span>
                            <span className="text-[10px] text-white/20">{formatTime(msg.createdAt)}</span>
                          </div>
                        )}
                        <p className="text-sm text-white/70 break-words whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Message input — send button matches room color */}
          {activeRoom && (
            <div className={cn(
              'shrink-0 border-t bg-[#0A0618]/50 backdrop-blur-sm p-3 md:p-4 transition-colors',
              activeColor.border.replace('/30', '/20')
            )}>
              <div className="flex items-end gap-2">
                <div className="flex-1 relative">
                  <textarea
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value.slice(0, 500))}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    rows={1}
                    className={cn(
                      'w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none resize-none min-h-[40px] max-h-[120px]',
                      activeColor.focusRing
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
                    messageInput.length > 450 ? 'text-red-400/70' : 'text-white/20'
                  )}>
                    {messageInput.length}/500
                  </span>
                </div>
                <button
                  onClick={handleSend}
                  disabled={!messageInput.trim() || sending}
                  className={cn(
                    'shrink-0 flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-r text-white transition-all duration-300 shadow-lg disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer',
                    `from-${activeColor.gradient.split(' ')[0].replace('from-', '')} to-${activeColor.gradient.split(' ')[1].replace('to-', '')}`,
                    activeColor.shadow,
                    // Fallback for dynamic gradient classes that Tailwind might not pick up
                    activeRoom?.slug === 'global' && 'from-blue-600 to-cyan-500 shadow-blue-500/25 hover:from-blue-500 hover:to-cyan-400',
                    activeRoom?.slug === 'beginners' && 'from-emerald-600 to-green-500 shadow-emerald-500/25 hover:from-emerald-500 hover:to-green-400',
                    activeRoom?.slug === 'intermediate' && 'from-amber-600 to-yellow-500 shadow-amber-500/25 hover:from-amber-500 hover:to-yellow-400',
                    activeRoom?.slug === 'advanced' && 'from-purple-600 to-violet-500 shadow-purple-500/25 hover:from-purple-500 hover:to-violet-400',
                    activeRoom?.slug === 'study-partners' && 'from-cyan-600 to-teal-500 shadow-cyan-500/25 hover:from-cyan-500 hover:to-teal-400',
                    !activeRoom?.slug && 'from-blue-600 to-cyan-500 shadow-blue-500/25'
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
          )}
        </div>

        {/* ─── Right Sidebar: Online Users ─── */}
        <div className="hidden xl:flex shrink-0 w-56 border-l border-white/5 bg-[#0A0618]/50 backdrop-blur-sm flex-col">
          <div className="p-4 border-b border-white/5">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Users className={cn('h-4 w-4', activeColor.text)} />
              Online
              <span className="text-xs text-white/30">({onlineUsers.length})</span>
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {onlineUsers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-6 w-6 text-white/10 mx-auto mb-2" />
                <p className="text-white/30 text-xs">No one is here yet</p>
              </div>
            ) : (
              onlineUsers.map((u) => (
                <div key={u.userId} className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-all">
                  <div className="relative shrink-0">
                    {u.userAvatar ? (
                      <img src={u.userAvatar} alt={u.userName} className="h-7 w-7 rounded-full object-cover" />
                    ) : (
                      <div className={cn(
                        'h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold text-white',
                        `bg-gradient-to-br ${activeColor.gradient}`
                      )}>
                        {u.userName[0].toUpperCase()}
                      </div>
                    )}
                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border border-[#0A0618]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white/70 truncate">{u.userName}</p>
                    {u.englishLevel && (
                      <span className={cn('text-[10px]', activeColor.text, 'opacity-60')}>{u.englishLevel}</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30 top-14"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar toggle — colored by active room */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className={cn(
            'md:hidden fixed bottom-4 left-4 z-30 h-10 w-10 rounded-full text-white flex items-center justify-center shadow-lg cursor-pointer transition-colors',
            activeRoom?.slug === 'global' && 'bg-gradient-to-r from-blue-600 to-cyan-500 shadow-blue-500/25',
            activeRoom?.slug === 'beginners' && 'bg-gradient-to-r from-emerald-600 to-green-500 shadow-emerald-500/25',
            activeRoom?.slug === 'intermediate' && 'bg-gradient-to-r from-amber-600 to-yellow-500 shadow-amber-500/25',
            activeRoom?.slug === 'advanced' && 'bg-gradient-to-r from-purple-600 to-violet-500 shadow-purple-500/25',
            activeRoom?.slug === 'study-partners' && 'bg-gradient-to-r from-cyan-600 to-teal-500 shadow-cyan-500/25',
            !activeRoom?.slug && 'bg-gradient-to-r from-blue-600 to-cyan-500 shadow-blue-500/25'
          )}
        >
          <PanelLeft className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
