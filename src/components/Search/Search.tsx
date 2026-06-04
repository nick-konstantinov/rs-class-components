import { useState } from 'react';
import type { ChangeEvent, SyntheticEvent } from 'react';
import styles from './Search.module.scss';
import Button from '@/components/Button/Button';

interface SearchProps {
  initialTerm: string;
  onSearch: (term: string) => void;
}

function Search({ initialTerm, onSearch }: SearchProps) {
  const [value, setValue] = useState(initialTerm);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(value.trim());
  };

  return (
    <form className={styles.search} onSubmit={handleSubmit}>
      <input
        type="text"
        className={styles.input}
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
