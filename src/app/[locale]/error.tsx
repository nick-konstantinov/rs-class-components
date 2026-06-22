'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import styles from './error.module.scss';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const t = useTranslations('error');

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className={styles.error} role="alert">
      <h2 className={styles.title}>{t('title')}</h2>
      <p className={styles.message}>{t('message')}</p>
      <button type="button" className={styles.retry} onClick={reset}>
        {t('retry')}
      </button>
    </div>
  );
}
