import { getTranslations } from 'next-intl/server';
import { getPokemonPage } from '@/lib/pokemon';
import { RESULTS_PER_PAGE } from '@/constants';
import { CardList } from '@/app/_components/CardList/CardList';
import { Pagination } from '@/app/_components/Pagination/Pagination';
import styles from './PokemonResults.module.scss';

interface PokemonResultsProps {
  query: string;
  page: number;
  details?: string;
}

export async function PokemonResults({ query, page, details }: PokemonResultsProps) {
  const t = await getTranslations('list');
  const { items, totalCount } = await getPokemonPage({ search: query, page });
  const totalPages = Math.ceil(totalCount / RESULTS_PER_PAGE);

  return (
    <>
      {items.length === 0 ? (
        <p className={styles.empty}>{query ? t('notFound', { query }) : t('empty')}</p>
      ) : (
        <CardList items={items} query={query} page={page} />
      )}
      <Pagination currentPage={page} totalPages={totalPages} query={query} details={details} />
    </>
  );
}
