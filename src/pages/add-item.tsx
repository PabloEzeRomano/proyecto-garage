import { Input } from '@/components/Input';
import useAuth from '@/hooks/useAuth';
import { Role } from '@/types/database';
import { useRouter } from 'next/router';
import { useState } from 'react';

import '@/styles/addForm.css';
import { supabase } from '@/lib/supabase';

export default function AddItem() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const router = useRouter();
  const { session, loading } = useAuth([Role.ADMIN, Role.ROOT]);

  if (loading || !session) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const { data, error } = await supabase.from('items').insert({
      title,
      description,
      price,
      image_url: imageUrl,
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
