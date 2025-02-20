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
import { EventGrid } from '@/components/EventGrid';

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

  const handleEventClick = (id: string) => {
    router.push(`/events/${id}`);
  };

  return (
    <div className="mx-auto px-4">
      <section className="hero-section">
        <div className="landing-content">
          <h1 className="title">Bienvenido a Proyecto Garage</h1>
          <p className="subtitle">Tu lugar para estar, ser y disfrutar</p>
        </div>
      </section>
      <section>
        {events.length > 0 ? (
          <EventSlider events={events} onEventClick={handleEventClick} />
        ) : (
          <p className="text-center text-gray-500">No events found</p>
        )}
      </section>

      <SearchBar handleSearch={handleSearch} isLoading={isLoading} />

      <EventGrid events={events} onEventClick={handleEventClick} />
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
