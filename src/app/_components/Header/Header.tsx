import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { ThemeToggle } from '@/app/_components/ThemeToggle/ThemeToggle';
import { LanguageSwitcher } from '@/app/_components/LanguageSwitcher/LanguageSwitcher';
import { Search } from '@/app/_components/Search/Search';
import styles from './Header.module.scss';

export async function Header() {
  const t = await getTranslations();

  return (
    <header className={styles.header}>
      <LanguageSwitcher className={styles.languageSwitcher} />
      <h1 className={styles.title}>{t('app.title')}</h1>
      <nav className={styles.nav} aria-label={t('nav.label')}>
        <Link href="/" className={styles.navLink}>
          {t('nav.home')}
        </Link>
        <Link href="/about" className={styles.navLink}>
          {t('nav.about')}
        </Link>
      </nav>
      <Suspense>
        <Search />
      </Suspense>
      <ThemeToggle className={styles.themeToggle} />
    </header>
  );
}
