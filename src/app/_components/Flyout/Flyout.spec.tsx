import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { NextIntlClientProvider } from 'next-intl';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { makeStore } from '@/store/store';
import { toggleSelected } from '@/store/slices/selectedItemsSlice';
import { makePokemon } from '@/test-utils/mockPokemon';
import type { PokemonItem } from '@/types/pokemon';
import { Flyout } from './Flyout';

vi.mock('@/app/[locale]/actions', () => ({
  generateCsvAction: vi.fn(async () => ({ base64: 'Y3N2', filename: '2_pokemons.csv' })),
}));

const messages = {
  flyout: {
    label: 'Selection',
    selected: '{count, plural, =1 {# item selected} other {# items selected}}',
    unselectAll: 'Unselect all',
    generate: 'Generate CSV',
    generating: 'Generating…',
    download: 'Save {filename}',
  },
};

function renderFlyout(preselected: PokemonItem[] = []) {
  const store = makeStore();
  preselected.forEach((item) => store.dispatch(toggleSelected(item)));

  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <Provider store={store}>
        <Flyout />
      </Provider>
    </NextIntlClientProvider>,
  );
}

afterEach(() => {
  vi.clearAllMocks();
});

describe('Flyout', () => {
  it('renders nothing when no items are selected', () => {
    const { container } = renderFlyout([]);
    expect(container).toBeEmptyDOMElement();
  });

  it('shows the selected count', () => {
    renderFlyout([makePokemon({ name: 'a' }), makePokemon({ name: 'b' })]);
    expect(screen.getByText('2 items selected')).toBeInTheDocument();
  });

  it('clears the selection on "Unselect all"', async () => {
    const user = userEvent.setup();
    const { container } = renderFlyout([makePokemon({ name: 'a' })]);

    await user.click(screen.getByRole('button', { name: 'Unselect all' }));

    expect(container).toBeEmptyDOMElement();
  });

  it('renders a CSV download link after generating', async () => {
    const user = userEvent.setup();
    renderFlyout([makePokemon({ name: 'a' }), makePokemon({ name: 'b' })]);

    await user.click(screen.getByRole('button', { name: 'Generate CSV' }));

    const link = await screen.findByRole('link', { name: 'Save 2_pokemons.csv' });
    expect(link).toHaveAttribute('download', '2_pokemons.csv');
    expect(link).toHaveAttribute('href', 'data:text/csv;charset=utf-8;base64,Y3N2');
  });
});
