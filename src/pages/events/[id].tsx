import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/lib/supabase';
import { Event } from '@/types/database';
import { GetServerSideProps } from 'next';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useState } from 'react';
import { Input } from '@/components/Input';
import { useRouter } from 'next/router';
import { getOptimizedImageUrl } from '@/utils/imageUtils';

import '@/styles/eventPage.css';

interface EventPageProps {
  event: Event;
}

export default function EventPage({ event }: EventPageProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!event) {
    return <div>Event not found</div>;
  }

  const handleAddToCart = () => {
    addToCart({
      id: event.id,
      quantity,
      table: 'events',
    });
  };

  return (
    <div className="event-page-container">
      <div className="event-hero">
        {event.image_url && (
          <div className="image-container">
            <Image
              src={getOptimizedImageUrl(event.image_url, 'large')}
              alt={event.title}
              fill
              className="event-image"
              priority
            />
            <div className="image-overlay" />
          </div>
        )}
        <div className="event-hero-content">
          <button
            onClick={() => router.back()}
            className="back-button"
          >
            ← Volver
          </button>
          <h1 className="event-title">{event.title}</h1>
          <p className="event-date">{dayjs(event.date).format('DD/MM/YYYY HH:mm')}</p>
        </div>
      </div>

      <div className="event-content">
        <div className="event-main">
          <section className="event-section">
            <h2 className="section-title">Descripción</h2>
            <p className="event-description">{event.description}</p>
          </section>

          <section className="event-section">
            <h2 className="section-title">Detalles</h2>
            <div className="event-details">
              <div className="detail-item">
                <span className="detail-label">Fecha</span>
                <span className="detail-value">
                  {dayjs(event.date).format('DD/MM/YYYY')}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Hora</span>
                <span className="detail-value">
                  {dayjs(event.date).format('HH:mm')}
                </span>
              </div>
              {event.price && (
                <div className="detail-item">
                  <span className="detail-label">Precio</span>
                  <span className="detail-value">${event.price}</span>
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="event-sidebar">
          <div className="reservation-card">
            <h3 className="reservation-title">Reservar Entrada</h3>
            <div className="reservation-content">
              <div className="quantity-selector">
                <Input
                  label="Cantidad"
                  name="quantity"
                  className="quantity-select"
                  type="select"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  options={Array.from({ length: 10 }, (_, i) => i + 1)}
                />
              </div>
              {event.price && (
                <div className="price-summary">
                  <span>Total</span>
                  <span className="total-price">
                    ${(event.price * quantity).toFixed(2)}
                  </span>
                </div>
              )}
              <button
                onClick={handleAddToCart}
                className="reserve-event-button"
              >
                Agregar al Carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params || {};

  if (!id) {
    return {
      notFound: true,
    };
  }

  const { data: event, error } = await supabase
    .from('events')
    .select('id, title, description, short_description, date, price, image_url')
    .eq('id', id)
    .single();

  if (error || !event) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      event: JSON.parse(JSON.stringify(event)),
    },
  };
};