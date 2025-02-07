export interface MinimalCartItem {
  id: number;
  quantity: number;
  table: 'events' | 'items';
}

export interface CartContextType {
  cartItems: MinimalCartItem[];
  addToCart: (item: MinimalCartItem) => void;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  totalItems: number;
}