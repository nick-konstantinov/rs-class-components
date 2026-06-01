import { type MockInstance } from 'vitest';
import { pokemonApi } from './pokemonApi';
import { makeStore } from '@/test-utils/renderWithStore';
import {
  makeDetailResponse,
  makeErrorResponse,
  makeFetchResponse,
  makeListResponse,
  mockPokemonFetch,
} from '@/test-utils/mockApi';

describe('pokemonApi.getPokemons', () => {
  let fetchSpy: MockInstance<typeof fetch>;

  beforeEach(() => {
    fetchSpy = vi.spyOn(globalThis, 'fetch');
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  const runGetPokemons = (arg: { search: string; page: number }) => {
    const store = makeStore();
    return store.dispatch(pokemonApi.endpoints.getPokemons.initiate(arg));
  };

  it('maps a successful search to a single item', async () => {
    mockPokemonFetch(fetchSpy, {
      'pokemon/pikachu': () => makeFetchResponse(makeDetailResponse({ name: 'pikachu' })),
    });

    const result = await runGetPokemons({ search: 'pikachu', page: 1 });

    expect(result.data).toMatchObject({ totalCount: 1 });
    expect(result.data?.items[0].name).toBe('pikachu');
  });

  it('returns an empty page when a search 404s', async () => {
    mockPokemonFetch(fetchSpy, {});

    const result = await runGetPokemons({ search: 'missingno', page: 1 });

    expect(result.data).toEqual({ items: [], totalCount: 0 });
  });

  it('returns an error when a search fails with a non-404 status', async () => {
    mockPokemonFetch(fetchSpy, {
      'pokemon/pikachu': () => makeErrorResponse(500),
    });

    const result = await runGetPokemons({ search: 'pikachu', page: 1 });

    expect(result.error).toMatchObject({ status: 500 });
  });

  it('returns an error when the list request fails', async () => {
    mockPokemonFetch(fetchSpy, {
      'offset=0': () => makeErrorResponse(500),
    });

    const result = await runGetPokemons({ search: '', page: 1 });

    expect(result.error).toMatchObject({ status: 500 });
  });

  it('returns an error when a detail request inside the list fails', async () => {
    mockPokemonFetch(fetchSpy, {
      'offset=0': () => makeFetchResponse(makeListResponse(['pokemon-1'], 1)),
    });

    const result = await runGetPokemons({ search: '', page: 1 });

    expect(result.error).toMatchObject({ status: 404 });
  });
});
