import type { KeyboardEvent } from 'react';
import './Card.css';
import placeholderSprite from '../../assets/pokemon-placeholder.svg';
import type { PokemonItem } from '../../types/pokemon';

interface CardProps {
  item: PokemonItem;
  onSelect?: (name: string) => void;
  isSelected?: boolean;
}

function Card({ item, onSelect, isSelected }: CardProps) {
  const handleClick = () => {
    onSelect?.(item.name);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect?.(item.name);
    }
  };

  const className = isSelected ? 'card card--selected' : 'card';

  return (
    <div
      className={className}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-current={isSelected ? 'true' : undefined}
    >
      <img src={item.sprite ?? placeholderSprite} alt={item.name} className="card__image" />

      <h3 className="card__title">{item.name}</h3>

      <p className="card__description">
        <span>
          <strong>Types:</strong> {item.types}
        </span>
        <span>
          <strong>Abilities:</strong> {item.abilities}
        </span>
        <span>
          <strong>Height:</strong> {item.height}
        </span>
        <span>
          <strong>Weight:</strong> {item.weight}
        </span>
      </p>
    </div>
  );
}

export default Card;
