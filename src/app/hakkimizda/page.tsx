import Image from 'next/image';
import { Award, Users, MapPin, Calendar, Target, Heart, Truck, Shield } from 'lucide-react';

export const metadata = { title: 'Hakkımızda' };

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-800 to-primary-950 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Hakkımızda</h1>
          <p className="text-primary-200 text-lg max-w-2xl mx-auto">
            Yılların tecrübesiyle kaliteli mobilya üretimi ve satışı yapan Huzur Mobilya olarak,
            evinize konfor ve şıklık katmak için çalışıyoruz.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Hikayemiz</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Huzur Mobilya, 2010 yılında Samsun&apos;da küçük bir atölye olarak kuruldu.
                  Kaliteli malzeme, özgün tasarım ve müşteri memnuniyeti odaklı yaklaşımımızla
                  kısa sürede sektörde güvenilir bir marka haline geldik.
                </p>
                <p>
                  Bugün, modern üretim tesislerimiz ve deneyimli ekibimizle Türkiye genelinde
                  binlerce aileye hizmet vermekten gurur duyuyoruz. Her bir ürünümüz, uzman
                  zanaatkarlarımız tarafından özenle üretilmektedir.
                </p>
                <p>
                  Misyonumuz, herkesin erişebileceği fiyatlarla kaliteli ve şık mobilyalar sunarak
                  yaşam alanlarını daha konforlu ve estetik hale getirmektir.
                </p>
              </div>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden bg-primary-100">
              <Image src="/logo.png" alt="Huzur Mobilya Hikayemiz" fill className="object-contain p-16" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: <Calendar size={28} />, value: '15+', label: 'Yıllık Deneyim' },
              { icon: <Users size={28} />, value: '10.000+', label: 'Mutlu Müşteri' },
              { icon: <Award size={28} />, value: '5.000+', label: 'Ürün Çeşidi' },
              { icon: <MapPin size={28} />, value: '81', label: 'İle Teslimat' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {stat.icon}
                </div>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Değerlerimiz</h2>
            <p className="text-gray-500 max-w-lg mx-auto">İlkelerimiz ve değerlerimiz işimizin temelidir</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Target size={24} />, title: 'Kalite', desc: 'En kaliteli malzemelerle, dayanıklı ve uzun ömürlü ürünler üretiyoruz.' },
              { icon: <Heart size={24} />, title: 'Müşteri Memnuniyeti', desc: 'Müşterilerimizin memnuniyeti her zaman önceliğimizdir.' },
              { icon: <Truck size={24} />, title: 'Hızlı Teslimat', desc: 'Siparişlerinizi en kısa sürede, güvenle teslim ediyoruz.' },
              { icon: <Shield size={24} />, title: 'Güvenilirlik', desc: 'Tüm ürünlerimiz garanti kapsamında, güvenle alışveriş yapın.' },
            ].map((value) => (
              <div key={value.title} className="p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
