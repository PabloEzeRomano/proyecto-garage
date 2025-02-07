import { CrudForm } from '@/components/CrudForm';
import useAuth from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Role, Stock, Item } from '@/types/database';
import { GetServerSideProps } from 'next';

interface AddStockProps {
  stock?: Stock;
  items?: Item[];
}

const defaultStock: Stock = {
  id: -1,
  itemId: -1,
  quantity: 0,
  name: '',
  cost: 0,
};

export default function AddStock({ stock, items = [] }: AddStockProps) {
  const { loading } = useAuth([Role.ADMIN, Role.ROOT]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  const inputs = [
    {
      label: 'Nombre',
      type: 'text',
      name: 'name',
      value: stock?.name || defaultStock.name,
    },
    {
      label: 'Item',
      type: 'select',
      name: 'itemId',
      value: String(stock?.itemId || defaultStock.itemId),
      options: items.map(item => ({
        value: item.id.toString(),
        label: item.title
      })),
    },
    {
      label: 'Cantidad',
      type: 'number',
      name: 'quantity',
      value: String(stock?.quantity || defaultStock.quantity),
    },
    {
      label: 'Costo',
      type: 'number',
      name: 'cost',
      value: String(stock?.cost || defaultStock.cost),
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const [stockResponse, itemsResponse] = await Promise.all([
    context.query.id
      ? supabase.from('stocks').select('*').eq('id', context.query.id)
      : Promise.resolve({ data: null, error: null }),
    supabase.from('items').select('id, title')
  ]);

  if (stockResponse.error) {
    console.error('Error fetching stock:', stockResponse.error);
    return { props: { stock: null, items: [] } };
  }

  if (itemsResponse.error) {
    console.error('Error fetching items:', itemsResponse.error);
    return { props: { stock: stockResponse.data?.[0] || null, items: [] } };
  }

  return {
    props: {
      stock: stockResponse.data?.[0] || null,
      items: itemsResponse.data || []
    }
  };
};
