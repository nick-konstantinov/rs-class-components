import { configureStore } from '@reduxjs/toolkit';
import submissionsReducer from '@/store/submissionsSlice';
import countriesReducer from '@/store/countriesSlice';

export const store = configureStore({
  reducer: {
    submissions: submissionsReducer,
    countries: countriesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
