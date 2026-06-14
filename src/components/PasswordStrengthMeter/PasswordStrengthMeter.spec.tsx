import { render, screen } from '@testing-library/react';
import PasswordStrengthMeter from './PasswordStrengthMeter';

describe('PasswordStrengthMeter', () => {
  it('renders nothing for an empty password', () => {
    const { container } = render(<PasswordStrengthMeter password="" />);

    expect(container).toBeEmptyDOMElement();
  });

  it('labels a strong password', () => {
    render(<PasswordStrengthMeter password="Abcdef1!" />);

    expect(screen.getByText('Strong')).toBeInTheDocument();
  });

  it('labels a weak password', () => {
    render(<PasswordStrengthMeter password="abc" />);

    expect(screen.getByText(/weak/i)).toBeInTheDocument();
  });
});
