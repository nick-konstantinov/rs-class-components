import { useState } from 'react';
import Button from '@/components/Button/Button';
import styles from './MainPage.module.scss';

type OpenForm = 'rhf' | 'uncontrolled' | null;

export default function MainPage() {
  const [openForm, setOpenForm] = useState<OpenForm>(null);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>React Forms</h1>
        <p className={styles.subtitle}>
          Fill the form in two ways: uncontrolled and React Hook Form and see the results below.
        </p>
      </header>

      <div className={styles.buttons}>
        <Button variant="primary" onClick={() => setOpenForm('uncontrolled')}>
          Uncontrolled form
        </Button>
        <Button variant="accent" onClick={() => setOpenForm('rhf')}>
          React Hook Form
        </Button>
      </div>

      <section>
        <h2 className={styles.sectionTitle}>Submissions</h2>
        <p className={styles.empty}>No submissions yet.</p>
      </section>

      {openForm && (
        <div className={styles.placeholder}>
          <p className={styles.placeholderText}>
            Placeholder for the <span>{openForm}</span> form.
          </p>
          <Button
            variant="secondary"
            className={styles.placeholderClose}
            onClick={() => setOpenForm(null)}
          >
            Close
          </Button>
        </div>
      )}
    </main>
  );
}
