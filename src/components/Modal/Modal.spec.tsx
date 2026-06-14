import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from './Modal';

function renderModal(overrides: { isOpen?: boolean; onClose?: () => void } = {}) {
  const onClose = overrides.onClose ?? vi.fn();
  const isOpen = overrides.isOpen ?? true;
  render(
    <Modal isOpen={isOpen} onClose={onClose} title="Test modal">
      <button type="button">Inside</button>
    </Modal>,
  );
  return { onClose };
}

describe('Modal', () => {
  it('renders nothing when closed', () => {
    renderModal({ isOpen: false });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders into #modal-root with dialog semantics', () => {
    renderModal();
    const dialog = screen.getByRole('dialog');

    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(document.getElementById('modal-root')).toContainElement(dialog);
  });

  it('closes on Escape', async () => {
    const user = userEvent.setup();
    const { onClose } = renderModal();

    await user.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalledOnce();
  });

  it('closes on overlay click but not on content click', async () => {
    const user = userEvent.setup();
    const { onClose } = renderModal();

    await user.click(screen.getByRole('button', { name: 'Inside' }));
    expect(onClose).not.toHaveBeenCalled();

    await user.click(screen.getByTestId('modal-overlay'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('moves focus into the dialog when opened', () => {
    renderModal();

    expect(screen.getByRole('dialog')).toHaveFocus();
  });
});
