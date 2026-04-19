import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Huzur Mobilya - Evinize Huzur Katıyoruz',
    template: '%s | Huzur Mobilya',
  },
  description:
    'Huzur Mobilya ile evinizi şıklık ve konforla donatın. Koltuk takımları, yatak odası, yemek odası ve daha fazlası uygun fiyatlarla.',
  keywords: [
    'mobilya',
    'koltuk',
    'yatak odası',
    'yemek odası',
    'ofis mobilyası',
    'huzur mobilya',
    'online mobilya',
    'mobilya mağazası',
  ],
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://huzurmobilya.com',
    siteName: 'Huzur Mobilya',
    title: 'Huzur Mobilya - Evinize Huzur Katıyoruz',
    description:
      'Huzur Mobilya ile evinizi şıklık ve konforla donatın. Koltuk takımları, yatak odası, yemek odası ve daha fazlası uygun fiyatlarla.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className={`${inter.className} bg-gray-50 text-gray-900 antialiased`}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
