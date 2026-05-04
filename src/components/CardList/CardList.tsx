import './CardList.css';
import Card from '../Card/Card';
import type { PokemonItem } from '../../types/pokemon';

interface CardListProps {
  items: PokemonItem[];
}

function CardList({ items }: CardListProps) {
  return (
    <div className="card-list">
      {items.map((item) => (
        <Card key={item.name} item={item} />
      ))}
    </div>
  );
}

export default CardList;
