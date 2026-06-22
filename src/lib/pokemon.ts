import type { PokemonDetailResponse, PokemonItem, PokemonListResponse } from '@/types/pokemon';
import { RESULTS_PER_PAGE } from '@/constants';

export interface PokemonPage {
  items: PokemonItem[];
  totalCount: number;
}

const DEFAULT_API_URL = 'https://pokeapi.co/api/v2';
const DEFAULT_REVALIDATE = 60;

function apiUrl(path: string): string {
  const base = process.env.POKEMON_API_URL ?? DEFAULT_API_URL;
  return `${base.replace(/\/$/, '')}/${path}`;
}

function revalidate(): number {
  return Number(process.env.REVALIDATE) || DEFAULT_REVALIDATE;
}

async function fetchJson<T>(path: string): Promise<T | null> {
  const response = await fetch(apiUrl(path), { next: { revalidate: revalidate() } });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`PokeAPI request failed (${response.status}): ${path}`);
  }

  return (await response.json()) as T;
}

export function detailToItem(detail: PokemonDetailResponse): PokemonItem {
  return {
    name: detail.name,
    types: detail.types.map((t) => t.type.name).join(', '),
    abilities: detail.abilities.map((a) => a.ability.name).join(', '),
    height: detail.height,
    weight: detail.weight,
    sprite: detail.sprites.front_default,
  };
}

export async function getPokemonDetail(name: string): Promise<PokemonItem | null> {
  const detail = await fetchJson<PokemonDetailResponse>(`pokemon/${name.trim().toLowerCase()}`);
  return detail ? detailToItem(detail) : null;
}

export async function getPokemonPage({
  search,
  page,
}: {
  search: string;
  page: number;
}): Promise<PokemonPage> {
  const trimmed = search.trim().toLowerCase();

  if (trimmed) {
    const item = await getPokemonDetail(trimmed);
    return item ? { items: [item], totalCount: 1 } : { items: [], totalCount: 0 };
  }

  const offset = (page - 1) * RESULTS_PER_PAGE;
  const list = await fetchJson<PokemonListResponse>(
    `pokemon?limit=${RESULTS_PER_PAGE}&offset=${offset}`,
  );

  if (!list) {
    return { items: [], totalCount: 0 };
  }

  const details = await Promise.all(list.results.map((entry) => getPokemonDetail(entry.name)));

  return {
    items: details.filter((item): item is PokemonItem => item !== null),
    totalCount: list.count,
  };
}
