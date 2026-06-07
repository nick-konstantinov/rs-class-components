import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CountryAutocomplete from './CountryAutocomplete';

function Wrapper() {
  const [value, setValue] = useState('');
  return (
    <CountryAutocomplete
      id="country"
      value={value}
      onChange={setValue}
      countries={['Canada', 'Germany', 'Japan']}
    />
  );
}

describe('CountryAutocomplete', () => {
  it('filters options as the user types and selects one by click', async () => {
    const user = userEvent.setup();
    render(<Wrapper />);

    const input = screen.getByRole('combobox');
    await user.type(input, 'ja');

    expect(screen.getByRole('option', { name: 'Japan' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Canada' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('option', { name: 'Japan' }));

    expect(input).toHaveValue('Japan');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});
