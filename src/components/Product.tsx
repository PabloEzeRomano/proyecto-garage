'use client';

import React from 'react';
import { Product as ProductType } from '../types/cart';
import Image from 'next/image';

interface ProductProps {
  product: ProductType;
  onAddToCart: (product: ProductType) => void;
}

export const Product: React.FC<ProductProps> = ({ product, onAddToCart }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow text-white">
      {product.image && (
        <Image
          src={product.image}
          alt={product.name}
          width={400}
          height={300}
          className="w-full h-48 object-cover rounded-md mb-4"
        />
      )}
      <h3 className="text-lg font-semibold text-gray-300 mb-2">
        {product.name}
      </h3>
      <p className="text-gray-600 text-sm mb-3">
        {product.description}
      </p>
      <div className="flex justify-between items-center">
        <p className="text-lg font-bold text-blue-600">
          ${product.price.toFixed(2)}
        </p>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
          onClick={() => onAddToCart(product)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}