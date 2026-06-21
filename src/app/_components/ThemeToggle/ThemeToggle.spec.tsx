import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from '@/app/_providers/ThemeProvider';
import type { Theme } from '@/lib/theme';
import { ThemeToggle } from './ThemeToggle';

const messages = { theme: { darkMode: 'Dark mode' } };

function renderToggle(initialTheme: Theme = 'light') {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <ThemeProvider initialTheme={initialTheme}>
        <ThemeToggle />
      </ThemeProvider>
    </NextIntlClientProvider>,
  );
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    document.cookie = 'theme=; path=/; max-age=0';
  });

  it('renders a switch labeled "Dark mode", unchecked for the light theme', () => {
    renderToggle('light');

    const toggle = screen.getByRole('switch', { name: 'Dark mode' });
    expect(toggle).toBeInTheDocument();
    expect(toggle).not.toBeChecked();
  });

  it('checks the switch and persists the cookie when toggled', async () => {
    const user = userEvent.setup();
    renderToggle('light');

    await user.click(screen.getByRole('switch'));

    expect(screen.getByRole('switch')).toBeChecked();
    expect(document.cookie).toContain('theme=dark');
  });

  it('reflects the initial dark theme as checked', () => {
    renderToggle('dark');

    expect(screen.getByRole('switch')).toBeChecked();
  });
});
