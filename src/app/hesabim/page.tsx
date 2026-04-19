'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, ShoppingBag, Heart, MapPin, LogOut, ChevronRight, Package } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { supabase } from '@/lib/supabase';
import type { Order } from '@/types';
import { formatPrice, formatDate, getOrderStatusLabel, getOrderStatusColor } from '@/lib/utils';

export default function AccountPage() {
  const router = useRouter();
  const { customer, isAuthenticated, logout } = useAuthStore();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
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
          .select('*, customer:customers(*)')
          .eq('customer_id', customer.id)
          .order('created_at', { ascending: false })
          .limit(5);
        if (data) setRecentOrders(data as unknown as Order[]);
      } catch (error) {
        console.error('Siparişler yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [isAuthenticated, customer, router]);

  if (!isAuthenticated || !customer) return null;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary-600">Ana Sayfa</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Hesabım</span>
      </nav>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold text-lg">
                {customer.full_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{customer.full_name}</h3>
                <p className="text-xs text-gray-500">{customer.phone}</p>
              </div>
            </div>
          </div>

          <nav className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {[
              { href: '/hesabim', icon: <User size={18} />, label: 'Hesap Bilgileri', active: true },
              { href: '/hesabim/siparislerim', icon: <ShoppingBag size={18} />, label: 'Siparişlerim' },
              { href: '/favoriler', icon: <Heart size={18} />, label: 'Favorilerim' },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-5 py-3.5 text-sm font-medium border-b border-gray-50 transition-colors ${
                  item.active ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item.icon}
                {item.label}
                <ChevronRight size={14} className="ml-auto" />
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-5 py-3.5 text-sm font-medium text-red-500 hover:bg-red-50 w-full transition-colors"
            >
              <LogOut size={18} />
              Çıkış Yap
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Account Info */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Hesap Bilgileri</h2>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Ad Soyad</span>
                <p className="font-medium text-gray-800">{customer.full_name}</p>
              </div>
              <div>
                <span className="text-gray-500">Telefon</span>
                <p className="font-medium text-gray-800">{customer.phone || '-'}</p>
              </div>
              <div>
                <span className="text-gray-500">E-posta</span>
                <p className="font-medium text-gray-800">{customer.email || '-'}</p>
              </div>
              <div>
                <span className="text-gray-500">Şehir</span>
                <p className="font-medium text-gray-800">{customer.city || '-'}</p>
              </div>
              <div className="sm:col-span-2">
                <span className="text-gray-500">Adres</span>
                <p className="font-medium text-gray-800">{customer.address || '-'}</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center">
                  <Package size={20} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{customer.total_orders}</p>
                  <p className="text-xs text-gray-500">Toplam Sipariş</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                  <ShoppingBag size={20} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{formatPrice(customer.total_spent)}</p>
                  <p className="text-xs text-gray-500">Toplam Harcama</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Son Siparişlerim</h2>
              <Link href="/hesabim/siparislerim" className="text-sm text-primary-600 font-medium hover:text-primary-700">
                Tümünü Gör
              </Link>
            </div>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-16 skeleton rounded-lg" />
                ))}
              </div>
            ) : recentOrders.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">Henüz siparişiniz bulunmamaktadır.</p>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/hesabim/siparislerim/${order.id}`}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-800">#{order.order_no}</p>
                      <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary-700">{formatPrice(order.grand_total)}</p>
                      <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${getOrderStatusColor(order.order_status)}`}>
                        {getOrderStatusLabel(order.order_status)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
