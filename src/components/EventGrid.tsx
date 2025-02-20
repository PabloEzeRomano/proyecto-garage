import { Event } from '@/types/database';
import { EventCard } from './EventCard';

import '@/styles/card.css';

interface EventGridProps {
  events: Event[];
  onEventClick: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onAddToCart?: (event: Event, quantity: number) => void;
  showActions?: boolean;
  showReservation?: boolean;
  quantities?: Record<string, number>;
  onQuantityChange?: (eventId: string, quantity: number) => void;
  loadingDelete?: boolean;
  title?: string;
  actionButton?: React.ReactNode;
}

export const EventGrid = ({
  events,
  onEventClick,
  onEdit,
  onDelete,
  onAddToCart,
  showActions = false,
  showReservation = false,
  quantities = {},
  onQuantityChange,
  loadingDelete = false,
  title,
  actionButton,
}: EventGridProps) => {
  return (
    <div className="cards-container">
      {(title || actionButton) && (
        <div className="cards-header">
          {title && <h1 className="cards-title">{title}</h1>}
          {actionButton}
        </div>
      )}
      <div className="grid-layout">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onEventClick={onEventClick}
            onEdit={onEdit}
            onDelete={onDelete}
            onAddToCart={onAddToCart}
            showActions={showActions}
            showReservation={showReservation}
            quantity={quantities[event.id] || 1}
            onQuantityChange={(quantity) =>
              onQuantityChange?.(event.id, quantity)
            }
            loadingDelete={loadingDelete}
          />
        ))}
      </div>
    </div>
  );
};
