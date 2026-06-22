import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { afterEach, describe, expect, it, vi } from 'vitest';

const { replace } = vi.hoisted(() => ({ replace: vi.fn() }));

vi.mock('@/i18n/routing', () => ({
  usePathname: () => '/about',
  useRouter: () => ({ replace }),
  routing: { locales: ['en', 'ru'], defaultLocale: 'en' },
}));

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams('q=pika&page=2'),
}));

import { LanguageSwitcher } from './LanguageSwitcher';

const messages = { lang: { label: 'Language' } };

function renderSwitcher(locale = 'en') {
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <LanguageSwitcher />
    </NextIntlClientProvider>,
  );
}

afterEach(() => {
  vi.clearAllMocks();
});

describe('LanguageSwitcher', () => {
  it('marks the current locale active and disabled', () => {
    renderSwitcher('en');

    const en = screen.getByRole('button', { name: 'EN' });
    expect(en).toBeDisabled();
    expect(en).toHaveAttribute('aria-current', 'true');
    expect(screen.getByRole('button', { name: 'RU' })).toBeEnabled();
  });

  it('switches locale preserving the path and query', async () => {
    const user = userEvent.setup();
    renderSwitcher('en');

    await user.click(screen.getByRole('button', { name: 'RU' }));

    expect(replace).toHaveBeenCalledWith(
      { pathname: '/about', query: { q: 'pika', page: '2' } },
      { locale: 'ru' },
    );
  });
});
