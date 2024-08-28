import { Input } from '@/components/Input';
import useAuth from '@/hooks/useAuth';
import { Role } from '@prisma/client';
import { useRouter } from 'next/router';
import { useState } from 'react';

import '@/styles/addForm.css';

export default function AddStock() {
  const [name, setName] = useState('');
  const [itemId, setItemId] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [cost, setCost] = useState(0);
  const router = useRouter();
  const { session, status } = useAuth([Role.ADMIN]);

  if (status === 'loading' || !session) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    await fetch('/api/stocks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });
    router.push('/stocks');
  };

  return (
    <div className="add-container">
      <h1 className="add-title">Añadir Stock</h1>
      <form onSubmit={handleSubmit} className="form-container">
        <Input
          placeholder="A title"
          label="Name:"
          onChange={(e) => setName(e.target.value)}
          type="text"
          value={name}
        />
        <Input
          placeholder="23"
          label="Item id:"
          onChange={(e) => setItemId(e.target.value)}
          type="text"
          value={itemId}
        />
        <Input
          placeholder="1"
          label="Quantity:"
          onChange={(e) => setQuantity(Number(e.target.value))}
          type="number"
          value={quantity}
        />
        <Input
          placeholder="1"
          label="Cost:"
          onChange={(e) => setCost(Number(e.target.value))}
          type="number"
          value={cost}
        />
        <button type="submit" className="submit">
          Add Item
        </button>
      </form>
    </div>
  );
}
