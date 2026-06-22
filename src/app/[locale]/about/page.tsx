import { getTranslations, setRequestLocale } from 'next-intl/server';
import { EXTERNAL_LINKS } from '@/external-links';
import styles from './About.module.scss';

type AboutPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');

  return (
    <section className={styles.about}>
      <h2 className={styles.title}>{t('title')}</h2>

      <p className={styles.intro}>
        {t.rich('intro', {
          name: (chunks) => <strong>{chunks}</strong>,
          course: (chunks) => (
            <a
              className={styles.link}
              href={EXTERNAL_LINKS.course}
              target="_blank"
              rel="noreferrer"
            >
              {chunks}
            </a>
          ),
        })}
      </p>

      <h3 className={styles.subtitle}>{t('contactsTitle')}</h3>
      <ul className={styles.list}>
        <li>
          {t('github')}{' '}
          <a
            className={styles.link}
            href={EXTERNAL_LINKS.authorGithub}
            target="_blank"
            rel="noreferrer"
          >
            @nick-konstantinov
          </a>
        </li>
        <li>
          {t('email')}{' '}
          <a className={styles.link} href={EXTERNAL_LINKS.authorEmail}>
            nick.konstantinov.job@gmail.com
          </a>
        </li>
      </ul>

      <h3 className={styles.subtitle}>{t('materialsTitle')}</h3>
      <p>
        {t('materials')}{' '}
        <a
          className={styles.link}
          href={EXTERNAL_LINKS.courseTasks}
          target="_blank"
          rel="noreferrer"
        >
          rolling-scopes-school/tasks
        </a>
      </p>
    </section>
  );
}
