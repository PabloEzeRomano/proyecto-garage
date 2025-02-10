import { useAuth } from '@/contexts/AuthContext';
import { Role, Stock } from '@/types/database';
import { createServerSideProps } from '@/utils/serverProps';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { EditIcon, TrashIcon } from '../../../public/icons';
import { useMutations } from '@/hooks/useMutations';

import '@/styles/table.css';

interface StocksProps {
  stocks: Stock[];
}

export default function Stocks({ stocks: initialStocks }: StocksProps) {
  const { user, loading, hasRole } = useAuth();
  const router = useRouter();
  const [stocks, setStocks] = useState<Stock[]>(initialStocks);
  const { remove } = useMutations('stocks');

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  if (!hasRole([Role.ADMIN, Role.ROOT])) {
    router.push('/');
  }

  const handleDelete = async (id: number) => {
    try {
      await remove(id.toString(), {
        onSuccess: () => {
          setStocks(stocks.filter((stock) => stock.id !== id));
        },
        onError: (error: Error) => {
          console.error('Error deleting stock:', error);
          alert('Error deleting stock');
        },
      });
    } catch (error) {
      // Error is already handled by onError callback
    }
  };

  return (
    <div className="main-container">
      <div className="main-header">
        <h1 className="main-title">Stocks</h1>
        <button
          onClick={() => router.push('/stocks/new')}
          className="add-button"
        >
          Agregar Stock
        </button>
      </div>
      <div className="table-container">
        <table className="table">
          <thead className="table-header">
            <tr>
              <th className="header-cell">Nombre</th>
              <th className="header-cell">Cantidad</th>
              <th className="header-cell">Costo</th>
              <th className="header-cell">Acciones</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {stocks.map((stock) => (
              <tr key={stock.id} className="table-row">
                <td className="table-cell">
                  <div className="font-medium">{stock.name}</div>
                </td>
                <td className="table-cell">
                  <div>{stock.quantity}</div>
                </td>
                <td className="table-cell">
                  <div>${stock.cost}</div>
                </td>
                <td className="table-cell">
                  <div className="actions">
                    <button
                      className="action-button edit-button"
                      onClick={() => router.push(`/stocks/update/${stock.id}`)}
                    >
                      <EditIcon />
                    </button>
                    <button
                      className="action-button delete-button"
                      onClick={() => handleDelete(stock.id)}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export const getServerSideProps = createServerSideProps<Stock>({
  table: 'stocks',
  key: 'stocks',
  columns: 'id, item_id, quantity, name, cost',
  requiredRoles: [Role.ADMIN, Role.ROOT],
  requireAuth: true
});
