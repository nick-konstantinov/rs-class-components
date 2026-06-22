'use server';

import { redirect } from '@/i18n/routing';
import type { Locale } from '@/i18n/routing';
import { itemsToCsv } from '@/lib/csv';
import type { PokemonItem } from '@/types/pokemon';

export async function searchAction(locale: Locale, formData: FormData) {
  const raw = formData.get('q');
  const q = typeof raw === 'string' ? raw.trim() : '';

  const query: Record<string, string | number> = { page: 1 };
  if (q) {
    query.q = q;
  }

  redirect({ href: { pathname: '/', query }, locale });
}

export interface CsvState {
  base64: string;
  filename: string;
}

export async function generateCsvAction(_prev: CsvState, formData: FormData): Promise<CsvState> {
  const raw = formData.get('items');
  if (typeof raw !== 'string') {
    return { base64: '', filename: '' };
  }

  let items: PokemonItem[];
  try {
    const parsed: unknown = JSON.parse(raw);
    items = Array.isArray(parsed) ? (parsed as PokemonItem[]) : [];
  } catch {
    return { base64: '', filename: '' };
  }

  const csv = itemsToCsv(items);
  const base64 = Buffer.from(csv, 'utf-8').toString('base64');

  return { base64, filename: `${items.length}_pokemons.csv` };
}
