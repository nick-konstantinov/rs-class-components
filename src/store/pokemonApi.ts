import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { PokemonDetailResponse, PokemonItem, PokemonListResponse } from '@/types/pokemon';
import { RESULTS_PER_PAGE } from '@/constants';

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
  endpoints: (builder) => ({
    getPokemonDetail: builder.query<PokemonItem, string>({
      query: (name) => `pokemon/${name}`,
      transformResponse: detailToItem,
      providesTags: ['Pokemon'],
    }),
    getPokemons: builder.query<PokemonPage, { search: string; page: number }>({
      async queryFn({ search, page }, _api, _extra, baseQuery) {
        const trimmed = search.trim().toLowerCase();

        if (trimmed) {
          const result = await baseQuery(`pokemon/${trimmed}`);

          if (result.error) {
            if (result.error.status === 404) {
              return { data: { items: [], totalCount: 0 } };
            }
            return { error: result.error };
          }

          const item = detailToItem(result.data as PokemonDetailResponse);
          return { data: { items: [item], totalCount: 1 } };
        }

        const offset = (page - 1) * RESULTS_PER_PAGE;
        const listResult = await baseQuery(`pokemon?limit=${RESULTS_PER_PAGE}&offset=${offset}`);

        if (listResult.error) return { error: listResult.error };

        const list = listResult.data as PokemonListResponse;
        const detailResults = await Promise.all(
          list.results.map((entry) => baseQuery(`pokemon/${entry.name}`)),
        );

        const failed = detailResults.find((result) => result.error);
        if (failed?.error) return { error: failed.error };

        const items = detailResults.map((result) =>
          detailToItem(result.data as PokemonDetailResponse),
        );
        return { data: { items, totalCount: list.count } };
      },
      providesTags: ['Pokemon'],
    }),
  }),
});

export const { useGetPokemonDetailQuery, useGetPokemonsQuery } = pokemonApi;
