import useAuth from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Role, Stock } from '@/types/database';
import { GetServerSideProps } from 'next';

export default function Stocks({ stocks }: { stocks: Stock[] }) {
  const { session, loading } = useAuth([Role.ADMIN, Role.ROOT]);

  if (loading || !session) {
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
  const { data: stocks, error } = await supabase
    .from('stock')
    .select('*');

  if (error) {
    throw error;
  }

  return {
    props: { stocks: stocks || [] },
  };
};
