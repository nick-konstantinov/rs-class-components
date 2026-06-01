import { type MockInstance } from 'vitest';
import type { PokemonDetailResponse, PokemonListResponse } from '@/types/pokemon';

export function makeDetailResponse(
  overrides: Partial<PokemonDetailResponse> = {},
): PokemonDetailResponse {
  return {
    name: 'pikachu',
    height: 4,
    weight: 60,
    types: [{ type: { name: 'electric' } }],
    abilities: [{ ability: { name: 'static' } }, { ability: { name: 'lightning-rod' } }],
    sprites: { front_default: 'https://example.test/pikachu.png' },
    ...overrides,
  };
}

export function makeListResponse(names: string[], count = names.length): PokemonListResponse {
  return {
    count,
    next: null,
    previous: null,
    results: names.map((name) => ({
      name,
      url: `https://pokeapi.co/api/v2/pokemon/${name}`,
    })),
  };
}

export function makeFetchResponse<T>(data: T, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function makeErrorResponse(status: number): Response {
  return new Response(null, { status });
}

export function requestedUrls(fetchSpy: MockInstance<typeof fetch>): string[] {
  return fetchSpy.mock.calls.map(([input]) => (input as Request).url);
}

export function mockPokemonFetch(
  fetchSpy: MockInstance<typeof fetch>,
  routes: Record<string, () => Response>,
): void {
  fetchSpy.mockImplementation((input) => {
    const url = (input as Request).url;
    const route = Object.entries(routes).find(([fragment]) => url.includes(fragment));
    return Promise.resolve(route ? route[1]() : makeErrorResponse(404));
  });
}
