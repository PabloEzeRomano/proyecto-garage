import { Input } from '@/components/Input';
import useAuth from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Event, Role } from '@/types/database';
import dayjs from 'dayjs';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { TrashIcon } from '../../public/icons/TrashIcon';

import '@/styles/addForm.css';

interface AddEventProps {
  event?: Event;
}

const defaultEvent: Event = {
  id: -1,
  title: '',
  description: '',
  short_description: '',
  price: 0,
  date: dayjs().format('YYYY-MM-DD'),
  image_url: null,
};

export default function AddEvent({ event }: AddEventProps) {
  const router = useRouter();
  const [eventData, setEventData] = useState<Event>(event || defaultEvent);
  const [addMore, setAddMore] = useState(false);

  const { session, loading } = useAuth([Role.ADMIN, Role.ROOT]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();

      reader.onload = () => {
        setEventData({ ...eventData, image_url: reader.result as string });
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

  if (loading || !session) {
    return <div>Cargando...</div>;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const parsedValue = type === 'number' ? parseFloat(value) : value;
    setEventData({ ...eventData, [name]: parsedValue });
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { id, ...restEventData } = eventData;

    const isUpdate = id !== -1;

    try {
      if (isUpdate) {
        await supabase.from('events').update(restEventData).eq('id', id);
      } else {
        await supabase.from('events').insert(restEventData);
      }
    } catch (error) {
      console.error('Error adding event:', error);
    }

    if (addMore) {
      setEventData(defaultEvent);
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
      name: 'short_description',
      value: eventData.short_description,
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
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setAddMore(!!e.target.checked)
        }
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
            <p>
              Arrastrá y soltá una imagen, o hacé click para seleccionar una
            </p>
          )}
        </div>
        {eventData.image_url && (
          <div className="flex items-center p-2 border border-stroke rounded-lg mb-4">
            <Image
              src={eventData.image_url}
              alt="Subida"
              width={200}
              height={200}
              style={{ marginTop: '10px', borderRadius: '10px' }}
            />
             <button
              className=" text-red-500"
              onClick={() => setEventData({ ...eventData, image_url: null })}
            >
              <TrashIcon />
            </button>
          </div>
        )}
        <button type="submit" className="submit">
          {event?.id !== -1 ? 'Actualizar Evento' : 'Agregar Evento'}
        </button>
      </form>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (context.query.id) {
    const { data: event, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', context.query.id);

    if (error) {
      console.error('Error fetching event:', error);
      return { props: { event: null } };
    }

    return { props: { event: event[0] } };
  }

  return { props: { event: null } };
};
