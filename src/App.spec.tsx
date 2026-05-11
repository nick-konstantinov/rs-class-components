import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { SEARCH_TERM_STORAGE_KEY } from './constants';
import { getPokemonList, searchPokemon } from './api/pokemon';
import { makePokemon, makePokemonList } from './test-utils/mockPokemon';

vi.mock('./api/pokemon', () => ({
  getPokemonList: vi.fn(),
  searchPokemon: vi.fn(),
}));

const mockedGetPokemonList = vi.mocked(getPokemonList);
const mockedSearchPokemon = vi.mocked(searchPokemon);

describe('App', () => {
  beforeEach(() => {
    mockedGetPokemonList.mockReset();
    mockedSearchPokemon.mockReset();
  });

  it('reads the saved search term from localStorage and uses it for the initial search', async () => {
    localStorage.setItem(SEARCH_TERM_STORAGE_KEY, 'charizard');
    mockedSearchPokemon.mockResolvedValueOnce([makePokemon({ name: 'charizard' })]);

    render(<App />);

    expect(screen.getByRole('textbox')).toHaveValue('charizard');
    expect(await screen.findByRole('heading', { name: 'charizard' })).toBeInTheDocument();
    expect(mockedSearchPokemon).toHaveBeenCalledWith('charizard');
  });

  it('falls back to the default list when localStorage is empty', async () => {
    mockedGetPokemonList.mockResolvedValueOnce(makePokemonList(2));

    render(<App />);

    expect(screen.getByRole('textbox')).toHaveValue('');
    expect(await screen.findByRole('heading', { name: 'pokemon-1' })).toBeInTheDocument();
    expect(mockedGetPokemonList).toHaveBeenCalledWith(0);
  });

  it('persists and triggers a new search when the user submits the form', async () => {
    const user = userEvent.setup();

    mockedGetPokemonList.mockResolvedValueOnce(makePokemonList(2));
    mockedSearchPokemon.mockResolvedValueOnce([makePokemon({ name: 'mewtwo' })]);

    render(<App />);

    await screen.findByRole('heading', { name: 'pokemon-1' });
    await user.type(screen.getByRole('textbox'), 'mewtwo{Enter}');

    expect(localStorage.getItem(SEARCH_TERM_STORAGE_KEY)).toBe('mewtwo');
    expect(await screen.findByRole('heading', { name: 'mewtwo' })).toBeInTheDocument();
    expect(mockedSearchPokemon).toHaveBeenCalledWith('mewtwo');
  });

  it('shows the ErrorBoundary fallback when Main crashes, while keeping Header alive', async () => {
    const user = userEvent.setup();
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockedGetPokemonList.mockResolvedValueOnce(makePokemonList(1));

    render(<App />);

    await screen.findByRole('heading', { name: 'pokemon-1' });
    await user.click(screen.getByRole('button', { name: 'Throw test error' }));

    expect(screen.getByRole('heading', { name: 'Something went wrong' })).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();

    errorSpy.mockRestore();
  });
});
