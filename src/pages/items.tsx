'use client';

import { ClientOnly } from '@/components/ClientOnly';
import { useCart } from '@/contexts/CartContext';
import useAuth from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { CartItem } from '@/types/cart';
import { Item, Role } from '@/types/database';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { EditIcon, TrashIcon } from '../../public/icons';

import '@/styles/list.css';

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
    const itemProduct: CartItem = {
      id: item.id,
      name: item.title,
      description: item.description,
      price: item.price,
      image: item.image_url || '',
      quantity: quantity
    };

    addToCart(itemProduct);
  };

  const deleteItem = async (id: number) => {
    const { data, error } = await supabase.from('items').delete().eq('id', id);

    if (error) {
      console.error('Error deleting item:', error);
    } else {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const handleEditItem = (id: number) => {
    router.push(`/add-item?id=${id}`);
  };

  return (
    <ClientOnly>
      <div className="list-container">
        <h1 className="list-title">Menú</h1>
        <div className="grid-layout">
          {items.map((item) => (
            <div key={item.id} className="card">
              {item.image_url && (
                <Image
                  src={item.image_url}
                  alt={item.title}
                  width={400}
                  height={300}
                  className="card-image"
                />
              )}
              <div className="card-header">
                <h3 className="card-title">{item.title}</h3>
                {user?.app_metadata?.roles?.includes(Role.ADMIN) && (
                  <div>
                    <button
                      className="action-button delete-button"
                      onClick={() => deleteItem(item.id)}
                    >
                      <TrashIcon />
                    </button>
                    <button
                      className="action-button edit-button"
                      onClick={() => handleEditItem(item.id)}
                    >
                      <EditIcon />
                    </button>
                  </div>
                )}
              </div>
              <p className="card-description">{item.description}</p>
              <div className="card-footer">
                <p className="card-price">
                  ${item.price?.toFixed(2) || 'Gratis'}
                </p>
                <div className="card-actions">
                  <select
                    value={quantities[item.id] || 1}
                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                    className="quantity-select"
                  >
                    {Array.from({ length: 10 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  <button
                    className="add-button"
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
