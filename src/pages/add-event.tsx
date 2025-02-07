'use client';

import { CrudForm } from '@/components/CrudForm';
import { useAuth } from '@/contexts/AuthContext';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { Event, Role } from '@/types/database';
import { GetServerSideProps } from 'next';
import dayjs from 'dayjs';

interface AddEventProps {
  event?: Event;
}

const defaultEvent: Event = {
  id: -1,
  title: '',
  description: '',
  short_description: '',
  price: 0,
  date: dayjs().format('YYYY-MM-DD'),
  image_url: null,
};

export default function AddEvent({ event }: AddEventProps) {
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
      value: event?.title || defaultEvent.title,
    },
    {
      label: 'Descripción',
      type: 'text',
      name: 'description',
      value: event?.description || defaultEvent.description,
    },
    {
      label: 'Descripción Corta',
      type: 'text',
      name: 'short_description',
      value: event?.short_description || defaultEvent.short_description,
    },
    {
      label: 'Precio',
      type: 'number',
      name: 'price',
      value: String(event?.price || defaultEvent.price),
    },
    {
      label: 'Fecha',
      type: 'date',
      name: 'date',
      value: dayjs(event?.date || defaultEvent.date).format('YYYY-MM-DD'),
    },
  ];

  return (
    <CrudForm<Event>
      data={event}
      defaultData={defaultEvent}
      table="events"
      title="Event"
      inputs={inputs}
      redirectPath="/events"
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

    // If editing existing event
    if (context.query.id) {
      const { data: event, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', context.query.id)
        .single();

      if (error) throw error;

      return {
        props: {
          event: JSON.parse(JSON.stringify(event))
        }
      };
    }

    // New event
    return {
      props: {
        event: null
      }
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      redirect: {
        destination: '/events',
        permanent: false,
      },
    };
  }
};
