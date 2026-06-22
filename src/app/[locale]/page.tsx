import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getPokemonPage } from '@/lib/pokemon';
import { CardList } from '@/app/_components/CardList/CardList';
import styles from './page.module.scss';

type HomePageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; page?: string }>;
};

export default async function HomePage({ params, searchParams }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { q = '', page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const t = await getTranslations('list');

  const { items } = await getPokemonPage({ search: q, page });

  if (items.length === 0) {
    return (
      <section className={styles.results}>
        <p className={styles.empty}>{q ? t('notFound', { query: q }) : t('empty')}</p>
      </section>
    );
  }

  return (
    <section className={styles.results}>
      <CardList items={items} query={q} page={page} />
    </section>
  );
}
