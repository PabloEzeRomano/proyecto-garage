'use client';

import useAuth from '@/hooks/useAuth';
import { Item, Role } from '@/types/database';
import { GetServerSideProps } from 'next';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { ClientOnly } from '@/components/ClientOnly';
import Image from 'next/image';
import { EditIcon, TrashIcon } from '../../public/icons';
import { useRouter } from 'next/navigation';

interface ItemQuantity {
  [key: string]: number;
}

export const ItemsPage: React.FC<{ items: Item[] }> = ({ items: initialItems }) => {
  const { user, loading } = useAuth([], [], false);
  const router = useRouter();
  const [items, setItems] = useState<Item[]>(initialItems);
  const [quantities, setQuantities] = useState<ItemQuantity>({});
  const { addToCart } = useCart();

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleQuantityChange = (itemId: number, quantity: number) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: quantity
    }));
  };

  const handleAddToCart = (item: Item) => {
    const quantity = quantities[item.id] || 1;
    const itemProduct = {
      id: item.id.toString(),
      name: item.title,
      description: item.description || '',
      price: item.price || 0,
      image: item.imageUrl || undefined,
    };

    addToCart(itemProduct, quantity);
  };

  const deleteItem = async (id: number) => {
    const response = await fetch('/api/item', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });

    if (response.ok) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  return (
    <ClientOnly>
      <div className="container mx-auto p-6 text-white">
        <h1 className="text-3xl font-bold mb-6">Menú</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow bg-gray-800"
            >
              {item.imageUrl && (
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
              )}
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-300 text-sm mb-3">{item.description}</p>
              <div className="flex justify-between items-center">
                <p className="text-lg font-bold text-blue-400">
                  ${item.price?.toFixed(2) || 'Gratis'}
                </p>
                <div className="flex gap-2">
                  {user?.user_metadata.role === Role.ADMIN && (
                    <>
                      <button
                        className="p-2 hover:bg-gray-700 rounded text-red-400"
                        onClick={() => deleteItem(item.id)}
                      >
                        <TrashIcon />
                      </button>
                      <button
                        className="p-2 hover:bg-gray-700 rounded text-blue-400"
                        onClick={() => router.push(`/add-item?id=${item.id}`)}
                      >
                        <EditIcon />
                      </button>
                    </>
                  )}
                  <select
                    value={quantities[item.id] || 1}
                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                    className="text-black bg-white rounded-md p-1"
                  >
                    {Array.from({ length: 10 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
                    onClick={() => handleAddToCart(item)}
                  >
                    Agregar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ClientOnly>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const { data: items, error } = await supabase
    .from('items')
    .select('*');

  if (error) {
    console.error('Error fetching items:', error);
    return {
      props: { items: [] }
    };
  }

  return {
    props: { items: JSON.parse(JSON.stringify(items)) },
  };
};

export default ItemsPage;
