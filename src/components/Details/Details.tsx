import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import placeholderSprite from '@/assets/images/pokemon-placeholder.svg';
import { getPokemonDetail } from '@/lib/pokemon';
import styles from './Details.module.scss';

interface DetailsProps {
  name: string;
  query: string;
  page: number;
}

export async function Details({ name, query, page }: DetailsProps) {
  const t = await getTranslations('details');
  const item = await getPokemonDetail(name);

  return (
    <aside className={styles.details} aria-label={t('label')}>
      <Link
        className={styles.close}
        href={{ pathname: '/', query: { q: query, page } }}
        aria-label={t('close')}
      />

      {item ? (
        <div className={styles.content}>
          <h2 className={styles.title}>{item.name}</h2>
          <Image
            src={item.sprite ?? placeholderSprite}
            alt={item.name}
            width={150}
            height={150}
            className={styles.image}
          />
          <dl className={styles.list}>
            <dt>{t('types')}</dt>
            <dd>{item.types}</dd>
            <dt>{t('abilities')}</dt>
            <dd>{item.abilities}</dd>
            <dt>{t('height')}</dt>
            <dd>{item.height}</dd>
            <dt>{t('weight')}</dt>
            <dd>{item.weight}</dd>
          </dl>
        </div>
      ) : (
        <p className={styles.error}>{t('notFound')}</p>
      )}
    </aside>
  );
}
