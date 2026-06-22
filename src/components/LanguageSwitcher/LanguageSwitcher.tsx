'use client';

import { useTransition } from 'react';
import clsx from 'clsx';
import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { usePathname, useRouter, routing } from '@/i18n/routing';
import type { Locale } from '@/i18n/routing';
import styles from './LanguageSwitcher.module.scss';

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const t = useTranslations('lang');
  const current = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const switchTo = (locale: Locale) => {
    const query = Object.fromEntries(searchParams.entries());
    startTransition(() => {
      router.replace({ pathname, query }, { locale });
    });
  };

  return (
    <div className={clsx(styles.switcher, className)} role="group" aria-label={t('label')}>
      {routing.locales.map((locale) => (
        <button
          key={locale}
          type="button"
          className={clsx(styles.option, { [styles.active]: locale === current })}
          aria-current={locale === current ? 'true' : undefined}
          disabled={locale === current || isPending}
          onClick={() => switchTo(locale)}
        >
          {locale.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
