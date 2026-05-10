import { render, screen } from '@testing-library/react';
import Card from './Card';
import { makePokemon } from '../../test-utils/mockPokemon.ts';

describe('Card', () => {
  it('renders pokemon details', () => {
    render(<Card item={makePokemon()} />);

    expect(screen.getByRole('heading', { name: 'pikachu' })).toBeInTheDocument();
    expect(screen.getByText('electric')).toBeInTheDocument();
    expect(screen.getByText('static, lightning-rod')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('60')).toBeInTheDocument();
  });

  it('renders the sprite image with name as alt text', () => {
    render(<Card item={makePokemon()} />);

    const image = screen.getByRole('img', { name: 'pikachu' });
    expect(image).toHaveAttribute('src', 'https://example.test/pikachu.png');
  });

  it('does not render an image when sprite is null', () => {
    render(<Card item={makePokemon({ sprite: null })} />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
