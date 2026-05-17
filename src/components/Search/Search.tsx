import { useState } from 'react';
import type { ChangeEvent, SyntheticEvent } from 'react';
import './Search.css';
import { SEARCH_TERM_STORAGE_KEY } from '../../constants';

interface SearchProps {
  initialTerm: string;
  onSearch: (term: string) => void;
  onChange?: (term: string) => void;
}

function Search({ initialTerm, onSearch }: SearchProps) {
  const [value, setValue] = useState(initialTerm);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value;
    setValue(next);

    if (next === '') {
      localStorage.setItem(SEARCH_TERM_STORAGE_KEY, '');
      onSearch('');
    }
  };

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = value.trim();
    setValue(trimmed);
    localStorage.setItem(SEARCH_TERM_STORAGE_KEY, trimmed);
    onSearch(trimmed);
  };

  return (
    <form className="search" onSubmit={handleSubmit}>
      <input
        type="text"
        className="search__input"
        placeholder="Search Pokemon by name..."
        value={value}
        onChange={handleChange}
      />
      <button type="submit" className="search__button">
        Search
      </button>
    </form>
  );
}

export default Search;
