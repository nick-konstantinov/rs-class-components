import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MainPage from './MainPage';

describe('MainPage', () => {
  it('renders the heading and both form buttons', () => {
    render(<MainPage />);

    expect(screen.getByRole('heading', { name: /react forms/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /uncontrolled form/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /react hook form/i })).toBeInTheDocument();
  });

  it('opens a form modal on button click and closes it', async () => {
    const user = userEvent.setup();
    render(<MainPage />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /uncontrolled form/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /close/i }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
