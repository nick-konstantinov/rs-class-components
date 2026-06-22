import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it } from 'vitest';
import { makeStore } from '@/store/store';
import { selectItemsCount } from '@/store/slices/selectedItemsSlice';
import { makePokemon } from '@/test-utils/mockPokemon';
import { CardSelect } from './CardSelect';

const messages = { card: { select: 'Select {name}' } };

function setup() {
  const store = makeStore();
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <Provider store={store}>
        <CardSelect item={makePokemon({ name: 'pikachu' })} />
      </Provider>
    </NextIntlClientProvider>,
  );
  return store;
}

describe('CardSelect', () => {
  it('renders an unchecked checkbox labeled for the pokemon', () => {
    setup();
    expect(screen.getByRole('checkbox', { name: 'Select pikachu' })).not.toBeChecked();
  });

  it('toggles selection in the store on change', async () => {
    const user = userEvent.setup();
    const store = setup();
    const checkbox = screen.getByRole('checkbox', { name: 'Select pikachu' });

    await user.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(selectItemsCount(store.getState())).toBe(1);

    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
    expect(selectItemsCount(store.getState())).toBe(0);
  });
});
