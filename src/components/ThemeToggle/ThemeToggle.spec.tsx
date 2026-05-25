import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '../../context/ThemeProvider';
import ThemeToggle from './ThemeToggle';

const renderToggle = () => render(<ThemeToggle />, { wrapper: ThemeProvider });

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.removeItem('theme');
    document.documentElement.removeAttribute('data-theme');
  });

  it('renders a switch labeled "Dark mode", unchecked by default', () => {
    renderToggle();

    const toggle = screen.getByRole('switch', { name: 'Dark mode' });
    expect(toggle).toBeInTheDocument();
    expect(toggle).not.toBeChecked();
  });

  it('switches data-theme on html when toggled', async () => {
    const user = userEvent.setup();
    renderToggle();

    expect(document.documentElement.getAttribute('data-theme')).toBe('light');

    await user.click(screen.getByRole('switch'));

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('reflects checked state matching current theme', async () => {
    const user = userEvent.setup();
    renderToggle();

    const toggle = screen.getByRole('switch');
    expect(toggle).not.toBeChecked();

    await user.click(toggle);

    expect(toggle).toBeChecked();
  });
});
