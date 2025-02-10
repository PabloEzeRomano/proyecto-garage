
'use client';

import { CrudForm } from '@/components/CrudForm';
import { useAuth } from '@/contexts/AuthContext';
import { Item, Role } from '@/types/database';

interface AddItemProps {
  item?: Item;
}

const defaultItem: Item = {
  id: -1,
  title: '',
  description: '',
  price: 0,
  image_url: null,
};

export const ItemForm = ({ item = defaultItem }: AddItemProps) => {
  const { loading, hasRole } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!hasRole([Role.ADMIN, Role.ROOT])) {
    return <div>No autorizado</div>;
  }

  const inputs = [
    {
      label: 'Título',
      type: 'text',
      name: 'title',
      value: item.title,
    },
    {
      label: 'Descripción',
      type: 'text',
      name: 'description',
      value: item.description,
    },
    {
      label: 'Precio',
      type: 'number',
      name: 'price',
      value: String(item.price),
    },
  ];

  return (
    <CrudForm<Item>
      data={item}
      defaultData={defaultItem}
      table="items"
      title="Item"
      inputs={inputs}
      redirectPath="/items"
      showImageUpload
    />
  );
}