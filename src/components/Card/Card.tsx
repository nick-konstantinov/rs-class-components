import './Card.css';
import placeholderSprite from '../../assets/pokemon-placeholder.svg';
import type { PokemonItem } from '../../types/pokemon';

interface CardProps {
  item: PokemonItem;
}

function Card({ item }: CardProps) {
  return (
    <div className="card">
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
