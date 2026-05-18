import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Main from './Main';
import DetailsOutletSlot from '../Details/DetailsOutletSlot';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import { fetchPokemonDetail, getPokemonList, searchPokemon } from '../../api/pokemon';
import { makePokemon, makePokemonList } from '../../test-utils/mockPokemon';

vi.mock('../../api/pokemon', () => ({
  getPokemonList: vi.fn(),
  searchPokemon: vi.fn(),
  fetchPokemonDetail: vi.fn(),
}));

const mockedGetPokemonList = vi.mocked(getPokemonList);
const mockedSearchPokemon = vi.mocked(searchPokemon);
const mockedFetchPokemonDetail = vi.mocked(fetchPokemonDetail);

const renderMain = (props: { searchTerm?: string; initialPath?: string } = {}) =>
  render(<Main searchTerm={props.searchTerm ?? ''} />, {
    wrapper: ({ children }) => (
      <MemoryRouter initialEntries={[props.initialPath ?? '/']}>{children}</MemoryRouter>
    ),
  });

const renderMainWithRoutes = (props: { searchTerm?: string; initialPath?: string } = {}) =>
  render(
    <MemoryRouter initialEntries={[props.initialPath ?? '/']}>
      <Routes>
        <Route path="/" element={<Main searchTerm={props.searchTerm ?? ''} />}>
          <Route index element={<DetailsOutletSlot />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );

describe('Main', () => {
  beforeEach(() => {
    mockedGetPokemonList.mockReset();
    mockedSearchPokemon.mockReset();
    mockedFetchPokemonDetail.mockReset();
  });

  it('shows loader on mount and renders the fetched pokemon list', async () => {
    mockedGetPokemonList.mockResolvedValueOnce({
      items: makePokemonList(3),
      totalCount: 60,
    });

    renderMain();

    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: 'pokemon-1' })).toBeInTheDocument();
    expect(screen.getAllByRole('heading')).toHaveLength(3);
    expect(mockedGetPokemonList).toHaveBeenCalledWith(1);
  });

  it('reads page from URL and fetches that page', async () => {
    mockedGetPokemonList.mockResolvedValueOnce({
      items: makePokemonList(3),
      totalCount: 60,
    });

    renderMain({ initialPath: '/?page=3' });

    await screen.findByRole('heading', { name: 'pokemon-1' });

    expect(mockedGetPokemonList).toHaveBeenCalledWith(3);
  });

  it('searches when searchTerm is provided on mount', async () => {
    mockedSearchPokemon.mockResolvedValueOnce({
      items: [makePokemon({ name: 'charizard' })],
      totalCount: 1,
    });

    renderMain({ searchTerm: 'charizard' });

    expect(await screen.findByRole('heading', { name: 'charizard' })).toBeInTheDocument();
    expect(mockedSearchPokemon).toHaveBeenCalledWith('charizard');
    expect(mockedGetPokemonList).not.toHaveBeenCalled();
  });

  it('shows "No Pokemon available" when list is empty without search term', async () => {
    mockedGetPokemonList.mockResolvedValueOnce({ items: [], totalCount: 0 });

    renderMain();

    expect(await screen.findByText('No Pokemon available')).toBeInTheDocument();
  });

  it('shows "No Pokemon found" when search yields no results', async () => {
    mockedSearchPokemon.mockResolvedValueOnce({ items: [], totalCount: 0 });

    renderMain({ searchTerm: 'missingno' });

    expect(await screen.findByText('No Pokemon found')).toBeInTheDocument();
  });

  it('shows the API error message', async () => {
    mockedGetPokemonList.mockRejectedValueOnce(new Error('Server is unavailable'));

    renderMain();

    expect(await screen.findByText('Server is unavailable')).toBeInTheDocument();
  });

  it('renders Pagination once items are loaded', async () => {
    mockedGetPokemonList.mockResolvedValueOnce({
      items: makePokemonList(3),
      totalCount: 60,
    });

    renderMain();

    await screen.findByRole('heading', { name: 'pokemon-1' });

    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
  });

  it('refetches and reflects the URL when a page button is clicked', async () => {
    const user = userEvent.setup();
    mockedGetPokemonList
      .mockResolvedValueOnce({ items: makePokemonList(3), totalCount: 60 })
      .mockResolvedValueOnce({
        items: [makePokemon({ name: 'page2-1' })],
        totalCount: 60,
      });

    renderMain();

    await screen.findByRole('heading', { name: 'pokemon-1' });
    await user.click(screen.getByRole('button', { name: '2' }));

    expect(await screen.findByRole('heading', { name: 'page2-1' })).toBeInTheDocument();
    expect(mockedGetPokemonList).toHaveBeenNthCalledWith(2, 2);
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

    const { rerender } = renderMain();

    await screen.findByRole('heading', { name: 'pokemon-1' });

    rerender(<Main searchTerm="mewtwo" />);

    expect(await screen.findByRole('heading', { name: 'mewtwo' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'pokemon-1' })).not.toBeInTheDocument();
    expect(mockedSearchPokemon).toHaveBeenCalledWith('mewtwo');
  });

  it('opens the details panel when a card is clicked', async () => {
    const user = userEvent.setup();
    mockedGetPokemonList.mockResolvedValueOnce({
      items: makePokemonList(2),
      totalCount: 40,
    });
    mockedFetchPokemonDetail.mockResolvedValueOnce(makePokemon({ name: 'pokemon-1' }));

    renderMainWithRoutes();

    await screen.findByRole('heading', { level: 3, name: 'pokemon-1' });
    await user.click(screen.getByRole('button', { name: /pokemon-1/i }));

    expect(await screen.findByRole('heading', { level: 2, name: 'pokemon-1' })).toBeInTheDocument();
    expect(mockedFetchPokemonDetail).toHaveBeenCalledWith('pokemon-1');
  });

  it('closes the details panel when the main background is clicked', async () => {
    const user = userEvent.setup();
    mockedGetPokemonList.mockResolvedValueOnce({
      items: makePokemonList(2),
      totalCount: 40,
    });
    mockedFetchPokemonDetail.mockResolvedValueOnce(makePokemon({ name: 'pokemon-1' }));

    renderMainWithRoutes({ initialPath: '/?page=1&details=pokemon-1' });

    expect(await screen.findByRole('heading', { level: 2, name: 'pokemon-1' })).toBeInTheDocument();

    await user.click(screen.getByRole('main'));

    expect(screen.queryByRole('heading', { level: 2, name: 'pokemon-1' })).not.toBeInTheDocument();
  });

  it('closes the details panel when the close button is clicked', async () => {
    const user = userEvent.setup();
    mockedGetPokemonList.mockResolvedValueOnce({
      items: makePokemonList(2),
      totalCount: 40,
    });
    mockedFetchPokemonDetail.mockResolvedValueOnce(makePokemon({ name: 'pokemon-1' }));

    renderMainWithRoutes({ initialPath: '/?page=1&details=pokemon-1' });

    expect(await screen.findByRole('heading', { level: 2, name: 'pokemon-1' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Close details' }));

    expect(screen.queryByRole('heading', { level: 2, name: 'pokemon-1' })).not.toBeInTheDocument();
  });

  it('triggers an error caught by ErrorBoundary when "Throw test error" is clicked', async () => {
    const user = userEvent.setup();
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockedGetPokemonList.mockResolvedValueOnce({
      items: makePokemonList(1),
      totalCount: 20,
    });

    render(
      <MemoryRouter>
        <ErrorBoundary>
          <Main searchTerm="" />
        </ErrorBoundary>
      </MemoryRouter>,
    );

    await screen.findByRole('heading', { name: 'pokemon-1' });
    await user.click(screen.getByRole('button', { name: 'Throw test error' }));

    expect(screen.getByRole('heading', { name: 'Something went wrong' })).toBeInTheDocument();
    errorSpy.mockRestore();
  });
});
