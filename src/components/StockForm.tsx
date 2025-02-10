import { CrudForm } from '@/components/CrudForm';
import { useAuth } from '@/contexts/AuthContext';
import { Item, Role, Stock } from '@/types/database';
import { useRouter } from 'next/router';

interface AddStockProps {
  stock?: Stock;
  items?: Item[];
}

const defaultStock: Stock = {
  id: -1,
  item_id: -1,
  quantity: 0,
  name: '',
  cost: 0,
};

export const StockForm = ({ stock = defaultStock, items = [] }: AddStockProps) => {
  const { loading, hasRole } = useAuth();
  const router = useRouter();
  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!hasRole([Role.ADMIN, Role.ROOT])) {
    router.push('/');
  }

  const inputs = [
    {
      label: 'Nombre',
      type: 'text',
      name: 'name',
      value: stock.name,
    },
    {
      label: 'Item',
      type: 'select',
      name: 'item_id',
      value: String(stock.item_id),
      options: items.map(item => ({
        value: item.id.toString(),
        label: item.title
      })),
    },
    {
      label: 'Cantidad',
      type: 'number',
      name: 'quantity',
      value: String(stock.quantity),
    },
    {
      label: 'Costo',
      type: 'number',
      name: 'cost',
      value: String(stock.cost),
    },
  ];

  return (
    <CrudForm<Stock>
      data={stock}
      defaultData={defaultStock}
      table="stocks"
      title="Stock"
      inputs={inputs}
      redirectPath="/stocks"
    />
  );
}