import { type MockInstance } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Details from './Details';
import { renderWithStore } from '@/test-utils/renderWithStore';
import {
  makeDetailResponse,
  makeErrorResponse,
  makeFetchResponse,
  requestedUrls,
} from '@/test-utils/mockApi';

describe('Details', () => {
  let fetchSpy: MockInstance<typeof fetch>;

  beforeEach(() => {
    fetchSpy = vi.spyOn(globalThis, 'fetch');
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  it('shows the loader while fetching and renders the pokemon on success', async () => {
    fetchSpy.mockResolvedValueOnce(makeFetchResponse(makeDetailResponse({ name: 'bulbasaur' })));

    renderWithStore(<Details name="bulbasaur" onClose={() => {}} />);

    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: 'bulbasaur' })).toBeInTheDocument();
    expect(requestedUrls(fetchSpy)).toContainEqual(expect.stringContaining('/pokemon/bulbasaur'));
  });

  it('renders a human-readable error message when the request fails', async () => {
    fetchSpy.mockResolvedValueOnce(makeErrorResponse(500));

    renderWithStore(<Details name="bulbasaur" onClose={() => {}} />);

    expect(
      await screen.findByText('Server is unavailable, please try again later'),
    ).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    fetchSpy.mockResolvedValueOnce(makeFetchResponse(makeDetailResponse()));

    renderWithStore(<Details name="pikachu" onClose={onClose} />);

    await user.click(screen.getByRole('button', { name: 'Close details' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('refetches when the name prop changes', async () => {
    fetchSpy
      .mockResolvedValueOnce(makeFetchResponse(makeDetailResponse({ name: 'bulbasaur' })))
      .mockResolvedValueOnce(makeFetchResponse(makeDetailResponse({ name: 'charizard' })));

    const { rerender } = renderWithStore(<Details name="bulbasaur" onClose={() => {}} />);

    await screen.findByRole('heading', { name: 'bulbasaur' });

    rerender(<Details name="charizard" onClose={() => {}} />);

    expect(await screen.findByRole('heading', { name: 'charizard' })).toBeInTheDocument();
    expect(fetchSpy).toHaveBeenCalledTimes(2);
    expect(requestedUrls(fetchSpy)).toContainEqual(expect.stringContaining('/pokemon/charizard'));
  });

  it('shows pokemon stats in the description list', async () => {
    fetchSpy.mockResolvedValueOnce(
      makeFetchResponse(
        makeDetailResponse({
          name: 'pikachu',
          types: [{ type: { name: 'electric' } }],
          abilities: [{ ability: { name: 'static' } }],
        }),
      ),
    );

    renderWithStore(<Details name="pikachu" onClose={() => {}} />);

    await waitFor(() => {
      expect(screen.getByText('electric')).toBeInTheDocument();
    });
    expect(screen.getByText('static')).toBeInTheDocument();
  });
});
