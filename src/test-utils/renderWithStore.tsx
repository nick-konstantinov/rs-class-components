import type { PropsWithChildren, ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import selectedItemsReducer, { toggleSelected } from '../store/slices/selectedItemsSlice';
import type { PokemonItem } from '../types/pokemon';

export function makeStore(preselected: PokemonItem[] = []) {
  const store = configureStore({ reducer: { selectedItems: selectedItemsReducer } });
  preselected.forEach((item) => store.dispatch(toggleSelected(item)));

  return store;
}

export type AppStore = ReturnType<typeof makeStore>;

interface Options extends Omit<RenderOptions, 'wrapper'> {
  preselected?: PokemonItem[];
  store?: AppStore;
}

export function renderWithStore(
  ui: ReactElement,
  { preselected, store = makeStore(preselected), ...renderOptions }: Options = {},
) {
  function Wrapper({ children }: PropsWithChildren) {
    return <Provider store={store}>{children}</Provider>;
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
