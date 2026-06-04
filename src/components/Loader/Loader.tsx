import styles from './Loader.module.scss';

export default function Loader() {
  return (
    <div className={styles.wrapper} role="status" aria-label="Loading">
      <div className={styles.loader} />
    </div>
  );
}
