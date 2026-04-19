'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, CreditCard, Truck, CheckCircle } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useAuthStore } from '@/store/auth';
import { supabase } from '@/lib/supabase';
import { formatPrice, getProductImageUrl } from '@/lib/utils';
import Toast from '@/components/ui/Toast';

type Step = 'info' | 'payment' | 'confirm';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, getTaxTotal, getGrandTotal, clearCart } = useCartStore();
  const { customer, isAuthenticated } = useAuthStore();

  const [step, setStep] = useState<Step>('info');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNo, setOrderNo] = useState('');

  const [form, setForm] = useState({
    fullName: customer?.full_name || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    address: customer?.address || '',
    city: customer?.city || '',
    notes: '',
  });

  const shippingCost = getTotalPrice() >= 2000 ? 0 : 149;
  const grandTotal = getGrandTotal() + shippingCost;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateInfo = () => {
    if (!form.fullName || !form.phone || !form.address || !form.city) {
      setToast({ message: 'Lütfen zorunlu alanları doldurun', type: 'error' });
      return false;
    }
    return true;
  };

  const handleSubmitOrder = async () => {
    setLoading(true);
    try {
      // Create or find customer
      let customerId = customer?.id;

      if (!customerId) {
        const { data: existingCustomer } = await supabase
          .from('customers')
          .select('id')
          .eq('phone', form.phone)
          .single();

        if (existingCustomer) {
          customerId = existingCustomer.id;
        } else {
          const { data: newCustomer, error: custErr } = await supabase
            .from('customers')
            .insert({
              full_name: form.fullName,
              email: form.email || null,
              phone: form.phone,
              address: form.address,
              city: form.city,
            })
            .select('id')
            .single();

          if (custErr) throw custErr;
          customerId = newCustomer.id;
        }
      }

      // Calculate totals
      const subtotal = getTotalPrice();
      const taxTotal = getTaxTotal();
      const discountTotal = 0;

      // Create order
      const { data: order, error: orderErr } = await supabase
        .from('orders')
        .insert({
          order_no: '',
          customer_id: customerId,
          order_status: 'beklemede',
          payment_status: 'odenmedi',
          subtotal,
          tax_total: taxTotal,
          discount_total: discountTotal,
          grand_total: grandTotal,
          shipping_address: form.address,
          shipping_city: form.city,
          notes: form.notes || null,
        })
        .select()
        .single();

      if (orderErr) throw orderErr;

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        unit_price: item.product.sale_price,
        tax_rate: item.product.tax_rate,
        discount_rate: 0,
        line_total: item.product.sale_price * item.quantity,
      }));

      const { error: itemsErr } = await supabase.from('order_items').insert(orderItems);
      if (itemsErr) throw itemsErr;

      setOrderNo(order.order_no);
      setOrderComplete(true);
      clearCart();
    } catch (error) {
      console.error('Sipariş oluşturulurken hata:', error);
      setToast({ message: 'Sipariş oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && !orderComplete) {
    router.push('/sepet');
    return null;
  }

  if (orderComplete) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Siparişiniz Alındı!</h1>
        <p className="text-gray-500 mb-2">Sipariş numaranız: <span className="font-bold text-primary-600">{orderNo}</span></p>
        <p className="text-gray-500 mb-8">Siparişiniz en kısa sürede hazırlanacaktır.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/urunler" className="px-8 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors">
            Alışverişe Devam Et
          </Link>
          {isAuthenticated && (
            <Link href="/hesabim/siparislerim" className="px-8 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors">
              Siparişlerimi Gör
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary-600">Ana Sayfa</Link>
        <ChevronRight size={14} />
        <Link href="/sepet" className="hover:text-primary-600">Sepet</Link>
        <ChevronRight size={14} />
        <span className="text-gray-900 font-medium">Sipariş</span>
      </nav>

      {/* Steps */}
      <div className="flex items-center justify-center gap-4 mb-10">
        {[
          { key: 'info', label: 'Bilgiler', icon: <Truck size={18} /> },
          { key: 'payment', label: 'Ödeme', icon: <CreditCard size={18} /> },
          { key: 'confirm', label: 'Onay', icon: <CheckCircle size={18} /> },
        ].map((s, i) => (
          <div key={s.key} className="flex items-center gap-2">
            {i > 0 && <div className={`w-12 h-0.5 ${['payment', 'confirm'].indexOf(step) >= i ? 'bg-primary-500' : 'bg-gray-200'}`} />}
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                step === s.key
                  ? 'bg-primary-600 text-white'
                  : ['payment', 'confirm'].indexOf(step) > ['info', 'payment', 'confirm'].indexOf(s.key)
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {s.icon}
              <span className="hidden sm:inline">{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          {step === 'info' && (
            <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4 animate-fade-in">
              <h2 className="text-lg font-bold text-gray-900 mb-2">Teslimat Bilgileri</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad *</label>
                  <input name="fullName" value={form.fullName} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                  <input name="email" type="email" value={form.email} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefon *</label>
                  <input name="phone" value={form.phone} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Şehir *</label>
                  <select name="city" value={form.city} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-0 bg-white">
                    <option value="">Seçiniz</option>
                    {['Samsun', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 'Konya', 'Gaziantep', 'Kayseri', 'Mersin', 'Eskişehir', 'Diyarbakır', 'Trabzon', 'Denizli', 'Sakarya', 'Muğla', 'Aydın', 'Manisa', 'Balıkesir', 'Tekirdağ', 'Kocaeli'].map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adres *</label>
                <textarea name="address" value={form.address} onChange={handleInputChange} rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sipariş Notu</label>
                <textarea name="notes" value={form.notes} onChange={handleInputChange} rows={2} placeholder="Teslimatla ilgili notunuz varsa yazabilirsiniz..." className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-0" />
              </div>
              <button
                onClick={() => validateInfo() && setStep('payment')}
                className="w-full py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
              >
                Ödeme Adımına Geç
              </button>
            </div>
          )}

          {step === 'payment' && (
            <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4 animate-fade-in">
              <h2 className="text-lg font-bold text-gray-900 mb-2">Ödeme Bilgileri</h2>
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-700">
                <p className="font-medium mb-1">Kapıda Ödeme</p>
                <p>Siparişiniz kapıda nakit veya kredi kartı ile ödeme seçeneğiyle teslim edilecektir.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl text-sm">
                <h3 className="font-semibold text-gray-800 mb-2">Teslimat Özeti</h3>
                <p className="text-gray-600">{form.fullName}</p>
                <p className="text-gray-600">{form.phone}</p>
                <p className="text-gray-600">{form.address}, {form.city}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep('info')}
                  className="px-6 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Geri
                </button>
                <button
                  onClick={() => setStep('confirm')}
                  className="flex-1 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
                >
                  Siparişi Onayla
                </button>
              </div>
            </div>
          )}

          {step === 'confirm' && (
            <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4 animate-fade-in">
              <h2 className="text-lg font-bold text-gray-900 mb-2">Sipariş Onayı</h2>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="relative w-14 h-14 bg-white rounded-lg overflow-hidden shrink-0">
                      <Image src={getProductImageUrl(item.product.image_url)} alt={item.product.name} fill className="object-cover" sizes="56px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{item.product.name}</p>
                      <p className="text-xs text-gray-500">{item.quantity} adet</p>
                    </div>
                    <p className="text-sm font-bold text-primary-700">{formatPrice(item.product.sale_price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep('payment')}
                  className="px-6 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Geri
                </button>
                <button
                  onClick={handleSubmitOrder}
                  disabled={loading}
                  className="flex-1 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'İşleniyor...' : 'Siparişi Tamamla'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-32 bg-white rounded-xl border border-gray-100 p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Sipariş Özeti</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Ürünler ({items.length})</span><span>{formatPrice(getTotalPrice())}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">KDV</span><span>{formatPrice(getTaxTotal())}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Kargo</span><span className={shippingCost === 0 ? 'text-green-600' : ''}>{shippingCost === 0 ? 'Ücretsiz' : formatPrice(shippingCost)}</span></div>
            </div>
            <hr />
            <div className="flex justify-between text-lg font-bold">
              <span>Toplam</span>
              <span className="text-primary-700">{formatPrice(grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
