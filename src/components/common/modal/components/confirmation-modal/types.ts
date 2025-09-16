import React from 'react';

import type { ModalCommonProps } from '@/components/common/modal/types.ts';

export interface IForwardProps {
  message: React.ReactNode | string;
  title?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
}

export interface IOwnProps extends ModalCommonProps<IForwardProps> {}

export type ConfirmationModalProps = IOwnProps;
