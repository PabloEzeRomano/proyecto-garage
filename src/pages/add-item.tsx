'use client';

import { CrudForm } from '@/components/CrudForm';
import { useAuth } from '@/contexts/AuthContext';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { Role, Item } from '@/types/database';
import { GetServerSideProps } from 'next';

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

export default function AddItem({ item }: AddItemProps) {
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
      value: item?.title || defaultItem.title,
    },
    {
      label: 'Descripción',
      type: 'text',
      name: 'description',
      value: item?.description || defaultItem.description,
    },
    {
      label: 'Precio',
      type: 'number',
      name: 'price',
      value: String(item?.price || defaultItem.price),
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const supabase = createServerSupabaseClient(context);

  try {
    // Check authentication and role
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return {
        redirect: {
          destination: '/auth/sign-in',
          permanent: false,
        },
      };
    }

    // Check if user has admin role
    const userRoles = session.user.app_metadata.roles as Role[];
    if (!userRoles?.includes(Role.ADMIN) && !userRoles?.includes(Role.ROOT)) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    // If editing existing item
    if (context.query.id) {
      const { data: item, error } = await supabase
        .from('items')
        .select('*')
        .eq('id', context.query.id)
        .single();

      if (error) throw error;

      return {
        props: {
          item: JSON.parse(JSON.stringify(item))
        }
      };
    }

    // New item
    return {
      props: {
        item: null
      }
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      redirect: {
        destination: '/items',
        permanent: false,
      },
    };
  }
};
