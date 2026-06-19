'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import {
  Headphones,
  Send,
  LogOut,
  MessageCircle,
  User,
  Clock,
  CheckCheck,
  Search,
  Circle,
  Loader2,
  Lock,
  ShieldCheck,
  RefreshCw,
  X,
  ChevronDown,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

// ─── Types ────────────────────────────────────────────────────────────────────
interface ChatSession {
  id: string;
  customer_id: string | null;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  status: 'open' | 'closed' | 'waiting';
  unread_admin: number;
  created_at: string;
  updated_at: string;
  lastMessage?: string;
}

interface ChatMessage {
  id: string;
  session_id: string;
  sender_type: 'customer' | 'admin';
  sender_name: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

// ─── Admin şifre (env'den alınır; yoksa default) ─────────────────────────────
// Üretimde NEXT_PUBLIC_ADMIN_PASSWORD env değişkenine set edin.
const ADMIN_PASSWORD =
  typeof process !== 'undefined' && process.env.NEXT_PUBLIC_ADMIN_PASSWORD
    ? process.env.NEXT_PUBLIC_ADMIN_PASSWORD
    : 'huzur2024';

const ADMIN_NAME = 'Huzur Mobilya Destek';

// ─── Yardımcı ─────────────────────────────────────────────────────────────────
function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return 'Bugün';
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return 'Dün';
  return d.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' });
}

// ─── Ana Bileşen ──────────────────────────────────────────────────────────────
export default function AdminChatPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showPw, setShowPw] = useState(false);

  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'waiting' | 'closed'>('all');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeSession = sessions.find((s) => s.id === activeSessionId) ?? null;

  // ── Scroll to bottom ────────────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Sessions yükleme ────────────────────────────────────────────────────────
  const loadSessions = useCallback(async () => {
    setLoadingSessions(true);
    try {
      const { data } = await supabase
        .from('chat_sessions')
        .select('*')
        .order('updated_at', { ascending: false });

      if (data) {
        // Her session için son mesajı çek
        const withLastMsg = await Promise.all(
          (data as ChatSession[]).map(async (s) => {
            const { data: msgs } = await supabase
              .from('chat_messages')
              .select('message')
              .eq('session_id', s.id)
              .order('created_at', { ascending: false })
              .limit(1)
              .maybeSingle();
            return { ...s, lastMessage: msgs?.message ?? '' };
          })
        );
        setSessions(withLastMsg);
      }
    } finally {
      setLoadingSessions(false);
    }
  }, []);

  // ── Mesajları yükle ─────────────────────────────────────────────────────────
  const loadMessages = useCallback(async (sessionId: string) => {
    setLoadingMessages(true);
    try {
      const { data } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });
      if (data) setMessages(data as ChatMessage[]);

      // Okundu işaretle
      await supabase
        .from('chat_messages')
        .update({ is_read: true })
        .eq('session_id', sessionId)
        .eq('sender_type', 'customer')
        .eq('is_read', false);

      // unread_admin sıfırla
      await supabase
        .from('chat_sessions')
        .update({ unread_admin: 0 })
        .eq('id', sessionId);

      setSessions((prev) =>
        prev.map((s) => (s.id === sessionId ? { ...s, unread_admin: 0 } : s))
      );
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  // ── Realtime: sessions ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!isLoggedIn) return;
    loadSessions();

    const channel = supabase
      .channel('admin:sessions')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'chat_sessions' },
        () => loadSessions()
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [isLoggedIn, loadSessions]);

  // ── Realtime: messages (aktif session) ───────────────────────────────────────
  useEffect(() => {
    if (!activeSessionId) return;

    const channel = supabase
      .channel(`admin:messages:${activeSessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `session_id=eq.${activeSessionId}`,
        },
        (payload) => {
          const msg = payload.new as ChatMessage;
          setMessages((prev) => {
            if (prev.some((m) => m.id === msg.id)) return prev;
            return [...prev, msg];
          });
          // Müşteri mesajını okundu yap
          if (msg.sender_type === 'customer') {
            supabase
              .from('chat_messages')
              .update({ is_read: true })
              .eq('id', msg.id);
          }
          // Sessions lastMessage güncelle
          setSessions((prev) =>
            prev.map((s) =>
              s.id === activeSessionId ? { ...s, lastMessage: msg.message, unread_admin: 0 } : s
            )
          );
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [activeSessionId]);

  // ── Session seç ─────────────────────────────────────────────────────────────
  const selectSession = async (sessionId: string) => {
    setActiveSessionId(sessionId);
    setMessages([]);
    await loadMessages(sessionId);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // ── Mesaj gönder ────────────────────────────────────────────────────────────
  const sendMessage = async () => {
    const text = inputText.trim();
    if (!text || !activeSessionId || sending) return;

    setSending(true);
    setInputText('');
    try {
      await supabase.from('chat_messages').insert({
        session_id: activeSessionId,
        sender_type: 'admin',
        sender_name: ADMIN_NAME,
        message: text,
        is_read: false,
      });
      // Oturumu 'open' yap
      await supabase
        .from('chat_sessions')
        .update({ status: 'open' })
        .eq('id', activeSessionId);
    } catch {
      setInputText(text);
    } finally {
      setSending(false);
    }
  };

  // ── Oturumu kapat ────────────────────────────────────────────────────────────
  const closeSession = async (sessionId: string) => {
    await supabase
      .from('chat_sessions')
      .update({ status: 'closed' })
      .eq('id', sessionId);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ── Login ────────────────────────────────────────────────────────────────────
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Şifre hatalı. Lütfen tekrar deneyin.');
    }
  };

  // ── Filtered sessions ────────────────────────────────────────────────────────
  const filteredSessions = sessions.filter((s) => {
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      s.customer_name.toLowerCase().includes(q) ||
      (s.customer_email ?? '').toLowerCase().includes(q) ||
      (s.customer_phone ?? '').includes(q);
    return matchesStatus && matchesSearch;
  });

  const totalUnread = sessions.reduce((acc, s) => acc + (s.unread_admin || 0), 0);

  // ── LOGIN EKRANI ─────────────────────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShieldCheck size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Paneli</h1>
            <p className="text-white/70 text-sm mt-1">Canlı Destek Yönetimi</p>
          </div>
          <form onSubmit={handleLogin} className="px-8 py-8 flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Admin Şifresi
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-3 border border-gray-200 rounded-xl text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPw ? <ChevronDown size={16} /> : <Lock size={16} />}
                </button>
              </div>
            </div>
            {loginError && (
              <p className="text-red-500 text-xs bg-red-50 px-3 py-2 rounded-lg">{loginError}</p>
            )}
            <button
              type="submit"
              className="w-full py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
            >
              Giriş Yap
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── ADMIN PANEL ──────────────────────────────────────────────────────────────
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
            <Headphones size={18} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-base leading-tight">Canlı Destek Paneli</h1>
            <p className="text-xs text-gray-500">Huzur Mobilya Admin</p>
          </div>
          {totalUnread > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
              {totalUnread}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadSessions}
            disabled={loadingSessions}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Yenile"
          >
            <RefreshCw size={16} className={loadingSessions ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => setIsLoggedIn(false)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut size={15} />
            <span className="hidden sm:inline">Çıkış</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Sol Panel: Sohbet Listesi ─────────────────────────────────────── */}
        <aside className="w-80 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
          {/* Search & Filter */}
          <div className="p-3 border-b border-gray-100 space-y-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Müşteri ara..."
                className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-400"
              />
            </div>
            <div className="flex gap-1">
              {(['all', 'waiting', 'open', 'closed'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`flex-1 py-1 text-xs rounded-lg font-medium transition-colors ${
                    statusFilter === s
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {s === 'all' ? 'Tümü' : s === 'waiting' ? 'Bekliyor' : s === 'open' ? 'Açık' : 'Kapalı'}
                </button>
              ))}
            </div>
          </div>

          {/* Session List */}
          <div className="flex-1 overflow-y-auto">
            {loadingSessions && sessions.length === 0 ? (
              <div className="flex items-center justify-center py-12 text-gray-400">
                <Loader2 size={24} className="animate-spin" />
              </div>
            ) : filteredSessions.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <MessageCircle size={32} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">Sohbet bulunamadı</p>
              </div>
            ) : (
              filteredSessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => selectSession(session.id)}
                  className={`w-full px-4 py-3.5 text-left border-b border-gray-50 transition-colors hover:bg-gray-50 ${
                    activeSessionId === session.id ? 'bg-primary-50 border-l-2 border-l-primary-500' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative flex-shrink-0 mt-0.5">
                      <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center">
                        <User size={16} className="text-gray-500" />
                      </div>
                      <Circle
                        size={10}
                        className={`absolute -bottom-0.5 -right-0.5 ${
                          session.status === 'waiting'
                            ? 'fill-yellow-400 text-yellow-400'
                            : session.status === 'open'
                            ? 'fill-green-400 text-green-400'
                            : 'fill-gray-300 text-gray-300'
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-sm text-gray-900 truncate">
                          {session.customer_name}
                        </span>
                        <span className="text-[10px] text-gray-400 flex-shrink-0">
                          {formatDate(session.updated_at)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <p className="text-xs text-gray-500 truncate max-w-[160px]">
                          {session.lastMessage || 'Mesaj yok'}
                        </p>
                        {session.unread_admin > 0 && (
                          <span className="ml-2 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 flex-shrink-0">
                            {session.unread_admin}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <span
                          className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold ${
                            session.status === 'waiting'
                              ? 'bg-yellow-100 text-yellow-700'
                              : session.status === 'open'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {session.status === 'waiting' ? 'Bekliyor' : session.status === 'open' ? 'Açık' : 'Kapalı'}
                        </span>
                        {session.customer_phone && (
                          <span className="text-[9px] text-gray-400 truncate">
                            {session.customer_phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>

        {/* ── Sağ Panel: Mesajlar ───────────────────────────────────────────── */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {!activeSession ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                <MessageCircle size={36} className="text-gray-300" />
              </div>
              <p className="font-semibold text-gray-500">Bir sohbet seçin</p>
              <p className="text-sm mt-1">Sol panelden müşteri sohbetini açın</p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="bg-white border-b border-gray-200 px-5 py-3.5 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center">
                    <User size={18} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{activeSession.customer_name}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      {activeSession.customer_email && <span>{activeSession.customer_email}</span>}
                      {activeSession.customer_phone && <span>· {activeSession.customer_phone}</span>}
                      <span
                        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold ${
                          activeSession.status === 'waiting'
                            ? 'bg-yellow-100 text-yellow-700'
                            : activeSession.status === 'open'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        <Circle size={6} className="fill-current" />
                        {activeSession.status === 'waiting'
                          ? 'Bekliyor'
                          : activeSession.status === 'open'
                          ? 'Açık'
                          : 'Kapalı'}
                      </span>
                    </div>
                  </div>
                </div>
                {activeSession.status !== 'closed' && (
                  <button
                    onClick={() => closeSession(activeSession.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <X size={13} />
                    Sohbeti Kapat
                  </button>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 bg-gray-50">
                {loadingMessages ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 size={24} className="animate-spin text-primary-500" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-gray-400 text-sm py-12">Henüz mesaj yok</div>
                ) : (
                  messages.map((msg, index) => {
                    const isAdmin = msg.sender_type === 'admin';
                    const prevMsg = messages[index - 1];
                    const showDateSeparator =
                      !prevMsg ||
                      new Date(msg.created_at).toDateString() !==
                        new Date(prevMsg.created_at).toDateString();

                    return (
                      <div key={msg.id}>
                        {showDateSeparator && (
                          <div className="flex items-center gap-3 my-2">
                            <div className="flex-1 h-px bg-gray-200" />
                            <span className="text-xs text-gray-400 px-2">
                              {formatDate(msg.created_at)}
                            </span>
                            <div className="flex-1 h-px bg-gray-200" />
                          </div>
                        )}
                        <div className={`flex gap-3 ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                          {!isAdmin && (
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-auto">
                              <User size={15} className="text-gray-500" />
                            </div>
                          )}
                          <div
                            className={`max-w-[65%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                              isAdmin
                                ? 'bg-primary-600 text-white rounded-tr-sm'
                                : 'bg-white text-gray-800 rounded-tl-sm shadow-sm border border-gray-100'
                            }`}
                          >
                            <p>{msg.message}</p>
                            <div
                              className={`flex items-center gap-1.5 mt-1 ${
                                isAdmin ? 'justify-end' : 'justify-start'
                              }`}
                            >
                              <span
                                className={`text-[10px] ${
                                  isAdmin ? 'text-white/60' : 'text-gray-400'
                                }`}
                              >
                                {formatTime(msg.created_at)}
                              </span>
                              {isAdmin && (
                                <CheckCheck
                                  size={12}
                                  className={msg.is_read ? 'text-blue-300' : 'text-white/50'}
                                />
                              )}
                            </div>
                          </div>
                          {isAdmin && (
                            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-auto">
                              <Headphones size={15} className="text-primary-600" />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="bg-white border-t border-gray-200 px-4 py-3 flex-shrink-0">
                {activeSession.status === 'closed' ? (
                  <p className="text-center text-sm text-gray-400 py-2">Bu sohbet kapatılmış.</p>
                ) : (
                  <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-200 focus-within:border-primary-400 transition-colors">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Müşteriye yanıt yazın..."
                      className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-gray-400"
                      disabled={sending}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!inputText.trim() || sending}
                      className="w-9 h-9 flex items-center justify-center bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-40 flex-shrink-0"
                    >
                      {sending ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Send size={16} />
                      )}
                    </button>
                  </div>
                )}
                <p className="text-center text-[10px] text-gray-400 mt-2">
                  <Clock size={9} className="inline mr-1" />
                  {ADMIN_NAME} · Admin Paneli
                </p>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
