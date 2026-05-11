import { render, screen } from '@testing-library/react';
import CardList from './CardList';
import { makePokemonList } from '../../test-utils/mockPokemon';

describe('CardList', () => {
  it('renders one card per item', () => {
    render(<CardList items={makePokemonList(3)} />);

    expect(screen.getAllByRole('heading')).toHaveLength(3);
    expect(screen.getByRole('heading', { name: 'pokemon-1' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'pokemon-2' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'pokemon-3' })).toBeInTheDocument();
  });

  it('renders no cards when items array is empty', () => {
    render(<CardList items={[]} />);

    expect(screen.queryAllByRole('heading')).toHaveLength(0);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
