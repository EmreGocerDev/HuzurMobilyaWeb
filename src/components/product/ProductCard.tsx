'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import type { Product } from '@/types';
import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';
import { formatPrice, getProductImageUrl, getAvailableStock } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const wishlisted = isInWishlist(product.id);

  const totalStock = getAvailableStock(product);
  const inStock = totalStock > 0;

  return (
    <div className="product-card group bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Link href={`/urun/${product.id}`}>
          <Image
            src={getProductImageUrl(product.image_url)}
            alt={product.name}
            fill
            className="object-cover img-zoom"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {!inStock && (
            <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-lg">
              Tükendi
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => wishlisted ? removeFromWishlist(product.id) : addToWishlist(product)}
            className={`w-9 h-9 flex items-center justify-center rounded-full shadow-lg transition-colors ${
              wishlisted ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-500'
            }`}
            title={wishlisted ? 'Favorilerden çıkar' : 'Favorilere ekle'}
          >
            <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
          </button>
          <Link
            href={`/urun/${product.id}`}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white text-gray-600 shadow-lg hover:bg-primary-50 hover:text-primary-600 transition-colors"
            title="Detay"
          >
            <Eye size={16} />
          </Link>
        </div>

        {/* Add to Cart - Bottom Overlay */}
        {inStock && (
          <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => addItem(product)}
              className="w-full py-2.5 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              <ShoppingCart size={16} />
              Sepete Ekle
            </button>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        {product.category && (
          <p className="text-xs text-primary-600 font-medium mb-1">{product.category.name}</p>
        )}
        <Link href={`/urun/${product.id}`}>
          <h3 className="text-sm font-semibold text-gray-800 hover:text-primary-600 transition-colors line-clamp-2 mb-2">
            {product.name}
          </h3>
        </Link>
        {product.material && (
          <p className="text-xs text-gray-400 mb-2">{product.material}</p>
        )}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-primary-700">{formatPrice(product.sale_price)}</p>
            {product.purchase_price > 0 && product.purchase_price < product.sale_price && (
              <p className="text-xs text-gray-400 line-through">{formatPrice(product.purchase_price)}</p>
            )}
          </div>
          {inStock ? (
            <span className="text-xs text-green-600 font-medium">Stokta</span>
          ) : (
            <span className="text-xs text-red-500 font-medium">Tükendi</span>
          )}
        </div>
      </div>
    </div>
  );
}
