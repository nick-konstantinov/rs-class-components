import type { PokemonItem } from '../types/pokemon';

export function makePokemon(overrides: Partial<PokemonItem> = {}): PokemonItem {
  return {
    name: 'pikachu',
    types: 'electric',
    abilities: 'static, lightning-rod',
    height: 4,
    weight: 60,
    sprite: 'https://example.test/pikachu.png',
    ...overrides,
  };
}

export function makePokemonList(
  count: number,
  overrides: Partial<PokemonItem> = {},
): PokemonItem[] {
  return Array.from({ length: count }, (_, i) =>
    makePokemon({ ...overrides, name: `pokemon-${i + 1}` }),
  );
}
