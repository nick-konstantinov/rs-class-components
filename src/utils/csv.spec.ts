import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { downloadCsv, itemsToCsv } from './csv';
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

  it('renders missing sprite as an empty field', () => {
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
    const item = makePokemon({
      name: 'has,comma',
      types: 'has"quote',
      abilities: 'clean',
      height: 1,
      weight: 1,
      sprite: 'x',
    });

    const csv = itemsToCsv([item]);

    expect(csv).toContain('"has,comma"');
    expect(csv).toContain('"has""quote"');
  });

  it('quotes fields containing newlines', () => {
    const item = makePokemon({
      name: 'multi\nline',
      types: 'x',
      abilities: 'y',
      height: 1,
      weight: 1,
      sprite: 'z',
    });

    expect(itemsToCsv([item])).toContain('"multi\nline"');
  });
});

describe('downloadCsv', () => {
  let clickSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    URL.createObjectURL = vi.fn(() => 'blob:test-url');
    URL.revokeObjectURL = vi.fn();
    clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  });

  afterEach(() => {
    clickSpy.mockRestore();
  });

  it('creates a Blob URL and revokes it', () => {
    downloadCsv([makePokemon({ name: 'pikachu' })]);

    expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
    expect(URL.createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:test-url');
  });

  it('downloads with a filename including the items count', () => {
    downloadCsv([
      makePokemon({ name: 'a' }),
      makePokemon({ name: 'b' }),
      makePokemon({ name: 'c' }),
    ]);

    expect(clickSpy).toHaveBeenCalledOnce();
    const anchor = clickSpy.mock.contexts[0] as HTMLAnchorElement;
    expect(anchor.download).toBe('3_pokemons.csv');
    expect(anchor.href).toContain('blob:test-url');
  });
});
