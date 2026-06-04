import styles from './Header.module.scss';
import Search from '@/components/Search/Search';
import ThemeToggle from '@/components/ThemeToggle/ThemeToggle';
import { ROUTES } from '@/routes';
import { NavLink } from 'react-router-dom';

interface HeaderProps {
  initialTerm: string;
  onSearch: (term: string) => void;
}

function Header({ initialTerm, onSearch }: HeaderProps) {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Pokemon Search</h1>
      <nav className={styles.nav} aria-label="Main navigation">
        <NavLink to={ROUTES.home} end className={styles.navLink}>
          Home
        </NavLink>
        <NavLink to={ROUTES.about} className={styles.navLink}>
          About
        </NavLink>
      </nav>
      <Search initialTerm={initialTerm} onSearch={onSearch} />
      <ThemeToggle className={styles.themeToggle} />
    </header>
  );
}

export default Header;
