'use client';

import { ClientOnly } from '@/components/ClientOnly';
import { useCart } from '@/contexts/CartContext';
import useAuth from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { CartItem } from '@/types/cart';
import { Event, Permission, Role } from '@/types/database';
import dayjs from 'dayjs';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { EditIcon, TrashIcon } from '../../public/icons';

import '@/styles/list.css';

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
    const eventProduct: CartItem = {
      id: event.id,
      name: event.title,
      description: event.description,
      price: event.price || 0,
      image: event.image_url || '',
      quantity,
    };

    addToCart(eventProduct);
  };

  const deleteEvent = async (id: number) => {
    const { data, error } = await supabase.from('events').delete().eq('id', id);

    if (error) {
      console.error('Error deleting event:', error);
    } else {
      setEvents(events.filter((event) => event.id !== id));
    }
  };

  const handleAddEvent = () => {
    router.push('/add-event');
  };

  console.log(user?.app_metadata?.permissions);

  return (
    <ClientOnly>
      <div className="list-container">
        <div className="list-header">
          <h1 className="list-title">Próximos Eventos</h1>
          {user?.app_metadata?.permissions?.includes(
            Permission.EVENTS_CREATE
          ) && (
            <button className="add-button" onClick={handleAddEvent}>
              Agregar un nuevo evento
            </button>
          )}
        </div>
        <div className="grid-layout">
          {[...events, ...events, ...events, ...events].map((event, index) => (
            <div key={`${event.id}-${index}`} className="card">
              {event.image_url && (
                <Image
                  src={event.image_url}
                  alt={event.title}
                  width={400}
                  height={300}
                  className="card-image"
                />
              )}
              <div className="card-header">
                <h3 className="card-title">{event.title}</h3>
                <div>
                  {user?.app_metadata?.permissions?.includes(
                    Permission.EVENTS_DELETE
                  ) && (
                    <button
                      className="action-button delete-button"
                      onClick={() => deleteEvent(event.id)}
                    >
                      <TrashIcon />
                    </button>
                  )}
                  {user?.app_metadata?.permissions?.includes(
                    Permission.EVENTS_UPDATE
                  ) && (
                    <button
                      className="action-button edit-button"
                      onClick={() => router.push(`/add-event?id=${event.id}`)}
                    >
                      <EditIcon />
                    </button>
                  )}
                </div>
              </div>
              <p className="card-date">
                {dayjs(event.date).format('DD/MM/YYYY HH:mm')}
              </p>
              {/* <p className="card-description">{event.description}</p> */}
              <div className="card-footer">
                <p className="card-price">
                  ${event.price?.toFixed(2) || 'Gratis'}
                </p>
                <div className="card-actions">
                  <select
                    value={quantities[event.id] || 1}
                    onChange={(e) =>
                      handleQuantityChange(event.id, parseInt(e.target.value))
                    }
                    className="quantity-select"
                  >
                    {Array.from({ length: 10 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  <button
                    className="reserve-button"
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
