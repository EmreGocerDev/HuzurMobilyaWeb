'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import Link from 'next/link';

const faqData = [
  {
    category: 'Sipariş & Ödeme',
    questions: [
      {
        q: 'Nasıl sipariş verebilirim?',
        a: 'Web sitemiz üzerinden istediğiniz ürünleri sepete ekleyip, sipariş adımlarını takip ederek kolayca sipariş verebilirsiniz. Telefon ile de sipariş vermek mümkündür.',
      },
      {
        q: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?',
        a: 'Kapıda nakit ödeme ve kapıda kredi kartı ile ödeme seçenekleri mevcuttur. Havale/EFT ile de ödeme yapabilirsiniz.',
      },
      {
        q: 'Taksit imkanı var mı?',
        a: 'Evet, kredi kartı ile 12 aya varan taksit seçeneklerimiz mevcuttur. Taksit seçenekleri bankanıza göre farklılık gösterebilir.',
      },
      {
        q: 'Siparişimi nasıl takip edebilirim?',
        a: 'Hesabınıza giriş yaparak "Siparişlerim" bölümünden siparişinizin durumunu takip edebilirsiniz. Ayrıca sipariş durumu değiştiğinde e-posta ile bilgilendirilirsiniz.',
      },
    ],
  },
  {
    category: 'Kargo & Teslimat',
    questions: [
      {
        q: 'Kargo ücreti ne kadar?',
        a: '2.000₺ ve üzeri siparişlerde kargo ücretsizdir. 2.000₺ altındaki siparişlerde kargo ücreti 149₺\'dir.',
      },
      {
        q: 'Teslimat süresi ne kadar?',
        a: 'Stokta bulunan ürünler 3-7 iş günü içinde teslim edilir. Özel üretim ürünlerde teslimat süresi 15-30 iş günü olabilir.',
      },
      {
        q: 'Montaj dahil mi?',
        a: 'Evet, büyük mobilya ürünlerinde (koltuk takımı, yatak odası, yemek odası vb.) montaj hizmeti ücretsiz olarak sunulmaktadır.',
      },
      {
        q: 'Hangi illere teslimat yapılıyor?',
        a: 'Türkiye\'nin 81 iline teslimat yapılmaktadır. Samsun içi teslimatlar daha hızlı gerçekleştirilmektedir.',
      },
    ],
  },
  {
    category: 'İade & Değişim',
    questions: [
      {
        q: 'İade koşulları nelerdir?',
        a: 'Teslim tarihinden itibaren 14 gün içinde koşulsuz iade hakkınız bulunmaktadır. Ürün kullanılmamış ve orijinal ambalajında olmalıdır.',
      },
      {
        q: 'İade kargo ücreti kime ait?',
        a: 'İade kargo ücreti müşteriye aittir. Ancak ürün hasarlı veya hatalı gelmiş ise kargo ücreti tarafımızca karşılanır.',
      },
      {
        q: 'İade sürecinde param ne zaman iade edilir?',
        a: 'İade edilen ürünün tarafımıza ulaşmasının ardından, kontrol sonrası 5 iş günü içinde ödemeniz iade edilir.',
      },
      {
        q: 'Ürün değişimi yapılabiliyor mu?',
        a: 'Evet, teslim tarihinden itibaren 14 gün içinde ürün değişimi yapılabilir. Değişim istediğiniz ürün stokta bulunmalıdır.',
      },
    ],
  },
  {
    category: 'Ürünler & Garanti',
    questions: [
      {
        q: 'Ürünlerin garanti süresi ne kadar?',
        a: 'Tüm mobilya ürünlerimiz 2 yıl üretici garantisi kapsamındadır. Garanti kapsamında üretim hatalarından kaynaklanan sorunlar ücretsiz olarak giderilir.',
      },
      {
        q: 'Ürünler hangi malzemelerden üretilmektedir?',
        a: 'Her ürün için kullanılan malzemeler ürün sayfasında detaylı olarak belirtilmektedir. Genel olarak birinci sınıf ahşap, kaliteli kumaş ve dayanıklı metal aksam kullanılmaktadır.',
      },
      {
        q: 'Özel ölçü sipariş verebilir miyim?',
        a: 'Evet, bazı ürünlerimizde özel ölçü sipariş verebilirsiniz. Detaylar için bize ulaşmanız yeterlidir.',
      },
    ],
  },
];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (key: string) => {
    setOpenItems((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-800 to-primary-950 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Sıkça Sorulan Sorular</h1>
          <p className="text-primary-200 text-lg max-w-2xl mx-auto">
            Merak ettiğiniz soruların cevaplarını burada bulabilirsiniz.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          {faqData.map((section) => (
            <div key={section.category} className="mb-10">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <HelpCircle size={22} className="text-primary-600" />
                {section.category}
              </h2>
              <div className="space-y-3">
                {section.questions.map((item) => {
                  const key = `${section.category}-${item.q}`;
                  const isOpen = openItems.includes(key);
                  return (
                    <div key={key} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                      <button
                        onClick={() => toggleItem(key)}
                        className="flex items-center justify-between w-full px-5 py-4 text-left"
                      >
                        <span className="text-sm font-medium text-gray-800 pr-4">{item.q}</span>
                        <ChevronDown
                          size={18}
                          className={`text-gray-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-4 animate-fade-in">
                          <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="text-center mt-12 p-8 bg-primary-50 rounded-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Sorunuz Cevapsız mı Kaldı?</h3>
            <p className="text-sm text-gray-500 mb-4">Bize istediğiniz zaman ulaşabilirsiniz.</p>
            <Link href="/iletisim" className="px-6 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors">
              İletişime Geçin
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
