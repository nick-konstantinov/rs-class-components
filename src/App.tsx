import './App.css';
import { Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import Main from './components/Main/Main';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import About from './pages/About/About';
import NotFound from './pages/NotFound/NotFound';
import { useLocalStorage } from './hooks/useLocalStorage';
import { SEARCH_TERM_STORAGE_KEY } from './constants';
import DetailsOutletSlot from './components/Details/DetailsOutletSlot';

function App() {
  const [searchTerm, setSearchTerm] = useLocalStorage<string>(SEARCH_TERM_STORAGE_KEY, '');

  return (
    <div className="app">
      <Header initialTerm={searchTerm} onSearch={setSearchTerm} />

      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Main searchTerm={searchTerm} />}>
            <Route index element={<DetailsOutletSlot />} />
          </Route>
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </div>
  );
}

export default App;
