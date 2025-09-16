import React from 'react';

import { Button } from '@/components';
import { Modal } from '@/components/common/modal';

import type { ConfirmationModalProps } from './types';

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  forwardedProps,
  modalParams,
}) => {
  const {
    title = 'Confirm action',
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    onConfirm,
  } = forwardedProps ?? {};

  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleClose = React.useCallback(() => {
    modalParams?.onClose?.();
  }, [modalParams]);

  const handleConfirm = React.useCallback(async () => {
    if (!onConfirm) return;
    setErrorMessage(null);
    try {
      onConfirm();
      handleClose();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Something went wrong. Please try again.',
      );
    }
  }, [onConfirm, handleClose]);

  const footerSlot = React.useMemo(
    () => (
      <>
        <Button type="button" color="default" variant="bordered" onClick={handleClose}>
          {cancelLabel}
        </Button>
        <Button type="button" onClick={handleConfirm}>
          {confirmLabel}
        </Button>
      </>
    ),
    [cancelLabel, confirmLabel, handleClose, handleConfirm],
  );

  return (
    <Modal {...modalParams} title={title} footerSlot={footerSlot}>
      <div role="document" aria-live="polite">
        {typeof message === 'string' ? <p style={{ margin: 0 }}>{message}</p> : message}
        {errorMessage ? (
          <p style={{ marginTop: 12, fontSize: 12, color: 'var(--error, #ef4444)' }}>
            {errorMessage}
          </p>
        ) : null}
      </div>
    </Modal>
  );
};
