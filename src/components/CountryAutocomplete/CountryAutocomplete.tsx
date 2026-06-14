import { useId, useState } from 'react';
import clsx from 'clsx';
import styles from './CountryAutocomplete.module.scss';

interface CountryAutocompleteProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  countries: string[];
  className?: string;
  invalid?: boolean;
}

export default function CountryAutocomplete({
  id,
  value,
  onChange,
  onBlur,
  countries,
  className,
  invalid = false,
}: CountryAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const listId = useId();

  const isExactMatch = countries.some((country) => country.toLowerCase() === value.toLowerCase());
  const matches =
    value && !isExactMatch
      ? countries.filter((country) => country.toLowerCase().includes(value.toLowerCase()))
      : countries;

  function handleSelect(country: string) {
    onChange(country);
    setOpen(false);
  }

  return (
    <div className={styles.wrap}>
      <input
        className={clsx(styles.input, className)}
        id={id}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-invalid={invalid || undefined}
        autoComplete="off"
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
          setOpen(true);
        }}
        onMouseDown={() => setOpen(true)}
        onBlur={() => {
          setOpen(false);
          onBlur?.();
        }}
      />
      {open && matches.length > 0 && (
        <ul className={styles.list} id={listId} role="listbox">
          {matches.map((country) => (
            <li
              key={country}
              className={styles.option}
              role="option"
              aria-selected={country === value}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => handleSelect(country)}
            >
              {country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
