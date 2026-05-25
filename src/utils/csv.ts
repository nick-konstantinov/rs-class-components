import type { PokemonItem } from '../types/pokemon';

const HEADERS = ['name', 'types', 'abilities', 'height', 'weight', 'sprite'] as const;

function escapeCsvField(value: string): string {
  if (/[",\r\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function itemToRow(item: PokemonItem): string {
  const fields = [
    item.name,
    item.types,
    item.abilities,
    String(item.height),
    String(item.weight),
    item.sprite ?? '',
  ];
  return fields.map(escapeCsvField).join(',');
}

export function itemsToCsv(items: PokemonItem[]): string {
  const header = HEADERS.join(',');
  if (items.length === 0) return header;
  return [header, ...items.map(itemToRow)].join('\r\n');
}

export function downloadCsv(items: PokemonItem[]): void {
  const csv = itemsToCsv(items);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `${items.length}_pokemons.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}
