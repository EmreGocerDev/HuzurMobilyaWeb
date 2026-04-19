'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
} from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';
import { useAuthStore } from '@/store/auth';

const categories = [
  { name: 'Koltuk Takımları', href: '/urunler?kategori=koltuk-takimlari' },
  { name: 'Yatak Odası', href: '/urunler?kategori=yatak-odasi' },
  { name: 'Yemek Odası', href: '/urunler?kategori=yemek-odasi' },
  { name: 'Ofis Mobilyası', href: '/urunler?kategori=ofis-mobilyasi' },
  { name: 'Genç Odası', href: '/urunler?kategori=genc-odasi' },
  { name: 'Bahçe Mobilyası', href: '/urunler?kategori=bahce-mobilyasi' },
  { name: 'Aksesuar', href: '/urunler?kategori=aksesuar' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryDropdown, setCategoryDropdown] = useState(false);

  const totalItems = useCartStore((s) => s.getTotalItems());
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/urunler?arama=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* Top Bar */}
      <div className="bg-primary-900 text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="tel:+905550000000" className="flex items-center gap-1 hover:text-primary-200 transition-colors">
              <Phone size={14} />
              <span className="hidden sm:inline">0555 000 0000</span>
            </a>
            <a href="mailto:info@huzurmobilya.com" className="flex items-center gap-1 hover:text-primary-200 transition-colors">
              <Mail size={14} />
              <span className="hidden sm:inline">info@huzurmobilya.com</span>
            </a>
          </div>
          <div className="flex items-center gap-1">
            <MapPin size={14} />
            <span className="hidden sm:inline">Samsun, Türkiye</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-800 to-primary-950 border border-primary-700 shadow-sm overflow-hidden">
              <Image src="/logo.png" alt="Huzur Mobilya" width={40} height={40} className="object-contain" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-primary-800 leading-tight">Huzur Mobilya</h1>
              <p className="text-xs text-gray-500">Evinize Huzur Katıyoruz</p>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Ürün, kategori veya marka ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-0 transition-colors text-sm"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Search size={18} />
              </button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Mobile search toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-primary-600 transition-colors"
              aria-label="Ara"
            >
              <Search size={22} />
            </button>

            {/* Wishlist */}
            <Link
              href="/favoriler"
              className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors"
              aria-label="Favoriler"
            >
              <Heart size={22} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full badge-pulse">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/sepet"
              className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors"
              aria-label="Sepet"
            >
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full badge-pulse">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Account */}
            <Link
              href={isAuthenticated ? '/hesabim' : '/giris'}
              className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
              aria-label="Hesabım"
            >
              <User size={22} />
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-primary-600 transition-colors"
              aria-label="Menü"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {searchOpen && (
          <form onSubmit={handleSearch} className="md:hidden mt-3 animate-slide-down">
            <div className="relative">
              <input
                type="text"
                placeholder="Ürün ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-0 transition-colors text-sm"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary-600 text-white rounded-lg"
              >
                <Search size={18} />
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Navigation Bar */}
      <nav className="hidden lg:block border-t border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center gap-1">
            <li>
              <Link href="/" className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-white rounded-t-lg transition-colors">
                Ana Sayfa
              </Link>
            </li>
            <li
              className="relative"
              onMouseEnter={() => setCategoryDropdown(true)}
              onMouseLeave={() => setCategoryDropdown(false)}
            >
              <button className="flex items-center gap-1 px-4 py-3 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-white rounded-t-lg transition-colors">
                Kategoriler <ChevronDown size={14} />
              </button>
              {categoryDropdown && (
                <div className="absolute top-full left-0 bg-white shadow-xl rounded-b-xl border border-gray-100 min-w-[220px] animate-slide-down z-50">
                  {categories.map((cat) => (
                    <Link
                      key={cat.name}
                      href={cat.href}
                      className="block px-5 py-3 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </li>
            <li>
              <Link href="/urunler" className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-white rounded-t-lg transition-colors">
                Tüm Ürünler
              </Link>
            </li>
            <li>
              <Link href="/kampanyalar" className="block px-4 py-3 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-white rounded-t-lg transition-colors font-semibold">
                Kampanyalar
              </Link>
            </li>
            <li>
              <Link href="/hakkimizda" className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-white rounded-t-lg transition-colors">
                Hakkımızda
              </Link>
            </li>
            <li>
              <Link href="/iletisim" className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-white rounded-t-lg transition-colors">
                İletişim
              </Link>
            </li>
            <li>
              <Link href="/sss" className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-white rounded-t-lg transition-colors">
                S.S.S.
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white animate-slide-down">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            <Link href="/" className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
              Ana Sayfa
            </Link>
            <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase">Kategoriler</div>
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="block px-6 py-2 text-sm text-gray-600 hover:bg-primary-50 hover:text-primary-600 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                {cat.name}
              </Link>
            ))}
            <hr className="my-2" />
            <Link href="/urunler" className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
              Tüm Ürünler
            </Link>
            <Link href="/kampanyalar" className="block px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
              Kampanyalar
            </Link>
            <Link href="/hakkimizda" className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
              Hakkımızda
            </Link>
            <Link href="/iletisim" className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
              İletişim
            </Link>
            <Link href="/sss" className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
              S.S.S.
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
