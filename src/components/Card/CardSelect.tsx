'use client';

import { useTranslations } from 'next-intl';
import { useAppDispatch, useAppSelector } from '@/store/storeHooks';
import { selectIsSelected, toggleSelected } from '@/store/slices/selectedItemsSlice';
import type { PokemonItem } from '@/types/pokemon';

interface CardSelectProps {
  item: PokemonItem;
  className?: string;
}

export function CardSelect({ item, className }: CardSelectProps) {
  const dispatch = useAppDispatch();
  const checked = useAppSelector(selectIsSelected(item.name));
  const t = useTranslations('card');

  return (
    <label className={className}>
      <input
        type="checkbox"
        checked={checked}
        onChange={() => dispatch(toggleSelected(item))}
        aria-label={t('select', { name: item.name })}
      />
    </label>
  );
}
