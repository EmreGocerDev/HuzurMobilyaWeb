# Huzur Mobilya Web
<div style="text-align: center;">
  <img src="public/logo.png" alt="Huzur Mobilya Logo">
</div>

Huzur Mobilya için hazırlanmış modern bir e-ticaret web uygulaması. Ürün listeleme, ürün detay, sepet, sipariş oluşturma, favoriler, üyelik ve hesap sayfaları ile birlikte satış odaklı bir vitrin deneyimi sunar.

## Özellikler

- Ana sayfa, kategori vitrinleri ve kampanya alanları
- Ürün listeleme sayfası
- Kategori, fiyat, renk, malzeme ve sıralama filtreleri
- Ürün detay sayfası
- Sepet yönetimi
- Çok adımlı sipariş akışı
- Giriş ve kayıt sayfaları
- Hesap, siparişlerim ve sipariş detayı sayfaları
- Favoriler sayfası
- Hakkımızda, iletişim, S.S.S. ve kampanya sayfaları
- Gizlilik politikası, kullanım şartları ve iade politikası
- Supabase tabanlı veri katmanı
- Zustand ile sepet, favori ve oturum yönetimi
- Tailwind CSS v4 ile responsive arayüz

## Kullanılan Teknolojiler

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Lucide React](https://lucide.dev/)

## Proje Yapısı

```text
src/
  app/
    favoriler/
    giris/
    gizlilik-politikasi/
    hakkimizda/
    hesabim/
    iade-politikasi/
    iletisim/
    kampanyalar/
    kayit/
    kullanim-sartlari/
    sepet/
    siparis/
    sss/
    urun/
    urunler/
  components/
    layout/
    product/
    ui/
  lib/
  store/
  types/
public/
  logo.png
  images/
    placeholder.svg
```

## Kurulum

1. Bağımlılıkları yükleyin:

```bash
npm install
```

2. Ortam değişkenlerini ayarlayın:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Geliştirme sunucusunu başlatın:

```bash
npm run dev
```

4. Uygulamayı tarayıcıda açın:

```text
http://localhost:3000
```

## Komutlar

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Supabase Kurulumu

Uygulama Supabase veritabanı ile çalışır. En az aşağıdaki tabloların karşılıkları gerekir:

- `categories`
- `products`
- `stock`
- `customers`
- `orders`
- `order_items`
- `suppliers`
- `warehouses`
- `profiles`
- `notifications`

Veritabanı şemasını ve RLS ayarlarını projedeki SQL dosyalarıyla oluşturabilirsiniz.

## Sayfalar

- `/` Ana sayfa
- `/urunler` Ürün listesi
- `/urun/[id]` Ürün detayı
- `/sepet` Sepet
- `/siparis` Sipariş oluşturma
- `/giris` Giriş
- `/kayit` Kayıt
- `/hesabim` Hesap paneli
- `/hesabim/siparislerim` Siparişlerim
- `/hesabim/siparislerim/[id]` Sipariş detayı
- `/favoriler` Favoriler
- `/hakkimizda` Hakkımızda
- `/iletisim` İletişim
- `/sss` S.S.S.
- `/kampanyalar` Kampanyalar
- `/gizlilik-politikasi` Gizlilik politikası
- `/kullanim-sartlari` Kullanım şartları
- `/iade-politikasi` İade politikası

## Notlar

- Logo dosyası `public/logo.png` konumunda kullanılmaktadır.
- Ürün görseli bulunmayan kayıtlar için `public/images/placeholder.svg` kullanılır.
- Proje responsive olacak şekilde tasarlanmıştır.
- Build kontrolü yapılmıştır.

## Lisans

Bu proje Huzur Mobilya iç kullanımına uygundur.
