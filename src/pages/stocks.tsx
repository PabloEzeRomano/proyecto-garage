import useAuth from '@/hooks/useAuth';
import { prisma } from '@/lib/prisma';
import { Role, Stock } from '@prisma/client';
import { GetServerSideProps } from 'next';

export default function Stocks({ stocks }: { stocks: Stock[] }) {
  const { session, status } = useAuth([Role.ADMIN]);

  if (status === 'loading' || !session) {
    return <div>Loading...</div>;
  }

  return (
    <div className="list-container">
      <h1 className="title">Stocks</h1>
      <div className="list">
        <ul>
          {stocks.map(({ id, name, quantity, cost }) => (
            <li key={id} className="item-container">
              <h2 className="title">{name}</h2>
              <p className="description">{quantity}</p>
              <button className="add-button">Agregar</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const stocks = await prisma.stock.findMany();
  return {
    props: { stocks },
  };
};
