import type { PokemonDetailResponse, PokemonItem, PokemonListResponse } from '../types/pokemon';
import { RESULTS_PER_PAGE } from '../constants';

const BASE_URL = 'https://pokeapi.co/api/v2';

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

export interface PokemonPage {
  items: PokemonItem[];
  totalCount: number;
}

function getErrorMessage(status: number): string {
  if (status === 404) return 'Not found';
  if (status >= 400 && status < 500) return `Request failed (${status})`;
  if (status >= 500) return 'Server is unavailable, please try again later';
  return 'Unknown error';
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new ApiError(response.status, getErrorMessage(response.status));
  }

  return (await response.json()) as T;
}

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

async function fetchPokemonDetail(nameOrId: string): Promise<PokemonItem> {
  const detail = await fetchJson<PokemonDetailResponse>(`${BASE_URL}/pokemon/${nameOrId}`);

  return detailToItem(detail);
}
