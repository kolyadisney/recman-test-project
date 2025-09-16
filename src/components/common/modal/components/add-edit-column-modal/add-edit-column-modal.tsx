import React from 'react';

import { Button, Input } from '@/components';
import { Modal } from '@/components/common/modal';
import { useBoardStore } from '@/store/useBoardStore';

import type { AddEditColumnModalProps } from './types';

export const AddEditColumnModal: React.FC<AddEditColumnModalProps> = ({
  forwardedProps,
  modalParams,
}) => {
  const addColumn = useBoardStore((store) => store.addColumn);
  const renameColumn = useBoardStore((store) => store.renameColumn);

  const modalTitleFromProps = forwardedProps?.title ?? 'Column';
  const initialColumnIdentifier = forwardedProps?.initialData?.columnId ?? '';
  const initialColumnTitleFromProps = forwardedProps?.initialData?.columnTitle ?? '';

  const isEditMode = Boolean(initialColumnIdentifier);

  const inputIdentifier = React.useId();
  const [columnTitle, setColumnTitle] = React.useState<string>('');
  const [validationErrorMessage, setValidationErrorMessage] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);

  React.useEffect(() => {
    setColumnTitle(initialColumnTitleFromProps);
  }, [initialColumnTitleFromProps]);

  const closeModalSafely = React.useCallback(() => {
    modalParams?.onClose?.();
  }, [modalParams]);

  const validateTitle = React.useCallback((rawTitle: string): string | null => {
    const normalized = rawTitle.trim();
    if (normalized.length === 0) return 'Title cannot be empty';
    if (normalized.length > 80) return 'Title is too long';
    return null;
  }, []);

  const handleSubmit: React.FormEventHandler = React.useCallback(
    (event) => {
      event.preventDefault();
      if (isSubmitting) return;

      const normalizedTitle = columnTitle.trim().replace(/\s+/g, ' ');
      const error = validateTitle(normalizedTitle);
      setValidationErrorMessage(error);
      if (error) return;

      setIsSubmitting(true);
      try {
        if (isEditMode) {
          renameColumn(initialColumnIdentifier, normalizedTitle);
        } else {
          addColumn(normalizedTitle);
        }
        closeModalSafely();
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      isSubmitting,
      columnTitle,
      validateTitle,
      isEditMode,
      renameColumn,
      initialColumnIdentifier,
      addColumn,
      closeModalSafely,
    ],
  );

  const footerSlot = React.useMemo(
    () => (
      <>
        <Button color="default" variant="bordered" type="button" onClick={closeModalSafely}>
          Cancel
        </Button>
        <Button type="submit" form="add-edit-column-form" disabled={isSubmitting}>
          {isEditMode ? 'Save' : 'Add'}
        </Button>
      </>
    ),
    [closeModalSafely, isSubmitting, isEditMode],
  );

  return (
    <Modal
      {...modalParams}
      title={isEditMode ? `Edit ${modalTitleFromProps}` : `Add ${modalTitleFromProps}`}
      footerSlot={footerSlot}
    >
      <form id="add-edit-column-form" onSubmit={handleSubmit} noValidate>
        <Input
          id={inputIdentifier}
          name="columnTitle"
          label="Column title"
          placeholder="Enter column title"
          variant="flat"
          fullWidth
          autoFocus
          value={columnTitle}
          onChange={(event) => {
            setColumnTitle(event.target.value);
            if (validationErrorMessage) setValidationErrorMessage(null);
          }}
          aria-invalid={Boolean(validationErrorMessage)}
          aria-describedby={validationErrorMessage ? `${inputIdentifier}-error` : undefined}
          maxLength={80}
        />

        {validationErrorMessage ? (
          <div
            id={`${inputIdentifier}-error`}
            role="alert"
            style={{ marginTop: 8, fontSize: 12, color: 'var(--error, #ef4444)' }}
          >
            {validationErrorMessage}
          </div>
        ) : null}
      </form>
    </Modal>
  );
};
