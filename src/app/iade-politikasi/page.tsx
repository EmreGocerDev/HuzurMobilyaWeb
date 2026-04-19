import Link from 'next/link';

export const metadata = { title: 'İade Politikası' };

export default function ReturnPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-primary-600">Ana Sayfa</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">İade Politikası</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">İade ve Değişim Politikası</h1>

      <div className="prose prose-sm max-w-none text-gray-600 space-y-6">
        <section>
          <h2 className="text-xl font-semibold text-gray-900">1. Cayma Hakkı</h2>
          <p>
            6502 sayılı Tüketicinin Korunması Hakkında Kanun gereği, ürün teslim tarihinden
            itibaren 14 gün içinde herhangi bir gerekçe göstermeksizin cayma hakkınızı
            kullanabilirsiniz.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">2. İade Koşulları</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Ürün kullanılmamış ve hasar görmemiş olmalıdır</li>
            <li>Orijinal ambalajında ve aksesuarlarıyla birlikte iade edilmelidir</li>
            <li>Fatura veya teslimat belgesi ile birlikte gönderilmelidir</li>
            <li>İade talebi, teslim tarihinden itibaren 14 gün içinde oluşturulmalıdır</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">3. İade Süreci</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Hesabınıza giriş yaparak &quot;Siparişlerim&quot; bölümünden iade talebinde bulunun</li>
            <li>İade nedeninizi belirtin ve formu doldurun</li>
            <li>İade onayı e-posta ile iletilecektir</li>
            <li>Onay sonrası ürünü belirtilen adrese gönderin</li>
            <li>Ürün tarafımıza ulaştıktan sonra kontrol edilecektir</li>
            <li>Kontrol sonrası ödemeniz 5 iş günü içinde iade edilecektir</li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">4. Hasarlı / Hatalı Ürün</h2>
          <p>
            Ürün hasarlı, hatalı veya yanlış geldiyse teslim tarihinden itibaren 3 iş günü
            içinde bize bildirmeniz gerekmektedir. Bu durumda kargo ücreti tarafımızca
            karşılanır ve ürün ücretsiz olarak değiştirilir.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">5. Kargo Ücreti</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Cayma hakkı kapsamındaki iadelerde kargo ücreti müşteriye aittir</li>
            <li>Hasarlı veya hatalı ürünlerde kargo ücreti Huzur Mobilya tarafından karşılanır</li>
            <li>Değişim işlemlerinde kargo ücreti Huzur Mobilya tarafından karşılanır</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">6. İade Edilemeyecek Ürünler</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Özel ölçü veya sipariş üzerine üretilen ürünler</li>
            <li>Ambalajı açılmış hijyen ürünleri (yastık, yorgan vb.)</li>
            <li>Kullanım sonucu oluşan hasarlar</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">7. Ödeme İadesi</h2>
          <p>
            İade onaylanan ürünün ödeme iadesi, ödeme yönteminize göre farklılık gösterebilir:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Kredi kartı ile ödeme: 5 iş günü içinde kartınıza iade</li>
            <li>Havale/EFT ile ödeme: 5 iş günü içinde banka hesabınıza iade</li>
            <li>Kapıda ödeme: IBAN bilginize 5 iş günü içinde iade</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">8. İletişim</h2>
          <p>
            İade ve değişim süreçleri hakkında sorularınız için{' '}
            <Link href="/iletisim" className="text-primary-600 hover:text-primary-700">iletişim sayfamızdan</Link>{' '}
            veya 0555 000 0000 numaralı telefondan bize ulaşabilirsiniz.
          </p>
        </section>
      </div>
    </div>
  );
}
