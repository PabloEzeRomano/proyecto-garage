import { Input } from '@/components/Input';
import useAuth from '@/hooks/useAuth';
import { prisma } from '@/lib/prisma';
import { Event, Role } from '@prisma/client';
import dayjs from 'dayjs';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

import '@/styles/addForm.css';

interface AddEventProps {
  events: Event[];
}

export default function AddEvent({ events }: AddEventProps) {
  const searchParams = useSearchParams();
  const eventId = searchParams?.get('id');
  const router = useRouter();
  const [eventData, setEventData] = useState<Event>(
    events.find((event) => eventId && event.id === Number(eventId)) || {
      id: -1,
      title: '',
      description: '',
      shortDescription: '',
      price: null,
      date: dayjs().toDate(),
      imageUrl: null,
    }
  );
  const [addMore, setAddMore] = useState(false);

  const { session, status } = useAuth([Role.ADMIN]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();

      reader.onload = () => {
        setEventData({ ...eventData, imageUrl: reader.result as string });
      };

      reader.readAsDataURL(file);
    },
    [eventData]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  if (status === 'loading' || !session) {
    return <div>Cargando...</div>;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const parsedValue =
      type === 'number'
        ? parseFloat(value)
        : type === 'date'
        ? dayjs(value).toDate()
        : value;
    setEventData({ ...eventData, [name]: parsedValue });
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { id: _, ...restEventData } = eventData;

    const url = '/api/events';
    const method = eventId ? 'PATCH' : 'POST';
    const body = eventId
      ? JSON.stringify(eventData)
      : JSON.stringify(restEventData);

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body,
    });

    if (addMore) {
      setEventData({
        id: -1,
        title: '',
        description: '',
        shortDescription: '',
        price: null,
        date: dayjs().toDate(),
        imageUrl: null,
      });
      setAddMore(false);
    } else {
      router.push('/events');
    }
  };

  const inputs = [
    {
      label: 'Título',
      onChange: handleInputChange,
      type: 'text',
      name: 'title',
      value: eventData.title,
    },
    {
      label: 'Descripción',
      onChange: handleInputChange,
      type: 'text',
      name: 'description',
      value: eventData.description,
    },
    {
      label: 'Descripción Corta',
      onChange: handleInputChange,
      type: 'text',
      name: 'shortDescription',
      value: eventData.shortDescription,
    },
    {
      label: 'Precio',
      onChange: handleInputChange,
      type: 'number',
      name: 'price',
      value: String(eventData.price || ''),
    },
    {
      label: 'Fecha',
      onChange: handleInputChange,
      type: 'date',
      name: 'date',
      value: dayjs(eventData.date).format('YYYY-MM-DD'),
    },
  ];

  return (
    <div className="add-container">
      <h1 className="add-title">Agregar Evento</h1>
      <Input
        label="Agregar más"
        onChange={(e) => setAddMore(e.target.checked)}
        type="checkbox"
        checked={addMore}
      />
      <form onSubmit={handleFormSubmit} className="form-container">
        {inputs.map((input, index) => (
          <Input key={index} {...input} />
        ))}
        <div {...getRootProps()} className="dropzone">
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Suelta la imagen aquí ...</p>
          ) : (
            <p>Arrastra y suelta una imagen aquí, o haz clic para seleccionar una</p>
          )}
        </div>
        {eventData.imageUrl && (
          <Image
            src={eventData.imageUrl}
            alt="Subida"
            width={200}
            height={200}
            style={{ marginTop: '10px' }}
          />
        )}
        <button type="submit" className="submit">
          {eventId ? 'Actualizar Evento' : 'Agregar Evento'}
        </button>
      </form>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const events = await prisma.event.findMany();
  return { props: { events: JSON.parse(JSON.stringify(events)) } };
};
