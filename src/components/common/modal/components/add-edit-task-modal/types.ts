import type { ModalCommonProps } from '@/components/common/modal/types.ts';
import type { Task } from '@/store/useBoardStore.ts';

export interface IForwardProps {
  initialData?: {
    task?: Task;
    columnId?: string;
  };
}

export interface IOwnProps extends ModalCommonProps<IForwardProps> {}

export type AddEditTaskModalProps = IOwnProps;
