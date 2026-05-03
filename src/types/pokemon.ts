export interface PokemonItem {
  name: string;
  description: string;
}

export interface PokemonListEntry {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListEntry[];
}

export interface PokemonDetailResponse {
  name: string;
  height: number;
  weight: number;
  types: { type: { name: string } }[];
  abilities: { ability: { name: string } }[];
}
