'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import Image from 'next/image';
import { Wallet } from '@mercadopago/sdk-react';
import { useState } from 'react';
import { Spinner } from './Spinner';

export const ShoppingCart: React.FC = () => {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();
  const [preferenceId, setPreferenceId] = useState<string>("");

  useEffect(() => {
    const loadMP = async () => {
      try {
        const response = await fetch('/api/create-preference', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ items }),
        });

        const data = await response.json();
        setPreferenceId(data.id);
      } catch (error) {
        console.error('Error creating preference:', error);
      }
    };
      loadMP();
  }, [items]);

  return (
    <div className="max-w-4xl mx-auto p-6 text-white">
      <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>

      {items.length === 0 ? (
        <p className="text-gray-300 text-center py-8">Your cart is empty</p>
      ) : (
        <>
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 border border-gray-200 rounded-lg p-4 bg-gray-800"
              >
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={96}
                    height={96}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-gray-300 text-sm">{item.description}</p>
                  <p className="text-blue-400 font-bold mt-2">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="p-1 hover:bg-gray-700 rounded"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    className="p-1 hover:bg-gray-700 rounded"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                  <button
                    className="ml-4 text-red-400 hover:text-red-300"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-end">
            <p className="text-xl font-bold mb-4">
              Total: ${totalPrice.toFixed(2)}
            </p>
            {preferenceId ? (
              <div id="wallet_container">
                <Wallet
                  initialization={{ preferenceId }}
                  customization={{ texts: { valueProp: 'smart_option' }}}
                />
              </div>
            ) : (
              <div className="p-4">
                <Spinner size="md" />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
