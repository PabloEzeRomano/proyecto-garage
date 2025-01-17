import { NavBar } from '@/components/NavBar';
import { ThemeProvider } from '@/contexts/ThemeContext';
import type { AppProps } from 'next/app';
import { Oswald } from 'next/font/google';
import Head from 'next/head';
import { CartProvider } from '../contexts/CartContext';
import { initMercadoPago } from '@mercadopago/sdk-react';

import '@/styles/globals.css';
import '@/styles/theme.css';
import '@/styles/button.css';
// import '@/styles/components.css';

const osvaldito = Oswald({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-inter',
});

export default function MyApp({ Component, pageProps }: AppProps) {
  initMercadoPago(process.env.NEXT_PUBLIC_MP_KEY!);
  return (
    <ThemeProvider>
      <CartProvider>
        <div className={`${osvaldito.variable} min-h-screen theme-bg theme-text`}>
          <Head>
            <title>Proyecto Garage</title>
            <meta name="description" content="Proyecto Garage - Tu lugar de encuentro" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <NavBar />
          <main className="theme-main">
            <Component {...pageProps} />
          </main>
          <footer className="theme-footer">
            <div className="theme-container">
              <p>Footer</p>
            </div>
          </footer>
        </div>
      </CartProvider>
    </ThemeProvider>
  );
}

// TODO: Add footer, add carousell events to homepage, on navbar add a transparent background when scrolling down
