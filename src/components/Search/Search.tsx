import { useState } from 'react';
import type { ChangeEvent, SyntheticEvent } from 'react';
import './Search.css';
import Button from '@/components/Button/Button';

interface SearchProps {
  initialTerm: string;
  onSearch: (term: string) => void;
}

function Search({ initialTerm, onSearch }: SearchProps) {
  const [value, setValue] = useState(initialTerm);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value;
    setValue(next);

    if (next === '') {
      onSearch('');
    }
  };

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = value.trim();
    setValue(trimmed);
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
      <Button type="submit" variant="primary">
        Search
      </Button>
    </form>
  );
}

export default Search;
