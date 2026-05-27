import './App.css';
import { useRoutes } from 'react-router-dom';
import Header from '@/components/Header/Header';
import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { SEARCH_TERM_STORAGE_KEY } from '@/constants';
import { getRouteConfig } from '@/routes';

function App() {
  const [searchTerm, setSearchTerm] = useLocalStorage<string>(SEARCH_TERM_STORAGE_KEY, '');
  const routes = useRoutes(getRouteConfig(searchTerm));

  return (
    <div className="app">
      <Header initialTerm={searchTerm} onSearch={setSearchTerm} />

      <ErrorBoundary>{routes}</ErrorBoundary>
    </div>
  );
}

export default App;
