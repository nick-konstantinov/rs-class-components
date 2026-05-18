import { Link } from 'react-router-dom';
import './NotFound.css';

function NotFound() {
  return (
    <section className="not-found">
      <h2 className="not-found__title">404</h2>
      <p className="not-found__message">The page you're looking for doesn't exist.</p>
      <Link to="/" className="not-found__link">
        Back home
      </Link>
    </section>
  );
}

export default NotFound;
