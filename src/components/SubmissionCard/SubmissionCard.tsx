import clsx from 'clsx';
import type { Submission } from '@/types/submission';
import styles from './SubmissionCard.module.scss';

interface SubmissionCardProps {
  submission: Submission;
  highlighted?: boolean;
}

export default function SubmissionCard({ submission, highlighted = false }: SubmissionCardProps) {
  const { source, name, age, email, gender, country, terms, image, createdAt } = submission;

  return (
    <article className={clsx(styles.card, highlighted && styles.highlighted)}>
      <div className={styles.media}>
        {image ? (
          <img className={styles.image} src={image} alt={`${name}'s profile`} />
        ) : (
          <span className={styles.placeholder}>No image</span>
        )}
      </div>

      <div className={styles.body}>
        <header className={styles.cardHeader}>
          <h3 className={styles.name}>{name}</h3>
          <span className={styles.badge}>
            {source === 'rhf' ? 'React Hook Form' : 'Uncontrolled'}
          </span>
        </header>

        <dl className={styles.fields}>
          <div className={styles.row}>
            <dt className={styles.term}>Age</dt>
            <dd className={styles.value}>{age}</dd>
          </div>
          <div className={styles.row}>
            <dt className={styles.term}>Email</dt>
            <dd className={styles.value}>{email}</dd>
          </div>
          <div className={styles.row}>
            <dt className={styles.term}>Gender</dt>
            <dd className={styles.value}>{gender}</dd>
          </div>
          <div className={styles.row}>
            <dt className={styles.term}>Country</dt>
            <dd className={styles.value}>{country}</dd>
          </div>
          <div className={styles.row}>
            <dt className={styles.term}>Terms</dt>
            <dd className={styles.value}>{terms ? '✓' : '✗'}</dd>
          </div>
        </dl>

        <time className={styles.time} dateTime={new Date(createdAt).toISOString()}>
          {new Date(createdAt).toLocaleString()}
        </time>
      </div>
    </article>
  );
}
