import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NotFound from './NotFound';

const renderNotFound = () =>
  render(<NotFound />, {
    wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
  });

describe('NotFound', () => {
  it('renders the 404 heading and message', () => {
    renderNotFound();

    expect(screen.getByRole('heading', { name: '404', level: 2 })).toBeInTheDocument();
    expect(screen.getByText(/The page you're looking for doesn't exist/i)).toBeInTheDocument();
  });

  it('renders a back link to the home route', () => {
    renderNotFound();

    expect(screen.getByRole('link', { name: 'Back home' })).toHaveAttribute('href', '/');
  });
});
