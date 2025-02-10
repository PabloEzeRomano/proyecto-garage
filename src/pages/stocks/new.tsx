import { StockForm } from "@/components/StockForm";
import { Item } from "@/types/database";
import { Stock } from "@/types/database";
import { createServerSideProps } from "@/utils/serverProps";

export default function NewStock({ items }: { items: Item[] }) {
  return <StockForm items={items} />
}

export const getServerSideProps = createServerSideProps<Stock | Item>([
  {
    table: 'items',
    key: 'items',
    columns: 'id, title',
  },
]);

