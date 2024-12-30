export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
}

export interface CartItem extends Product {
  // type: 'ticket' | 'product';
  quantity: number;
}