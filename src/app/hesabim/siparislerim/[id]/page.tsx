'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Package, MapPin, CreditCard, Calendar } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { supabase } from '@/lib/supabase';
import type { Order, OrderItem, Product } from '@/types';
import { formatPrice, formatDate, getOrderStatusLabel, getOrderStatusColor, getPaymentStatusLabel, getProductImageUrl } from '@/lib/utils';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<(OrderItem & { product: Product })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/giris');
      return;
    }

    async function fetchOrder() {
      try {
        const { data: orderData } = await supabase
          .from('orders')
          .select('*, customer:customers(*)')
          .eq('id', orderId)
          .single();

        if (orderData) {
          setOrder(orderData as unknown as Order);
        }

        const { data: itemsData } = await supabase
          .from('order_items')
          .select('*, product:products(*)')
          .eq('order_id', orderId);

        if (itemsData) {
          setOrderItems(itemsData as unknown as (OrderItem & { product: Product })[]);
        }
      } catch (error) {
        console.error('Sipariş yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [isAuthenticated, orderId, router]);

  if (!isAuthenticated) return null;
  if (loading) return <LoadingSpinner size="lg" />;
  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Sipariş Bulunamadı</h2>
        <Link href="/hesabim/siparislerim" className="text-primary-600 font-medium">Siparişlerime Dön</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap">
        <Link href="/" className="hover:text-primary-600">Ana Sayfa</Link>
        <ChevronRight size={14} />
        <Link href="/hesabim" className="hover:text-primary-600">Hesabım</Link>
        <ChevronRight size={14} />
        <Link href="/hesabim/siparislerim" className="hover:text-primary-600">Siparişlerim</Link>
        <ChevronRight size={14} />
        <span className="text-gray-900 font-medium">#{order.order_no}</span>
      </nav>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sipariş #{order.order_no}</h1>
          <p className="text-sm text-gray-500 mt-1">{formatDate(order.created_at)}</p>
        </div>
        <span className={`px-4 py-2 text-sm font-medium rounded-full ${getOrderStatusColor(order.order_status)}`}>
          {getOrderStatusLabel(order.order_status)}
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Ürünler</h2>
            <div className="space-y-4">
              {orderItems.map((item) => (
                <div key={item.id} className="flex gap-4 p-3 bg-gray-50 rounded-xl">
                  <div className="relative w-20 h-20 bg-white rounded-lg overflow-hidden shrink-0">
                    <Image src={getProductImageUrl(item.product?.image_url)} alt={item.product?.name || ''} fill className="object-cover" sizes="80px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{item.product?.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.quantity} adet × {formatPrice(item.unit_price)}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-primary-700 whitespace-nowrap">{formatPrice(item.line_total)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-4">
          {/* Totals */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Sipariş Özeti</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Ara Toplam</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">KDV</span>
                <span>{formatPrice(order.tax_total)}</span>
              </div>
              {order.discount_total > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">İndirim</span>
                  <span className="text-green-600">-{formatPrice(order.discount_total)}</span>
                </div>
              )}
              <hr className="my-2" />
              <div className="flex justify-between text-lg font-bold">
                <span>Toplam</span>
                <span className="text-primary-700">{formatPrice(order.grand_total)}</span>
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <MapPin size={18} className="text-primary-600" /> Teslimat Adresi
            </h3>
            <p className="text-sm text-gray-600">{order.shipping_address}</p>
            <p className="text-sm text-gray-600">{order.shipping_city}</p>
          </div>

          {/* Payment Status */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <CreditCard size={18} className="text-primary-600" /> Ödeme Durumu
            </h3>
            <p className="text-sm text-gray-600">{getPaymentStatusLabel(order.payment_status)}</p>
          </div>

          {order.notes && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Sipariş Notu</h3>
              <p className="text-sm text-gray-600">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
