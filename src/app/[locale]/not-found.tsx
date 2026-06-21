import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import styles from './NotFound.module.scss';

export default function NotFound() {
  const t = useTranslations('notFound');

  return (
    <section className={styles.notFound}>
      <h2 className={styles.title}>{t('title')}</h2>
      <p className={styles.message}>{t('message')}</p>
      <Link href="/" className={styles.link}>
        {t('backHome')}
      </Link>
    </section>
  );
}
