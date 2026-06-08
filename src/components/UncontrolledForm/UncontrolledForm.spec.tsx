import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithStore } from '@/test-utils/renderWithStore';
import UncontrolledForm from './UncontrolledForm';

type User = ReturnType<typeof userEvent.setup>;

async function fillValidForm(user: User) {
  await user.type(screen.getByLabelText('Name'), 'Bob');
  await user.type(screen.getByLabelText('Email'), 'bob@mail.com');
  await user.type(screen.getByLabelText('Password'), 'Abcdef1!');
  await user.type(screen.getByLabelText('Confirm password'), 'Abcdef1!');
  await user.type(screen.getByLabelText('Country'), 'Canada');
  await user.type(screen.getByLabelText('Age'), '25');
  await user.click(screen.getByLabelText('Male'));
  await user.upload(
    screen.getByLabelText('Profile image'),
    new File(['x'], 'avatar.png', { type: 'image/png' }),
  );
  await user.click(screen.getByLabelText(/terms and conditions/i));
}

describe('UncontrolledForm', () => {
  it('renders all fields', () => {
    renderWithStore(<UncontrolledForm onSuccess={vi.fn()} />);

    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm password')).toBeInTheDocument();
    expect(screen.getByLabelText('Country')).toBeInTheDocument();
    expect(screen.getByLabelText('Age')).toBeInTheDocument();
    expect(screen.getByLabelText('Male')).toBeInTheDocument();
    expect(screen.getByLabelText('Female')).toBeInTheDocument();
    expect(screen.getByLabelText('Profile image')).toBeInTheDocument();
    expect(screen.getByLabelText(/terms and conditions/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('does not validate while typing (only on submit)', async () => {
    const user = userEvent.setup();
    renderWithStore(<UncontrolledForm onSuccess={vi.fn()} />);

    await user.type(screen.getByLabelText('Email'), 'not-an-email');

    expect(screen.queryByText(/invalid email/i)).not.toBeInTheDocument();
  });

  it('shows errors and does not dispatch on an invalid submit', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    const { store } = renderWithStore(<UncontrolledForm onSuccess={onSuccess} />);

    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
    expect(onSuccess).not.toHaveBeenCalled();
    expect(store.getState().submissions.items).toHaveLength(0);
  });

  it('dispatches a submission and calls onSuccess on a valid submit', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    const { store } = renderWithStore(<UncontrolledForm onSuccess={onSuccess} />);

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(onSuccess).toHaveBeenCalledOnce();

    const items = store.getState().submissions.items;
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      source: 'uncontrolled',
      name: 'Bob',
      age: 25,
      email: 'bob@mail.com',
      gender: 'male',
      country: 'Canada',
      terms: true,
      image: null,
    });
  });
});
