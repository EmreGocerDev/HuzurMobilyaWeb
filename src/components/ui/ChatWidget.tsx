'use client';

import { useEffect, useRef, useState } from 'react';
import {
  MessageCircle,
  X,
  Send,
  ChevronDown,
  Loader2,
  User,
  Headphones,
  CheckCheck,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';

interface Message {
  id: string;
  session_id: string;
  sender_type: 'customer' | 'admin';
  sender_name: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

type ChatStep = 'closed' | 'welcome' | 'form' | 'chat';

export default function ChatWidget() {
  const customer = useAuthStore((s) => s.customer);

  const [step, setStep] = useState<ChatStep>('closed');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [unread, setUnread] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  // Guest form
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (step === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, step]);

  // Focus input when chat opens
  useEffect(() => {
    if (step === 'chat') {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [step]);

  // Subscribe to messages for current session
  useEffect(() => {
    if (!sessionId) return;

    const channel = supabase
      .channel(`chat:${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          const msg = payload.new as Message;
          setMessages((prev) => {
            if (prev.some((m) => m.id === msg.id)) return prev;
            return [...prev, msg];
          });
          if (msg.sender_type === 'admin') {
            if (step !== 'chat') {
              setUnread((u) => u + 1);
            }
            // Simulate typing indicator cleared
            setIsTyping(false);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, step]);

  const openChat = () => {
    if (step !== 'closed') {
      setStep('closed');
      return;
    }
    setUnread(0);
    setStep('welcome');
  };

  const startChat = async () => {
    const name = customer?.full_name || guestName.trim();
    const email = customer?.email || guestEmail.trim() || null;
    const phone = customer?.phone || null;

    if (!name) return;

    try {
      // Check for existing open session
      let existingId: string | null = null;

      if (customer?.id) {
        const { data } = await supabase
          .from('chat_sessions')
          .select('id')
          .eq('customer_id', customer.id)
          .eq('status', 'open')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        existingId = data?.id ?? null;
      }

      if (existingId) {
        setSessionId(existingId);
        // Load existing messages
        const { data: msgs } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('session_id', existingId)
          .order('created_at', { ascending: true });
        setMessages((msgs as Message[]) || []);
      } else {
        const { data, error } = await supabase
          .from('chat_sessions')
          .insert({
            customer_id: customer?.id || null,
            customer_name: name,
            customer_email: email,
            customer_phone: phone,
            status: 'waiting',
          })
          .select()
          .single();

        if (error || !data) return;
        setSessionId(data.id);

        // Send automatic welcome message
        await supabase.from('chat_messages').insert({
          session_id: data.id,
          sender_type: 'admin',
          sender_name: 'Huzur Mobilya Destek',
          message: `Merhaba ${name}! 👋 Huzur Mobilya canlı desteğine hoş geldiniz. Yetkilimiz kısa süre içinde size yardımcı olacaktır. Lütfen sorununuzu yazınız.`,
          is_read: false,
        });
      }

      setStep('chat');
    } catch {
      // silently ignore
    }
  };

  const sendMessage = async () => {
    const text = inputText.trim();
    if (!text || !sessionId || sending) return;

    setSending(true);
    setInputText('');

    const name = customer?.full_name || guestName || 'Misafir';

    try {
      await supabase.from('chat_messages').insert({
        session_id: sessionId,
        sender_type: 'customer',
        sender_name: name,
        message: text,
        is_read: false,
      });

      // Update session updated_at + status
      await supabase
        .from('chat_sessions')
        .update({ status: 'open', unread_admin: supabase.rpc('increment_unread', { session_id: sessionId }) })
        .eq('id', sessionId);
    } catch {
      setInputText(text); // restore on error
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  };

  const isOpen = step !== 'closed';

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat Panel */}
      {isOpen && (
        <div
          className="w-[360px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
          style={{ maxHeight: '520px', animation: 'slideUp 0.2s ease' }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Headphones size={20} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm">Canlı Destek</p>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-white/80 text-xs">Çevrimiçi · Hızlı yanıt</span>
              </div>
            </div>
            <button
              onClick={() => setStep('closed')}
              className="text-white/70 hover:text-white transition-colors p-1"
            >
              <ChevronDown size={20} />
            </button>
          </div>

          {/* Content */}
          {step === 'welcome' && (
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 text-center">
              <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mb-4">
                <MessageCircle size={28} className="text-primary-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Nasıl yardımcı olabiliriz?</h3>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                Ürünlerimiz, siparişleriniz veya herhangi bir konuda sorularınızı yanıtlamaktan memnuniyet duyarız.
              </p>
              {customer ? (
                <button
                  onClick={startChat}
                  className="w-full py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
                >
                  Sohbet Başlat
                </button>
              ) : (
                <button
                  onClick={() => setStep('form')}
                  className="w-full py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
                >
                  Devam Et
                </button>
              )}
            </div>
          )}

          {step === 'form' && (
            <div className="flex-1 flex flex-col px-6 py-6 gap-4">
              <p className="text-sm text-gray-500 text-center">Sizi tanımak isteriz</p>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Ad Soyad *</label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Adınız Soyadınız"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-primary-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">E-posta (isteğe bağlı)</label>
                <input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="ornek@email.com"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-primary-500 focus:outline-none"
                />
              </div>
              <button
                onClick={startChat}
                disabled={!guestName.trim()}
                className="w-full py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 mt-auto"
              >
                Sohbet Başlat
              </button>
            </div>
          )}

          {step === 'chat' && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50" style={{ minHeight: 0 }}>
                {messages.length === 0 && (
                  <div className="text-center text-gray-400 text-xs py-4">Henüz mesaj yok</div>
                )}
                {messages.map((msg) => {
                  const isAdmin = msg.sender_type === 'admin';
                  return (
                    <div key={msg.id} className={`flex gap-2 ${isAdmin ? 'justify-start' : 'justify-end'}`}>
                      {isAdmin && (
                        <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-auto">
                          <Headphones size={14} className="text-primary-600" />
                        </div>
                      )}
                      <div
                        className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                          isAdmin
                            ? 'bg-white text-gray-800 rounded-tl-sm shadow-sm border border-gray-100'
                            : 'bg-primary-600 text-white rounded-tr-sm'
                        }`}
                      >
                        <p>{msg.message}</p>
                        <div className={`flex items-center gap-1 mt-1 ${isAdmin ? 'justify-start' : 'justify-end'}`}>
                          <span className={`text-[10px] ${isAdmin ? 'text-gray-400' : 'text-white/60'}`}>
                            {formatTime(msg.created_at)}
                          </span>
                          {!isAdmin && (
                            <CheckCheck size={12} className={msg.is_read ? 'text-blue-300' : 'text-white/50'} />
                          )}
                        </div>
                      </div>
                      {!isAdmin && (
                        <div className="w-7 h-7 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0 mt-auto">
                          <User size={14} className="text-white" />
                        </div>
                      )}
                    </div>
                  );
                })}
                {isTyping && (
                  <div className="flex gap-2 justify-start">
                    <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <Headphones size={14} className="text-primary-600" />
                    </div>
                    <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100">
                      <div className="flex gap-1 items-center">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="px-3 py-3 bg-white border-t border-gray-100">
                <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Mesajınızı yazın..."
                    className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-gray-400"
                    disabled={sending}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!inputText.trim() || sending}
                    className="w-8 h-8 flex items-center justify-center bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-40 flex-shrink-0"
                  >
                    {sending ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : (
                      <Send size={15} />
                    )}
                  </button>
                </div>
                <p className="text-center text-[10px] text-gray-400 mt-2">Huzur Mobilya · Canlı Destek</p>
              </div>
            </>
          )}
        </div>
      )}

      {/* FAB Button */}
      <button
        onClick={openChat}
        className={`relative w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 ${
          isOpen
            ? 'bg-gray-700 hover:bg-gray-800'
            : 'bg-primary-600 hover:bg-primary-700 hover:scale-105'
        }`}
      >
        {isOpen ? (
          <X size={22} className="text-white" />
        ) : (
          <MessageCircle size={24} className="text-white" />
        )}
        {!isOpen && unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
