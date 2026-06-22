import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import placeholderSprite from '@/assets/images/pokemon-placeholder.svg';
import type { PokemonItem } from '@/types/pokemon';
import { CardSelect } from './CardSelect';
import styles from './Card.module.scss';

interface CardProps {
  item: PokemonItem;
  query: string;
  page: number;
}

export async function Card({ item, query, page }: CardProps) {
  const t = await getTranslations('card');

  return (
    <article className={styles.card}>
      <CardSelect item={item} className={styles.checkbox} />
      <Link
        href={{ pathname: '/', query: { q: query, page, details: item.name } }}
        className={styles.body}
        aria-label={t('viewDetails', { name: item.name })}
      >
        <Image
          src={item.sprite ?? placeholderSprite}
          alt={item.name}
          width={100}
          height={100}
          className={styles.image}
        />

        <h3 className={styles.title}>{item.name}</h3>

        <p className={styles.description}>
          <span>
            <strong>{t('types')}</strong> {item.types}
          </span>
          <span>
            <strong>{t('abilities')}</strong> {item.abilities}
          </span>
          <span>
            <strong>{t('height')}</strong> {item.height}
          </span>
          <span>
            <strong>{t('weight')}</strong> {item.weight}
          </span>
        </p>
      </Link>
    </article>
  );
}
