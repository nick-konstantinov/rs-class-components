import clsx from 'clsx';
import styles from './Card.module.scss';
import placeholderSprite from '@/assets/images/pokemon-placeholder.svg';
import type { PokemonItem } from '@/types/pokemon';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectIsSelected, toggleSelected } from '@/store/slices/selectedItemsSlice';

interface CardProps {
  item: PokemonItem;
  onSelect?: (name: string) => void;
  isSelected?: boolean;
}

function Card({ item, onSelect, isSelected }: CardProps) {
  const dispatch = useAppDispatch();
  const isChecked = useAppSelector(selectIsSelected(item.name));

  const handleClick = () => {
    onSelect?.(item.name);
  };

  const handleCheckboxChange = () => {
    dispatch(toggleSelected(item));
  };

  return (
    <div className={clsx(styles.card, { [styles.selected]: isSelected })}>
      <label className={styles.checkbox}>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          aria-label={`Select ${item.name}`}
        />
      </label>

      <button
        type="button"
        className={styles.body}
        onClick={handleClick}
        aria-label={`View ${item.name} details`}
        aria-current={isSelected ? 'true' : undefined}
      />

      <img src={item.sprite ?? placeholderSprite} alt={item.name} className={styles.image} />

      <h3 className={styles.title}>{item.name}</h3>

      <p className={styles.description}>
        <span>
          <strong>Types:</strong>
          {item.types}
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
