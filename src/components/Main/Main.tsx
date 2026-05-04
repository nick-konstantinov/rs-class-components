import { Component } from 'react';
import './Main.css';
import Loader from '../Loader/Loader';
import CardList from '../CardList/CardList';
import { getPokemonList, searchPokemon } from '../../api/pokemon';
import type { PokemonItem } from '../../types/pokemon';

interface MainProps {
  searchTerm: string;
}

interface MainState {
  items: PokemonItem[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  page: number;
  crash: boolean;
}

class Main extends Component<MainProps, MainState> {
  state: MainState = {
    items: [],
    loading: false,
    loadingMore: false,
    error: null,
    page: 0,
    crash: false,
  };

  componentDidMount() {
    void this.fetchData(0);
  }

  componentDidUpdate(prevProps: MainProps, prevState: MainState) {
    const prev = prevProps.searchTerm.trim();
    const current = this.props.searchTerm.trim();

    if (prev !== current) {
      this.setState(
        {
          page: 0,
          items: [],
        },
        () => {
          void this.fetchData(0);
        },
      );
      return;
    }

    if (prevState.page !== this.state.page && !current) {
      void this.fetchData(this.state.page);
    }
  }

  fetchData = async (page: number = 0) => {
    try {
      const isSearch = this.props.searchTerm.trim();

      this.setState({
        error: null,
        loading: page === 0,
        loadingMore: page > 0,
      });

      let items: PokemonItem[];

      if (isSearch) {
        items = await searchPokemon(this.props.searchTerm);

        this.setState({
          items,
          loading: false,
          loadingMore: false,
        });

        return;
      }

      const newItems = await getPokemonList(page);

      this.setState((prev) => ({
        items: page === 0 ? newItems : [...prev.items, ...newItems],
        loading: false,
        loadingMore: false,
      }));
    } catch (err) {
      this.setState({
        error: err instanceof Error ? err.message : 'Unknown error',
        loading: false,
        loadingMore: false,
      });
    }
  };

  loadNextPage = () => {
    if (this.props.searchTerm.trim()) return;

    this.setState((prev) => ({
      page: prev.page + 1,
    }));
  };

  render() {
    const { items, loading, loadingMore, error } = this.state;
    const isSearch = this.props.searchTerm.trim();
    const isEmpty = !loading && items.length === 0;

    if (this.state.crash) {
      throw new Error('Test error');
    }

    return (
      <main className="main">
        {error && <p className="main__error">{error}</p>}

        {loading && <Loader />}

        {!loading && !error && isEmpty && (
          <p className="main__placeholder">
            {isSearch ? 'No Pokemon found' : 'No Pokemon available'}
          </p>
        )}

        {!loading && items.length > 0 && <CardList items={items} />}

        {loadingMore && <Loader />}

        <div className="main__controls">
          {!isSearch && !loading && items.length > 0 && (
            <button onClick={this.loadNextPage} className="main__load-more">
              Load more
            </button>
          )}

          {!loading && !loadingMore && (
            <button onClick={() => this.setState({ crash: true })} className="main__error-btn">
              Throw test error
            </button>
          )}
        </div>
      </main>
    );
  }
}

export default Main;
