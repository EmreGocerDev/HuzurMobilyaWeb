'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from 'lucide-react';
import Toast from '@/components/ui/Toast';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.message) {
      setToast({ message: 'Lütfen zorunlu alanları doldurun', type: 'error' });
      return;
    }
    setLoading(true);
    // Simulate sending
    setTimeout(() => {
      setToast({ message: 'Mesajınız başarıyla gönderildi! En kısa sürede dönüş yapacağız.', type: 'success' });
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      setLoading(false);
    }, 1000);
  };

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-800 to-primary-950 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">İletişim</h1>
          <p className="text-primary-200 text-lg max-w-2xl mx-auto">
            Sorularınız, önerileriniz veya siparişleriniz hakkında bize ulaşabilirsiniz.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">İletişim Bilgileri</h2>
              <div className="space-y-4">
                {[
                  { icon: <MapPin size={20} />, title: 'Adres', text: 'Atatürk Cad. No:42\nİlkadım, Samsun' },
                  { icon: <Phone size={20} />, title: 'Telefon', text: '0555 000 0000\n0212 000 0000' },
                  { icon: <Mail size={20} />, title: 'E-posta', text: 'info@huzurmobilya.com\ndestek@huzurmobilya.com' },
                  { icon: <Clock size={20} />, title: 'Çalışma Saatleri', text: 'Pzt - Cmt: 09:00 - 19:00\nPazar: 10:00 - 17:00' },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100">
                    <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-500 whitespace-pre-line">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Whatsapp */}
              <a
                href="https://wa.me/905550000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-3 bg-green-500 text-white font-medium rounded-xl hover:bg-green-600 transition-colors"
              >
                <MessageCircle size={20} />
                WhatsApp ile İletişim
              </a>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Bize Yazın</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad *</label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-primary-500 focus:ring-0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-primary-500 focus:ring-0"
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-primary-500 focus:ring-0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Konu</label>
                      <select
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-primary-500 focus:ring-0 bg-white"
                      >
                        <option value="">Seçiniz</option>
                        <option value="siparis">Sipariş Hakkında</option>
                        <option value="urun">Ürün Bilgisi</option>
                        <option value="iade">İade / Değişim</option>
                        <option value="sikayet">Şikayet</option>
                        <option value="oneri">Öneri</option>
                        <option value="diger">Diğer</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mesajınız *</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={5}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-primary-500 focus:ring-0"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center gap-2 px-8 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50"
                  >
                    <Send size={18} />
                    {loading ? 'Gönderiliyor...' : 'Mesaj Gönder'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Embed */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gray-200 rounded-2xl overflow-hidden h-80">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d385396.3909498794!2d28.731994!3d41.005370!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caa7040068086b%3A0xe1ccfe98bc01b0d0!2z4bCw4bGh4bGi4bCo4bC44bCy4bCr!5e0!3m2!1str!2str!4v1700000000000"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Huzur Mobilya Konum"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
