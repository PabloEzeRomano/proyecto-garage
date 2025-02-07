'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import {
  createServerSupabaseAdmin,
  createServerSupabaseClient,
} from '@/lib/supabase-server';
import { Item, Role } from '@/types/database';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { EditIcon, TrashIcon } from '../../public/icons';
import Image from 'next/image';
import { getOptimizedImageUrl } from '@/utils/imageUtils';

import '@/styles/list.css';
import { Input } from '@/components/Input';

interface ItemsProps {
  items: Item[];
}

interface ItemQuantity {
  [key: string]: number;
}

export const ItemsPage: React.FC<ItemsProps> = ({ items: initialItems }) => {
  const [items, setItems] = useState(initialItems);
  const [quantities, setQuantities] = useState<ItemQuantity>({});
  const { addToCart } = useCart();
  const { hasRole } = useAuth();
  const router = useRouter();

  const handleQuantityChange = (itemId: number, quantity: number) => {
    setQuantities({
      ...quantities,
      [itemId]: quantity,
    });
  };

  const handleAddToCart = (item: Item) => {
    const quantity = quantities[item.id] || 1;
    addToCart({
      id: item.id,
      quantity,
      table: 'items',
    });
    setQuantities({ ...quantities, [item.id]: 0 });
  };

  const deleteItem = async (id: number) => {
    const supabase = createServerSupabaseAdmin();
    const { error } = await supabase.from('items').delete().eq('id', id);

    if (error) {
      console.error('Error deleting item:', error);
      return;
    }

    setItems(items.filter((item) => item.id !== id));
  };

  const handleAddItem = () => {
    router.push('/add-item');
  };

  return (
    <div className="list-container">
      <div className="list-header">
        <h1 className="list-title">Menu</h1>
        {hasRole([Role.ADMIN, Role.ROOT]) && (
          <button onClick={handleAddItem} className="add-button">
            Agregar un nuevo producto
          </button>
        )}
      </div>
      <div className="grid-layout">
        {items.map((item) => (
          <div key={item.id} className="card">
            {item.image_url && (
              <div className="card-image-container">
                <Image
                  src={getOptimizedImageUrl(item.image_url)}
                  alt={item.title}
                  width={300}
                  height={280}
                  className="card-image"
                />
              </div>
            )}
            <div className="card-content">
              <h2 className="card-title">{item.title}</h2>
              <p className="card-description">{item.description}</p>
              <div className="card-footer">
                <span className="card-price">${item.price}</span>
                <div className="card-actions">
                  {hasRole([Role.ADMIN, Role.ROOT]) && (
                    <>
                      <button
                        onClick={() => router.push(`/add-item?id=${item.id}`)}
                        className="action-button edit-button"
                      >
                        <EditIcon />
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="action-button delete-button"
                      >
                        <TrashIcon />
                      </button>
                    </>
                  )}
                  <Input
                    removeMargin
                    type="select"
                    options={Array.from({ length: 10 }, (_, i) => i + 1)}
                    value={quantities[item.id] || 1}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      handleQuantityChange(item.id, parseInt(e.target.value))
                    }
                  />
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="reserve-button"
                  >
                    Agregar al carrito
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemsPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const supabase = createServerSupabaseClient(context);

  try {
    const { data: items, error } = await supabase
      .from('items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return {
      props: {
        items: JSON.parse(JSON.stringify(items || [])),
      },
    };
  } catch (error) {
    console.error('Error fetching items:', error);
    return {
      props: {
        items: [],
      },
    };
  }
};
