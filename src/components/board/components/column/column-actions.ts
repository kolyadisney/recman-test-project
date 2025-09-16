import type { ActionItem } from '@/components/common/mobile-action-sheet/types';
import type { BoardState } from '@/store/useBoardStore';

interface GetColumnActionsArgs {
  columnId: string;
  board: BoardState;
  reorderColumns: (sourceIndex: number, destinationIndex: number) => void;

  onRename: () => void;
  onDelete: () => void;
  onAddTask: () => void;
}

export function getColumnActions({
  columnId,
  board,
  reorderColumns,
  onRename,
  onDelete,
  onAddTask,
}: GetColumnActionsArgs): ActionItem[] {
  const columnOrder = board.columnOrder;
  const currentIndex = columnOrder.indexOf(columnId);
  const lastIndex = columnOrder.length - 1;

  const disabledInvalidIndex = currentIndex < 0;

  return [
    {
      id: 'move-first',
      label: 'Move to first',
      disabled: disabledInvalidIndex || currentIndex <= 0,
      onPress: () => reorderColumns(currentIndex, 0),
    },
    {
      id: 'move-left',
      label: 'Move left',
      disabled: disabledInvalidIndex || currentIndex <= 0,
      onPress: () => reorderColumns(currentIndex, currentIndex - 1),
    },
    {
      id: 'move-right',
      label: 'Move right',
      disabled: disabledInvalidIndex || currentIndex >= lastIndex,
      onPress: () => reorderColumns(currentIndex, currentIndex + 1),
    },
    {
      id: 'move-last',
      label: 'Move to last',
      disabled: disabledInvalidIndex || currentIndex >= lastIndex,
      onPress: () => reorderColumns(currentIndex, lastIndex),
    },
    {
      id: 'add-task',
      label: 'Add task',
      onPress: onAddTask,
    },
    {
      id: 'rename',
      label: 'Rename column',
      onPress: onRename,
    },
    {
      id: 'delete',
      label: 'Delete column',
      onPress: onDelete,
    },
  ];
}
