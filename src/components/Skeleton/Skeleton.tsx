import { RESULTS_PER_PAGE } from '@/constants';
import styles from './Skeleton.module.scss';

export function ResultsSkeleton() {
  return (
    <div className={styles.grid} aria-hidden="true">
      {Array.from({ length: RESULTS_PER_PAGE }, (_, i) => (
        <div key={i} className={styles.card} />
      ))}
    </div>
  );
}

export function DetailsSkeleton() {
  return <div className={styles.details} aria-hidden="true" />;
}
