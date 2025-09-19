import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { PencilIcon } from '@heroicons/react/16/solid';
import { EllipsisVerticalIcon, TrashIcon } from '@heroicons/react/24/solid';
import React from 'react';

import { Button, Checkbox } from '@/components';
import { TaskItem } from '@/components/board/components';
import { MobileActionSheet } from '@/components/common/mobile-action-sheet/mobile-actoin-sheet.tsx';
import { EModalsMaps } from '@/components/common/modal/config';
import { useBoardStore } from '@/store/useBoardStore';
import { useModalStore } from '@/store/useModalStore';

import { getColumnActions } from './column-actions';
import {
  ColumnHeader,
  ColumnTasksWrapperStyled,
  ColumnTitle,
  ColumnWrapper,
  ColumnActionsRow,
  EmptyState,
  ColumnAllTasksActionsButtons,
} from './column.styled';

import type { ColumnProps } from './types';

export const Column: React.FC<ColumnProps> = ({ columnId, index }) => {
  const columnElementReference = React.useRef<HTMLDivElement>(null);
  const columnTasksZoneReference = React.useRef<HTMLDivElement>(null);

  const [isOverColumnDrag, setIsOverColumnDrag] = React.useState(false);
  const [isOverTasksZoneDrag, setIsOverTasksZoneDrag] = React.useState(false);

  const [isActionSheetOpen, setIsActionSheetOpen] = React.useState(false);
  const openSheet = React.useCallback(() => setIsActionSheetOpen(true), []);
  const closeSheet = React.useCallback(() => setIsActionSheetOpen(false), []);

  const board = useBoardStore((store) => store.board);
  const columnFromStore = useBoardStore((store) => store.board.columns[columnId]);
  const tasksByIdentifierFromStore = useBoardStore((store) => store.board.tasks);
  const columnTaskIdentifiersFromStore = useBoardStore(
    (store) => store.board.columns[columnId]?.taskIdentifiers ?? [],
  );
  const currentFilter = useBoardStore((store) => store.filter);
  const currentSearchQuery = useBoardStore((store) => store.searchQuery);
  const selectedTaskIdentifiersSet = useBoardStore((store) => store.selectedTaskIdentifiers);

  const reorderColumns = useBoardStore((store) => store.reorderColumns);
  const deleteColumn = useBoardStore((store) => store.deleteColumn);
  const selectAllInColumn = useBoardStore((store) => store.selectAllInColumn);
  const bulkComplete = useBoardStore((store) => store.bulkComplete);
  const bulkDelete = useBoardStore((store) => store.bulkDelete);
  const moveTask = useBoardStore((store) => store.moveTask);
  const reorderTasks = useBoardStore((store) => store.reorderTasks);
  const getFilteredTasks = useBoardStore((store) => store.getFilteredTasks);

  const { openModal } = useModalStore();

  const selectedTaskIdentifiersInColumn = React.useMemo(
    () => columnTaskIdentifiersFromStore.filter((id) => selectedTaskIdentifiersSet.has(id)),
    [columnTaskIdentifiersFromStore, selectedTaskIdentifiersSet],
  );

  const deleteWholeColumn = React.useCallback(() => {
    if (!columnFromStore) return;
    openModal({
      name: EModalsMaps.CONFIRMATION,
      forwardProps: {
        message: `Are you sure you want to delete column “${columnFromStore.title}” with all its tasks?`,
        onConfirm: () => deleteColumn(columnId),
      },
    });
  }, [columnFromStore, columnId, deleteColumn, openModal]);

  const onEditColumn = React.useCallback(() => {
    if (!columnFromStore) return;
    openModal({
      name: EModalsMaps.ADD_EDIT_COLUMN,
      forwardProps: {
        initialData: { columnId, columnTitle: columnFromStore.title },
      },
    });
  }, [columnFromStore, columnId, openModal]);

  const areAllTasksInColumnSelected =
    columnTaskIdentifiersFromStore.length > 0 &&
    selectedTaskIdentifiersInColumn.length === columnTaskIdentifiersFromStore.length;

  const hasAnySelectedTasksInColumn = selectedTaskIdentifiersInColumn.length > 0;

  const areAllSelectedCompleted = React.useMemo(
    () =>
      hasAnySelectedTasksInColumn &&
      selectedTaskIdentifiersInColumn.every((id) => board.tasks[id]?.isCompleted === true),
    [board.tasks, hasAnySelectedTasksInColumn, selectedTaskIdentifiersInColumn],
  );

  const bulkToggleButtonLabel = areAllSelectedCompleted
    ? 'Uncomplete selected'
    : 'Complete selected';

  const handleBulkToggleComplete = React.useCallback(() => {
    if (!hasAnySelectedTasksInColumn) return;
    bulkComplete(selectedTaskIdentifiersInColumn, !areAllSelectedCompleted);
    selectAllInColumn(columnId, false);
  }, [
    hasAnySelectedTasksInColumn,
    bulkComplete,
    selectedTaskIdentifiersInColumn,
    areAllSelectedCompleted,
    selectAllInColumn,
    columnId,
  ]);

  const filteredTasksForColumn = React.useMemo(
    () => getFilteredTasks(columnId),
    [getFilteredTasks, columnId, currentFilter, currentSearchQuery, tasksByIdentifierFromStore],
  );

  React.useEffect(() => {
    const element = columnElementReference.current;
    if (!element) return;

    const cleanupDrag = draggable({
      element,
      getInitialData: () => ({ type: 'column', columnId, index }),
    });

    const cleanupDrop = dropTargetForElements({
      element,
      getData: () => ({ type: 'column', columnId, index }),
      canDrop: ({ source }) => source.data.type === 'column',
      onDragEnter: () => setIsOverColumnDrag(true),
      onDragLeave: () => setIsOverColumnDrag(false),
      onDrop: ({ source }) => {
        setIsOverColumnDrag(false);
        const sourceIndex = source.data.index as number;
        if (sourceIndex !== index) reorderColumns(sourceIndex, index);
      },
    });

    return () => {
      cleanupDrag();
      cleanupDrop();
    };
  }, [columnId, index, reorderColumns]);

  React.useEffect(() => {
    const element = columnTasksZoneReference.current;
    if (!element) return;

    const cleanup = dropTargetForElements({
      element,
      getData: () => ({ type: 'tasks-zone', columnId }),
      canDrop: ({ source }) => source.data.type === 'task',
      onDragEnter: () => setIsOverTasksZoneDrag(true),
      onDragLeave: () => setIsOverTasksZoneDrag(false),
      onDrop: ({ source, location }) => {
        setIsOverTasksZoneDrag(false);

        const hitTask = location.current.dropTargets.some(
          (target) => (target.data as any)?.type === 'task-target',
        );
        if (hitTask) return;

        const sourceColumnId = source.data.columnId as string;
        const sourceIndex = source.data.index as number;
        const destinationIndex = columnTaskIdentifiersFromStore.length;

        if (sourceColumnId === columnId) {
          if (sourceIndex !== destinationIndex) {
            reorderTasks(columnId, sourceIndex, destinationIndex);
          }
        } else {
          moveTask(sourceColumnId, columnId, sourceIndex, destinationIndex);
        }
      },
    });

    return () => cleanup();
  }, [columnId, columnTaskIdentifiersFromStore.length, moveTask, reorderTasks]);

  const columnActions = React.useMemo(
    () =>
      getColumnActions({
        columnId,
        board,
        reorderColumns,
        onRename: onEditColumn,
        onDelete: deleteWholeColumn,
        onAddTask: () =>
          openModal({
            name: EModalsMaps.ADD_EDIT_TASK,
            forwardProps: { initialData: { columnId } },
          }),
      }),
    [columnId, board, reorderColumns, onEditColumn, deleteWholeColumn, openModal],
  );

  const toggleSelectAllTasksInColumn = (checked: boolean) => {
    selectAllInColumn(columnId, checked);
  };

  const deleteSelectedTasksInColumn = () => {
    if (!hasAnySelectedTasksInColumn) return;
    openModal({
      name: EModalsMaps.CONFIRMATION,
      forwardProps: {
        message: `Delete ${selectedTaskIdentifiersInColumn.length} selected task(s) from “${columnFromStore.title}”?`,
        onConfirm: () => bulkDelete(selectedTaskIdentifiersInColumn),
      },
    });
  };

  const hasAnyTasksInColumn = columnTaskIdentifiersFromStore.length > 0;

  const handleAddingTask = () => {
    openModal({
      name: EModalsMaps.ADD_EDIT_TASK,
      forwardProps: { initialData: { columnId } },
    });
  };

  if (!columnFromStore) return null;

  return (
    <ColumnWrapper ref={columnElementReference} $isOverColumn={isOverColumnDrag}>
      <ColumnHeader>
        <ColumnTitle>{columnFromStore.title}</ColumnTitle>

        <div style={{ display: 'flex', gap: 8 }}>
          <Button type="button" onClick={handleAddingTask} size="sm">
            Add task
          </Button>
          <Button
            type="button"
            onClick={openSheet}
            variant="flat"
            isIconOnly
            title="More"
            aria-label="Column menu"
          >
            <EllipsisVerticalIcon width={16} height={16} />
          </Button>
          <Button type="button" onClick={onEditColumn} color="primary" isIconOnly title="Rename">
            <PencilIcon width={14} height={14} />
          </Button>

          <Button
            type="button"
            onClick={deleteWholeColumn}
            color="danger"
            isIconOnly
            title="Delete"
          >
            <TrashIcon width={14} height={14} />
          </Button>
        </div>
      </ColumnHeader>
      {columnFromStore.taskIdentifiers.length > 0 && (
        <ColumnActionsRow>
          <Checkbox
            checked={areAllTasksInColumnSelected}
            onChange={(value) => toggleSelectAllTasksInColumn(value)}
            label={`Select all (${selectedTaskIdentifiersInColumn.length}/${columnTaskIdentifiersFromStore.length})`}
          />
          <ColumnAllTasksActionsButtons>
            <Button
              type="button"
              onClick={handleBulkToggleComplete}
              disabled={!hasAnySelectedTasksInColumn}
            >
              {bulkToggleButtonLabel}
            </Button>
            <Button
              type="button"
              onClick={deleteSelectedTasksInColumn}
              color="danger"
              disabled={!hasAnySelectedTasksInColumn}
            >
              Delete selected
            </Button>
          </ColumnAllTasksActionsButtons>
        </ColumnActionsRow>
      )}

      <ColumnTasksWrapperStyled ref={columnTasksZoneReference} $isOverZone={isOverTasksZoneDrag}>
        {filteredTasksForColumn.length === 0 ? (
          <EmptyState $isOverZone={isOverTasksZoneDrag}>
            {hasAnyTasksInColumn ? 'No matching tasks' : 'Empty tasks'}
          </EmptyState>
        ) : (
          filteredTasksForColumn.map((task, taskIndex) => (
            <TaskItem key={task.id} taskIdentifier={task.id} index={taskIndex} />
          ))
        )}
      </ColumnTasksWrapperStyled>

      <MobileActionSheet
        isOpen={isActionSheetOpen}
        onClose={closeSheet}
        title="Column actions"
        actions={columnActions}
      />
    </ColumnWrapper>
  );
};
