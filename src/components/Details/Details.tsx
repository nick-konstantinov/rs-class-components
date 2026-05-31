import './Details.css';
import Loader from '@/components/Loader/Loader';
import placeholderSprite from '@/assets/images/pokemon-placeholder.svg';
import { useGetPokemonDetailQuery } from '@/store/pokemonApi';
import { getQueryErrorMessage } from '@/utils/errors';

interface DetailsProps {
  name: string;
  onClose: () => void;
}

function Details({ name, onClose }: DetailsProps) {
  const { data, isFetching, error } = useGetPokemonDetailQuery(name);
  const errorMessage = error ? getQueryErrorMessage(error) : null;

  return (
    <aside className="details" aria-label="Pokemon details">
      <button
        type="button"
        className="details__close"
        onClick={onClose}
        aria-label="Close details"
      />

      {isFetching && <Loader />}

      {errorMessage && <p className="details__error">{errorMessage}</p>}

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
