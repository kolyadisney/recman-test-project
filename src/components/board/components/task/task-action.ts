import type { ActionItem } from '@/components/common/mobile-action-sheet/types';
import type { BoardState, Task } from '@/store/useBoardStore';

type ReorderTasks = (columnId: string, sourceIndex: number, destinationIndex: number) => void;
type MoveTask = (
  sourceColumnId: string,
  destinationColumnId: string,
  sourceIndex: number,
  destinationIndex: number,
) => void;
type ToggleTaskCompletion = (taskId: string) => void;
type DeleteTask = (taskId: string) => void;

interface GetTaskActionsArgs {
  task: Task;
  board: BoardState;
  reorderTasks: ReorderTasks;
  moveTask: MoveTask;
  toggleTaskCompletion: ToggleTaskCompletion;
  deleteTask: DeleteTask;
}

export function getTaskActions({
  task,
  board,
  reorderTasks,
  moveTask,
  toggleTaskCompletion,
  deleteTask,
}: GetTaskActionsArgs): ActionItem[] {
  const currentColumn = board.columns[task.columnId];
  const currentIndex = currentColumn.taskIdentifiers.indexOf(task.id);
  const lastIndex = currentColumn.taskIdentifiers.length - 1;

  const columnOrder = board.columnOrder;
  const boardColumnIndex = columnOrder.indexOf(task.columnId);

  return [
    {
      id: 'top',
      label: 'Move to top',
      disabled: currentIndex <= 0,
      onPress: () => reorderTasks(task.columnId, currentIndex, 0),
    },
    {
      id: 'up',
      label: 'Move up',
      disabled: currentIndex <= 0,
      onPress: () => reorderTasks(task.columnId, currentIndex, currentIndex - 1),
    },
    {
      id: 'down',
      label: 'Move down',
      disabled: currentIndex < 0 || currentIndex >= lastIndex,
      onPress: () => reorderTasks(task.columnId, currentIndex, currentIndex + 1),
    },
    {
      id: 'bottom',
      label: 'Move to bottom',
      disabled: currentIndex < 0 || currentIndex >= lastIndex,
      onPress: () => reorderTasks(task.columnId, currentIndex, lastIndex),
    },
    {
      id: 'prev-col',
      label: 'Move to previous column',
      disabled: boardColumnIndex <= 0,
      onPress: () => {
        const prevColumnId = columnOrder[boardColumnIndex - 1];
        moveTask(
          task.columnId,
          prevColumnId,
          currentIndex,
          board.columns[prevColumnId].taskIdentifiers.length,
        );
      },
    },
    {
      id: 'next-col',
      label: 'Move to next column',
      disabled: boardColumnIndex < 0 || boardColumnIndex >= columnOrder.length - 1,
      onPress: () => {
        const nextColumnId = columnOrder[boardColumnIndex + 1];
        moveTask(
          task.columnId,
          nextColumnId,
          currentIndex,
          board.columns[nextColumnId].taskIdentifiers.length,
        );
      },
    },
    {
      id: 'toggle-complete',
      label: task.isCompleted ? 'Mark as incomplete' : 'Mark as complete',
      onPress: () => toggleTaskCompletion(task.id),
    },
    {
      id: 'delete',
      label: 'Delete task',
      onPress: () => deleteTask(task.id),
    },
  ];
}
