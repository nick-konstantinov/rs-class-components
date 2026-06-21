import { Link } from 'react-router-dom';
import { ROUTES } from '@/routes';
import styles from './NotFound.module.scss';

function NotFound() {
  return (
    <section className={styles.notFound}>
      <h2 className={styles.title}>404</h2>
      <p className={styles.message}>The page you're looking for doesn't exist.</p>
      <Link to={ROUTES.home} className={styles.link}>
        Back home
      </Link>
    </section>
  );
}

export default NotFound;
