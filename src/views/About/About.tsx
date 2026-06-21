import { EXTERNAL_LINKS } from '@/external-links';
import styles from './About.module.scss';

function About() {
  return (
    <section className={styles.about}>
      <h2 className={styles.title}>About</h2>

      <p className={styles.intro}>
        Hi! I'm <strong>Nick Konstantinov</strong>, a student of the{' '}
        <a className={styles.link} href={EXTERNAL_LINKS.course} target="_blank" rel="noreferrer">
          Rolling Scopes School: React 2026Q2
        </a>{' '}
        course. This Pokemon search app is built as Task 3 of the React module.
      </p>

      <h3 className={styles.subtitle}>Contacts</h3>
      <ul className={styles.list}>
        <li>
          GitHub:{' '}
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
          Email:{' '}
          <a className={styles.link} href={EXTERNAL_LINKS.authorEmail}>
            nick.konstantinov.job@gmail.com
          </a>
        </li>
      </ul>

      <h3 className={styles.subtitle}>Course materials</h3>
      <p>
        Task descriptions and resources:{' '}
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

export default About;
