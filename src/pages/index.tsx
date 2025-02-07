'use client';

import { EventSlider } from '@/components/EventSlider';
import { SearchBar } from '@/components/SearchBar';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { Event } from '@/types/database';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import dayjs from 'dayjs';
import { useSupabase } from '@/contexts/SupabaseContext';
import Image from 'next/image';
import { getOptimizedImageUrl } from '@/utils/imageUtils';
import '@/styles/list.css';
import '@/styles/modal.css';
import '@/styles/landing.css';

interface HomeProps {
  events: Event[];
}

export default function Home({ events: initialEvents }: HomeProps) {
  const [events, setEvents] = useState(initialEvents);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = useSupabase();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const query = formData.get('query')?.toString() || '';
    const date = formData.get('date')?.toString() || '';

    try {
      let eventsQuery = supabase.from('events').select('*');

      if (query) {
        eventsQuery = eventsQuery.or(
          `title.ilike.%${query}%,description.ilike.%${query}%`
        );
      }

      if (date) {
        const startDate = dayjs(date).startOf('day').toISOString();
        const endDate = dayjs(date).endOf('day').toISOString();
        eventsQuery = eventsQuery.gte('date', startDate).lte('date', endDate);
      }

      const { data, error } = await eventsQuery;

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error searching events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEventClick = (id: number) => {
    router.push(`/events/${id}`);
  };

  return (
    <div className="container mx-auto px-4">
      <section className="hero-section">
        <div className="landing-content">
          <h1 className="title">Bienvenido a Proyecto Garage</h1>
          <p className="subtitle">Tu lugar para estar</p>
        </div>
      </section>
      <section className="py-12">
        <h2 className="text-3xl font-bold mb-8">Upcoming Events</h2>
        {events.length > 0 ? (
          <EventSlider events={events} onEventClick={handleEventClick} />
        ) : (
          <p className="text-center text-gray-500">No events found</p>
        )}
      </section>

      <SearchBar handleSearch={handleSearch} isLoading={isLoading} />

      {/* Event Grid */}
      <div className="list-container">
        <div className="grid-layout">
          {events.map((event, index) => (
            <div
              key={`${event.id}-${index}`}
              className="card cursor-pointer"
              onClick={() => handleEventClick(event.id)}
            >
              <div
                className="card-header"
                onClick={() => handleEventClick(event.id)}
              >
                <Image
                  src={getOptimizedImageUrl(event.image_url, 'medium')}
                  alt={event.title}
                  className="card-image"
                  width={400}
                  height={300}
                />
              </div>
              <div className="card-content">
                <h3 className="card-title">{event.title}</h3>
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

                  {event.price && <p className="card-price">${event.price}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const supabase = createServerSupabaseClient(context);

  try {
    let eventsQuery = supabase
      .from('events')
      .select('*')
      .gte('date', new Date().toISOString())
      .order('date', { ascending: true });

    // Apply search filters if present
    if (context.query.query) {
      eventsQuery = eventsQuery.or(
        `title.ilike.%${context.query.query}%,description.ilike.%${context.query.query}%`
      );
    }

    if (context.query.date) {
      const startDate = dayjs(context.query.date as string)
        .startOf('day')
        .toISOString();
      const endDate = dayjs(context.query.date as string)
        .endOf('day')
        .toISOString();
      eventsQuery = eventsQuery.gte('date', startDate).lte('date', endDate);
    }

    const { data: events, error } = await eventsQuery;

    if (error) throw error;

    return {
      props: {
        events: JSON.parse(JSON.stringify(events || [])),
      },
    };
  } catch (error) {
    console.error('Error fetching events:', error);
    return {
      props: {
        events: [],
      },
    };
  }
};
