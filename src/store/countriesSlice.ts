import { createSlice } from '@reduxjs/toolkit';
import { COUNTRIES } from '@/data/countries';
import type { RootState } from '@/store';

interface CountriesState {
  list: string[];
}

const initialState: CountriesState = {
  list: COUNTRIES,
};

const countriesSlice = createSlice({
  name: 'countries',
  initialState,
  reducers: {},
});

export const selectCountries = (state: RootState) => state.countries.list;

export default countriesSlice.reducer;
