import { useEffect, useState } from 'react';
import './Main.css';
import Loader from '../Loader/Loader';
import CardList from '../CardList/CardList';
import { getPokemonList, searchPokemon } from '../../api/pokemon';
import type { PokemonItem } from '../../types/pokemon';

interface MainProps {
  searchTerm: string;
}

function Main({ searchTerm }: MainProps) {
  const [items, setItems] = useState<PokemonItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [crash, setCrash] = useState(false);

  const trimmed = searchTerm.trim();
  const [prevTrimmed, setPrevTrimmed] = useState(trimmed);

  if (prevTrimmed !== trimmed) {
    setPrevTrimmed(trimmed);
    setPage(0);
  }

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        setError(null);
        setLoading(page === 0);
        setLoadingMore(page > 0);

        if (trimmed) {
          const results = await searchPokemon(trimmed);
          if (cancelled) return;
          setItems(results);
        } else {
          const fetched = await getPokemonList(page);
          if (cancelled) return;
          setItems((prev) => (page === 0 ? fetched : [...prev, ...fetched]));
        }
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        if (!cancelled) {
          setLoading(false);
          setLoadingMore(false);
        }
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

  const isEmpty = !loading && items.length === 0;

  return (
    <main className="main">
      {error && <p className="main__error">{error}</p>}

      {loading && <Loader />}

      {!loading && !error && isEmpty && (
        <p className="main__placeholder">{trimmed ? 'No Pokemon found' : 'No Pokemon available'}</p>
      )}

      {!loading && items.length > 0 && <CardList items={items} />}

      {loadingMore && <Loader />}

      <div className="main__controls">
        {!trimmed && !loading && items.length > 0 && (
          <button onClick={() => setPage((p) => p + 1)} className="main__load-more">
            Load more
          </button>
        )}

        {!loading && !loadingMore && (
          <button onClick={() => setCrash(true)} className="main__error-btn">
            Throw test error
          </button>
        )}
      </div>
    </main>
  );
}

export default Main;
