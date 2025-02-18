'use client';

import { Input } from '@/components/Input';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useMutations } from '@/hooks/useMutations';
import { Item, Role } from '@/types/database';
import { getOptimizedImageUrl } from '@/utils/imageUtils';
import { createServerSideProps } from '@/utils/serverProps';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { EditIcon, TrashIcon } from '../../../public/icons';

import '@/styles/card.css';

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
  const { remove } = useMutations('items');

  const handleQuantityChange = (itemId: string, quantity: number) => {
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

  const deleteItem = async (id: string) => {
    await remove(id, {
      onSuccess: () => {
        setItems(items.filter((item) => item.id !== id));
      },
      onError: (error: Error) => {
        console.error('Error deleting item:', error);
        alert('Error deleting item');
      },
    });
  };

  const handleAddItem = () => {
    router.push('/items/new');
  };

  return (
    <div className="cards-container">
      <div className="cards-header">
        <h1 className="cards-title">Menu</h1>
        {hasRole([Role.ADMIN, Role.ROOT]) && (
          <motion.button
          whileHover={{
            scale: 1.1,
            boxShadow: '0 0 8px #5ce08d',
            textShadow: '0 0 8px #5ce08d',
          }}
          className="success"
          onClick={handleAddItem}
        >
          Agregar un nuevo producto
        </motion.button>
        )}
      </div>
      <div className="grid-layout">
        {items.map((item) => (
          <div key={item.id} className="card theme-surface">
            {item.image_url && (
              <div>
                <Image
                  src={getOptimizedImageUrl(item.image_url)}
                  alt={item.title}
                  width={300}
                  height={280}
                  className="card-image w-full"
                />
              </div>
            )}
            <div className="card-content">
              <div className="card-header">
                <h2 className="card-title">{item.title}</h2>
                {hasRole([Role.ADMIN, Role.ROOT]) && (
                  <div className="actions">
                    <button
                      onClick={() => router.push(`/items/update/${item.id}`)}
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
                  </div>
                )}
              </div>
              <div className="card-footer">
                <span className="card-price">${item.price}</span>
                <div className="card-actions">
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
                    className="primary"
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

export const getServerSideProps = createServerSideProps<Item>({
  table: 'items',
  key: 'items',
  columns: '*',
  requireAuth: false,
  order: {
    column: 'created_at',
    ascending: false,
  },
});
