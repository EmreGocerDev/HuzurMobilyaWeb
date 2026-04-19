import Link from 'next/link';

export const metadata = { title: 'Gizlilik Politikası' };

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-primary-600">Ana Sayfa</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Gizlilik Politikası</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Gizlilik Politikası</h1>

      <div className="prose prose-sm max-w-none text-gray-600 space-y-6">
        <section>
          <h2 className="text-xl font-semibold text-gray-900">1. Genel Bilgi</h2>
          <p>
            Huzur Mobilya olarak kişisel verilerinizin güvenliği konusunda büyük önem veriyoruz.
            Bu gizlilik politikası, web sitemizi kullanırken toplanan kişisel verilerin nasıl
            işlendiğini ve korunduğunu açıklamaktadır.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">2. Toplanan Veriler</h2>
          <p>Web sitemizi kullanırken aşağıdaki bilgiler toplanabilir:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Ad, soyad ve iletişim bilgileri</li>
            <li>E-posta adresi ve telefon numarası</li>
            <li>Teslimat adresi bilgileri</li>
            <li>Sipariş geçmişi ve alışveriş tercihleri</li>
            <li>Tarayıcı ve cihaz bilgileri</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">3. Verilerin Kullanımı</h2>
          <p>Toplanan veriler aşağıdaki amaçlarla kullanılmaktadır:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Siparişlerin işlenmesi ve teslimatı</li>
            <li>Müşteri hizmetleri desteği</li>
            <li>Kampanya ve duyuru bildirimleri (onayınızla)</li>
            <li>Web sitesi deneyiminin iyileştirilmesi</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">4. Verilerin Korunması</h2>
          <p>
            Kişisel verileriniz 256-bit SSL şifreleme ile korunmaktadır. Verileriniz üçüncü
            taraflarla yasal zorunluluklar dışında paylaşılmamaktadır. 6698 sayılı KVKK
            kapsamında haklarınızı kullanabilirsiniz.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">5. Çerezler (Cookies)</h2>
          <p>
            Web sitemiz, kullanıcı deneyimini iyileştirmek amacıyla çerezler kullanmaktadır.
            Tarayıcı ayarlarınızdan çerezleri devre dışı bırakabilirsiniz.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">6. İletişim</h2>
          <p>
            Gizlilik politikamız hakkında sorularınız için{' '}
            <Link href="/iletisim" className="text-primary-600 hover:text-primary-700">iletişim sayfamızdan</Link>{' '}
            bize ulaşabilirsiniz.
          </p>
        </section>
      </div>
    </div>
  );
}
