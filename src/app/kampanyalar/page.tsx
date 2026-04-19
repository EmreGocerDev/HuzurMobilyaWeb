'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Tag, Percent, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/types';
import ProductCard from '@/components/product/ProductCard';
import ProductSkeleton from '@/components/ui/ProductSkeleton';

export default function CampaignsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data } = await supabase
          .from('products')
          .select('*, category:categories(*), stock(*)')
          .eq('is_active', true)
          .order('sale_price', { ascending: true })
          .limit(12);
        if (data) setProducts(data as unknown as Product[]);
      } catch (error) {
        console.error('Ürünler yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-red-600 to-red-800 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-60 h-60 bg-yellow-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-red-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-6">
            <Percent size={16} />
            Özel Kampanyalar
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Büyük İndirimler!</h1>
          <p className="text-red-100 text-lg max-w-2xl mx-auto mb-8">
            En uygun fiyatlı ürünlerimiz ve özel kampanyalarımızdan yararlanın. Fırsatları kaçırmayın!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 px-5 py-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <Tag size={18} />
              <span className="text-sm font-medium">Ücretsiz Kargo</span>
            </div>
            <div className="flex items-center gap-2 px-5 py-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <Clock size={18} />
              <span className="text-sm font-medium">Sınırlı Süre</span>
            </div>
          </div>
        </div>
      </section>

      {/* Promotional Banners */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl text-white">
              <h3 className="text-xl font-bold mb-2">Koltuk Takımları</h3>
              <p className="text-primary-100 text-sm mb-4">Seçili modellerde özel fiyatlar</p>
              <Link href="/urunler?kategori=koltuk-takimlari" className="inline-block px-4 py-2 bg-white text-primary-700 text-sm font-medium rounded-lg hover:bg-primary-50 transition-colors">
                İncele
              </Link>
            </div>
            <div className="p-6 bg-gradient-to-br from-accent-500 to-accent-700 rounded-2xl text-white">
              <h3 className="text-xl font-bold mb-2">Yatak Odası</h3>
              <p className="text-accent-100 text-sm mb-4">Komple takımlarda avantajlı fiyatlar</p>
              <Link href="/urunler?kategori=yatak-odasi" className="inline-block px-4 py-2 bg-white text-accent-700 text-sm font-medium rounded-lg hover:bg-accent-50 transition-colors">
                İncele
              </Link>
            </div>
            <div className="p-6 bg-gradient-to-br from-secondary-600 to-secondary-800 rounded-2xl text-white">
              <h3 className="text-xl font-bold mb-2">Ofis Mobilyası</h3>
              <p className="text-secondary-100 text-sm mb-4">Ergonomik çözümler uygun fiyatlarla</p>
              <Link href="/urunler?kategori=ofis-mobilyasi" className="inline-block px-4 py-2 bg-white text-secondary-700 text-sm font-medium rounded-lg hover:bg-secondary-50 transition-colors">
                İncele
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Fırsat Ürünleri</h2>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          <div className="text-center mt-10">
            <Link href="/urunler" className="px-8 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors">
              Tüm Ürünleri Gör
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
