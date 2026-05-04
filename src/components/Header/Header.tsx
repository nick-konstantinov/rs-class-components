import { Component } from 'react';
import './Header.css';
import Search from '../Search/Search';

interface HeaderProps {
  initialTerm: string;
  onSearch: (term: string) => void;
}

class Header extends Component<HeaderProps> {
  render() {
    return (
      <header className="header">
        <h1 className="header__title">Pokemon Search</h1>
        <Search initialTerm={this.props.initialTerm} onSearch={this.props.onSearch} />
      </header>
    );
  }
}

export default Header;
