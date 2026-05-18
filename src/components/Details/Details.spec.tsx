import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Details from './Details';
import { fetchPokemonDetail } from '../../api/pokemon';
import { makePokemon } from '../../test-utils/mockPokemon';

vi.mock('../../api/pokemon', () => ({
  fetchPokemonDetail: vi.fn(),
}));

const mockedFetchPokemonDetail = vi.mocked(fetchPokemonDetail);

describe('Details', () => {
  beforeEach(() => {
    mockedFetchPokemonDetail.mockReset();
  });

  it('shows the loader while fetching and renders the pokemon on success', async () => {
    mockedFetchPokemonDetail.mockResolvedValueOnce(makePokemon({ name: 'bulbasaur' }));

    render(<Details name="bulbasaur" onClose={() => {}} />);

    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: 'bulbasaur' })).toBeInTheDocument();
    expect(mockedFetchPokemonDetail).toHaveBeenCalledWith('bulbasaur');
  });

  it('renders error message when fetch fails', async () => {
    mockedFetchPokemonDetail.mockRejectedValueOnce(new Error('Server is unavailable'));

    render(<Details name="bulbasaur" onClose={() => {}} />);

    expect(await screen.findByText('Server is unavailable')).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    mockedFetchPokemonDetail.mockResolvedValueOnce(makePokemon());

    render(<Details name="pikachu" onClose={onClose} />);

    await user.click(screen.getByRole('button', { name: 'Close details' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('refetches when the name prop changes', async () => {
    mockedFetchPokemonDetail
      .mockResolvedValueOnce(makePokemon({ name: 'bulbasaur' }))
      .mockResolvedValueOnce(makePokemon({ name: 'charizard' }));

    const { rerender } = render(<Details name="bulbasaur" onClose={() => {}} />);

    await screen.findByRole('heading', { name: 'bulbasaur' });

    rerender(<Details name="charizard" onClose={() => {}} />);

    expect(await screen.findByRole('heading', { name: 'charizard' })).toBeInTheDocument();
    expect(mockedFetchPokemonDetail).toHaveBeenCalledTimes(2);
    expect(mockedFetchPokemonDetail).toHaveBeenLastCalledWith('charizard');
  });

  it('shows pokemon stats in the description list', async () => {
    mockedFetchPokemonDetail.mockResolvedValueOnce(
      makePokemon({ name: 'pikachu', types: 'electric', abilities: 'static' }),
    );

    render(<Details name="pikachu" onClose={() => {}} />);

    await waitFor(() => {
      expect(screen.getByText('electric')).toBeInTheDocument();
    });
    expect(screen.getByText('static')).toBeInTheDocument();
  });
});
