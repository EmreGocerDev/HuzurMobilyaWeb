'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft, Tag } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { formatPrice, getProductImageUrl } from '@/lib/utils';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice, getTaxTotal, getGrandTotal } = useCartStore();
  const [couponCode, setCouponCode] = useState('');

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag size={40} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Sepetiniz Boş</h2>
        <p className="text-gray-500 mb-8">Henüz sepetinize ürün eklemediniz.</p>
        <Link
          href="/urunler"
          className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
        >
          <ShoppingBag size={20} />
          Alışverişe Başla
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary-600">Ana Sayfa</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Sepetim</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">Sepetim ({items.length} ürün)</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const totalStock = item.product.stock?.reduce((s, st) => s + st.quantity, 0) ?? 99;
            return (
              <div key={item.product.id} className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-gray-50 rounded-xl overflow-hidden shrink-0">
                  <Image
                    src={getProductImageUrl(item.product.image_url)}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      {item.product.category && (
                        <p className="text-xs text-primary-600 font-medium">{item.product.category.name}</p>
                      )}
                      <Link href={`/urun/${item.product.id}`}>
                        <h3 className="text-sm font-semibold text-gray-800 hover:text-primary-600 transition-colors line-clamp-2">
                          {item.product.name}
                        </h3>
                      </Link>
                    </div>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                      title="Kaldır"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="mt-3 flex items-end justify-between">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="px-2 py-1.5 hover:bg-gray-50 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-3 py-1.5 text-sm font-medium min-w-[40px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, Math.min(totalStock, item.quantity + 1))}
                        className="px-2 py-1.5 hover:bg-gray-50 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary-700">
                        {formatPrice(item.product.sale_price * item.quantity)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-gray-500">Birim: {formatPrice(item.product.sale_price)}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="flex items-center justify-between pt-4">
            <Link href="/urunler" className="flex items-center gap-2 text-sm text-primary-600 font-medium hover:text-primary-700">
              <ArrowLeft size={18} />
              Alışverişe Devam Et
            </Link>
            <button
              onClick={clearCart}
              className="flex items-center gap-2 text-sm text-red-500 font-medium hover:text-red-600"
            >
              <Trash2 size={16} />
              Sepeti Temizle
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-32 bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Sipariş Özeti</h2>

            {/* Coupon */}
            <div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Kupon kodu"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-0"
                  />
                </div>
                <button className="px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg text-sm hover:bg-gray-200 transition-colors">
                  Uygula
                </button>
              </div>
            </div>

            <hr />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Ara Toplam</span>
                <span className="font-medium">{formatPrice(getTotalPrice())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">KDV</span>
                <span className="font-medium">{formatPrice(getTaxTotal())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Kargo</span>
                <span className="font-medium text-green-600">
                  {getTotalPrice() >= 2000 ? 'Ücretsiz' : formatPrice(149)}
                </span>
              </div>
            </div>

            <hr />

            <div className="flex justify-between text-lg font-bold">
              <span>Toplam</span>
              <span className="text-primary-700">
                {formatPrice(getGrandTotal() + (getTotalPrice() >= 2000 ? 0 : 149))}
              </span>
            </div>

            {getTotalPrice() < 2000 && (
              <p className="text-xs text-center text-gray-500 bg-yellow-50 p-2 rounded-lg">
                Ücretsiz kargo için {formatPrice(2000 - getTotalPrice())} daha eklemeniz gerekiyor.
              </p>
            )}

            <Link
              href="/siparis"
              className="block w-full py-3.5 bg-primary-600 text-white text-center font-semibold rounded-xl hover:bg-primary-700 transition-all transform hover:scale-[1.02] shadow-lg shadow-primary-500/20"
            >
              Siparişi Tamamla
            </Link>

            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Güvenli ödeme ile korunuyorsunuz
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
