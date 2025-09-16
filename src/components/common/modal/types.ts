import type React from 'react';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;

  size?: ModalSize;

  title?: string;
  ariaLabel?: string;

  children: React.ReactNode;

  hideCloseButton?: boolean;

  closeOnBackdropClick?: boolean;

  closeOnEscape?: boolean;

  portalContainer?: HTMLElement | null;

  headerActionsSlot?: React.ReactNode;

  footerSlot?: React.ReactNode;
}

export type TForwardProps<ForwardProps = NonNullable<unknown>> = ForwardProps & {
  title?: string;
};

export interface ModalCommonProps<ForwardProps = NonNullable<unknown>> {
  forwardedProps: TForwardProps<ForwardProps>;

  modalParams: {
    isOpen: boolean;
    onClose: () => void;
    className?: string;
  };

  publicParams: any;
}
