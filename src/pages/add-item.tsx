import { Input } from '@/components/Input';
import useAuth from '@/hooks/useAuth';
import { Role } from '@prisma/client';
import { useRouter } from 'next/router';
import { useState } from 'react';

import '@/styles/addForm.css';

export default function AddItem() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const router = useRouter();
  const { session, status } = useAuth([Role.ADMIN]);

  if (status === 'loading' || !session) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    await fetch('/api/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description, price, imageUrl }),
    });
    router.push('/items');
  };

  return (
    <div className="add-container">
      <h1 className="add-title">Añadir Item</h1>
      <form onSubmit={handleSubmit} className="form-container">
        <Input
          placeholder="A title"
          label="Title:"
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          value={title}
        />
        <Input
          placeholder="1"
          label="Description:"
          onChange={(e) => setDescription(e.target.value)}
          type="text"
          value={description}
        />
        <Input
          placeholder="1"
          label="Price:"
          onChange={(e) => setPrice(Number(e.target.value))}
          type="number"
          value={price}
        />
        <Input
          label="Image URL:"
          placeholder="https://image.com"
          onChange={(e) => setImageUrl(e.target.value)}
          type="text"
          value={imageUrl}
        />
        <button type="submit" className="submit">
          Add Item
        </button>
      </form>
    </div>
  );
}
