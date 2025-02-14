'use client';

import { ClientOnly } from '@/components/ClientOnly';
import { EventGrid } from '@/components/EventGrid';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useMutations } from '@/hooks/useMutations';
import { Event, Permission, Role } from '@/types/database';
import { createServerSideProps } from '@/utils/serverProps';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useState } from 'react';

interface EventProps {
  events: Event[];
}

interface EventQuantity {
  [key: string]: number;
}

export const EventsPage: React.FC<EventProps> = ({ events: initialEvents }) => {
  const { user, loading, hasRole } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [quantities, setQuantities] = useState<EventQuantity>({});
  const { addToCart } = useCart();
  const { remove, loading: loadingMutation } = useMutations('events');

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleQuantityChange = (eventId: number, quantity: number) => {
    setQuantities((prev) => ({
      ...prev,
      [eventId]: quantity,
    }));
  };

  const handleAddToCart = (event: Event, quantity: number) => {
    addToCart({
      id: event.id,
      quantity,
      table: 'events',
    });
  };

  const handleDelete = async (id: number) => {
    try {
      await remove(id.toString(), {
        onSuccess: () => {
          setEvents(events.filter((event) => event.id !== id));
        },
        onError: (error: Error) => {
          console.error('Error deleting event:', error);
          alert('Error deleting event');
        },
      });
    } catch (error) {
      // Error is already handled by onError callback
    }
  };

  const handleAddEvent = () => {
    router.push('/events/new');
  };

  const handleEventClick = (eventId: number) => {
    router.push(`/events/${eventId}`);
  };

  const handleEdit = (eventId: number) => {
    router.push(`/events/update/${eventId}`);
  };

  const addButton = user?.app_metadata?.permissions?.includes(
    Permission.EVENTS_CREATE
  ) && (
    <motion.button
      whileHover={{
        scale: 1.1,
        boxShadow: '0 0 8px #5ce08d',
        textShadow: '0 0 8px #5ce08d',
      }}
      className="success"
      onClick={handleAddEvent}
    >
      Agregar un nuevo evento
    </motion.button>
  );

  return (
    <ClientOnly>
      <EventGrid
        events={events}
        onEventClick={handleEventClick}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddToCart={handleAddToCart}
        showActions={hasRole([Role.ADMIN, Role.ROOT])}
        showReservation={true}
        quantities={quantities}
        onQuantityChange={handleQuantityChange}
        loadingDelete={loadingMutation}
        title="Próximos Eventos"
        actionButton={addButton}
      />
    </ClientOnly>
  );
};

export const getServerSideProps = createServerSideProps<Event>({
  table: 'events',
  key: 'events',
  columns: 'id, title, description, short_description, date, price, image_url',
  requireAuth: false,
  order: {
    column: 'date',
    ascending: true,
  },
});

export default EventsPage;
