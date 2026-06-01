import { type MockInstance } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import Main from './Main';
import DetailsOutletSlot from '@/components/Details/DetailsOutletSlot';
import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary';
import {
  makeDetailResponse,
  makeErrorResponse,
  makeFetchResponse,
  makeListResponse,
  mockPokemonFetch,
  requestedUrls,
} from '@/test-utils/mockApi';
import { makeStore } from '@/test-utils/renderWithStore';
import { ROUTES } from '@/routes';

const renderMain = (props: { searchTerm?: string; initialPath?: string } = {}) => {
  const store = makeStore();
  return render(<Main searchTerm={props.searchTerm ?? ''} />, {
    wrapper: ({ children }) => (
      <Provider store={store}>
        <MemoryRouter initialEntries={[props.initialPath ?? '/']}>{children}</MemoryRouter>
      </Provider>
    ),
  });
};

const renderMainWithRoutes = (props: { searchTerm?: string; initialPath?: string } = {}) =>
  render(
    <Provider store={makeStore()}>
      <MemoryRouter initialEntries={[props.initialPath ?? ROUTES.home]}>
        <Routes>
          <Route path={ROUTES.home} element={<Main searchTerm={props.searchTerm ?? ''} />}>
            <Route index element={<DetailsOutletSlot />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </Provider>,
  );

describe('Main', () => {
  let fetchSpy: MockInstance<typeof fetch>;

  beforeEach(() => {
    fetchSpy = vi.spyOn(globalThis, 'fetch');
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  it('shows loader on mount and renders the fetched pokemon list', async () => {
    mockPokemonFetch(fetchSpy, {
      'offset=0': () => makeFetchResponse(makeListResponse(['pokemon-1', 'pokemon-2'], 60)),
      'pokemon/pokemon-1': () => makeFetchResponse(makeDetailResponse({ name: 'pokemon-1' })),
      'pokemon/pokemon-2': () => makeFetchResponse(makeDetailResponse({ name: 'pokemon-2' })),
    });

    renderMain();

    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: 'pokemon-1' })).toBeInTheDocument();
    expect(screen.getAllByRole('heading')).toHaveLength(2);
    expect(requestedUrls(fetchSpy)).toContainEqual(expect.stringContaining('offset=0'));
  });

  it('reads page from URL and fetches that page', async () => {
    mockPokemonFetch(fetchSpy, {
      'offset=40': () => makeFetchResponse(makeListResponse(['pokemon-1', 'pokemon-2'], 60)),
      'pokemon/pokemon-1': () => makeFetchResponse(makeDetailResponse({ name: 'pokemon-1' })),
      'pokemon/pokemon-2': () => makeFetchResponse(makeDetailResponse({ name: 'pokemon-2' })),
    });

    renderMain({ initialPath: '/?page=3' });

    await screen.findByRole('heading', { name: 'pokemon-1' });

    expect(requestedUrls(fetchSpy)).toContainEqual(expect.stringContaining('offset=40'));
  });

  it('searches when searchTerm is provided on mount', async () => {
    mockPokemonFetch(fetchSpy, {
      'pokemon/charizard': () => makeFetchResponse(makeDetailResponse({ name: 'charizard' })),
    });

    renderMain({ searchTerm: 'charizard' });

    expect(await screen.findByRole('heading', { name: 'charizard' })).toBeInTheDocument();
    const urls = requestedUrls(fetchSpy);
    expect(urls).toContainEqual(expect.stringContaining('/pokemon/charizard'));
    expect(urls).not.toContainEqual(expect.stringContaining('limit='));
  });

  it('shows "No Pokemon available" when list is empty without search term', async () => {
    mockPokemonFetch(fetchSpy, {
      'offset=0': () => makeFetchResponse(makeListResponse([], 0)),
    });

    renderMain();

    expect(await screen.findByText('No Pokemon available')).toBeInTheDocument();
  });

  it('shows "No Pokemon found" when search yields no results', async () => {
    mockPokemonFetch(fetchSpy, {});

    renderMain({ searchTerm: 'missingno' });

    expect(await screen.findByText('No Pokemon found')).toBeInTheDocument();
  });

  it('shows the API error message', async () => {
    mockPokemonFetch(fetchSpy, {
      'offset=0': () => makeErrorResponse(500),
    });

    renderMain();

    expect(
      await screen.findByText('Server is unavailable, please try again later'),
    ).toBeInTheDocument();
  });

  it('renders Pagination once items are loaded', async () => {
    mockPokemonFetch(fetchSpy, {
      'offset=0': () => makeFetchResponse(makeListResponse(['pokemon-1', 'pokemon-2'], 60)),
      'pokemon/pokemon-1': () => makeFetchResponse(makeDetailResponse({ name: 'pokemon-1' })),
      'pokemon/pokemon-2': () => makeFetchResponse(makeDetailResponse({ name: 'pokemon-2' })),
    });

    renderMain();

    await screen.findByRole('heading', { name: 'pokemon-1' });

    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
  });

  it('refetches and reflects the URL when a page button is clicked', async () => {
    const user = userEvent.setup();
    mockPokemonFetch(fetchSpy, {
      'offset=0': () => makeFetchResponse(makeListResponse(['pokemon-1', 'pokemon-2'], 60)),
      'pokemon/pokemon-1': () => makeFetchResponse(makeDetailResponse({ name: 'pokemon-1' })),
      'pokemon/pokemon-2': () => makeFetchResponse(makeDetailResponse({ name: 'pokemon-2' })),
      'offset=20': () => makeFetchResponse(makeListResponse(['page2-1'], 60)),
      'pokemon/page2-1': () => makeFetchResponse(makeDetailResponse({ name: 'page2-1' })),
    });

    renderMain();

    await screen.findByRole('heading', { name: 'pokemon-1' });
    await user.click(screen.getByRole('button', { name: '2' }));

    expect(await screen.findByRole('heading', { name: 'page2-1' })).toBeInTheDocument();
    expect(requestedUrls(fetchSpy)).toContainEqual(expect.stringContaining('offset=20'));
  });

  it('refetches when searchTerm prop changes', async () => {
    mockPokemonFetch(fetchSpy, {
      'offset=0': () => makeFetchResponse(makeListResponse(['pokemon-1', 'pokemon-2'], 40)),
      'pokemon/pokemon-1': () => makeFetchResponse(makeDetailResponse({ name: 'pokemon-1' })),
      'pokemon/pokemon-2': () => makeFetchResponse(makeDetailResponse({ name: 'pokemon-2' })),
      'pokemon/mewtwo': () => makeFetchResponse(makeDetailResponse({ name: 'mewtwo' })),
    });

    const { rerender } = renderMain();

    await screen.findByRole('heading', { name: 'pokemon-1' });

    rerender(<Main searchTerm="mewtwo" />);

    expect(await screen.findByRole('heading', { name: 'mewtwo' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'pokemon-1' })).not.toBeInTheDocument();
    expect(requestedUrls(fetchSpy)).toContainEqual(expect.stringContaining('/pokemon/mewtwo'));
  });

  it('opens the details panel when a card is clicked', async () => {
    const user = userEvent.setup();
    mockPokemonFetch(fetchSpy, {
      'offset=0': () => makeFetchResponse(makeListResponse(['pokemon-1', 'pokemon-2'], 40)),
      'pokemon/pokemon-1': () => makeFetchResponse(makeDetailResponse({ name: 'pokemon-1' })),
      'pokemon/pokemon-2': () => makeFetchResponse(makeDetailResponse({ name: 'pokemon-2' })),
    });

    renderMainWithRoutes();

    await screen.findByRole('heading', { level: 3, name: 'pokemon-1' });
    await user.click(screen.getByRole('button', { name: /pokemon-1/i }));

    expect(await screen.findByRole('heading', { level: 2, name: 'pokemon-1' })).toBeInTheDocument();
    expect(requestedUrls(fetchSpy)).toContainEqual(expect.stringContaining('/pokemon/pokemon-1'));
  });

  it('closes the details panel when the main background is clicked', async () => {
    const user = userEvent.setup();
    mockPokemonFetch(fetchSpy, {
      'offset=0': () => makeFetchResponse(makeListResponse(['pokemon-1', 'pokemon-2'], 40)),
      'pokemon/pokemon-1': () => makeFetchResponse(makeDetailResponse({ name: 'pokemon-1' })),
      'pokemon/pokemon-2': () => makeFetchResponse(makeDetailResponse({ name: 'pokemon-2' })),
    });

    renderMainWithRoutes({ initialPath: '/?page=1&details=pokemon-1' });

    expect(await screen.findByRole('heading', { level: 2, name: 'pokemon-1' })).toBeInTheDocument();

    await user.click(screen.getByRole('main'));

    expect(screen.queryByRole('heading', { level: 2, name: 'pokemon-1' })).not.toBeInTheDocument();
  });

  it('closes the details panel when the close button is clicked', async () => {
    const user = userEvent.setup();
    mockPokemonFetch(fetchSpy, {
      'offset=0': () => makeFetchResponse(makeListResponse(['pokemon-1', 'pokemon-2'], 40)),
      'pokemon/pokemon-1': () => makeFetchResponse(makeDetailResponse({ name: 'pokemon-1' })),
      'pokemon/pokemon-2': () => makeFetchResponse(makeDetailResponse({ name: 'pokemon-2' })),
    });

    renderMainWithRoutes({ initialPath: '/?page=1&details=pokemon-1' });

    expect(await screen.findByRole('heading', { level: 2, name: 'pokemon-1' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Close details' }));

    expect(screen.queryByRole('heading', { level: 2, name: 'pokemon-1' })).not.toBeInTheDocument();
  });

  it('triggers an error caught by ErrorBoundary when "Throw test error" is clicked', async () => {
    const user = userEvent.setup();
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockPokemonFetch(fetchSpy, {
      'offset=0': () => makeFetchResponse(makeListResponse(['pokemon-1'], 20)),
      'pokemon/pokemon-1': () => makeFetchResponse(makeDetailResponse({ name: 'pokemon-1' })),
    });

    render(
      <Provider store={makeStore()}>
        <MemoryRouter>
          <ErrorBoundary>
            <Main searchTerm="" />
          </ErrorBoundary>
        </MemoryRouter>
      </Provider>,
    );

    await screen.findByRole('heading', { name: 'pokemon-1' });
    await user.click(screen.getByRole('button', { name: 'Throw test error' }));

    expect(screen.getByRole('heading', { name: 'Something went wrong' })).toBeInTheDocument();
    errorSpy.mockRestore();
  });

  it('refetches the current page when Refresh is clicked', async () => {
    const user = userEvent.setup();
    mockPokemonFetch(fetchSpy, {
      'offset=0': () => makeFetchResponse(makeListResponse(['pokemon-1', 'pokemon-2'], 60)),
      'pokemon/pokemon-1': () => makeFetchResponse(makeDetailResponse({ name: 'pokemon-1' })),
      'pokemon/pokemon-2': () => makeFetchResponse(makeDetailResponse({ name: 'pokemon-2' })),
    });

    renderMain();

    await screen.findByRole('heading', { name: 'pokemon-1' });
    const callsBefore = fetchSpy.mock.calls.length;

    await user.click(screen.getByRole('button', { name: 'Refresh' }));

    await waitFor(() => {
      expect(fetchSpy.mock.calls.length).toBeGreaterThan(callsBefore);
    });
  });
});
