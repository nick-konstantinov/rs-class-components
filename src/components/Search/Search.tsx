import { Component } from 'react';
import type { ChangeEvent, SyntheticEvent } from 'react';
import './Search.css';
import { SEARCH_TERM_STORAGE_KEY } from '../../constants';

interface SearchProps {
  initialTerm: string;
  onSearch: (term: string) => void;
  onChange?: (term: string) => void;
}

interface SearchState {
  value: string;
}

class Search extends Component<SearchProps, SearchState> {
  state: SearchState = {
    value: this.props.initialTerm,
  };

  handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    this.setState({ value });

    if (value === '') {
      localStorage.setItem(SEARCH_TERM_STORAGE_KEY, '');

      this.props.onSearch('');
    }
  };

  handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = this.state.value.trim();
    localStorage.setItem(SEARCH_TERM_STORAGE_KEY, trimmed);
    this.props.onSearch(trimmed);
  };

  render() {
    return (
      <form className="search" onSubmit={this.handleSubmit}>
        <input
          type="text"
          className="search__input"
          placeholder="Search Pokemon by name..."
          value={this.state.value}
          onChange={this.handleChange}
        />
        <button type="submit" className="search__button">
          Search
        </button>
      </form>
    );
  }
}

export default Search;
