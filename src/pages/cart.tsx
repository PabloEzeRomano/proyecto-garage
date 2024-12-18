'use client';

import { ShoppingCart } from '@/components/ShoppingCart';
import { ClientOnly } from '@/components/ClientOnly';

export const CartPage: React.FC = () => {
  return (
    <ClientOnly>
      <ShoppingCart />
    </ClientOnly>
  );
};

export default CartPage;