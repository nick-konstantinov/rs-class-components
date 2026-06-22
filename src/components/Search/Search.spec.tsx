import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams('q=charizard'),
}));

vi.mock('@/i18n/routing', () => ({
  routing: { locales: ['en', 'ru'], defaultLocale: 'en' },
}));

vi.mock('@/app/[locale]/actions', () => ({
  searchAction: vi.fn(),
}));

import { Search } from './Search';

const messages = {
  search: {
    label: 'Search Pokemon',
    placeholder: 'Search Pokemon by name...',
    submit: 'Search',
  },
};

describe('Search', () => {
  it('renders the URL query as the uncontrolled default value', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <Search />
      </NextIntlClientProvider>,
    );

    const input = screen.getByRole('textbox', { name: 'Search Pokemon' });
    expect(input).toHaveValue('charizard');
    expect(input).toHaveAttribute('name', 'q');
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });
});
