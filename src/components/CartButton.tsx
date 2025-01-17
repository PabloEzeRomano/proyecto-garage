'use client';

import React from 'react';
import { useCart } from '@/contexts/CartContext';
import { CartIcon } from '../../public/icons';
import { useRouter } from 'next/navigation';

export const CartButton = () => {
  const { cartItems } = useCart();
  const router = useRouter();
  const itemCount = cartItems.reduce((total: number, item) => total + item.quantity, 0);

  return (
    <button
      onClick={() => router.push('/cart')}
      className="relative theme-button"
      aria-label="Open cart"
    >
      <CartIcon />
      {itemCount > 0 && (
        <span className="theme-badge">
          {itemCount}
        </span>
      )}
    </button>
  );
};
