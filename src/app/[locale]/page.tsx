import { Suspense } from 'react';
import clsx from 'clsx';
import { setRequestLocale } from 'next-intl/server';
import { PokemonResults } from '@/components/PokemonResults/PokemonResults';
import { Details } from '@/components/Details/Details';
import { ResultsSkeleton, DetailsSkeleton } from '@/components/Skeleton/Skeleton';
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

  return (
    <div className={clsx(styles.layout, { [styles.split]: details })}>
      <section className={styles.results}>
        <Suspense key={`${q}-${page}`} fallback={<ResultsSkeleton />}>
          <PokemonResults query={q} page={page} details={details} />
        </Suspense>
      </section>

      {details && (
        <Suspense key={details} fallback={<DetailsSkeleton />}>
          <Details name={details} query={q} page={page} />
        </Suspense>
      )}
    </div>
  );
}
