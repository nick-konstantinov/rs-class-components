import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Search from './Search';
import { SEARCH_TERM_STORAGE_KEY } from '../../constants';

describe('Search', () => {
  it('renders an input pre-filled with initialTerm', () => {
    render(<Search initialTerm="bulbasaur" onSearch={() => {}} />);

    expect(screen.getByRole('textbox')).toHaveValue('bulbasaur');
  });

  it('updates the input value as the user types', async () => {
    const user = userEvent.setup();
    render(<Search initialTerm="" onSearch={() => {}} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'pika');

    expect(input).toHaveValue('pika');
  });

  it('fires onSearch("") and writes empty string to localStorage when input is cleared', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();

    render(<Search initialTerm="pikachu" onSearch={onSearch} />);

    const input = screen.getByRole('textbox');
    await user.clear(input);

    expect(input).toHaveValue('');
    expect(onSearch).toHaveBeenCalledWith('');
    expect(localStorage.getItem(SEARCH_TERM_STORAGE_KEY)).toBe('');
  });

  it('trims, persists, and notifies onSearch when the user submits via Enter', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();

    render(<Search initialTerm="" onSearch={onSearch} />);

    await user.type(screen.getByRole('textbox'), '  pikachu  {Enter}');

    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith('pikachu');
    expect(localStorage.getItem(SEARCH_TERM_STORAGE_KEY)).toBe('pikachu');
    expect(screen.getByRole('textbox')).toHaveValue('pikachu');
  });

  it('submits via the Search button as well', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();

    render(<Search initialTerm="charmander" onSearch={onSearch} />);

    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(onSearch).toHaveBeenCalledWith('charmander');
    expect(localStorage.getItem(SEARCH_TERM_STORAGE_KEY)).toBe('charmander');
  });
});
