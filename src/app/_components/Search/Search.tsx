'use client';

import { useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';
import { searchAction } from '@/app/[locale]/actions';
import styles from './Search.module.scss';

export function Search() {
  const q = useSearchParams().get('q') ?? '';
  const localeValue = useLocale();
  const locale = hasLocale(routing.locales, localeValue) ? localeValue : routing.defaultLocale;
  const t = useTranslations('search');

  return (
    <form className={styles.search} action={searchAction.bind(null, locale)}>
      <input
        key={q}
        type="text"
        name="q"
        defaultValue={q}
        placeholder={t('placeholder')}
        aria-label={t('label')}
        className={styles.input}
      />
      <button type="submit" className={styles.button}>
        {t('submit')}
      </button>
    </form>
  );
}
