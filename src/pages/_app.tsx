import { NavBar } from '@/components/NavBar';
import { initMercadoPago } from '@mercadopago/sdk-react';
import { AppProps } from 'next/app';
import { Oswald } from 'next/font/google';
import Head from 'next/head';
import { CartProvider } from '../context/CartContext';
import { useEffect } from 'react';

import '@/styles/globals.css';
import '@/styles/myapp.css';

const osvaldito = Oswald({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-inter',
});

export default function MyApp({
  Component,
  pageProps,
}: AppProps): JSX.Element {
  initMercadoPago(process.env.NEXT_PUBLIC_MP_KEY!)

  return (
    <>
      <Head>
        <title>Proyecto Garage</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <CartProvider>
        <div className={`${osvaldito.variable} app-container font-sans`}>
          <NavBar />
          <main className="content">
            <Component {...pageProps} />
          </main>
        </div>
      </CartProvider>
    </>
  );
}
