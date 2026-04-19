'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Truck,
  Shield,
  HeadphonesIcon,
  CreditCard,
  Sofa,
  Bed,
  UtensilsCrossed,
  Briefcase,
  Sparkles,
  TreePine,
  Gem,
  Star,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Product, Category } from '@/types';
import ProductCard from '@/components/product/ProductCard';
import ProductSkeleton from '@/components/ui/ProductSkeleton';

const categoryIcons: Record<string, React.ReactNode> = {
  'Koltuk Takımları': <Sofa size={32} />,
  'Yatak Odası': <Bed size={32} />,
  'Yemek Odası': <UtensilsCrossed size={32} />,
  'Ofis Mobilyası': <Briefcase size={32} />,
  'Genç Odası': <Sparkles size={32} />,
  'Bahçe Mobilyası': <TreePine size={32} />,
  'Aksesuar': <Gem size={32} />,
};

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [catRes, featuredRes, newRes] = await Promise.all([
          supabase
            .from('categories')
            .select('*')
            .eq('is_active', true)
            .order('sort_order'),
          supabase
            .from('products')
            .select('*, category:categories(*), stock(*)')
            .eq('is_active', true)
            .order('sale_price', { ascending: false })
            .limit(8),
          supabase
            .from('products')
            .select('*, category:categories(*), stock(*)')
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(8),
        ]);

        if (catRes.data) setCategories(catRes.data as Category[]);
        if (featuredRes.data) setFeaturedProducts(featuredRes.data as unknown as Product[]);
        if (newRes.data) setNewProducts(newRes.data as unknown as Product[]);
      } catch (error) {
        console.error('Veri yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-400 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <span className="inline-block px-4 py-1.5 bg-primary-700/50 text-primary-200 text-sm font-medium rounded-full mb-6">
                Yeni Sezon Koleksiyonu
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Evinize <span className="text-accent-400">Huzur</span> Katıyoruz
              </h1>
              <p className="text-lg text-primary-200 mb-8 max-w-lg leading-relaxed">
                Modern ve klasik mobilya seçenekleriyle hayalinizdeki yaşam alanlarını oluşturun.
                Kaliteli malzeme, özgün tasarım, uygun fiyat.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/urunler"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-accent-500 text-white font-semibold rounded-xl hover:bg-accent-600 transition-all transform hover:scale-105 shadow-lg shadow-accent-500/30"
                >
                  Ürünleri Keşfet <ArrowRight size={20} />
                </Link>
                <Link
                  href="/kampanyalar"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all backdrop-blur-sm border border-white/20"
                >
                  Kampanyalar
                </Link>
              </div>
            </div>
            <div className="hidden lg:flex justify-center animate-slide-up">
              <div className="relative w-96 h-96">
                <div className="absolute inset-0 bg-gradient-to-br from-accent-400/20 to-primary-400/20 rounded-3xl transform rotate-6" />
                <div className="absolute inset-0 bg-gradient-to-br from-primary-700 to-primary-900 rounded-3xl overflow-hidden shadow-2xl">
                  <Image
                    src="/logo.png"
                    alt="Huzur Mobilya"
                    fill
                    className="object-contain p-12"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <Truck size={24} />, title: 'Ücretsiz Kargo', desc: '2.000₺ üzeri siparişlerde' },
              { icon: <Shield size={24} />, title: 'Güvenli Ödeme', desc: '256-bit SSL şifreleme' },
              { icon: <HeadphonesIcon size={24} />, title: '7/24 Destek', desc: 'Müşteri hizmetleri' },
              { icon: <CreditCard size={24} />, title: 'Taksit İmkanı', desc: '12 aya varan taksit' },
            ].map((feature) => (
              <div key={feature.title} className="flex items-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-12 h-12 flex items-center justify-center bg-primary-50 text-primary-600 rounded-xl shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-800">{feature.title}</h4>
                  <p className="text-xs text-gray-500">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Kategoriler</h2>
            <p className="text-gray-500 max-w-lg mx-auto">İhtiyacınıza uygun mobilyayı kolayca bulun</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {categories.map((cat, index) => (
              <Link
                key={cat.id}
                href={`/urunler?kategori=${cat.id}`}
                className="group flex flex-col items-center gap-3 p-6 bg-white rounded-2xl border border-gray-100 hover:border-primary-200 hover:shadow-lg transition-all animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 flex items-center justify-center bg-primary-50 text-primary-600 rounded-2xl group-hover:bg-primary-100 group-hover:scale-110 transition-all">
                  {categoryIcons[cat.name] || <Sofa size={32} />}
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-primary-600 transition-colors text-center">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Öne Çıkan Ürünler</h2>
              <p className="text-gray-500">En çok tercih edilen ürünlerimiz</p>
            </div>
            <Link
              href="/urunler"
              className="hidden sm:inline-flex items-center gap-2 text-primary-600 font-medium hover:text-primary-700 transition-colors"
            >
              Tümünü Gör <ArrowRight size={18} />
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          <div className="sm:hidden mt-6 text-center">
            <Link href="/urunler" className="inline-flex items-center gap-2 text-primary-600 font-medium">
              Tümünü Gör <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="py-16 bg-gradient-to-r from-primary-800 to-primary-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-80 h-80 bg-accent-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Hayalinizdeki Mobilya Burada</h2>
          <p className="text-primary-200 text-lg mb-8 max-w-2xl mx-auto">
            Uzman ekibimizle ücretsiz danışmanlık hizmeti alın. Evinizin ölçülerine ve tarzınıza
            uygun mobilya seçiminde yardımcı olalım.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/iletisim"
              className="px-8 py-4 bg-white text-primary-800 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
            >
              Bize Ulaşın
            </Link>
            <a
              href="tel:+905550000000"
              className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
            >
              0555 000 0000
            </a>
          </div>
        </div>
      </section>

      {/* New Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Yeni Ürünler</h2>
              <p className="text-gray-500">En son eklenen ürünlerimizi keşfedin</p>
            </div>
            <Link
              href="/urunler?siralama=yeni"
              className="hidden sm:inline-flex items-center gap-2 text-primary-600 font-medium hover:text-primary-700 transition-colors"
            >
              Tümünü Gör <ArrowRight size={18} />
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Müşteri Yorumları</h2>
            <p className="text-gray-500">Müşterilerimizin deneyimlerini okuyun</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Ayşe Y.', text: 'Koltuk takımımız harika görünüyor. Kalite ve konfor bir arada. Kesinlikle tavsiye ederim.', rating: 5 },
              { name: 'Mehmet K.', text: 'Yatak odası takımı beklediğimden çok daha güzel geldi. Montaj ekibi de çok ilgiliydi.', rating: 5 },
              { name: 'Fatma S.', text: 'Yemek masası ve sandalyeler çok şık. Misafirlerimiz çok beğendi. Teşekkürler Huzur Mobilya!', rating: 5 },
            ].map((review, i) => (
              <div key={i} className="p-6 bg-gray-50 rounded-2xl">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <Star key={j} size={16} className="text-accent-400 fill-accent-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">&ldquo;{review.text}&rdquo;</p>
                <p className="text-sm font-semibold text-gray-800">{review.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
