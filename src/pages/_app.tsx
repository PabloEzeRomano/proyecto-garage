import { NavBar } from '@/components/NavBar';
import { CartProvider } from '../context/CartContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <CartProvider>
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
          <Head>
            <title>Proyecto Garage</title>
            <meta name="description" content="Proyecto Garage - Tu lugar de encuentro" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <NavBar />
          <main className="container mx-auto px-4 py-8">
            <Component {...pageProps} />
          </main>
        </div>
      </CartProvider>
    </ThemeProvider>
  );
}
