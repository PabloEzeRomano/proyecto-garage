'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';

export const CartButton: React.FC = () => {
  const { totalItems } = useCart();
  const router = useRouter();

  return (
    <button
      className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
      onClick={() => router.push('/cart')}
    >
      <svg
        className="w-6 h-6 text-gray-700"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
          {totalItems}
        </span>
      )}
    </button>
  );
};