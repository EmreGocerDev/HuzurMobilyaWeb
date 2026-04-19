import type { Product } from '@/types';

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
  }).format(price);
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string): string {
  return new Intl.DateTimeFormat('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

export function getOrderStatusLabel(status: string): string {
  const map: Record<string, string> = {
    beklemede: 'Beklemede',
    hazirlaniyor: 'Hazırlanıyor',
    kargoda: 'Kargoda',
    teslim_edildi: 'Teslim Edildi',
    iptal: 'İptal',
  };
  return map[status] || status;
}

export function getOrderStatusColor(status: string): string {
  const map: Record<string, string> = {
    beklemede: 'bg-yellow-100 text-yellow-800',
    hazirlaniyor: 'bg-blue-100 text-blue-800',
    kargoda: 'bg-purple-100 text-purple-800',
    teslim_edildi: 'bg-green-100 text-green-800',
    iptal: 'bg-red-100 text-red-800',
  };
  return map[status] || 'bg-gray-100 text-gray-800';
}

export function getPaymentStatusLabel(status: string): string {
  const map: Record<string, string> = {
    odenmedi: 'Ödenmedi',
    kismi_odendi: 'Kısmi Ödendi',
    odendi: 'Ödendi',
    iade: 'İade',
  };
  return map[status] || status;
}

export function getProductImageUrl(url: string | null): string {
  if (!url) return '/images/placeholder.jpg';
  if (url.startsWith('http')) return url;
  return url;
}

export function getAvailableStock(product: Pick<Product, 'max_stock_level'> & { stock?: { quantity: number }[] }): number {
  if (product.stock && product.stock.length > 0) {
    return product.stock.reduce((sum, stockItem) => sum + stockItem.quantity, 0);
  }

  return product.max_stock_level;
}

export function calculateDiscountedPrice(price: number, discountRate: number): number {
  return price - (price * discountRate) / 100;
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
