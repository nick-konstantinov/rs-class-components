import { type MockInstance } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './App';
import { SEARCH_TERM_STORAGE_KEY } from './constants';
import {
  makeDetailResponse,
  makeFetchResponse,
  makeListResponse,
  mockPokemonFetch,
  requestedUrls,
} from './test-utils/mockApi';
import { makeStore } from './test-utils/renderWithStore';
import { ThemeProvider } from './context/ThemeProvider';

const renderApp = (initialPath = '/') => {
  const store = makeStore();
  return render(<App />, {
    wrapper: ({ children }) => (
      <Provider store={store}>
        <ThemeProvider>
          <MemoryRouter initialEntries={[initialPath]}>{children}</MemoryRouter>
        </ThemeProvider>
      </Provider>
    ),
  });
};

describe('App', () => {
  let fetchSpy: MockInstance<typeof fetch>;

  beforeEach(() => {
    fetchSpy = vi.spyOn(globalThis, 'fetch');
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  it('reads the saved search term from localStorage and uses it for the initial search', async () => {
    localStorage.setItem(SEARCH_TERM_STORAGE_KEY, JSON.stringify('charizard'));
    mockPokemonFetch(fetchSpy, {
      'pokemon/charizard': () => makeFetchResponse(makeDetailResponse({ name: 'charizard' })),
    });

    renderApp();

    expect(screen.getByRole('textbox')).toHaveValue('charizard');
    expect(await screen.findByRole('heading', { name: 'charizard' })).toBeInTheDocument();
    expect(requestedUrls(fetchSpy)).toContainEqual(expect.stringContaining('/pokemon/charizard'));
  });

  it('falls back to the default list when localStorage is empty', async () => {
    mockPokemonFetch(fetchSpy, {
      'offset=0': () => makeFetchResponse(makeListResponse(['pokemon-1', 'pokemon-2'], 40)),
      'pokemon/pokemon-1': () => makeFetchResponse(makeDetailResponse({ name: 'pokemon-1' })),
      'pokemon/pokemon-2': () => makeFetchResponse(makeDetailResponse({ name: 'pokemon-2' })),
    });

    renderApp();

    expect(screen.getByRole('textbox')).toHaveValue('');
    expect(await screen.findByRole('heading', { name: 'pokemon-1' })).toBeInTheDocument();
    expect(requestedUrls(fetchSpy)).toContainEqual(expect.stringContaining('offset=0'));
  });

  it('persists and triggers a new search when the user submits the form', async () => {
    const user = userEvent.setup();
    mockPokemonFetch(fetchSpy, {
      'offset=0': () => makeFetchResponse(makeListResponse(['pokemon-1', 'pokemon-2'], 40)),
      'pokemon/pokemon-1': () => makeFetchResponse(makeDetailResponse({ name: 'pokemon-1' })),
      'pokemon/pokemon-2': () => makeFetchResponse(makeDetailResponse({ name: 'pokemon-2' })),
      'pokemon/mewtwo': () => makeFetchResponse(makeDetailResponse({ name: 'mewtwo' })),
    });

    renderApp();

    await screen.findByRole('heading', { name: 'pokemon-1' });
    await user.type(screen.getByRole('textbox'), 'mewtwo{Enter}');

    expect(localStorage.getItem(SEARCH_TERM_STORAGE_KEY)).toBe(JSON.stringify('mewtwo'));
    expect(await screen.findByRole('heading', { name: 'mewtwo' })).toBeInTheDocument();
    expect(requestedUrls(fetchSpy)).toContainEqual(expect.stringContaining('/pokemon/mewtwo'));
  });

  it('shows the ErrorBoundary fallback when Main crashes, while keeping Header alive', async () => {
    const user = userEvent.setup();
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockPokemonFetch(fetchSpy, {
      'offset=0': () => makeFetchResponse(makeListResponse(['pokemon-1'], 20)),
      'pokemon/pokemon-1': () => makeFetchResponse(makeDetailResponse({ name: 'pokemon-1' })),
    });

    renderApp();

    await screen.findByRole('heading', { name: 'pokemon-1' });
    await user.click(screen.getByRole('button', { name: 'Throw test error' }));

    expect(screen.getByRole('heading', { name: 'Something went wrong' })).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();

    errorSpy.mockRestore();
  });

  it('renders the About page on the /about route', () => {
    renderApp('/about');

    expect(screen.getByRole('heading', { name: 'About' })).toBeInTheDocument();
  });

  it('renders the NotFound page on an unknown route', () => {
    renderApp('/this-route-does-not-exist');

    expect(screen.getByRole('heading', { name: '404', level: 2 })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back home' })).toBeInTheDocument();
  });
});
