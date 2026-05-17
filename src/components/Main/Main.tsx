import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './Main.css';
import Loader from '../Loader/Loader';
import CardList from '../CardList/CardList';
import Pagination from '../Pagination/Pagination';
import { getPokemonList, searchPokemon } from '../../api/pokemon';
import type { PokemonItem } from '../../types/pokemon';
import { RESULTS_PER_PAGE } from '../../constants';

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

  if (pageParam !== String(page)) {
    setSearchParams({ page: String(page) }, { replace: true });
  }

  const trimmed = searchTerm.trim();
  const [prevTrimmed, setPrevTrimmed] = useState(trimmed);

  if (prevTrimmed !== trimmed) {
    setPrevTrimmed(trimmed);
    if (page !== 1) {
      setSearchParams({ page: '1' }, { replace: true });
    }
  }

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

  return (
    <main className="main">
      {error && <p className="main__error">{error}</p>}

      {loading && <Loader />}

      {!loading && !error && isEmpty && (
        <p className="main__placeholder">{trimmed ? 'No Pokemon found' : 'No Pokemon available'}</p>
      )}

      {!loading && items.length > 0 && (
        <>
          <CardList items={items} />
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </>
      )}

      <div className="main__controls">
        {!loading && (
          <button onClick={() => setCrash(true)} className="main__error-btn">
            Throw test error
          </button>
        )}
      </div>
    </main>
  );
}

export default Main;
