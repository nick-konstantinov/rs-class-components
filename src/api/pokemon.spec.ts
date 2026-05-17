import { type MockInstance } from 'vitest';
import { ApiError, getPokemonList, searchPokemon } from './pokemon';
import {
  makeDetailResponse,
  makeErrorResponse,
  makeFetchResponse,
  makeListResponse,
} from '../test-utils/mockApi';

describe('api/pokemon', () => {
  let fetchSpy: MockInstance<typeof fetch>;

  beforeEach(() => {
    fetchSpy = vi.spyOn(globalThis, 'fetch');
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  describe('getPokemonList', () => {
    it('fetches the list and maps each entry to a PokemonItem', async () => {
      fetchSpy
        .mockResolvedValueOnce(makeFetchResponse(makeListResponse(['pikachu', 'charmander'])))
        .mockResolvedValueOnce(makeFetchResponse(makeDetailResponse({ name: 'pikachu' })))
        .mockResolvedValueOnce(
          makeFetchResponse(
            makeDetailResponse({
              name: 'charmander',
              types: [{ type: { name: 'fire' } }],
            }),
          ),
        );

      const { items, totalCount } = await getPokemonList(1);

      expect(items).toHaveLength(2);
      expect(items[0].name).toBe('pikachu');
      expect(items[1].name).toBe('charmander');
      expect(items[1].types).toBe('fire');
      expect(totalCount).toBe(2);
    });

    it('uses (page - 1) x 20 as the offset', async () => {
      fetchSpy.mockResolvedValueOnce(makeFetchResponse(makeListResponse([])));

      await getPokemonList(3);

      expect(fetchSpy).toHaveBeenCalledWith(expect.stringContaining('offset=40'));
    });

    it('throws ApiError with 5xx status', async () => {
      fetchSpy.mockResolvedValueOnce(makeErrorResponse(500));

      await expect(getPokemonList(1)).rejects.toThrow(
        'Server is unavailable, please try again later',
      );
    });

    it('throws ApiError with non-404 4xx status', async () => {
      fetchSpy.mockResolvedValueOnce(makeErrorResponse(400));

      await expect(getPokemonList(1)).rejects.toThrow('Request failed (400)');
    });
  });

  describe('searchPokemon', () => {
    it('returns one item on successful fetch', async () => {
      fetchSpy.mockResolvedValueOnce(makeFetchResponse(makeDetailResponse({ name: 'pikachu' })));

      const { items, totalCount } = await searchPokemon('pikachu');

      expect(items).toHaveLength(1);
      expect(items[0].name).toBe('pikachu');
      expect(totalCount).toBe(1);
    });

    it('returns an empty page on 404', async () => {
      fetchSpy.mockResolvedValueOnce(makeErrorResponse(404));

      const { items, totalCount } = await searchPokemon('missingno');

      expect(items).toEqual([]);
      expect(totalCount).toBe(0);
    });

    it('returns an empty page for whitespace term without calling fetch', async () => {
      const { items } = await searchPokemon('   ');

      expect(items).toEqual([]);
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('lowercases and trims the term before fetching', async () => {
      fetchSpy.mockResolvedValueOnce(makeFetchResponse(makeDetailResponse({ name: 'pikachu' })));

      await searchPokemon('  Pikachu  ');

      expect(fetchSpy).toHaveBeenCalledWith(expect.stringContaining('/pokemon/pikachu'));
    });

    it('rethrows non-404 errors', async () => {
      fetchSpy.mockResolvedValueOnce(makeErrorResponse(500));

      await expect(searchPokemon('pikachu')).rejects.toThrow('Server is unavailable');
    });
  });

  describe('ApiError', () => {
    it('exposes status, name and message', () => {
      const err = new ApiError(404, 'Not found');

      expect(err.status).toBe(404);
      expect(err.name).toBe('ApiError');
      expect(err.message).toBe('Not found');
    });
  });
});
