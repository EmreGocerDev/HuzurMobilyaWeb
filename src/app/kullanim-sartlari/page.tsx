import Link from 'next/link';

export const metadata = { title: 'Kullanım Şartları' };

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-primary-600">Ana Sayfa</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Kullanım Şartları</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Kullanım Şartları</h1>

      <div className="prose prose-sm max-w-none text-gray-600 space-y-6">
        <section>
          <h2 className="text-xl font-semibold text-gray-900">1. Genel Hükümler</h2>
          <p>
            Bu web sitesini kullanarak aşağıdaki kullanım şartlarını kabul etmiş sayılırsınız.
            Huzur Mobilya, bu şartları önceden bildirimde bulunmaksızın değiştirme hakkını saklı tutar.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">2. Hizmet Tanımı</h2>
          <p>
            Huzur Mobilya, mobilya ve ev dekorasyon ürünlerinin çevrimiçi satışını
            gerçekleştiren bir e-ticaret platformudur. Sitede yer alan ürün bilgileri,
            fiyatlar ve stok durumları önceden bildirilmeksizin değişebilir.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">3. Kullanıcı Yükümlülükleri</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Doğru ve güncel bilgi sağlamak</li>
            <li>Hesap bilgilerinin gizliliğini korumak</li>
            <li>Siteyi yasa dışı amaçlarla kullanmamak</li>
            <li>Diğer kullanıcıların haklarına saygı göstermek</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">4. Sipariş ve Ödeme</h2>
          <p>
            Verilen siparişler, ödemenin onaylanmasının ardından işleme alınır. Huzur Mobilya,
            stok durumuna bağlı olarak siparişi iptal etme veya alternatif ürün önerme hakkını
            saklı tutar. Tüm fiyatlar KDV dahildir.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">5. Fikri Mülkiyet</h2>
          <p>
            Web sitesindeki tüm içerik, görseller, logolar ve tasarımlar Huzur Mobilya&apos;ya
            aittir. İzinsiz kopyalanması, çoğaltılması ve dağıtılması yasaktır.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">6. Sorumluluk Sınırlaması</h2>
          <p>
            Huzur Mobilya, web sitesinin kesintisiz veya hatasız çalışacağını garanti etmez.
            Teknik sorunlardan kaynaklanan zararlardan sorumlu tutulamaz.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">7. Uygulanacak Hukuk</h2>
          <p>
            Bu kullanım şartları Türkiye Cumhuriyeti yasalarına tabidir.
            Uyuşmazlıklarda Samsun Mahkemeleri ve İcra Daireleri yetkilidir.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">8. İletişim</h2>
          <p>
            Kullanım şartları hakkında sorularınız için{' '}
            <Link href="/iletisim" className="text-primary-600 hover:text-primary-700">iletişim sayfamızdan</Link>{' '}
            bize ulaşabilirsiniz.
          </p>
        </section>
      </div>
    </div>
  );
}
