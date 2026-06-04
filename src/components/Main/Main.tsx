import { useEffect, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';
import styles from './Main.module.scss';
import Loader from '@/components/Loader/Loader';
import CardList from '@/components/CardList/CardList';
import Pagination from '@/components/Pagination/Pagination';
import { getPokemonList, searchPokemon } from '@/api/pokemon';
import type { PokemonItem } from '@/types/pokemon';
import { RESULTS_PER_PAGE } from '@/constants';

interface MainProps {
  searchTerm: string;
}

function Main({ searchTerm }: MainProps) {
  const [items, setItems] = useState<PokemonItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [crash, setCrash] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = searchParams.get('page');
  const page = Number(pageParam) || 1;

  useEffect(() => {
    if (pageParam !== String(page)) {
      setSearchParams({ page: String(page) }, { replace: true });
    }
  }, [pageParam, page, setSearchParams]);

  const trimmed = searchTerm.trim();
  const prevTrimmedRef = useRef(trimmed);

  useEffect(() => {
    if (prevTrimmedRef.current === trimmed) return;
    prevTrimmedRef.current = trimmed;
    if (page !== 1) {
      setSearchParams({ page: '1' }, { replace: true });
    }
  }, [trimmed, page, setSearchParams]);

  const selectedName = searchParams.get('details');

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        setError(null);
        setLoading(true);

        const result = trimmed ? await searchPokemon(trimmed) : await getPokemonList(page);

        if (cancelled) return;

        setItems(result.items);
        setTotalCount(result.totalCount);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [trimmed, page]);

  if (crash) {
    throw new Error('Test error');
  }

  const totalPages = Math.ceil(totalCount / RESULTS_PER_PAGE);
  const isEmpty = !loading && items.length === 0;

  const handlePageChange = (next: number) => {
    setSearchParams({ page: String(next) });
  };

  const handleSelectCard = (name: string) => {
    setSearchParams({ page: String(page), details: name });
  };

  const handleBackgroundClick = (event: MouseEvent<HTMLElement>) => {
    if (event.target !== event.currentTarget) return;
    if (!selectedName) return;

    const next = new URLSearchParams(searchParams);
    next.delete('details');
    setSearchParams(next, { replace: true });
  };

  const className = selectedName ? `${styles.main} ${styles.split}` : styles.main;

  return (
    <main className={className} onClick={handleBackgroundClick}>
      <div className={styles.list}>
        {error && <p className={styles.error}>{error}</p>}

        {loading && <Loader />}

        {!loading && !error && isEmpty && (
          <p className={styles.placeholder}>
            {trimmed ? 'No Pokemon found' : 'No Pokemon available'}
          </p>
        )}

        {!loading && items.length > 0 && (
          <>
            <CardList items={items} onSelectCard={handleSelectCard} selectedName={selectedName} />
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}

        <div className={styles.controls}>
          {!loading && (
            <button onClick={() => setCrash(true)} className={styles.errorBtn}>
              Throw test error
            </button>
          )}
        </div>
      </div>

      <Outlet />
    </main>
  );
}

export default Main;
