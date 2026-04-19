'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SlidersHorizontal, Grid3X3, List, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Product, Category } from '@/types';
import ProductCard from '@/components/product/ProductCard';
import ProductSkeleton from '@/components/ui/ProductSkeleton';
import { formatPrice } from '@/lib/utils';

const ITEMS_PER_PAGE = 12;

function ProductListingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter states
  const currentCategory = searchParams.get('kategori') || '';
  const currentSearch = searchParams.get('arama') || '';
  const currentSort = searchParams.get('siralama') || 'yeni';
  const currentPage = parseInt(searchParams.get('sayfa') || '1', 10);
  const currentMinPrice = searchParams.get('min_fiyat') || '';
  const currentMaxPrice = searchParams.get('max_fiyat') || '';
  const currentMaterial = searchParams.get('malzeme') || '';
  const currentColor = searchParams.get('renk') || '';

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      if (!updates.sayfa) params.set('sayfa', '1');
      router.push(`/urunler?${params.toString()}`);
    },
    [searchParams, router]
  );

  useEffect(() => {
    supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
      .then(({ data }) => {
        if (data) setCategories(data as Category[]);
      });
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        let query = supabase
          .from('products')
          .select('*, category:categories(*), stock(*)', { count: 'exact' })
          .eq('is_active', true);

        // Search
        if (currentSearch) {
          query = query.or(`name.ilike.%${currentSearch}%,description.ilike.%${currentSearch}%,sku.ilike.%${currentSearch}%`);
        }

        // Category filter
        if (currentCategory) {
          query = query.eq('category_id', currentCategory);
        }

        // Price filter
        if (currentMinPrice) {
          query = query.gte('sale_price', parseFloat(currentMinPrice));
        }
        if (currentMaxPrice) {
          query = query.lte('sale_price', parseFloat(currentMaxPrice));
        }

        // Material filter
        if (currentMaterial) {
          query = query.ilike('material', `%${currentMaterial}%`);
        }

        // Color filter
        if (currentColor) {
          query = query.ilike('color', `%${currentColor}%`);
        }

        // Sorting
        switch (currentSort) {
          case 'fiyat-artan':
            query = query.order('sale_price', { ascending: true });
            break;
          case 'fiyat-azalan':
            query = query.order('sale_price', { ascending: false });
            break;
          case 'isim-az':
            query = query.order('name', { ascending: true });
            break;
          case 'isim-za':
            query = query.order('name', { ascending: false });
            break;
          case 'yeni':
          default:
            query = query.order('created_at', { ascending: false });
            break;
        }

        // Pagination
        const from = (currentPage - 1) * ITEMS_PER_PAGE;
        const to = from + ITEMS_PER_PAGE - 1;
        query = query.range(from, to);

        const { data, count } = await query;
        if (data) setProducts(data as unknown as Product[]);
        if (count !== null) setTotalCount(count);
      } catch (error) {
        console.error('Ürünler yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [currentCategory, currentSearch, currentSort, currentPage, currentMinPrice, currentMaxPrice, currentMaterial, currentColor]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const activeFilterCount = [currentCategory, currentMinPrice, currentMaxPrice, currentMaterial, currentColor].filter(Boolean).length;

  const clearAllFilters = () => {
    router.push('/urunler');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <a href="/" className="hover:text-primary-600">Ana Sayfa</a>
        <span>/</span>
        <span className="text-gray-900 font-medium">Ürünler</span>
        {currentSearch && (
          <>
            <span>/</span>
            <span className="text-primary-600">&ldquo;{currentSearch}&rdquo; için sonuçlar</span>
          </>
        )}
      </nav>

      <div className="flex gap-8">
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-32 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Filtreler</h2>
              {activeFilterCount > 0 && (
                <button onClick={clearAllFilters} className="text-xs text-red-500 hover:text-red-700">
                  Temizle ({activeFilterCount})
                </button>
              )}
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-3">Kategori</h3>
              <div className="space-y-1">
                <button
                  onClick={() => updateParams({ kategori: '' })}
                  className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                    !currentCategory ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Tümü
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => updateParams({ kategori: cat.id })}
                    className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                      currentCategory === cat.id
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-3">Fiyat Aralığı</h3>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={currentMinPrice}
                  onChange={(e) => updateParams({ min_fiyat: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-0"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={currentMaxPrice}
                  onChange={(e) => updateParams({ max_fiyat: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-0"
                />
              </div>
            </div>

            {/* Material */}
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-3">Malzeme</h3>
              <input
                type="text"
                placeholder="Örn: Kadife, Ahşap..."
                value={currentMaterial}
                onChange={(e) => updateParams({ malzeme: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-0"
              />
            </div>

            {/* Color */}
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-3">Renk</h3>
              <input
                type="text"
                placeholder="Örn: Gri, Beyaz..."
                value={currentColor}
                onChange={(e) => updateParams({ renk: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-0"
              />
            </div>
          </div>
        </aside>

        {/* Products Main */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
              >
                <SlidersHorizontal size={16} />
                Filtreler
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              <p className="text-sm text-gray-500">
                <span className="font-medium text-gray-900">{totalCount}</span> ürün bulundu
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={currentSort}
                onChange={(e) => updateParams({ siralama: e.target.value })}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-0 bg-white"
              >
                <option value="yeni">En Yeni</option>
                <option value="fiyat-artan">Fiyat: Düşükten Yükseğe</option>
                <option value="fiyat-azalan">Fiyat: Yüksekten Düşüğe</option>
                <option value="isim-az">İsim: A-Z</option>
                <option value="isim-za">İsim: Z-A</option>
              </select>
              <div className="hidden sm:flex border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-primary-50 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Grid3X3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-primary-50 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {currentCategory && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 text-xs rounded-full">
                  Kategori: {categories.find((c) => c.id === currentCategory)?.name}
                  <button onClick={() => updateParams({ kategori: '' })}><X size={14} /></button>
                </span>
              )}
              {currentMinPrice && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 text-xs rounded-full">
                  Min: {formatPrice(parseFloat(currentMinPrice))}
                  <button onClick={() => updateParams({ min_fiyat: '' })}><X size={14} /></button>
                </span>
              )}
              {currentMaxPrice && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 text-xs rounded-full">
                  Max: {formatPrice(parseFloat(currentMaxPrice))}
                  <button onClick={() => updateParams({ max_fiyat: '' })}><X size={14} /></button>
                </span>
              )}
              {currentMaterial && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 text-xs rounded-full">
                  Malzeme: {currentMaterial}
                  <button onClick={() => updateParams({ malzeme: '' })}><X size={14} /></button>
                </span>
              )}
              {currentColor && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 text-xs rounded-full">
                  Renk: {currentColor}
                  <button onClick={() => updateParams({ renk: '' })}><X size={14} /></button>
                </span>
              )}
            </div>
          )}

          {/* Product Grid */}
          {loading ? (
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
              {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <SlidersHorizontal size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Ürün Bulunamadı</h3>
              <p className="text-gray-500 mb-6">Arama kriterlerinize uygun ürün bulunamamıştır.</p>
              <button
                onClick={clearAllFilters}
                className="px-6 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors"
              >
                Filtreleri Temizle
              </button>
            </div>
          ) : (
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={() => updateParams({ sayfa: String(currentPage - 1) })}
                disabled={currentPage <= 1}
                className="p-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronLeft size={18} />
              </button>
              {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
                let pageNum: number;
                if (totalPages <= 7) {
                  pageNum = i + 1;
                } else if (currentPage <= 4) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 3) {
                  pageNum = totalPages - 6 + i;
                } else {
                  pageNum = currentPage - 3 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => updateParams({ sayfa: String(pageNum) })}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                      currentPage === pageNum
                        ? 'bg-primary-600 text-white'
                        : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => updateParams({ sayfa: String(currentPage + 1) })}
                disabled={currentPage >= totalPages}
                className="p-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setFiltersOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-xl overflow-y-auto animate-slide-down">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between">
              <h2 className="font-bold text-lg">Filtreler</h2>
              <button onClick={() => setFiltersOpen(false)} className="p-1 text-gray-500">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 space-y-6">
              {/* Same filters as desktop */}
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Kategori</h3>
                <div className="space-y-1">
                  <button
                    onClick={() => { updateParams({ kategori: '' }); setFiltersOpen(false); }}
                    className={`block w-full text-left px-3 py-2 text-sm rounded-lg ${
                      !currentCategory ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-600'
                    }`}
                  >
                    Tümü
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => { updateParams({ kategori: cat.id }); setFiltersOpen(false); }}
                      className={`block w-full text-left px-3 py-2 text-sm rounded-lg ${
                        currentCategory === cat.id ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-600'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Fiyat Aralığı</h3>
                <div className="flex gap-2">
                  <input type="number" placeholder="Min" value={currentMinPrice} onChange={(e) => updateParams({ min_fiyat: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                  <input type="number" placeholder="Max" value={currentMaxPrice} onChange={(e) => updateParams({ max_fiyat: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Malzeme</h3>
                <input type="text" placeholder="Örn: Kadife" value={currentMaterial} onChange={(e) => updateParams({ malzeme: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Renk</h3>
                <input type="text" placeholder="Örn: Gri" value={currentColor} onChange={(e) => updateParams({ renk: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
              <button onClick={() => { clearAllFilters(); setFiltersOpen(false); }} className="w-full py-3 bg-red-50 text-red-600 font-medium rounded-xl text-sm">
                Tüm Filtreleri Temizle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductListingPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-8"><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{Array.from({ length: 12 }).map((_, i) => <ProductSkeleton key={i} />)}</div></div>}>
      <ProductListingContent />
    </Suspense>
  );
}
