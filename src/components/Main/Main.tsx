import { useEffect, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';
import './Main.css';
import Loader from '@/components/Loader/Loader';
import CardList from '@/components/CardList/CardList';
import Pagination from '@/components/Pagination/Pagination';
import { pokemonApi, useGetPokemonsQuery } from '@/store/pokemonApi';
import { useAppDispatch } from '@/store/hooks';
import { getQueryErrorMessage } from '@/utils/errors';
import { RESULTS_PER_PAGE } from '@/constants';

interface MainProps {
  searchTerm: string;
}

function Main({ searchTerm }: MainProps) {
  const [crash, setCrash] = useState(false);
  const dispatch = useAppDispatch();

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

  const { data, isFetching, error } = useGetPokemonsQuery({ search: trimmed, page });
  const items = data?.items ?? [];
  const totalCount = data?.totalCount ?? 0;
  const errorMessage = error ? getQueryErrorMessage(error) : null;

  if (crash) {
    throw new Error('Test error');
  }

  const totalPages = Math.ceil(totalCount / RESULTS_PER_PAGE);
  const isEmpty = !isFetching && items.length === 0;

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

  const handleRefresh = () => {
    dispatch(pokemonApi.util.invalidateTags(['Pokemon']));
  };

  const className = selectedName ? 'main main--split' : 'main';

  return (
    <main className={className} onClick={handleBackgroundClick}>
      <div className="main__list">
        {errorMessage && <p className="main__error">{errorMessage}</p>}

        {isFetching && <Loader />}

        {!isFetching && !errorMessage && isEmpty && (
          <p className="main__placeholder">
            {trimmed ? 'No Pokemon found' : 'No Pokemon available'}
          </p>
        )}

        {!isFetching && items.length > 0 && (
          <>
            <CardList items={items} onSelectCard={handleSelectCard} selectedName={selectedName} />
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}

        <div className="main__controls">
          {!isFetching && (
            <>
              <button onClick={handleRefresh} className="main__refresh">
                Refresh
              </button>
              <button onClick={() => setCrash(true)} className="main__error-btn">
                Throw test error
              </button>
            </>
          )}
        </div>
      </div>

      <Outlet />
    </main>
  );
}

export default Main;
