'use client';

import React, { useEffect, useState } from 'react';
import { useCart } from '../contexts/CartContext';
import Image from 'next/image';
import { Spinner } from '@/components/Spinner';
import { Event, Item } from '@/types/database';
import { getOptimizedImageUrl } from '@/utils/imageUtils';
import { useRouter } from 'next/router';

interface CartItemDetails extends Item {
  quantity: number;
}

interface CartEventDetails extends Event {
  quantity: number;
}

type CartItemWithDetails = CartItemDetails | CartEventDetails;

interface CartPageProps {
  initialItems: CartItemWithDetails[];
}

export default function CartPage() {
  const router = useRouter();
  const { removeFromCart, updateQuantity, getItemsWithDetails } = useCart();
  const [itemsWithDetails, setItemsWithDetails] =
    useState<CartItemWithDetails[]>();
  const [isLoading, setIsLoading] = useState(false);

  // Update items when cart changes
  useEffect(() => {
    const updateItems = async () => {
      const items = await getItemsWithDetails();
      setItemsWithDetails(items);
    };

    updateItems();
  }, [getItemsWithDetails]);

  const totalPrice =
    itemsWithDetails?.reduce(
      (sum, item) => sum + (item.price || 0) * item.quantity,
      0
    ) || 0;

  const handleProceedToCheckout = () => {
    setIsLoading(true);
    router.push('/checkout');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 text-white">
      <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>

      {itemsWithDetails?.length === 0 ? (
        <p className="text-gray-300 text-center py-8">Your cart is empty</p>
      ) : (
        <>
          <div className="space-y-4">
            {itemsWithDetails?.map((item) => (
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
                    onClick={() =>
                      updateQuantity(item.id, item.quantity - 1)
                    }
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    className="p-1 hover:bg-gray-700 rounded"
                    onClick={() =>
                      updateQuantity(item.id, item.quantity + 1)
                    }
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
            <button
              onClick={handleProceedToCheckout}
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {isLoading ? <Spinner size="sm" /> : 'Ir a pagar'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
