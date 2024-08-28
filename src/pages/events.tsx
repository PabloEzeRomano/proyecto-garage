import { EventModal } from '@/components/EventModal';
import useAuth from '@/hooks/useAuth';
import { prisma } from '@/lib/prisma';
import { Event } from '@prisma/client';
import dayjs from 'dayjs';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { EditIcon, TrashIcon } from '../../public/icons';

import '@/styles/list.css';
import { motion } from 'framer-motion';

interface EventProps {
  events: Event[];
}

export default function Events({ events: initialEvents }: EventProps) {
  const { session, status } = useAuth([], false);
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>(
    undefined
  );

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  const deleteEvent = async (id: number) => {
    const response = await fetch('/api/events', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });

    if (response.ok) {
      setEvents(events.filter((event) => event.id !== id));
    }
  };

  const selectEvent = (eventId: number) => {
    setSelectedEvent(events.find(({ id }) => id === eventId));
  };

  const buildURL = () => {
    const data = {
      text: `Hola! Me interesa este evento: ${selectedEvent?.title}`,
    };
    const urlSearchParams = new URLSearchParams(data);
    let whatsAppURL = `https://wa.me/+5491122535526?${urlSearchParams.toString()}`;
    return whatsAppURL;
  };

  return (
    <div className="list-container">
      <h1 className="title">Eventos</h1>
      <ul className="list">
        {events.map(({ id, title, date }) => (
          <li key={id} className="list-item">
            <motion.button
              className="event-button"
              style={{
                backgroundImage: `url("https://cdn.usegalileo.ai/stability/c852de51-b9f1-4363-a925-ba207724a92f.png")`,
              }}
              onClick={() => selectEvent(id)}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 0 8px #ff6347',
                textShadow: '0 0 8px #ff6347',
              }}
            />
            <div>
              <p className="item-title">{title}</p>
              <p className="date">{dayjs(date).format('DD/MM/YYYY HH:mm')}</p>
            </div>
            <div className="flex justify-between items-center mt-auto">
              {session?.user.role && (
                <div className="flex items-center justify-between">
                  <button
                    className="add-button mr-2"
                    onClick={() => deleteEvent(id)}
                  >
                    <TrashIcon />
                  </button>
                  <button
                    className="add-button"
                    onClick={() => router.push(`/add-event?id=${id}`)}
                  >
                    <EditIcon />
                  </button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
      {selectedEvent && (
        <EventModal
          selectedEvent={selectedEvent}
          closeModal={() => setSelectedEvent(undefined)}
          buildURL={buildURL}
        />
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const events = await prisma.event.findMany();

  return {
    props: { events: JSON.parse(JSON.stringify(events)) },
  };
};
