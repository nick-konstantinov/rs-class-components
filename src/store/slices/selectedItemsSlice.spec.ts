import { describe, expect, it } from 'vitest';
import reducer, { toggleSelected, unselectAll } from './selectedItemsSlice';
import { makePokemon } from '../../test-utils/mockPokemon';

describe('selectedItemsSlice', () => {
  it('initial state has empty byName', () => {
    expect(reducer(undefined, unselectAll())).toEqual({ byName: {} });
  });

  it('toggleSelected adds an unselected item', () => {
    const item = makePokemon({ name: 'bulbasaur' });
    const state = reducer(undefined, toggleSelected(item));

    expect(state.byName).toEqual({ bulbasaur: item });
  });

  it('toggleSelected removes an already-selected item', () => {
    const item = makePokemon({ name: 'bulbasaur' });
    const after1st = reducer(undefined, toggleSelected(item));
    const after2nd = reducer(after1st, toggleSelected(item));

    expect(after2nd.byName).toEqual({});
  });

  it('unselectAll clears all selected items', () => {
    const a = makePokemon({ name: 'a' });
    const b = makePokemon({ name: 'b' });

    let state = reducer(undefined, toggleSelected(a));
    state = reducer(state, toggleSelected(b));
    state = reducer(state, unselectAll());

    expect(state.byName).toEqual({});
  });
});
