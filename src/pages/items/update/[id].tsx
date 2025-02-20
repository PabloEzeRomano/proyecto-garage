import { ItemForm } from '@/components/ItemForm';
import { Item } from '@/types/database';
import { Role } from '@/types/database';
import { createServerSideProps } from '@/utils/serverProps';

export default function UpdateItem() {
  return <ItemForm />;
}

export const getServerSideProps = createServerSideProps<Item>({
  table: 'items',
  key: 'item',
  columns: 'id, title, description, price, image_url',
  requiredRoles: [Role.ADMIN, Role.ROOT],
  requireAuth: true,
  single: true,
  query: {
    eq: {
      id: 'id',
    },
  },
});
