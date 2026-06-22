import clsx from 'clsx';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getPokemonPage } from '@/lib/pokemon';
import { RESULTS_PER_PAGE } from '@/constants';
import { CardList } from '@/app/_components/CardList/CardList';
import { Pagination } from '@/app/_components/Pagination/Pagination';
import { Details } from '@/app/_components/Details/Details';
import styles from './page.module.scss';

type HomePageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; page?: string; details?: string }>;
};

export default async function HomePage({ params, searchParams }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { q = '', page: pageParam, details } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const t = await getTranslations('list');

  const { items, totalCount } = await getPokemonPage({ search: q, page });
  const totalPages = Math.ceil(totalCount / RESULTS_PER_PAGE);

  return (
    <div className={clsx(styles.layout, { [styles.split]: details })}>
      <section className={styles.results}>
        {items.length === 0 ? (
          <p className={styles.empty}>{q ? t('notFound', { query: q }) : t('empty')}</p>
        ) : (
          <CardList items={items} query={q} page={page} />
        )}
        <Pagination currentPage={page} totalPages={totalPages} query={q} details={details} />
      </section>

      {details && <Details name={details} query={q} page={page} />}
    </div>
  );
}
