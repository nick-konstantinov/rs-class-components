import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Flyout from './Flyout';
import { renderWithStore } from '@/test-utils/renderWithStore';
import { makePokemon } from '@/test-utils/mockPokemon';
import { selectItemsCount } from '@/store/slices/selectedItemsSlice';
import { downloadCsv } from '@/utils/csv';

vi.mock('@/utils/csv', () => ({
  downloadCsv: vi.fn(),
}));

const mockedDownloadCsv = vi.mocked(downloadCsv);

describe('Flyout', () => {
  beforeEach(() => {
    mockedDownloadCsv.mockReset();
  });

  it('does not render when nothing is selected', () => {
    renderWithStore(<Flyout />);

    expect(screen.queryByRole('region', { name: 'Selection' })).not.toBeInTheDocument();
  });

  it('shows the selection count', () => {
    renderWithStore(<Flyout />, {
      preselected: [makePokemon({ name: 'a' }), makePokemon({ name: 'b' })],
    });

    const region = screen.getByRole('region', { name: 'Selection' });
    expect(region).toBeInTheDocument();
    expect(region).toHaveTextContent('2 items are selected');
  });

  it('clears the store when Unselect all is clicked', async () => {
    const user = userEvent.setup();
    const { store } = renderWithStore(<Flyout />, {
      preselected: [makePokemon({ name: 'a' })],
    });

    await user.click(screen.getByRole('button', { name: 'Unselect all' }));

    expect(selectItemsCount(store.getState())).toBe(0);
  });

  it('calls downloadCsv with the selected items when Download is clicked', async () => {
    const user = userEvent.setup();
    const a = makePokemon({ name: 'a' });
    const b = makePokemon({ name: 'b' });
    renderWithStore(<Flyout />, { preselected: [a, b] });

    await user.click(screen.getByRole('button', { name: 'Download' }));

    expect(mockedDownloadCsv).toHaveBeenCalledTimes(1);
    expect(mockedDownloadCsv).toHaveBeenCalledWith([a, b]);
  });
});
