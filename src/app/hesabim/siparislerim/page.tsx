'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { supabase } from '@/lib/supabase';
import type { Order } from '@/types';
import { formatPrice, formatDate, getOrderStatusLabel, getOrderStatusColor } from '@/lib/utils';

export default function OrdersPage() {
  const router = useRouter();
  const { customer, isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/giris');
      return;
    }

    async function fetchOrders() {
      if (!customer?.id) return;
      try {
        const { data } = await supabase
          .from('orders')
          .select('*')
          .eq('customer_id', customer.id)
          .order('created_at', { ascending: false });
        if (data) setOrders(data as unknown as Order[]);
      } catch (error) {
        console.error('Siparişler yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [isAuthenticated, customer, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary-600">Ana Sayfa</Link>
        <ChevronRight size={14} />
        <Link href="/hesabim" className="hover:text-primary-600">Hesabım</Link>
        <ChevronRight size={14} />
        <span className="text-gray-900 font-medium">Siparişlerim</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">Siparişlerim</h1>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 skeleton rounded-xl" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Henüz Siparişiniz Yok</h3>
          <p className="text-gray-500 mb-6">İlk siparişinizi vermek için alışverişe başlayın.</p>
          <Link href="/urunler" className="px-6 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors">
            Alışverişe Başla
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/hesabim/siparislerim/${order.id}`}
              className="block bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-gray-900">Sipariş #{order.order_no}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatDate(order.created_at)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getOrderStatusColor(order.order_status)}`}>
                    {getOrderStatusLabel(order.order_status)}
                  </span>
                  <span className="text-lg font-bold text-primary-700">{formatPrice(order.grand_total)}</span>
                  <ChevronRight size={18} className="text-gray-400" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
