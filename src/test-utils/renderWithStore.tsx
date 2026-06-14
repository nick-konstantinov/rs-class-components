import type { ReactElement, ReactNode } from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import submissionsReducer from '@/store/submissionsSlice';
import countriesReducer from '@/store/countriesSlice';

export function makeStore() {
  return configureStore({
    reducer: {
      submissions: submissionsReducer,
      countries: countriesReducer,
    },
  });
}

export type AppStore = ReturnType<typeof makeStore>;

export function renderWithStore(ui: ReactElement, store: AppStore = makeStore()) {
  function Wrapper({ children }: { children: ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return { store, ...render(ui, { wrapper: Wrapper }) };
}
