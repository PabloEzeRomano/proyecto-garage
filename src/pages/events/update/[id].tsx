import { Role, Event } from '@/types/database';
import { createServerSideProps } from '@/utils/serverProps';
import { EventForm } from '../../../components/EventForm';

interface EventPageProps {
  event: Event;
}

export default function AddEventPage({ event }: EventPageProps) {
  return <EventForm event={event} />;
}

export const getServerSideProps = createServerSideProps<Event>({
  table: 'events',
  key: 'event',
  columns: 'id, title, description, short_description, date, price, image_url',
  requireAuth: true,
  requiredRoles: [Role.ADMIN, Role.ROOT],
  single: true,
  query: {
    eq: {
      id: 'id',
    },
  },
});
