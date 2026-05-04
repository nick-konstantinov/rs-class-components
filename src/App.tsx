import { Component } from 'react';
import Header from './components/Header/Header';
import Main from './components/Main/Main';
import { SEARCH_TERM_STORAGE_KEY } from './constants';
import './App.css';

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

  render() {
    return (
      <div className="app">
        <Header initialTerm={this.state.searchTerm} onSearch={this.handleSearch} />
        <Main searchTerm={this.state.searchTerm} />
      </div>
    );
  }
}

export default App;
