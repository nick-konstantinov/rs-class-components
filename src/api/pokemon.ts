import type { PokemonDetailResponse, PokemonItem, PokemonListResponse } from '../types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';
const PAGE_SIZE = 20;

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
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

export async function getPokemonList(page: number): Promise<PokemonItem[]> {
  const offset = page * PAGE_SIZE;

  const list = await fetchJson<PokemonListResponse>(
    `${BASE_URL}/pokemon?limit=${PAGE_SIZE}&offset=${offset}`,
  );

  return Promise.all(list.results.map((entry) => fetchPokemonDetail(entry.name)));
}

export async function searchPokemon(term: string): Promise<PokemonItem[]> {
  const trimmed = term.trim().toLowerCase();

  if (!trimmed) return [];

  try {
    const detail = await fetchJson<PokemonDetailResponse>(`${BASE_URL}/pokemon/${trimmed}`);

    return [detailToItem(detail)];
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      return [];
    }
    throw err;
  }
}

async function fetchPokemonDetail(nameOrId: string): Promise<PokemonItem> {
  const detail = await fetchJson<PokemonDetailResponse>(`${BASE_URL}/pokemon/${nameOrId}`);

  return detailToItem(detail);
}
