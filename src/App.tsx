import { Component } from 'react';
import Header from './components/Header/Header';
import Main from './components/Main/Main';
import { SEARCH_TERM_STORAGE_KEY } from './constants';
import './App.css';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary.tsx';

interface AppState {
  searchTerm: string;
}

class App extends Component<Record<string, never>, AppState> {
  state: AppState = {
    searchTerm: localStorage.getItem(SEARCH_TERM_STORAGE_KEY) ?? '',
  };

  handleSearch = (term: string) => {
    this.setState({ searchTerm: term });
  };

  handleSearchChange = (term: string) => {
    this.setState({ searchTerm: term });
  };

  render() {
    return (
      <div className="app">
        <Header
          initialTerm={this.state.searchTerm}
          onSearch={this.handleSearch}
          onChange={this.handleSearchChange}
        />

        <ErrorBoundary>
          <Main searchTerm={this.state.searchTerm} />
        </ErrorBoundary>
      </div>
    );
  }
}

export default App;
