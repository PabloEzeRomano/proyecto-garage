'use client';

import { EventModal } from '@/components/EventModal';
import { supabase } from '@/lib/supabase';
import { Event } from '@/types/database';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';
import { EventSlider } from '@/components/EventSlider';
import { SearchBar } from '@/components/SearchBar';
import { useSearchParams } from 'next/navigation';

import '@/styles/landing.css';
import '@/styles/list.css';
import '@/styles/modal.css';

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();

  // const [selectedProvince, setSelectedProvince] = useState('');
  // const [selectedLocation, setSelectedLocation] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  // Update filtered events when search params change
  useEffect(() => {
    const query = searchParams?.get('query')?.toLowerCase() || '';
    const date = searchParams?.get('date') || '';

    let filtered = events;
    if (date) {
      filtered = filtered.filter(
        (event) => dayjs(event.date).format('YYYY-MM-DD') === date
      );
    }
    if (query) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query)
      );
    }
    setFilteredEvents(filtered);
  }, [searchParams, events]);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
      setFilteredEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Trigger a new search with current URL parameters
    const query = searchParams?.get('query')?.toLowerCase() || '';
    const date = searchParams?.get('date') || '';

    let filtered = events;
    if (date) {
      filtered = filtered.filter(
        (event) => dayjs(event.date).format('YYYY-MM-DD') === date
      );
    }
    if (query) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query)
      );
    }
    setFilteredEvents(filtered);
    setIsLoading(false);
  };

  const buildURL = () => {
    if (!selectedEvent) return '#';
    // TODO: Implement URL building logic for event sharing/booking
    return '#';
  };

  // <select
  //           className="search-input"
  //           value={selectedProvince}
  //           onChange={(e) => setSelectedProvince(e.target.value)}
  //         >
  //           <option value="">Provincia</option>
  //           {/* Add provinces */}
  //         </select>
  //         <select
  //           className="search-input"
  //           value={selectedLocation}
  //           onChange={(e) => setSelectedLocation(e.target.value)}
  //         >
  //           <option value="">Localidad</option>
  //           {/* Add locations based on selected province */}
  //         </select>

  const displayEvents = filteredEvents.length > 0 ? filteredEvents : events;

  return (
    <div className="min-h-screen">
      <EventSlider events={events} onEventClick={setSelectedEvent} />

      <SearchBar handleSearch={handleSearch} isLoading={isLoading} />

      {/* Event Grid */}
      <div className="list-container">
        <div className="grid-layout">
          {[...displayEvents, ...displayEvents, ...displayEvents, ...displayEvents].map((event, index) => (
            <div
              key={`${event.id}-${index}`}
              className="card cursor-pointer"
              onClick={() => setSelectedEvent(event)}
            >
              <div className="card-header">
                <Image
                  src={event.image_url || '/placeholder.jpg'}
                  alt={event.title}
                  className="card-image"
                  width={1000}
                  height={1000}
                />
              </div>
              <div className="card-content">
                <h3 className="card-title">{event.title}</h3>
                {/* <p className="card-description">{event.short_description}</p> */}
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

      {/* Event Modal */}
      {selectedEvent && (
        <EventModal
          selectedEvent={selectedEvent}
          closeModal={() => setSelectedEvent(null)}
          buildURL={buildURL}
        />
      )}
    </div>
  );
}
