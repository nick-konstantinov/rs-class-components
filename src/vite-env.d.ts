/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_POKEMON_API_URL: string;
  readonly VITE_CACHE_TTL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
