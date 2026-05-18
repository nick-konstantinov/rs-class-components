import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import About from './About';

const renderAbout = () =>
  render(<About />, {
    wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
  });

describe('About', () => {
  it('renders the page heading', () => {
    renderAbout();

    expect(screen.getByRole('heading', { name: 'About', level: 2 })).toBeInTheDocument();
  });

  it('links to the RS School React course', () => {
    renderAbout();

    expect(
      screen.getByRole('link', { name: 'Rolling Scopes School: React 2026Q2' }),
    ).toHaveAttribute('href', 'https://rs.school/courses/reactjs');
  });

  it('links to the author GitHub profile', () => {
    renderAbout();

    expect(screen.getByRole('link', { name: '@nick-konstantinov' })).toHaveAttribute(
      'href',
      'https://github.com/nick-konstantinov',
    );
  });

  it('links to the course materials README', () => {
    renderAbout();

    expect(screen.getByRole('link', { name: 'rolling-scopes-school/tasks' })).toHaveAttribute(
      'href',
      'https://github.com/rolling-scopes-school/tasks/blob/master/react/README.md',
    );
  });
});
