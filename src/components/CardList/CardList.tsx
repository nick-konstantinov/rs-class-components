import { Card } from '@/components/Card/Card';
import type { PokemonItem } from '@/types/pokemon';
import styles from './CardList.module.scss';

interface CardListProps {
  items: PokemonItem[];
  query: string;
  page: number;
}

export function CardList({ items, query, page }: CardListProps) {
  return (
    <div className={styles.list}>
      {items.map((item) => (
        <Card key={item.name} item={item} query={query} page={page} />
      ))}
    </div>
  );
}
