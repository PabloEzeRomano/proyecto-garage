import { Event, Role } from '@/types/database';
import { getOptimizedImageUrl } from '@/utils/imageUtils';
import dayjs from 'dayjs';
import Image from 'next/image';
import { EditIcon, TrashIcon } from '../../public/icons';
import { Input } from './Input';

interface EventCardProps {
  event: Event;
  onEventClick: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onAddToCart?: (event: Event, quantity: number) => void;
  showActions?: boolean;
  showReservation?: boolean;
  quantity?: number;
  onQuantityChange?: (quantity: number) => void;
  loadingDelete?: boolean;
}

export const EventCard = ({
  event,
  onEventClick,
  onEdit,
  onDelete,
  onAddToCart,
  showActions = false,
  showReservation = false,
  quantity = 1,
  onQuantityChange,
  loadingDelete = false,
}: EventCardProps) => {
  return (
    <div className="card theme-surface">
      <div className="card-image-container">
        <Image
          src={getOptimizedImageUrl(event.image_url || null, 'medium')}
          alt={event.title}
          width={400}
          height={300}
          className="card-image"
          onClick={() => onEventClick(event.id)}
        />
      </div>
      <div className="card-content">
        <div className="card-header">
          <h3 className="card-title">{event.title}</h3>
          {showActions && (
            <div className="actions">
              <button
                onClick={() => onEdit?.(event.id)}
                className="action-button edit-button"
              >
                <EditIcon />
              </button>
              <button
                onClick={() => onDelete?.(event.id)}
                className="action-button delete-button"
                disabled={loadingDelete}
              >
                <TrashIcon />
              </button>
            </div>
          )}
        </div>
        <div className="card-footer">
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
          <div className="flex items-end flex-col">
            <p className="card-price">${event.price?.toFixed(2) || 'Gratis'}</p>
            {showReservation && (
              <div className="card-actions">
                <Input
                  removeMargin
                  type="select"
                  options={Array.from({ length: 10 }, (_, i) => i + 1)}
                  value={quantity}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    onQuantityChange?.(parseInt(e.target.value))
                  }
                />
                <button
                  className="reserve-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart?.(event, quantity);
                  }}
                >
                  Reservar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
