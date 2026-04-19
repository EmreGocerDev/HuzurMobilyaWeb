<img width="1914" height="948" alt="{BB26FCE7-59D8-4871-A2EC-179D4B9ECEFF}" src="https://github.com/user-attachments/assets/713f67f1-7c87-4c2f-83ab-344638824c31" /># Huzur Mobilya Web
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



GÖRSELLER 

<img width="1915" height="950" alt="{92BAEA39-FC5F-4A41-A791-380DE8F1CCD7}" src="https://github.com/user-attachments/assets/360f3f81-ad12-42f1-a6a2-fe08ce4d749e" />




<img width="1914" height="948" alt="{0BB7D1B8-CCDC-49A2-84A3-DB43CC53F581}" src="https://github.com/user-attachments/assets/e5529ad5-22bf-4b58-9b7b-b9d1525e45b0" />




<img width="1916" height="949" alt="{C0450D08-B5D8-4D1B-80F6-96468057BB13}" src="https://github.com/user-attachments/assets/fee4ace6-fae3-485b-886c-8a11d5b1d46d" />




<img width="1911" height="949" alt="{3EEA4D68-3C2F-4A6E-A14A-EC727FFAB510}" src="https://github.com/user-attachments/assets/746929c9-44ba-43de-ba10-11298fc4a90a" />




<img width="1908" height="946" alt="{66C7FF00-B0D3-4422-B4E2-18F37BD79886}" src="https://github.com/user-attachments/assets/07d632c2-a0b8-420a-a445-e65aeb12ce67" />




<img width="1911" height="950" alt="{88859421-EE25-42CD-87B3-F44FC247BE3C}" src="https://github.com/user-attachments/assets/3bddd052-9006-435c-9ce6-7ee90fcda5c0" />






