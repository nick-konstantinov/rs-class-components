import type { PokemonDetailResponse, PokemonItem, PokemonListResponse } from '@/types/pokemon';
import { RESULTS_PER_PAGE } from '@/constants';
import { ApiError, fetchJson } from '@/services/http';

const BASE_URL = import.meta.env.VITE_POKEMON_API_URL;

export interface Page<T> {
  items: T[];
  totalCount: number;
}

export type PokemonPage = Page<PokemonItem>;

function detailToItem(detail: PokemonDetailResponse): PokemonItem {
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

export async function getPokemonList(page: number): Promise<PokemonPage> {
  const offset = (page - 1) * RESULTS_PER_PAGE;

  const list = await fetchJson<PokemonListResponse>(
    `${BASE_URL}/pokemon?limit=${RESULTS_PER_PAGE}&offset=${offset}`,
  );

  const items = await Promise.all(list.results.map((entry) => fetchPokemonDetail(entry.name)));

  return { items, totalCount: list.count };
}

export async function searchPokemon(term: string): Promise<PokemonPage> {
  const trimmed = term.trim().toLowerCase();

  if (!trimmed) return { items: [], totalCount: 0 };

  try {
    const detail = await fetchJson<PokemonDetailResponse>(`${BASE_URL}/pokemon/${trimmed}`);
    const items = [detailToItem(detail)];

    return { items, totalCount: items.length };
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      return { items: [], totalCount: 0 };
    }
    throw err;
  }
}

export async function fetchPokemonDetail(nameOrId: string): Promise<PokemonItem> {
  const detail = await fetchJson<PokemonDetailResponse>(`${BASE_URL}/pokemon/${nameOrId}`);

  return detailToItem(detail);
}
