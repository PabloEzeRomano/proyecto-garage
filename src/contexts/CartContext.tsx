'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { supabase } from '@/lib/supabase';
import { Event, Item } from '@/types/database';

interface MinimalCartItem {
  id: string;
  quantity: number;
  table: 'events' | 'items'; // The table where the item should be fetched from
}

interface CartItemDetails extends Item {
  quantity: number;
}

interface CartEventDetails extends Event {
  quantity: number;
}

type CartItemWithDetails = CartItemDetails | CartEventDetails;

interface CartContextType {
  cartItems: MinimalCartItem[];
  addToCart: (item: {
    id: string;
    quantity: number;
    table: 'events' | 'items';
  }) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  totalItems: number;
  getItemsWithDetails: () => Promise<CartItemWithDetails[]>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_STORAGE_KEY = 'cartItems';

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<MinimalCartItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        return savedCart ? JSON.parse(savedCart) : [];
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }, [cartItems]);

  const addToCart = useCallback(({ id, quantity, table }: MinimalCartItem) => {
    setCartItems((prev) => {
      const existingItem = prev.find((i) => i.id === id);

      if (existingItem) {
        return prev.map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prev, { id, quantity, table }];
    });
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === itemId
            ? { ...item, quantity: Math.max(0, quantity) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const getItemsWithDetails = useCallback(async () => {
    try {
      const itemPromises = cartItems.map(async (cartItem) => {
        const { data, error } = await supabase
          .from(cartItem.table)
          .select('id, title, description, price, image_url')
          .eq('id', cartItem.id)
          .single();

        if (error) throw error;
        return { ...data, quantity: cartItem.quantity };
      });

      return await Promise.all(itemPromises);
    } catch (error) {
      console.error('Error getting item details:', error);
      return [];
    }
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        totalItems,
        getItemsWithDetails,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
