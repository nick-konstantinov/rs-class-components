import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from './Header';

describe('Header', () => {
  it('renders the title and a search input pre-filled with initialTerm', () => {
    render(<Header initialTerm="bulbasaur" onSearch={() => {}} onChange={() => {}} />);

    expect(screen.getByRole('heading', { name: 'Pokemon Search' })).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveValue('bulbasaur');
  });

  it('forwards search submissions to onSearch', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();

    render(<Header initialTerm="" onSearch={onSearch} onChange={() => {}} />);
    await user.type(screen.getByRole('textbox'), 'pikachu{Enter}');

    expect(onSearch).toHaveBeenCalledWith('pikachu');
  });
});
