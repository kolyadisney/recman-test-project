import type { ModalCommonProps } from '@/components/common/modal/types.ts';

export interface IForwardProps {
  initialData?: {
    columnId?: string;
    columnTitle?: string;
  };
}

export interface IOwnProps extends ModalCommonProps<IForwardProps> {}

export type AddEditColumnModalProps = IOwnProps;
