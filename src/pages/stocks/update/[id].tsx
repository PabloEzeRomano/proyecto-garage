import { StockForm } from "@/components/StockForm";
import { Item, Stock } from "@/types/database";
import { createServerSideProps } from "@/utils/serverProps";

export default function UpdateStock({ stock, items }: { stock: Stock, items: Item[] }) {
  return <StockForm stock={stock} items={items} />
}

export const getServerSideProps = createServerSideProps<Stock | Item>([
  {
    table: 'stocks',
    key: 'stock',
    columns: 'id, item_id, quantity, name, cost',
    query: {
      eq: {
        id: 'id',
      },
    },
  },
  {
    table: 'items',
    key: 'items',
    columns: 'id, title',
  },
]);
