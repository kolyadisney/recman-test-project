import React from 'react';
import { createPortal } from 'react-dom';

import {
  BackdropLayer,
  ModalBody,
  ModalContainer,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  CloseButton,
} from './modal.styled';

import type { ModalProps } from './types';

function useLockBodyScroll(isActive: boolean) {
  React.useEffect(() => {
    if (!isActive) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isActive]);
}

const useReturnFocus = (isActive: boolean) => {
  const previouslyFocusedElementRef = React.useRef<HTMLElement | null>(null);
  React.useEffect(() => {
    if (isActive) {
      previouslyFocusedElementRef.current = document.activeElement as HTMLElement | null;
      return () => {
        previouslyFocusedElementRef.current?.focus?.();
      };
    }
  }, [isActive]);
};

function ensurePortalContainer(customContainer?: HTMLElement | null): HTMLElement | null {
  if (typeof window === 'undefined' || typeof document === 'undefined') return null;
  if (customContainer) return customContainer;
  let portal = document.getElementById('modal-root');
  if (!portal) {
    portal = document.createElement('div');
    portal.setAttribute('id', 'modal-root');
    document.body.appendChild(portal);
  }
  return portal;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  ariaLabel,
  children,
  size = 'md',
  hideCloseButton = false,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  portalContainer,
  headerActionsSlot,
  footerSlot,
}) => {
  const portalNode = ensurePortalContainer(portalContainer);
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const titleId = React.useId();

  useLockBodyScroll(isOpen);
  useReturnFocus(isOpen);
  // useFocusTrap(dialogRef, isOpen, initialFocusRef);

  React.useEffect(() => {
    if (!isOpen || !closeOnEscape) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => document.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [isOpen, closeOnEscape, onClose]);

  if (!isOpen || !portalNode) return null;

  const handleBackdropMouseDown: React.MouseEventHandler<HTMLDivElement> = (event) => {
    if (!closeOnBackdropClick) return;
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <BackdropLayer onMouseDown={handleBackdropMouseDown} aria-hidden={false}>
      <ModalContainer
        ref={dialogRef}
        size={size}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-label={!title ? ariaLabel : undefined}
        tabIndex={-1}
      >
        <ModalHeader>
          {title ? <ModalTitle id={titleId}>{title}</ModalTitle> : <span />}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {headerActionsSlot}
            {!hideCloseButton && (
              <CloseButton type="button" aria-label="Close modal" onClick={onClose}>
                ✕
              </CloseButton>
            )}
          </div>
        </ModalHeader>

        <ModalBody>{children}</ModalBody>

        {footerSlot ? <ModalFooter>{footerSlot}</ModalFooter> : null}
      </ModalContainer>
    </BackdropLayer>,
    portalNode,
  );
};
