import { describe, expect, it } from 'vitest';
import { itemsToCsv } from './csv';
import { makePokemon } from '@/test-utils/mockPokemon';

describe('itemsToCsv', () => {
  it('returns only the header for an empty array', () => {
    expect(itemsToCsv([])).toBe('#,Name,Types,Abilities,Height,Weight,Sprite');
  });

  it('joins header and rows with CRLF', () => {
    const item = makePokemon({
      name: 'pikachu',
      types: 'electric',
      abilities: 'static',
      height: 4,
      weight: 60,
      sprite: 'https://example.test/pikachu.png',
    });

    expect(itemsToCsv([item])).toBe(
      '#,Name,Types,Abilities,Height,Weight,Sprite\r\n' +
        '1,pikachu,electric,static,4,60,https://example.test/pikachu.png',
    );
  });

  it('renders a missing sprite as an empty field', () => {
    const item = makePokemon({
      name: 'noimg',
      types: 'unknown',
      abilities: 'none',
      height: 1,
      weight: 1,
      sprite: null,
    });
    expect(itemsToCsv([item])).toContain('noimg,unknown,none,1,1,');
  });

  it('quotes fields with commas and doubles inner quotes', () => {
    const item = makePokemon({ name: 'has,comma', types: 'has"quote', abilities: 'clean' });
    const csv = itemsToCsv([item]);

    expect(csv).toContain('"has,comma"');
    expect(csv).toContain('"has""quote"');
  });

  it('quotes fields containing newlines', () => {
    const item = makePokemon({ name: 'multi\nline' });
    expect(itemsToCsv([item])).toContain('"multi\nline"');
  });
});
