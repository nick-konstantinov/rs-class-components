import { Component } from 'react';
import './Main.css';
import Loader from '../Loader/Loader.tsx';
import type { PokemonItem } from '../../types/pokemon.ts';
import { ApiError, searchPokemon } from '../../api/pokemon.ts';

interface MainProps {
  searchTerm: string;
}

interface MainState {
  loading: boolean;
  error: string | null;
  items: PokemonItem[];
}

class Main extends Component<MainProps, MainState> {
  state: MainState = {
    loading: false,
    error: null,
    items: [],
  };

  componentDidMount() {
    void this.fetchData();
  }

  componentDidUpdate(prevProps: MainProps) {
    if (prevProps.searchTerm !== this.props.searchTerm) {
      void this.fetchData();
    }
  }

  async fetchData() {
    try {
      this.setState({ loading: true, error: null });

      const items = await searchPokemon(this.props.searchTerm);

      this.setState({
        items,
        loading: false,
      });
    } catch (err) {
      let message = 'Unknown error';

      if (err instanceof ApiError) {
        message = err.message;
      } else if (err instanceof Error) {
        message = err.message;
      }

      this.setState({
        error: message,
        loading: false,
      });
    }
  }

  render() {
    const { searchTerm } = this.props;
    const { loading, error, items } = this.state;

    if (loading) {
      return <Loader />;
    }

    if (error) {
      return <p>Error: {error}</p>;
    }

    if (items.length === 0) {
      return (
        <main className="main">
          <p className="main__placeholder">
            {searchTerm ? `No results for "${searchTerm}"` : 'No Pokemon found'}
          </p>
        </main>
      );
    }

    return (
      <main className="main">
        <p>Found {items.length} Pokemon</p>
      </main>
    );
  }
}

export default Main;
