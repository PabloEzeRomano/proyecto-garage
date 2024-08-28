import useAuth from '@/hooks/useAuth';
import { Item, PrismaClient } from '@prisma/client';
import { GetServerSideProps } from 'next';

import '@/styles/list.css';
import { prisma } from '@/lib/prisma';

export default function Items({ items }: { items: Item[] }) {
  const { session, status } = useAuth([], false);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div className="list-container">
      <h1 className="title">Items</h1>
      <div className="list">
        <ul>
          {items.map(({ id, title, description, price }) => (
            <li key={id} className="item-container">
              <h2 className="title">{title}</h2>
              <p className="description">{description}</p>
              <button className="add-button">Agregar</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const items = await prisma.item.findMany();
  return {
    props: { items },
  };
};
