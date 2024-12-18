'use client';

import { Product } from '@/components/Product';
import { useCart } from '@/context/CartContext';
import { ClientOnly } from '@/components/ClientOnly';

// Example products data
const exampleProducts = [
  {
    id: '1',
    name: 'Hamburguesa Clásica',
    description: 'Carne, lechuga, tomate, queso y salsa especial',
    price: 2500,
    image: '/images/burger.jpg'
  },
  {
    id: '2',
    name: 'Pizza Margherita',
    description: 'Salsa de tomate, mozzarella y albahaca',
    price: 3000,
    image: '/images/pizza.jpg'
  },
  {
    id: '3',
    name: 'Papas Fritas',
    description: 'Papas fritas crocantes con sal',
    price: 1200,
    image: '/images/fries.jpg'
  }
];

export const ProductsPage: React.FC = () => {
  const { addToCart } = useCart();

  return (
    <ClientOnly>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Nuestros Productos</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exampleProducts.map(product => (
            <Product key={product.id} product={product} onAddToCart={addToCart} />
          ))}
        </div>
      </div>
    </ClientOnly>
  );
};

export default ProductsPage;