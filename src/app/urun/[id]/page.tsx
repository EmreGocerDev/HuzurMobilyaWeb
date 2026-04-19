'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Heart,
  ShoppingCart,
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
  Share2,
  ChevronRight,
  Package,
  Star,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/types';
import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';
import { formatPrice, getProductImageUrl, getAvailableStock } from '@/lib/utils';
import ProductCard from '@/components/product/ProductCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Toast from '@/components/ui/Toast';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'details' | 'shipping'>('description');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const addItem = useCartStore((s) => s.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const wishlisted = product ? isInWishlist(product.id) : false;

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      try {
        const { data } = await supabase
          .from('products')
          .select('*, category:categories(*), supplier:suppliers(*), stock(*)')
          .eq('id', productId)
          .single();

        if (data) {
          const p = data as unknown as Product;
          setProduct(p);

          // Fetch related products
          if (p.category_id) {
            const { data: related } = await supabase
              .from('products')
              .select('*, category:categories(*), stock(*)')
              .eq('is_active', true)
              .eq('category_id', p.category_id)
              .neq('id', p.id)
              .limit(4);
            if (related) setRelatedProducts(related as unknown as Product[]);
          }
        }
      } catch (error) {
        console.error('Ürün yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    }
    if (productId) fetchProduct();
  }, [productId]);

  if (loading) return <LoadingSpinner size="lg" />;

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Ürün Bulunamadı</h2>
        <p className="text-gray-500 mb-6">Aradığınız ürün mevcut değil veya kaldırılmış olabilir.</p>
        <Link href="/urunler" className="px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors">
          Ürünlere Dön
        </Link>
      </div>
    );
  }

  const totalStock = getAvailableStock(product);
  const inStock = totalStock > 0;
  const taxAmount = (product.sale_price * product.tax_rate) / 100;
  const totalWithTax = product.sale_price + taxAmount;

  const handleAddToCart = () => {
    addItem(product, quantity);
    setToast({ message: `${product.name} sepete eklendi!`, type: 'success' });
    setQuantity(1);
  };

  const handleToggleWishlist = () => {
    if (wishlisted) {
      removeFromWishlist(product.id);
      setToast({ message: 'Favorilerden çıkarıldı', type: 'info' });
    } else {
      addToWishlist(product);
      setToast({ message: 'Favorilere eklendi!', type: 'success' });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: product.name, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setToast({ message: 'Bağlantı kopyalandı!', type: 'info' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap">
        <Link href="/" className="hover:text-primary-600">Ana Sayfa</Link>
        <ChevronRight size={14} />
        <Link href="/urunler" className="hover:text-primary-600">Ürünler</Link>
        {product.category && (
          <>
            <ChevronRight size={14} />
            <Link href={`/urunler?kategori=${product.category_id}`} className="hover:text-primary-600">
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight size={14} />
        <span className="text-gray-900 font-medium truncate">{product.name}</span>
      </nav>

      {/* Product Section */}
      <div className="grid lg:grid-cols-2 gap-10 mb-16">
        {/* Image */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
            <Image
              src={getProductImageUrl(product.image_url)}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            {!inStock && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="px-6 py-3 bg-red-500 text-white text-lg font-bold rounded-xl">Tükendi</span>
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div>
          {product.category && (
            <Link
              href={`/urunler?kategori=${product.category_id}`}
              className="inline-block px-3 py-1 bg-primary-50 text-primary-600 text-xs font-medium rounded-full mb-3 hover:bg-primary-100 transition-colors"
            >
              {product.category.name}
            </Link>
          )}

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} className={i < 4 ? 'text-accent-400 fill-accent-400' : 'text-gray-300'} />
              ))}
            </div>
            <span className="text-sm text-gray-500">SKU: {product.sku}</span>
          </div>

          {/* Price */}
          <div className="mb-6 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-baseline gap-3 mb-1">
              <span className="text-3xl font-bold text-primary-700">{formatPrice(product.sale_price)}</span>
            </div>
            <p className="text-sm text-gray-500">
              KDV dahil: {formatPrice(totalWithTax)} (%{product.tax_rate} KDV)
            </p>
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2 mb-6">
            <Package size={18} className={inStock ? 'text-green-500' : 'text-red-500'} />
            {inStock ? (
              <span className="text-sm font-medium text-green-600">Stokta ({totalStock} adet)</span>
            ) : (
              <span className="text-sm font-medium text-red-500">Stokta Yok</span>
            )}
          </div>

          {/* Short Description */}
          {product.description && (
            <p className="text-gray-600 text-sm leading-relaxed mb-6">{product.description}</p>
          )}

          {/* Product attributes */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {product.color && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">Renk:</span>
                <span className="font-medium text-gray-800">{product.color}</span>
              </div>
            )}
            {product.material && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">Malzeme:</span>
                <span className="font-medium text-gray-800">{product.material}</span>
              </div>
            )}
            {product.dimensions && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">Ölçüler:</span>
                <span className="font-medium text-gray-800">{product.dimensions}</span>
              </div>
            )}
            {product.weight && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">Ağırlık:</span>
                <span className="font-medium text-gray-800">{product.weight} kg</span>
              </div>
            )}
          </div>

          {/* Quantity & Add to Cart */}
          {inStock && (
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-3 hover:bg-gray-50 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 py-3 font-medium text-sm min-w-[50px] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(totalStock, q + 1))}
                  className="px-3 py-3 hover:bg-gray-50 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 px-8 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all transform hover:scale-[1.02] shadow-lg shadow-primary-500/20"
              >
                <ShoppingCart size={20} />
                Sepete Ekle
              </button>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={handleToggleWishlist}
              className={`flex items-center gap-2 px-5 py-2.5 border rounded-xl text-sm font-medium transition-colors ${
                wishlisted
                  ? 'border-red-200 bg-red-50 text-red-600'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
              {wishlisted ? 'Favorilerde' : 'Favorilere Ekle'}
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <Share2 size={18} />
              Paylaş
            </button>
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
              <Truck size={20} className="text-green-600 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-green-800">Ücretsiz Kargo</p>
                <p className="text-xs text-green-600">2.000₺ üzeri</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
              <Shield size={20} className="text-blue-600 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-blue-800">2 Yıl Garanti</p>
                <p className="text-xs text-blue-600">Üretici garantisi</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
              <RotateCcw size={20} className="text-orange-600 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-orange-800">14 Gün İade</p>
                <p className="text-xs text-orange-600">Koşulsuz iade</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-16">
        <div className="flex border-b border-gray-200">
          {(['description', 'details', 'shipping'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'description' && 'Açıklama'}
              {tab === 'details' && 'Özellikler'}
              {tab === 'shipping' && 'Kargo & İade'}
            </button>
          ))}
        </div>
        <div className="py-6">
          {activeTab === 'description' && (
            <div className="prose prose-sm max-w-none text-gray-600">
              {product.description ? (
                <p className="leading-relaxed">{product.description}</p>
              ) : (
                <p className="text-gray-400 italic">Ürün açıklaması henüz eklenmemiş.</p>
              )}
            </div>
          )}
          {activeTab === 'details' && (
            <div className="max-w-lg">
              <table className="w-full text-sm">
                <tbody>
                  {[
                    ['SKU', product.sku],
                    ['Barkod', product.barcode],
                    ['Kategori', product.category?.name],
                    ['Malzeme', product.material],
                    ['Renk', product.color],
                    ['Ölçüler', product.dimensions],
                    ['Ağırlık', product.weight ? `${product.weight} kg` : null],
                    ['KDV Oranı', `%${product.tax_rate}`],
                  ]
                    .filter(([, val]) => val)
                    .map(([label, value]) => (
                      <tr key={label as string} className="border-b border-gray-100">
                        <td className="py-3 text-gray-500 font-medium w-40">{label}</td>
                        <td className="py-3 text-gray-800">{value}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
          {activeTab === 'shipping' && (
            <div className="space-y-4 text-sm text-gray-600 max-w-2xl">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Kargo Bilgileri</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>2.000₺ üzeri siparişlerde kargo ücretsizdir.</li>
                  <li>2.000₺ altı siparişlerde kargo ücreti 149₺&apos;dir.</li>
                  <li>Siparişiniz 3-7 iş günü içinde teslim edilir.</li>
                  <li>Büyük mobilya ürünlerinde montaj dahildir.</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">İade Politikası</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Teslim tarihinden itibaren 14 gün içinde koşulsuz iade hakkınız bulunmaktadır.</li>
                  <li>İade edilecek ürün kullanılmamış ve orijinal ambalajında olmalıdır.</li>
                  <li>İade kargo ücreti müşteriye aittir.</li>
                  <li>İade işlemi onaylandıktan sonra 5 iş günü içinde ödemeniz iade edilir.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Benzer Ürünler</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
