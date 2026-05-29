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

export function makeListResponse(names: string[]): PokemonListResponse {
  return {
    count: names.length,
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
