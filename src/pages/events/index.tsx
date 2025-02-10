'use client';

import { ClientOnly } from '@/components/ClientOnly';
import { Input } from '@/components/Input';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useMutations } from '@/hooks/useMutations';
import { Event, Permission, Role } from '@/types/database';
import { getOptimizedImageUrl } from '@/utils/imageUtils';
import { createServerSideProps } from '@/utils/serverProps';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { EditIcon, TrashIcon } from '../../../public/icons';

import '@/styles/card.css';

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

  const handleAddToCart = (event: Event) => {
    const quantity = quantities[event.id] || 1;
    addToCart({
      id: event.id,
      quantity,
      table: 'events'
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

  return (
    <ClientOnly>
      <div className="cards-container">
        <div className="cards-header">
          <h1 className="cards-title">Próximos Eventos</h1>
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
                  {hasRole([Role.ADMIN, Role.ROOT]) && (
                    <div className="actions">
                      <button
                        onClick={() => router.push(`/events/update/${event.id}`)}
                        className="action-button edit-button"
                      >
                        <EditIcon />
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="action-button delete-button"
                        disabled={loadingMutation}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  )}
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

export const getServerSideProps = createServerSideProps<Event>({
  table: 'events',
  key: 'events',
  columns: 'id, title, description, short_description, date, price, image_url',
  requireAuth: false,
  order: {
    column: 'date',
    ascending: true,
  }
});

export default EventsPage;
