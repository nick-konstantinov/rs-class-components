import { Component } from 'react';
import './Main.css';

interface MainProps {
  searchTerm: string;
}

class Main extends Component<MainProps> {
  render() {
    const message = this.props.searchTerm
      ? `Searching for "${this.props.searchTerm}"`
      : 'Showing all Pokemon';
    return (
      <main className="main">
        <p className="main__placeholder">{message}</p>
      </main>
    );
  }
}

export default Main;
