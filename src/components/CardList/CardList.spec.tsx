import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CardList from './CardList';
import { makePokemonList } from '../../test-utils/mockPokemon';
import { renderWithStore } from '../../test-utils/renderWithStore';

describe('CardList', () => {
  it('renders one card per item', () => {
    renderWithStore(<CardList items={makePokemonList(3)} />);

    expect(screen.getAllByRole('heading')).toHaveLength(3);
    expect(screen.getByRole('heading', { name: 'pokemon-1' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'pokemon-2' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'pokemon-3' })).toBeInTheDocument();
  });

  it('renders no cards when items array is empty', () => {
    renderWithStore(<CardList items={[]} />);

    expect(screen.queryAllByRole('heading')).toHaveLength(0);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('marks the matching card as current when selectedName is set', () => {
    renderWithStore(<CardList items={makePokemonList(3)} selectedName="pokemon-2" />);

    const cards = screen.getAllByRole('button');
    expect(cards[0]).not.toHaveAttribute('aria-current');
    expect(cards[1]).toHaveAttribute('aria-current', 'true');
    expect(cards[2]).not.toHaveAttribute('aria-current');
  });

  it('forwards onSelectCard to each Card', async () => {
    const user = userEvent.setup();
    const onSelectCard = vi.fn();

    renderWithStore(<CardList items={makePokemonList(2)} onSelectCard={onSelectCard} />);

    await user.click(screen.getAllByRole('button')[0]);

    expect(onSelectCard).toHaveBeenCalledWith('pokemon-1');
  });
});
