import { Component } from 'react';
import Header from './components/Header/Header';
import Main from './components/Main/Main';
import { SEARCH_TERM_STORAGE_KEY } from './constants';
import './App.css';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary.tsx';
import { Route, Routes } from 'react-router-dom';
import About from './pages/About/About.tsx';
import NotFound from './pages/NotFound/NotFound.tsx';

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
          <Routes>
            <Route path="/" element={<Main searchTerm={this.state.searchTerm} />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </div>
    );
  }
}

export default App;
