import { afterEach, describe, expect, it, vi } from 'vitest';
import { getPokemonDetail, getPokemonPage } from './pokemon';
import type { PokemonDetailResponse, PokemonListResponse } from '@/types/pokemon';

function jsonResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response;
}

function detail(name: string): PokemonDetailResponse {
  return {
    name,
    height: 7,
    weight: 69,
    types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
    abilities: [{ ability: { name: 'overgrow' } }],
    sprites: { front_default: `https://img/${name}.png` },
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('getPokemonDetail', () => {
  it('maps the API detail response to a flat item', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(detail('pikachu'))));

    const item = await getPokemonDetail('Pikachu');

    expect(item).toEqual({
      name: 'pikachu',
      types: 'grass, poison',
      abilities: 'overgrow',
      height: 7,
      weight: 69,
      sprite: 'https://img/pikachu.png',
    });
  });

  it('returns null when the pokemon does not exist (404)', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(null, 404)));

    expect(await getPokemonDetail('missing')).toBeNull();
  });
});

describe('getPokemonPage', () => {
  it('returns a page of items for an empty search', async () => {
    const list: PokemonListResponse = {
      count: 100,
      next: null,
      previous: null,
      results: [
        { name: 'bulbasaur', url: '' },
        { name: 'ivysaur', url: '' },
      ],
    };
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse(list))
      .mockResolvedValueOnce(jsonResponse(detail('bulbasaur')))
      .mockResolvedValueOnce(jsonResponse(detail('ivysaur')));
    vi.stubGlobal('fetch', fetchMock);

    const page = await getPokemonPage({ search: '', page: 1 });

    expect(page.totalCount).toBe(100);
    expect(page.items.map((item) => item.name)).toEqual(['bulbasaur', 'ivysaur']);
  });

  it('returns a single item for a search hit', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(detail('pikachu'))));

    const page = await getPokemonPage({ search: 'Pikachu', page: 1 });

    expect(page).toEqual({
      items: [expect.objectContaining({ name: 'pikachu' })],
      totalCount: 1,
    });
  });

  it('returns an empty page for a search miss (404)', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(null, 404)));

    const page = await getPokemonPage({ search: 'zzz', page: 1 });

    expect(page).toEqual({ items: [], totalCount: 0 });
  });

  it('throws on a server error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(null, 500)));

    await expect(getPokemonPage({ search: '', page: 1 })).rejects.toThrow();
  });
});
