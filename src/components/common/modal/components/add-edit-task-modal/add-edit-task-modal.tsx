import React from 'react';

import { Button, Input } from '@/components';
import { Modal } from '@/components/common/modal';
import { useBoardStore } from '@/store/useBoardStore';

import type { AddEditTaskModalProps } from '@/components/common/modal/components/add-edit-task-modal/types';

export const AddEditTaskModal: React.FC<AddEditTaskModalProps> = ({
  forwardedProps,
  modalParams,
}) => {
  const addTask = useBoardStore((store) => store.addTask);
  const updateTask = useBoardStore((store) => store.updateTask);

  const modalTitleFromProps = forwardedProps?.title ?? 'Task';
  const initialColumnIdentifier = forwardedProps?.initialData?.columnId ?? '';
  const initialTaskIdentifier = forwardedProps?.initialData?.task?.id ?? '';
  const initialTaskTitleFromProps = forwardedProps?.initialData?.task?.title ?? '';

  const isEditMode = Boolean(initialTaskIdentifier);

  const inputIdentifier = React.useId();
  const [taskTitle, setTaskTitle] = React.useState<string>('');
  const [validationErrorMessage, setValidationErrorMessage] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);

  React.useEffect(() => {
    setTaskTitle(initialTaskTitleFromProps);
  }, [initialTaskTitleFromProps]);

  const closeModalSafely = React.useCallback(() => {
    modalParams?.onClose?.();
  }, [modalParams]);

  const validateTitle = React.useCallback((rawTitle: string): string | null => {
    const normalized = rawTitle.trim();
    if (normalized.length === 0) return 'Title cannot be empty';
    if (normalized.length > 200) return 'Title is too long';
    return null;
  }, []);

  const handleSubmit = React.useCallback(
    (event?: React.FormEvent) => {
      event?.preventDefault();
      if (isSubmitting) return;

      const normalizedTitle = taskTitle.trim().replace(/\s+/g, ' ');
      const error = validateTitle(normalizedTitle);
      setValidationErrorMessage(error);
      if (error) return;

      if (!isEditMode && !initialColumnIdentifier) {
        setValidationErrorMessage('Column is not specified');
        return;
      }

      setIsSubmitting(true);
      try {
        if (isEditMode) {
          updateTask(initialTaskIdentifier, normalizedTitle);
        } else {
          addTask(initialColumnIdentifier, normalizedTitle);
        }
        closeModalSafely();
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      isSubmitting,
      taskTitle,
      validateTitle,
      isEditMode,
      initialColumnIdentifier,
      initialTaskIdentifier,
      updateTask,
      addTask,
      closeModalSafely,
    ],
  );

  const footerSlot = React.useMemo(
    () => (
      <>
        <Button color="default" variant="bordered" onClick={closeModalSafely} type="button">
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isEditMode ? 'Save' : 'Add'}
        </Button>
      </>
    ),
    [closeModalSafely, handleSubmit, isSubmitting, isEditMode],
  );

  return (
    <Modal
      {...modalParams}
      title={isEditMode ? `Edit ${modalTitleFromProps}` : `Add ${modalTitleFromProps}`}
      footerSlot={footerSlot}
    >
      <form onSubmit={handleSubmit} noValidate>
        <Input
          id={inputIdentifier}
          name="taskTitle"
          variant="flat"
          label="Task title"
          placeholder="Enter task title"
          fullWidth
          autoFocus
          value={taskTitle}
          onChange={(event) => {
            setTaskTitle(event.target.value);
            if (validationErrorMessage) setValidationErrorMessage(null);
          }}
          aria-invalid={Boolean(validationErrorMessage)}
          aria-describedby={validationErrorMessage ? `${inputIdentifier}-error` : undefined}
          maxLength={200}
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

        <button type="submit" hidden />
      </form>
    </Modal>
  );
};
