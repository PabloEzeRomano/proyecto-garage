'use client';

import { Product } from '@/components/Product';
import { useCart } from '../contexts/CartContext';
import { ClientOnly } from '@/components/ClientOnly';

import '@/styles/list.css';

// Example products data
const exampleProducts = [
  {
    id: 1,
    name: 'Hamburguesa Clásica',
    description: 'Carne, lechuga, tomate, queso y salsa especial',
    price: 2500,
    image: '/images/burger.jpg',
    quantity: 1,
  },
  {
    id: 2,
    name: 'Pizza Margherita',
    description: 'Salsa de tomate, mozzarella y albahaca',
    price: 3000,
    image: '/images/pizza.jpg',
    quantity: 1,
  },
  {
    id: 3,
    name: 'Papas Fritas',
    description: 'Papas fritas crocantes con sal',
    price: 1200,
    image: '/images/fries.jpg',
    quantity: 1,
  },
];

export const ProductsPage: React.FC = () => {
  const { addToCart } = useCart();

  return (
    <ClientOnly>
      <div className="list-container">
        <h1 className="list-title">Nuestros Productos</h1>
        <div className="grid-layout">
          {exampleProducts.map((product) => (
            <Product
              key={product.id}
              product={product}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      </div>
    </ClientOnly>
  );
};

export default ProductsPage;
