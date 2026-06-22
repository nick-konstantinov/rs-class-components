'use client';

import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useTheme } from '@/providers/ThemeProvider';
import styles from './ThemeToggle.module.scss';

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const t = useTranslations('theme');
  const isDark = theme === 'dark';

  return (
    <label className={clsx(styles.toggle, className)}>
      <span className={styles.label}>{t('darkMode')}</span>
      <input
        type="checkbox"
        role="switch"
        className={styles.input}
        checked={isDark}
        onChange={toggleTheme}
      />
    </label>
  );
}
