'use client';

import { ShoppingCart } from '@/components/ShoppingCart';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { GetServerSideProps } from 'next';
import { Event, Item } from '@/types/database';
import { MinimalCartItem } from '@/types/cart';
import { cookies } from 'next/headers';

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

export default function CartPage({ initialItems }: CartPageProps) {
  return <ShoppingCart initialItems={initialItems} />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const supabase = createServerSupabaseClient(context);

  try {
    // Get cart items from cookies
    const cartCookie = cookies().get('cartItems');
    if (!cartCookie?.value) {
      return { props: { initialItems: [] } };
    }

    const cartItems = JSON.parse(cartCookie.value) as MinimalCartItem[];

    // Group items by table for efficient querying
    const itemsByTable = cartItems.reduce((acc, item) => {
      if (!acc[item.table]) {
        acc[item.table] = [];
      }
      acc[item.table].push(item);
      return acc;
    }, {} as Record<'events' | 'items', MinimalCartItem[]>);

    // Fetch all items in parallel
    const [eventsData, itemsData] = await Promise.all([
      itemsByTable.events?.length > 0
        ? supabase
            .from('events')
            .select('*')
            .in('id', itemsByTable.events.map(item => item.id))
        : Promise.resolve({ data: [], error: null }),
      itemsByTable.items?.length > 0
        ? supabase
            .from('items')
            .select('*')
            .in('id', itemsByTable.items.map(item => item.id))
        : Promise.resolve({ data: [], error: null })
    ]);

    if (eventsData.error) throw eventsData.error;
    if (itemsData.error) throw itemsData.error;

    // Combine the data with quantities
    const events = eventsData.data.map(event => ({
      ...event,
      quantity: itemsByTable.events.find(item => item.id === event.id)?.quantity || 0
    }));

    const items = itemsData.data.map(item => ({
      ...item,
      quantity: itemsByTable.items.find(cartItem => cartItem.id === item.id)?.quantity || 0
    }));

    return {
      props: {
        initialItems: JSON.parse(JSON.stringify([...events, ...items]))
      }
    };
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return {
      props: {
        initialItems: []
      }
    };
  }
};