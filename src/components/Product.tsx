'use client';

import React from 'react';
import { CartItem as ProductType } from '../types/cart';
import Image from 'next/image';

interface ProductProps {
  product: ProductType;
  onAddToCart: (product: ProductType) => void;
}

export const Product: React.FC<ProductProps> = ({ product, onAddToCart }) => {
  return (
    <div className="card">
      {product.image && (
        <Image
          src={product.image}
          alt={product.name}
          width={400}
          height={300}
          className="card-image"
        />
      )}
      <h3 className="card-title">
        {product.name}
      </h3>
      <p className="card-description">{product.description}</p>
      <div className="card-actions">
        <p className="card-price">
          ${product.price.toFixed(2)}
        </p>
        <button
          className="add-button"
          onClick={() => onAddToCart(product)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};
