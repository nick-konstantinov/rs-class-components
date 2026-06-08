import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithStore } from '@/test-utils/renderWithStore';
import RhfForm from './RhfForm';

type User = ReturnType<typeof userEvent.setup>;

async function fillValidForm(user: User) {
  await user.type(screen.getByLabelText('Name'), 'Alice');
  await user.type(screen.getByLabelText('Age'), '30');
  await user.type(screen.getByLabelText('Email'), 'alice@mail.com');
  await user.click(screen.getByLabelText('Female'));
  await user.type(screen.getByLabelText('Country'), 'Canada');
  await user.type(screen.getByLabelText('Password'), 'Abcdef1!');
  await user.type(screen.getByLabelText('Confirm password'), 'Abcdef1!');
  await user.upload(
    screen.getByLabelText('Profile image'),
    new File(['x'], 'avatar.png', { type: 'image/png' }),
  );
  await user.click(screen.getByLabelText(/terms and conditions/i));
  await user.tab();
}

describe('RhfForm', () => {
  it('renders all fields', () => {
    renderWithStore(<RhfForm onSuccess={vi.fn()} />);

    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Age')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Male')).toBeInTheDocument();
    expect(screen.getByLabelText('Female')).toBeInTheDocument();
    expect(screen.getByLabelText('Country')).toBeInTheDocument();
    expect(screen.getByLabelText('Profile image')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm password')).toBeInTheDocument();
    expect(screen.getByLabelText(/terms and conditions/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('shows a validation error for an invalid email', async () => {
    const user = userEvent.setup();
    renderWithStore(<RhfForm onSuccess={vi.fn()} />);

    await user.type(screen.getByLabelText('Email'), 'not-an-email');
    await user.tab();

    expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
  });

  it('keeps submit disabled until the form is valid', async () => {
    const user = userEvent.setup();
    renderWithStore(<RhfForm onSuccess={vi.fn()} />);

    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();

    await fillValidForm(user);

    await waitFor(() => expect(screen.getByRole('button', { name: /submit/i })).toBeEnabled());
  });

  it('dispatches a submission and calls onSuccess', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    const { store } = renderWithStore(<RhfForm onSuccess={onSuccess} />);

    await fillValidForm(user);
    await waitFor(() => expect(screen.getByRole('button', { name: /submit/i })).toBeEnabled());
    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(onSuccess).toHaveBeenCalledOnce();

    const items = store.getState().submissions.items;
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      source: 'rhf',
      name: 'Alice',
      age: 30,
      email: 'alice@mail.com',
      gender: 'female',
      country: 'Canada',
      terms: true,
      image: null,
    });
  });
});
