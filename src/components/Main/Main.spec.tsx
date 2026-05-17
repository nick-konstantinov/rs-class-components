import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Main from './Main';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import { getPokemonList, searchPokemon } from '../../api/pokemon';
import { makePokemon, makePokemonList } from '../../test-utils/mockPokemon';

vi.mock('../../api/pokemon', () => ({
  getPokemonList: vi.fn(),
  searchPokemon: vi.fn(),
}));

const mockedGetPokemonList = vi.mocked(getPokemonList);
const mockedSearchPokemon = vi.mocked(searchPokemon);

describe('Main', () => {
  beforeEach(() => {
    mockedGetPokemonList.mockReset();
    mockedSearchPokemon.mockReset();
  });

  it('shows loader on mount and renders the fetched pokemon list', async () => {
    mockedGetPokemonList.mockResolvedValueOnce({
      items: makePokemonList(3),
      totalCount: 60,
    });

    render(<Main searchTerm="" />);

    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: 'pokemon-1' })).toBeInTheDocument();
    expect(screen.getAllByRole('heading')).toHaveLength(3);
    expect(mockedGetPokemonList).toHaveBeenCalledWith(1);
  });

  it('searches when searchTerm is provided on mount', async () => {
    mockedSearchPokemon.mockResolvedValueOnce({
      items: [makePokemon({ name: 'charizard' })],
      totalCount: 1,
    });

    render(<Main searchTerm="charizard" />);

    expect(await screen.findByRole('heading', { name: 'charizard' })).toBeInTheDocument();
    expect(mockedSearchPokemon).toHaveBeenCalledWith('charizard');
    expect(mockedGetPokemonList).not.toHaveBeenCalled();
  });

  it('shows "No Pokemon available" when list is empty without search term', async () => {
    mockedGetPokemonList.mockResolvedValueOnce({ items: [], totalCount: 0 });

    render(<Main searchTerm="" />);

    expect(await screen.findByText('No Pokemon available')).toBeInTheDocument();
  });

  it('shows "No Pokemon found" when search yields no results', async () => {
    mockedSearchPokemon.mockResolvedValueOnce({ items: [], totalCount: 0 });

    render(<Main searchTerm="missingno" />);

    expect(await screen.findByText('No Pokemon found')).toBeInTheDocument();
  });

  it('shows the API error message', async () => {
    mockedGetPokemonList.mockRejectedValueOnce(new Error('Server is unavailable'));

    render(<Main searchTerm="" />);

    expect(await screen.findByText('Server is unavailable')).toBeInTheDocument();
  });

  it('appends the next page when "Load more" is clicked', async () => {
    const user = userEvent.setup();
    mockedGetPokemonList
      .mockResolvedValueOnce({ items: makePokemonList(3), totalCount: 60 })
      .mockResolvedValueOnce({
        items: [makePokemon({ name: 'page2-1' }), makePokemon({ name: 'page2-2' })],
        totalCount: 60,
      });

    render(<Main searchTerm="" />);

    await screen.findByRole('heading', { name: 'pokemon-1' });
    await user.click(screen.getByRole('button', { name: 'Load more' }));

    expect(await screen.findByRole('heading', { name: 'page2-1' })).toBeInTheDocument();
    expect(screen.getAllByRole('heading')).toHaveLength(5);
    expect(mockedGetPokemonList).toHaveBeenNthCalledWith(2, 2);
  });

  it('does not show "Load more" when there is a search term', async () => {
    mockedSearchPokemon.mockResolvedValueOnce({
      items: [makePokemon()],
      totalCount: 1,
    });

    render(<Main searchTerm="pikachu" />);

    await screen.findByRole('heading', { name: 'pikachu' });

    expect(screen.queryByRole('button', { name: 'Load more' })).not.toBeInTheDocument();
  });

  it('refetches when searchTerm prop changes', async () => {
    mockedGetPokemonList.mockResolvedValueOnce({
      items: makePokemonList(2),
      totalCount: 40,
    });
    mockedSearchPokemon.mockResolvedValueOnce({
      items: [makePokemon({ name: 'mewtwo' })],
      totalCount: 1,
    });

    const { rerender } = render(<Main searchTerm="" />);

    await screen.findByRole('heading', { name: 'pokemon-1' });

    rerender(<Main searchTerm="mewtwo" />);

    expect(await screen.findByRole('heading', { name: 'mewtwo' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'pokemon-1' })).not.toBeInTheDocument();
    expect(mockedSearchPokemon).toHaveBeenCalledWith('mewtwo');
  });

  it('triggers an error caught by ErrorBoundary when "Throw test error" is clicked', async () => {
    const user = userEvent.setup();
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockedGetPokemonList.mockResolvedValueOnce({
      items: makePokemonList(1),
      totalCount: 20,
    });

    render(
      <ErrorBoundary>
        <Main searchTerm="" />
      </ErrorBoundary>,
    );

    await screen.findByRole('heading', { name: 'pokemon-1' });
    await user.click(screen.getByRole('button', { name: 'Throw test error' }));

    expect(screen.getByRole('heading', { name: 'Something went wrong' })).toBeInTheDocument();
    errorSpy.mockRestore();
  });
});
