import { render } from '@testing-library/react';
import Loader from './Loader';

describe('Loader', () => {
  it('renders the loading indicator', () => {
    const { container } = render(<Loader />);

    expect(container.querySelector('.loader-wrapper')).toBeInTheDocument();
    expect(container.querySelector('.loader')).toBeInTheDocument();
  });
});
