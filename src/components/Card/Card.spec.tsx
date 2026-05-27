import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Card from './Card';
import { makePokemon } from '@/test-utils/mockPokemon.ts';

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

  it('falls back to the placeholder image when sprite is null', () => {
    render(<Card item={makePokemon({ sprite: null })} />);

    const image = screen.getByRole('img', { name: 'pikachu' });
    expect(image).toBeInTheDocument();
    expect(image.getAttribute('src')).toBeTruthy();
  });

  it('calls onSelect with the pokemon name when the card is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(<Card item={makePokemon({ name: 'bulbasaur' })} onSelect={onSelect} />);

    await user.click(screen.getByRole('button'));

    expect(onSelect).toHaveBeenCalledWith('bulbasaur');
  });

  it('calls onSelect when Enter is pressed on a focused card', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(<Card item={makePokemon({ name: 'bulbasaur' })} onSelect={onSelect} />);

    const card = screen.getByRole('button');
    card.focus();
    await user.keyboard('{Enter}');

    expect(onSelect).toHaveBeenCalledWith('bulbasaur');
  });

  it('marks the card as current when isSelected is true', () => {
    render(<Card item={makePokemon()} isSelected />);

    expect(screen.getByRole('button')).toHaveAttribute('aria-current', 'true');
  });

  it('omits aria-current when isSelected is false', () => {
    render(<Card item={makePokemon()} />);

    expect(screen.getByRole('button')).not.toHaveAttribute('aria-current');
  });
});
