import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { CartProvider } from '@/contexts/CartContext';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAdminPage = router.pathname.startsWith('/admin') || router.pathname === '/admin-login';

  return (
    <CartProvider>
      <Head>
        <title>DeFit - Modern Clothing E-commerce</title>
        <meta name="description" content="DeFit - Your destination for modern and stylish clothing." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {isAdminPage ? (
        <Component {...pageProps} />
      ) : (
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Component {...pageProps} />
          </main>
          <Footer />
        </div>
      )}
    </CartProvider>
  );
}
