import { render, screen } from '@testing-library/react';
import type { Submission } from '@/types/submission';
import SubmissionCard from './SubmissionCard';
import styles from './SubmissionCard.module.scss';

const submission: Submission = {
  id: '1',
  source: 'rhf',
  name: 'Alice',
  age: 30,
  email: 'alice@mail.com',
  gender: 'female',
  terms: true,
  country: 'Japan',
  image: null,
  createdAt: 1700000000000,
};

describe('SubmissionCard', () => {
  it('renders all submitted fields', () => {
    render(<SubmissionCard submission={submission} />);

    expect(screen.getByRole('heading', { name: 'Alice' })).toBeInTheDocument();
    expect(screen.getByText('alice@mail.com')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('female')).toBeInTheDocument();
    expect(screen.getByText('Japan')).toBeInTheDocument();
    expect(screen.getByText('React Hook Form')).toBeInTheDocument();
  });

  it('shows an image placeholder when there is no image', () => {
    render(<SubmissionCard submission={submission} />);

    expect(screen.getByText(/no image/i)).toBeInTheDocument();
  });

  it('applies the highlight class only when highlighted', () => {
    const { container, rerender } = render(<SubmissionCard submission={submission} />);
    expect(container.firstChild).not.toHaveClass(styles.highlighted);

    rerender(<SubmissionCard submission={submission} highlighted />);
    expect(container.firstChild).toHaveClass(styles.highlighted);
  });
});
