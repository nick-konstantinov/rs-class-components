export interface PokemonItem {
  name: string;
  types: string;
  abilities: string;
  height: number;
  weight: number;
  sprite: string | null;
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
  sprites: { front_default: string | null };
}
