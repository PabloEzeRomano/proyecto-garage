'use client';

import { CrudForm } from '@/components/CrudForm';
import { useAuth } from '@/contexts/AuthContext';
import { Event, Role } from '@/types/database';
import dayjs from 'dayjs';

interface EventFormProps {
  event?: Event;
}

const defaultEvent: Event = {
  id: '-1',
  title: '',
  description: '',
  short_description: '',
  price: 0,
  date: dayjs().format('YYYY-MM-DD'),
  image_url: null,
};

export const EventForm = ({ event = defaultEvent }: EventFormProps) => {
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
      value: event.title,
    },
    {
      label: 'Descripción',
      type: 'text',
      name: 'description',
      value: event.description,
    },
    {
      label: 'Descripción Corta',
      type: 'text',
      name: 'short_description',
      value: event.short_description,
    },
    {
      label: 'Precio',
      type: 'number',
      name: 'price',
      value: String(event.price),
    },
    {
      label: 'Fecha',
      type: 'date',
      name: 'date',
      value: dayjs(event.date),
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
