import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from './Header';
import { MemoryRouter } from 'react-router-dom';

const renderHeader = (
  props: {
    initialTerm?: string;
    onSearch?: (t: string) => void;
  } = {},
  initialPath = '/',
) =>
  render(<Header initialTerm={props.initialTerm ?? ''} onSearch={props.onSearch ?? (() => {})} />, {
    wrapper: ({ children }) => (
      <MemoryRouter initialEntries={[initialPath]}>{children}</MemoryRouter>
    ),
  });

describe('Header', () => {
  it('renders the title and a search input pre-filled with initialTerm', () => {
    renderHeader({ initialTerm: 'bulbasaur' });

    expect(screen.getByRole('heading', { name: 'Pokemon Search' })).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveValue('bulbasaur');
  });

  it('forwards search submissions to onSearch', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();

    renderHeader({ onSearch });
    await user.type(screen.getByRole('textbox'), 'pikachu{Enter}');

    expect(onSearch).toHaveBeenCalledWith('pikachu');
  });

  it('renders navigation links to Home and About', () => {
    renderHeader();

    const nav = screen.getByRole('navigation', { name: /main/i });
    expect(nav).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');
  });

  it('marks the current route as active via aria-current', () => {
    renderHeader({}, '/about');

    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current');
  });
});
