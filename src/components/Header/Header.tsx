import './Header.css';
import Search from '../Search/Search';
import { NavLink } from 'react-router-dom';

interface HeaderProps {
  initialTerm: string;
  onSearch: (term: string) => void;
  onChange: (term: string) => void;
}

function Header({ initialTerm, onSearch, onChange }: HeaderProps) {
  return (
    <header className="header">
      <h1 className="header__title">Pokemon Search</h1>
      <nav className="header__nav" aria-label="Main navigation">
        <NavLink to="/" end className="header__nav-link">
          Home
        </NavLink>
        <NavLink to="/about" className="header__nav-link">
          About
        </NavLink>
      </nav>
      <Search initialTerm={initialTerm} onSearch={onSearch} onChange={onChange} />
    </header>
  );
}

export default Header;
