import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { ThemeToggle } from '@/app/_components/ThemeToggle/ThemeToggle';
import styles from './Header.module.scss';

export async function Header() {
  const t = await getTranslations();

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{t('app.title')}</h1>
      <nav className={styles.nav} aria-label={t('nav.label')}>
        <Link href="/" className={styles.navLink}>
          {t('nav.home')}
        </Link>
        <Link href="/about" className={styles.navLink}>
          {t('nav.about')}
        </Link>
      </nav>
      <ThemeToggle className={styles.themeToggle} />
    </header>
  );
}
