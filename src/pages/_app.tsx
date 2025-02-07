import { NavBar } from '@/components/NavBar';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { SupabaseProvider } from '@/contexts/SupabaseContext';
import { initMercadoPago } from '@mercadopago/sdk-react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { CartProvider } from '../contexts/CartContext';

import '@/styles/button.css';
import '@/styles/globals.css';
import '@/styles/theme.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  initMercadoPago(process.env.NEXT_PUBLIC_MP_KEY!);
  return (
    <SupabaseProvider>
      <AuthProvider>
        <ThemeProvider>
          <CartProvider>
            <div className={`min-h-screen theme-bg theme-text`}>
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
      </AuthProvider>
    </SupabaseProvider>
  );
}

// TODO: Add footer, add carousell events to homepage, on navbar add a transparent background when scrolling down
