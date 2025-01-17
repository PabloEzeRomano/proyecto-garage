'use client';

import { ClientOnly } from '@/components/ClientOnly';
import { useCart } from '@/contexts/CartContext';
import useAuth from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Event, Role } from '@/types/database';
import dayjs from 'dayjs';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { EditIcon, TrashIcon } from '../../public/icons';

interface EventProps {
  events: Event[];
}

interface EventQuantity {
  [key: string]: number;
}

export const EventsPage: React.FC<EventProps> = ({ events: initialEvents }) => {
  const { user, loading } = useAuth([], [], false);
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [quantities, setQuantities] = useState<EventQuantity>({});
  const { addToCart } = useCart();

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleQuantityChange = (eventId: number, quantity: number) => {
    setQuantities((prev) => ({
      ...prev,
      [eventId]: quantity,
    }));
  };

  const handleAddToCart = (event: Event) => {
    const quantity = quantities[event.id] || 1;
    const eventProduct = {
      id: event.id.toString(),
      name: event.title,
      description: event.description,
      price: event.price || 0,
      image: event.image_url || undefined,
    };

    addToCart(eventProduct, quantity);
  };

  const deleteEvent = async (id: number) => {
    const { data, error } = await supabase.from('events').delete().eq('id', id);

    if (error) {
      console.error('Error deleting event:', error);
    } else {
      setEvents(events.filter((event) => event.id !== id));
    }
  };

  return (
    <ClientOnly>
      <div className="container mx-auto p-6 text-white">
        <h1 className="text-3xl font-bold mb-6">Próximos Eventos</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow bg-gray-800"
            >
              {event.image_url && (
                <Image
                  src={event.image_url}
                  alt={event.title}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
              )}
              <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
              <p className="text-gray-300 text-sm mb-2">
                {dayjs(event.date).format('DD/MM/YYYY HH:mm')}
              </p>
              <p className="text-gray-300 text-sm mb-3">{event.description}</p>
              <div className="flex justify-between items-center">
                <p className="text-lg font-bold text-blue-400">
                  ${event.price?.toFixed(2) || 'Gratis'}
                </p>
                <div className="flex gap-2">
                  {user?.user_metadata.role === Role.ADMIN && (
                    <>
                      <button
                        className="p-2 hover:bg-gray-700 rounded text-red-400"
                        onClick={() => deleteEvent(event.id)}
                      >
                        <TrashIcon />
                      </button>
                      <button
                        className="p-2 hover:bg-gray-700 rounded text-blue-400"
                        onClick={() => router.push(`/add-event?id=${event.id}`)}
                      >
                        <EditIcon />
                      </button>
                    </>
                  )}
                  <select
                    value={quantities[event.id] || 1}
                    onChange={(e) =>
                      handleQuantityChange(event.id, parseInt(e.target.value))
                    }
                    className="text-black bg-white rounded-md p-1"
                  >
                    {Array.from({ length: 10 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
                    onClick={() => handleAddToCart(event)}
                  >
                    Reservar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ClientOnly>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const { data: events, error } = await supabase.from('events').select('*');

  if (error) {
    console.error('Error fetching events:', error);
    return {
      props: { events: [] },
    };
  }

  return {
    props: { events: JSON.parse(JSON.stringify(events)) },
  };
};

export default EventsPage;
