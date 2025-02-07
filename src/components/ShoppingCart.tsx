'use client';

import React, { useEffect, useState } from 'react';
import { useCart } from '../contexts/CartContext';
import Image from 'next/image';
import { Wallet } from '@mercadopago/sdk-react';
import { Spinner } from './Spinner';
import { supabase } from '@/lib/supabase';
import { Event, Item } from '@/types/database';
import { getOptimizedImageUrl } from '@/utils/imageUtils';

interface CartItemDetails extends Item {
  quantity: number;
}

interface CartEventDetails extends Event {
  quantity: number;
}

type CartItemWithDetails = CartItemDetails | CartEventDetails;

interface ShoppingCartProps {
  initialItems: CartItemWithDetails[];
}

export const ShoppingCart: React.FC<ShoppingCartProps> = ({ initialItems }) => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const [preferenceId, setPreferenceId] = useState<string>("");
  const [itemsWithDetails, setItemsWithDetails] = useState<CartItemWithDetails[]>(initialItems);

  // Update items when cart changes
  useEffect(() => {
    const updateItemDetails = async () => {
      try {
        const itemPromises = cartItems.map(async (cartItem) => {
          // First try to find the item in our existing items
          const existingItem = itemsWithDetails.find(item => item.id === cartItem.id);
          if (existingItem) {
            return { ...existingItem, quantity: cartItem.quantity };
          }

          // If not found (new item), fetch from database
          const { data, error } = await supabase
            .from(cartItem.table)
            .select('id, title, description, price, image_url')
            .eq('id', cartItem.id)
            .single();

          if (error) throw error;
          return { ...data, quantity: cartItem.quantity };
        });

        const items = await Promise.all(itemPromises);
        setItemsWithDetails(items);
      } catch (error) {
        console.error('Error updating item details:', error);
      }
    };

    updateItemDetails();
  }, [cartItems]);

  useEffect(() => {
    const loadMP = async () => {
      try {
        const response = await fetch('/api/create-preference', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ cartItems: itemsWithDetails }),
        });

        const data = await response.json();
        setPreferenceId(data.id);
      } catch (error) {
        console.error('Error creating preference:', error);
      }
    };

    if (itemsWithDetails.length > 0) {
      loadMP();
    }
  }, [itemsWithDetails]);

  const totalPrice = itemsWithDetails.reduce(
    (sum, item) => sum + (item.price || 0) * item.quantity,
    0
  );

  return (
    <div className="max-w-4xl mx-auto p-6 text-white">
      <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-gray-300 text-center py-8">Your cart is empty</p>
      ) : (
        <>
          <div className="space-y-4">
            {itemsWithDetails.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 border border-gray-200 rounded-lg p-4 bg-gray-800"
              >
                {item.image_url && (
                  <Image
                    src={getOptimizedImageUrl(item.image_url, 'thumbnail')}
                    alt={item.title}
                    width={96}
                    height={96}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-gray-300 text-sm">{item.description}</p>
                  <p className="text-blue-400 font-bold mt-2">
                    ${(item.price || 0).toFixed(2)}
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
                    Borrar
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
