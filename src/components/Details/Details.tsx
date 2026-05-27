import { useEffect, useState } from 'react';
import './Details.css';
import Loader from '@/components/Loader/Loader';
import placeholderSprite from '@/assets/images/pokemon-placeholder.svg';
import { fetchPokemonDetail } from '@/api/pokemon';
import type { PokemonItem } from '@/types/pokemon';

interface DetailsProps {
  name: string;
  onClose: () => void;
}

function Details({ name, onClose }: DetailsProps) {
  const [data, setData] = useState<PokemonItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        setError(null);
        setData(null);
        setLoading(true);

        const result = await fetchPokemonDetail(name);
        if (cancelled) return;

        setData(result);
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
  }, [name]);

  return (
    <aside className="details" aria-label="Pokemon details">
      <button
        type="button"
        className="details__close"
        onClick={onClose}
        aria-label="Close details"
      />

      {loading && <Loader />}

      {error && <p className="details__error">{error}</p>}

      {data && (
        <div className="details__content">
          <h2 className="details__title">{data.name}</h2>
          <img src={data.sprite ?? placeholderSprite} alt={data.name} className="details__image" />
          <dl className="details__list">
            <dt>Types</dt>
            <dd>{data.types}</dd>
            <dt>Abilities</dt>
            <dd>{data.abilities}</dd>
            <dt>Height</dt>
            <dd>{data.height}</dd>
            <dt>Weight</dt>
            <dd>{data.weight}</dd>
          </dl>
        </div>
      )}
    </aside>
  );
}

export default Details;
