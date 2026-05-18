import './CardList.css';
import Card from '../Card/Card';
import type { PokemonItem } from '../../types/pokemon';

interface CardListProps {
  items: PokemonItem[];
  onSelectCard?: (name: string) => void;
  selectedName?: string | null;
}

function CardList({ items, onSelectCard, selectedName }: CardListProps) {
  return (
    <div className="card-list">
      {items.map((item) => (
        <Card
          key={item.name}
          item={item}
          onSelect={onSelectCard}
          isSelected={item.name === selectedName}
        />
      ))}
    </div>
  );
}

export default CardList;
