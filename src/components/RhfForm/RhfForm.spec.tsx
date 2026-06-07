import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithStore } from '@/test-utils/renderWithStore';
import RhfForm from './RhfForm';

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

  it('dispatches a submission and calls onSuccess', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    const { store } = renderWithStore(<RhfForm onSuccess={onSuccess} />);

    await user.type(screen.getByLabelText('Name'), 'Alice');
    await user.type(screen.getByLabelText('Age'), '30');
    await user.type(screen.getByLabelText('Email'), 'alice@mail.com');
    await user.click(screen.getByLabelText('Female'));
    await user.type(screen.getByLabelText('Country'), 'Canada');
    await user.click(screen.getByLabelText(/terms and conditions/i));

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
