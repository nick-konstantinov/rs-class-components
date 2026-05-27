import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Pagination from './Pagination';

describe('Pagination', () => {
  it('renders nothing when totalPages is 0', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={0} onPageChange={() => {}} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders all pages without ellipsis when totalPages <= 7', () => {
    render(<Pagination currentPage={3} totalPages={7} onPageChange={() => {}} />);

    expect(screen.getAllByRole('button', { name: /^[1-7]$/ })).toHaveLength(7);
    expect(screen.queryByText('…')).not.toBeInTheDocument();
  });

  it('marks the current page with aria-current and disables it', () => {
    render(<Pagination currentPage={3} totalPages={5} onPageChange={() => {}} />);

    const current = screen.getByRole('button', { name: '3' });
    expect(current).toHaveAttribute('aria-current', 'page');
    expect(current).toBeDisabled();
  });

  it('shows both ellipses when current is in the middle', () => {
    render(<Pagination currentPage={6} totalPages={10} onPageChange={() => {}} />);

    expect(screen.getAllByText('…')).toHaveLength(2);
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '5' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '6' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '7' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '10' })).toBeInTheDocument();
  });

  it('shows only right ellipsis at the start', () => {
    render(<Pagination currentPage={2} totalPages={10} onPageChange={() => {}} />);

    expect(screen.getAllByText('…')).toHaveLength(1);
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '10' })).toBeInTheDocument();
  });

  it('shows only left ellipsis at the end', () => {
    render(<Pagination currentPage={9} totalPages={10} onPageChange={() => {}} />);

    expect(screen.getAllByText('…')).toHaveLength(1);
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '8' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '10' })).toBeInTheDocument();
  });

  it('inlines page 2 when current is 4 (gap of one page)', () => {
    render(<Pagination currentPage={4} totalPages={10} onPageChange={() => {}} />);

    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
    expect(screen.getAllByText('…')).toHaveLength(1);
  });

  it('disables prev on first page and next on last page', () => {
    const { rerender } = render(
      <Pagination currentPage={1} totalPages={10} onPageChange={() => {}} />,
    );

    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next page' })).not.toBeDisabled();

    rerender(<Pagination currentPage={10} totalPages={10} onPageChange={() => {}} />);

    expect(screen.getByRole('button', { name: 'Previous page' })).not.toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
  });

  it('calls onPageChange when a page number is clicked', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(<Pagination currentPage={5} totalPages={10} onPageChange={onPageChange} />);

    await user.click(screen.getByRole('button', { name: '4' }));

    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it('calls onPageChange with current ± 1 for prev/next', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(<Pagination currentPage={5} totalPages={10} onPageChange={onPageChange} />);

    await user.click(screen.getByRole('button', { name: 'Next page' }));
    expect(onPageChange).toHaveBeenLastCalledWith(6);

    await user.click(screen.getByRole('button', { name: 'Previous page' }));
    expect(onPageChange).toHaveBeenLastCalledWith(4);
  });
});
