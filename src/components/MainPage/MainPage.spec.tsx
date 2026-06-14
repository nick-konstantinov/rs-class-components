import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithStore, makeStore } from '@/test-utils/renderWithStore';
import { addSubmission } from '@/store/submissionsSlice';
import MainPage from './MainPage';

describe('MainPage', () => {
  it('renders the heading and both form buttons', () => {
    renderWithStore(<MainPage />);

    expect(screen.getByRole('heading', { name: /react forms/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /uncontrolled form/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /react hook form/i })).toBeInTheDocument();
  });

  it('opens a form modal on button click and closes it', async () => {
    const user = userEvent.setup();
    renderWithStore(<MainPage />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /uncontrolled form/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /close/i }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders submission cards from the store', () => {
    const store = makeStore();
    store.dispatch(
      addSubmission({
        source: 'rhf',
        name: 'Alice',
        age: 30,
        email: 'alice@mail.com',
        gender: 'female',
        terms: true,
        country: 'Japan',
        image: null,
      }),
    );

    renderWithStore(<MainPage />, store);

    expect(screen.queryByText(/no submissions yet/i)).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Alice' })).toBeInTheDocument();
    expect(screen.getByText('alice@mail.com')).toBeInTheDocument();
  });
});
