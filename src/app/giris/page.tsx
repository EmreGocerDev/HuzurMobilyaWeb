'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff, Mail, Phone, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { verifyPassword } from '@/lib/crypto';
import { useAuthStore } from '@/store/auth';
import type { Customer } from '@/types';
import Toast from '@/components/ui/Toast';

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('phone');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!password) {
        setToast({ message: 'Lütfen şifrenizi girin', type: 'error' });
        setLoading(false);
        return;
      }

      let query = supabase.from('customers').select('*');

      if (loginMethod === 'email') {
        if (!email) {
          setToast({ message: 'Lütfen e-posta adresinizi girin', type: 'error' });
          setLoading(false);
          return;
        }
        query = query.eq('email', email.toLowerCase().trim());
      } else {
        if (!phone) {
          setToast({ message: 'Lütfen telefon numaranızı girin', type: 'error' });
          setLoading(false);
          return;
        }
        query = query.eq('phone', phone.trim());
      }

      const { data, error } = await query.single();

      if (error || !data) {
        setToast({ message: 'Hesap bulunamadı. Lütfen bilgilerinizi kontrol edin.', type: 'error' });
        setLoading(false);
        return;
      }

      if (!data.password_hash) {
        setToast({ message: 'Bu hesap için şifre tanımlanmamış. Lütfen yönetici ile iletişime geçin.', type: 'error' });
        setLoading(false);
        return;
      }

      const passwordValid = await verifyPassword(password, data.password_hash);
      if (!passwordValid) {
        setToast({ message: 'Şifre hatalı. Lütfen tekrar deneyin.', type: 'error' });
        setLoading(false);
        return;
      }

      login(data as Customer);
      setToast({ message: 'Giriş başarılı! Yönlendiriliyorsunuz...', type: 'success' });
      setTimeout(() => router.push('/hesabim'), 1000);
    } catch {
      setToast({ message: 'Bir hata oluştu. Lütfen tekrar deneyin.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <Image src="/logo.png" alt="Huzur Mobilya" width={64} height={64} className="rounded-xl mx-auto" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Hoş Geldiniz</h1>
          <p className="text-gray-500 text-sm mt-1">Hesabınıza giriş yapın</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          {/* Login method toggle */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button
              onClick={() => setLoginMethod('phone')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                loginMethod === 'phone' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500'
              }`}
            >
              Telefon ile
            </button>
            <button
              onClick={() => setLoginMethod('email')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                loginMethod === 'email' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500'
              }`}
            >
              E-posta ile
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginMethod === 'email' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ornek@email.com"
                    autoComplete="email"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-primary-500 focus:ring-0 focus:outline-none"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <span className="absolute left-9 top-1/2 -translate-y-1/2 text-gray-400 text-sm">+90</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="555 000 0000"
                    autoComplete="tel"
                    className="w-full pl-16 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-primary-500 focus:ring-0 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Şifre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-primary-500 focus:ring-0 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Hesabınız yok mu?{' '}
              <Link href="/kayit" className="text-primary-600 font-medium hover:text-primary-700">
                Kayıt Ol
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
