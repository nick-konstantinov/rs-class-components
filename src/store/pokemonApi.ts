import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { PokemonDetailResponse, PokemonItem } from '@/types/pokemon';

const CACHE_TTL = Number(import.meta.env.VITE_CACHE_TTL) || 60;

export interface PokemonPage {
  items: PokemonItem[];
  totalCount: number;
}

export function detailToItem(detail: PokemonDetailResponse): PokemonItem {
  const types = detail.types.map((t) => t.type.name).join(', ');
  const abilities = detail.abilities.map((a) => a.ability.name).join(', ');

  return {
    name: detail.name,
    types,
    abilities,
    height: detail.height,
    weight: detail.weight,
    sprite: detail.sprites.front_default,
  };
}

export const pokemonApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_POKEMON_API_URL }),
  tagTypes: ['Pokemon'],
  keepUnusedDataFor: CACHE_TTL,
  endpoints: () => ({}),
});
