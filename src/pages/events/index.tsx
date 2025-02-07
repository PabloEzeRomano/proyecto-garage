'use client';

import { ClientOnly } from '@/components/ClientOnly';
import { Input } from '@/components/Input';
import { useCart } from '@/contexts/CartContext';
import useAuth from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import '@/styles/list.css';
import { Event, Permission } from '@/types/database';
import dayjs from 'dayjs';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { EditIcon, TrashIcon } from '../../../public/icons';
import { getOptimizedImageUrl } from '@/utils/imageUtils';

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
    addToCart({
      id: event.id,
      quantity,
      table: 'events'
    });
  };

  const deleteEvent = async (id: number) => {
    const { error } = await supabase.from('events').delete().eq('id', id);

    if (error) {
      console.error('Error deleting event:', error);
    } else {
      setEvents(events.filter((event) => event.id !== id));
    }
  };

  const handleAddEvent = () => {
    router.push('/add-event');
  };

  const handleEventClick = (eventId: number) => {
    router.push(`/events/${eventId}`);
  };

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
          {events.map((event) => (
            <div key={event.id} className="card">
              <div className="card-image-container">
                <Image
                  src={getOptimizedImageUrl(event.image_url || null, 'medium')}
                  alt={event.title}
                  width={400}
                  height={300}
                  className="card-image"
                  onClick={() => handleEventClick(event.id)}
                />
              </div>
              <div className="card-content">
                <div className="card-header">
                  <h3 className="card-title">{event.title}</h3>
                  <div className="event-actions">
                    {user?.app_metadata?.permissions?.includes(
                      Permission.EVENTS_DELETE
                    ) && (
                      <button
                        className="action-button delete-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteEvent(event.id);
                        }}
                      >
                        <TrashIcon />
                      </button>
                    )}
                    {user?.app_metadata?.permissions?.includes(
                      Permission.EVENTS_UPDATE
                    ) && (
                      <button
                        className="action-button edit-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/add-event?id=${event.id}`);
                        }}
                      >
                        <EditIcon />
                      </button>
                    )}
                  </div>
                </div>
                <div className="card-footer">
                  <div>
                    <div className="card-date-time">
                      <div className="card-date">
                        <p>{dayjs(event.date).format('DD')}</p>
                        <span className="text-sm ml-1">
                          {dayjs(event.date).format('MMM')}
                        </span>
                      </div>
                      <div className="card-time">
                        <p>{dayjs(event.date).format('HH')}</p>
                        <p>{dayjs(event.date).format('mm')}</p>
                      </div>
                    </div>

                    <p className="card-price">
                      ${event.price?.toFixed(2) || 'Gratis'}
                    </p>
                  </div>
                  <div className="card-actions">
                    <Input
                      removeMargin
                      type="select"
                      options={Array.from({ length: 10 }, (_, i) => i + 1)}
                      value={quantities[event.id] || 1}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        handleQuantityChange(event.id, parseInt(e.target.value))
                      }
                    />
                    <button
                      className="reserve-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(event);
                      }}
                    >
                      Reservar
                    </button>
                  </div>
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
  const { data: events, error } = await supabase
    .from('events')
    .select('id, title, description, short_description, date, price, image_url')
    .order('date', { ascending: true });

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
