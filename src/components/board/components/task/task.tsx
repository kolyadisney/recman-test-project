import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { PencilIcon } from '@heroicons/react/16/solid';
import { CheckIcon, TrashIcon, EllipsisVerticalIcon } from '@heroicons/react/24/solid';
import React from 'react';

import { Button, Checkbox } from '@/components';
import { getTaskActions } from '@/components/board/components/task/task-action.ts';
import { MobileActionSheet } from '@/components/common/mobile-action-sheet/mobile-actoin-sheet.tsx';
import { EModalsMaps } from '@/components/common/modal/config';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { useLongPress } from '@/hooks/useLongPress';
import { useBoardStore } from '@/store/useBoardStore';
import { useModalStore } from '@/store/useModalStore';
import { highlightSearchTerm } from '@/utils/search';

import { TaskActionsContainer, TaskContainerStyled, TaskTitle } from './task.styled';

interface TaskItemProps {
  taskIdentifier: string;
  index: number;
}

export const TaskItem: React.FC<TaskItemProps> = ({ taskIdentifier, index }) => {
  const elementRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [isOverTarget, setIsOverTarget] = React.useState(false);

  const [isActionSheetOpen, setIsActionSheetOpen] = React.useState(false);
  const openSheet = React.useCallback(() => setIsActionSheetOpen(true), []);
  const closeSheet = React.useCallback(() => setIsActionSheetOpen(false), []);
  const longPressHandlers = useLongPress(openSheet, { delayMs: 450 });

  const board = useBoardStore((s) => s.board);
  const task = useBoardStore((s) => s.board.tasks[taskIdentifier]);
  const searchQuery = useBoardStore((s) => s.searchQuery);
  const isTaskSelected = useBoardStore((s) => s.selectedTaskIdentifiers.has(taskIdentifier));

  const toggleTaskCompletion = useBoardStore((s) => s.toggleTaskCompletion);
  const deleteTask = useBoardStore((s) => s.deleteTask);
  const setTaskSelection = useBoardStore((s) => s.setTaskSelection);
  const reorderTasks = useBoardStore((s) => s.reorderTasks);
  const moveTask = useBoardStore((s) => s.moveTask);

  const { openModal } = useModalStore();

  useBodyScrollLock(isDragging || isActionSheetOpen);

  React.useEffect(() => {
    const element = elementRef.current;
    if (!element || !task) return;

    const cleanupDrag = draggable({
      element,
      getInitialData: () => ({
        type: 'task',
        taskId: task.id,
        columnId: task.columnId,
        index,
      }),
      onDragStart: () => setIsDragging(true),
      onDrop: () => setIsDragging(false),
    });

    const cleanupDrop = dropTargetForElements({
      element,
      getData: () => ({ type: 'task-target', index }),
      canDrop: ({ source }) => source.data.type === 'task',
      onDragEnter: () => setIsOverTarget(true),
      onDragLeave: () => setIsOverTarget(false),
      onDrop: ({ source }) => {
        setIsOverTarget(false);
        const sourceColumnId = source.data.columnId as string;
        const sourceIndex = source.data.index as number;

        const destinationColumnId = task.columnId;
        const destinationIndex = index;

        if (sourceColumnId === destinationColumnId) {
          if (sourceIndex !== destinationIndex) {
            reorderTasks(destinationColumnId, sourceIndex, destinationIndex);
          }
        } else {
          moveTask(sourceColumnId, destinationColumnId, sourceIndex, destinationIndex);
        }
      },
    });

    return () => {
      cleanupDrag();
      cleanupDrop();
    };
  }, [task?.id, task?.columnId, index, reorderTasks, moveTask]);

  const handleEditTask = React.useCallback(() => {
    if (!task) return;
    openModal({
      name: EModalsMaps.ADD_EDIT_TASK,
      forwardProps: { initialData: { task } },
    });
  }, [openModal, task]);

  const handleDeleteTask = React.useCallback(() => {
    if (!task) return;
    openModal({
      name: EModalsMaps.CONFIRMATION,
      forwardProps: {
        message: `Are you sure you want to delete task “${task.title}”?`,
        onConfirm: () => deleteTask(task.id),
      },
    });
  }, [deleteTask, openModal, task]);

  const actions = React.useMemo(
    () =>
      getTaskActions({
        task,
        board,
        reorderTasks,
        moveTask,
        toggleTaskCompletion,
        deleteTask,
      }),
    [task, board, reorderTasks, moveTask, toggleTaskCompletion, deleteTask],
  );

  if (!task) return null;

  return (
    <TaskContainerStyled
      ref={elementRef}
      {...longPressHandlers}
      $dragging={isDragging}
      $completed={task.isCompleted}
      $isOverTarget={isOverTarget}
    >
      <Checkbox
        ariaLabel="Select task"
        checked={isTaskSelected}
        onChange={(value) => setTaskSelection(taskIdentifier, value)}
      />

      <TaskTitle
        $completed={task.isCompleted}
        dangerouslySetInnerHTML={{ __html: highlightSearchTerm(task.title, searchQuery) }}
      />

      <TaskActionsContainer>
        <Button type="button" isIconOnly variant="flat" onClick={openSheet} title="More">
          <EllipsisVerticalIcon width={16} height={16} />
        </Button>
        <Button
          type="button"
          isIconOnly
          variant={task.isCompleted ? 'solid' : 'flat'}
          color="success"
          onClick={() => toggleTaskCompletion(task.id)}
          title={task.isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {task.isCompleted ? (
            <CheckIcon width={14} height={14} />
          ) : (
            <CheckIcon width={14} height={14} />
          )}
        </Button>

        <Button type="button" isIconOnly variant="solid" color="primary" onClick={handleEditTask}>
          <PencilIcon width={14} height={14} />
        </Button>

        <Button type="button" isIconOnly color="danger" onClick={handleDeleteTask}>
          <TrashIcon width={14} height={14} />
        </Button>
      </TaskActionsContainer>

      <MobileActionSheet
        isOpen={isActionSheetOpen}
        onClose={closeSheet}
        title="Task actions"
        actions={actions}
      />
    </TaskContainerStyled>
  );
};
