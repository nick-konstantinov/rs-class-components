import { createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { PokemonItem } from '../../types/pokemon';
import type { RootState } from '../index';

interface SelectedItemsState {
  byName: Record<string, PokemonItem>;
}

const initialState: SelectedItemsState = {
  byName: {},
};

const selectedItemsSlice = createSlice({
  name: 'selectedItems',
  initialState,
  reducers: {
    toggleSelected(state, action: PayloadAction<PokemonItem>) {
      const item = action.payload;
      if (state.byName[item.name]) {
        delete state.byName[item.name];
      } else {
        state.byName[item.name] = item;
      }
    },
    unselectAll(state) {
      state.byName = {};
    },
  },
});

export const { toggleSelected, unselectAll } = selectedItemsSlice.actions;
export default selectedItemsSlice.reducer;

export const selectSelectedMap = (state: RootState) => state.selectedItems.byName;

export const selectSelectedList = createSelector([selectSelectedMap], (byName) =>
  Object.values(byName),
);

export const selectSelectedCount = (state: RootState) =>
  Object.keys(state.selectedItems.byName).length;

export const selectIsSelected = (name: string) => (state: RootState) =>
  Boolean(state.selectedItems.byName[name]);
