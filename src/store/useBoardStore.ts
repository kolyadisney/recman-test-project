import { enableMapSet } from 'immer';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

enableMapSet();

export interface Task {
  id: string;
  title: string;
  isCompleted: boolean;
  columnId: string;
}

export interface Column {
  id: string;
  title: string;
  taskIdentifiers: string[];
}

export interface BoardState {
  tasks: Record<string, Task>;
  columns: Record<string, Column>;
  columnOrder: string[];
}

export type Filter = 'all' | 'active' | 'completed';

export interface BoardStore {
  board: BoardState;
  filter: Filter;
  searchQuery: string;
  selectedTaskIdentifiers: Set<string>;

  addColumn: (title: string) => void;
  renameColumn: (columnIdentifier: string, title: string) => void;
  deleteColumn: (columnIdentifier: string) => void;
  reorderColumns: (sourceIndex: number, destinationIndex: number) => void;

  addTask: (columnIdentifier: string, title: string) => void;
  updateTask: (taskIdentifier: string, newTitle: string) => void;
  toggleTaskCompletion: (taskIdentifier: string) => void;
  deleteTask: (taskIdentifier: string) => void;

  reorderTasks: (columnIdentifier: string, sourceIndex: number, destinationIndex: number) => void;
  moveTask: (
    sourceColumnIdentifier: string,
    destinationColumnIdentifier: string,
    sourceIndex: number,
    destinationIndex: number,
  ) => void;

  setTaskSelection: (taskIdentifier: string, isSelected: boolean) => void;
  clearSelection: () => void;
  selectAllInColumn: (columnIdentifier: string, isSelected: boolean) => void;
  bulkComplete: (taskIdentifiers: string[], completed: boolean) => void;
  bulkDelete: (taskIdentifiers: string[]) => void;
  bulkMove: (taskIdentifiers: string[], destinationColumnIdentifier: string) => void;

  setFilter: (filter: Filter) => void;
  setSearchQuery: (query: string) => void;

  getColumnTasks: (columnIdentifier: string) => Task[];
  getFilteredTasks: (columnIdentifier: string) => Task[];
  getDirectSearchMatchRanges: (sourceText: string) => Array<{ start: number; end: number }>;
}

const normalizeString = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const computeLevenshteinDistance = (left: string, right: string): number => {
  if (left.length === 0) return right.length;
  if (right.length === 0) return left.length;

  const distanceMatrix: number[][] = Array.from({ length: right.length + 1 }, () =>
    new Array(left.length + 1).fill(0),
  );

  for (let leftIndex = 0; leftIndex <= left.length; leftIndex += 1) {
    distanceMatrix[0][leftIndex] = leftIndex;
  }
  for (let rightIndex = 0; rightIndex <= right.length; rightIndex += 1) {
    distanceMatrix[rightIndex][0] = rightIndex;
  }

  for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
    for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
      const substitutionCost = left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1;
      distanceMatrix[rightIndex][leftIndex] = Math.min(
        distanceMatrix[rightIndex][leftIndex - 1] + 1,
        distanceMatrix[rightIndex - 1][leftIndex] + 1,
        distanceMatrix[rightIndex - 1][leftIndex - 1] + substitutionCost,
      );
    }
  }
  return distanceMatrix[right.length][left.length];
};

const doesTextMatchQuery = (text: string, query: string): boolean => {
  const normalizedText = normalizeString(text);
  const normalizedQuery = normalizeString(query).trim();
  if (!normalizedQuery) return true;
  if (normalizedText.includes(normalizedQuery)) return true;

  const wordList = normalizedText.split(/\s+/);
  const allowedDistance = Math.max(1, Math.floor(normalizedQuery.length / 4));

  return wordList.some((word) => {
    if (word.length < 3 && normalizedQuery.length < 3) {
      return word === normalizedQuery;
    }
    return computeLevenshteinDistance(word, normalizedQuery) <= allowedDistance;
  });
};

const computeDirectMatchRanges = (text: string, query: string) => {
  const ranges: Array<{ start: number; end: number }> = [];
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return ranges;

  const source = text.toLowerCase();
  let fromIndex = 0;
  while (true) {
    const foundIndex = source.indexOf(normalizedQuery, fromIndex);
    if (foundIndex === -1) break;
    ranges.push({ start: foundIndex, end: foundIndex + normalizedQuery.length });
    fromIndex = foundIndex + normalizedQuery.length;
  }
  return ranges;
};

/** ===================== Initial state ===================== */

const initialBoardState: BoardState = {
  tasks: {},
  columns: {},
  columnOrder: [],
};

export const useBoardStore = create<BoardStore>()(
  devtools(
    persist(
      immer<BoardStore>((setState, getState) => ({
        board: initialBoardState,
        filter: 'all',
        searchQuery: '',
        selectedTaskIdentifiers: new Set<string>(),

        addColumn: (title) =>
          setState((draftState) => {
            const columnIdentifier = uuidv4();
            draftState.board.columns[columnIdentifier] = {
              id: columnIdentifier,
              title: title.trim() || 'Untitled',
              taskIdentifiers: [],
            };
            draftState.board.columnOrder.push(columnIdentifier);
          }),

        renameColumn: (columnIdentifier, title) =>
          setState((draftState) => {
            const column = draftState.board.columns[columnIdentifier];
            if (column) {
              column.title = title.trim();
            }
          }),

        deleteColumn: (columnIdentifier) =>
          setState((draftState) => {
            const column = draftState.board.columns[columnIdentifier];
            if (!column) return;

            for (const taskIdentifier of column.taskIdentifiers) {
              delete draftState.board.tasks[taskIdentifier];
              draftState.selectedTaskIdentifiers.delete(taskIdentifier);
            }

            delete draftState.board.columns[columnIdentifier];
            draftState.board.columnOrder = draftState.board.columnOrder.filter(
              (identifier) => identifier !== columnIdentifier,
            );
          }),

        reorderColumns: (sourceIndex, destinationIndex) =>
          setState((draftState) => {
            const columnOrder = draftState.board.columnOrder;
            const safeSourceIndex = Math.max(0, Math.min(sourceIndex, columnOrder.length - 1));
            const safeDestinationIndex = Math.max(
              0,
              Math.min(destinationIndex, columnOrder.length - 1),
            );
            const [movedColumnIdentifier] = columnOrder.splice(safeSourceIndex, 1);
            columnOrder.splice(safeDestinationIndex, 0, movedColumnIdentifier);
          }),

        addTask: (columnIdentifier, title) =>
          setState((draftState) => {
            const column = draftState.board.columns[columnIdentifier];
            if (!column) return;

            const taskIdentifier = uuidv4();
            draftState.board.tasks[taskIdentifier] = {
              id: taskIdentifier,
              title: title.trim(),
              isCompleted: false,
              columnId: columnIdentifier,
            };
            column.taskIdentifiers.push(taskIdentifier);
          }),

        updateTask: (taskIdentifier, newTitle) =>
          setState((draftState) => {
            const task = draftState.board.tasks[taskIdentifier];
            if (task) {
              task.title = newTitle.trim();
            }
          }),

        toggleTaskCompletion: (taskIdentifier) =>
          setState((draftState) => {
            const task = draftState.board.tasks[taskIdentifier];
            if (task) {
              task.isCompleted = !task.isCompleted;
            }
          }),

        deleteTask: (taskIdentifier) =>
          setState((draftState) => {
            const task = draftState.board.tasks[taskIdentifier];
            if (!task) return;

            const sourceColumn = draftState.board.columns[task.columnId];
            if (sourceColumn) {
              sourceColumn.taskIdentifiers = sourceColumn.taskIdentifiers.filter(
                (identifier) => identifier !== taskIdentifier,
              );
            }

            delete draftState.board.tasks[taskIdentifier];
            draftState.selectedTaskIdentifiers.delete(taskIdentifier);
          }),

        reorderTasks: (columnIdentifier, sourceIndex, destinationIndex) =>
          setState((draftState) => {
            const column = draftState.board.columns[columnIdentifier];
            if (!column) return;

            if (sourceIndex === destinationIndex) return;

            const uniqueTaskIdentifiers = Array.from(new Set(column.taskIdentifiers));
            const maxIndex = uniqueTaskIdentifiers.length - 1;
            const from = Math.max(0, Math.min(sourceIndex, maxIndex));
            const to = Math.max(0, Math.min(destinationIndex, maxIndex));

            const [movedTaskIdentifier] = uniqueTaskIdentifiers.splice(from, 1);
            uniqueTaskIdentifiers.splice(to, 0, movedTaskIdentifier);
            column.taskIdentifiers = uniqueTaskIdentifiers;
          }),

        moveTask: (
          sourceColumnIdentifier,
          destinationColumnIdentifier,
          sourceIndex,
          destinationIndex,
        ) =>
          setState((draftState) => {
            if (sourceColumnIdentifier === destinationColumnIdentifier) {
              const column = draftState.board.columns[sourceColumnIdentifier];
              if (!column) return;
              const maxIndex = column.taskIdentifiers.length - 1;
              const from = Math.max(0, Math.min(sourceIndex, maxIndex));
              const to = Math.max(0, Math.min(destinationIndex, maxIndex));
              if (from === to) return;

              const unique = Array.from(new Set(column.taskIdentifiers));
              const [id] = unique.splice(from, 1);
              unique.splice(to, 0, id);
              column.taskIdentifiers = unique;
              return;
            }

            const sourceColumn = draftState.board.columns[sourceColumnIdentifier];
            const destinationColumn = draftState.board.columns[destinationColumnIdentifier];
            if (!sourceColumn || !destinationColumn) return;

            const fromMax = sourceColumn.taskIdentifiers.length - 1;
            const safeSourceIndex = Math.max(0, Math.min(sourceIndex, fromMax));
            const taskIdentifier = sourceColumn.taskIdentifiers[safeSourceIndex];
            if (!taskIdentifier) return;

            sourceColumn.taskIdentifiers = sourceColumn.taskIdentifiers.filter(
              (id) => id !== taskIdentifier,
            );

            const destNoDup = destinationColumn.taskIdentifiers.filter(
              (id) => id !== taskIdentifier,
            );
            const to = Math.max(
              0,
              Math.min(destinationIndex ?? destNoDup.length, destNoDup.length),
            );
            destNoDup.splice(to, 0, taskIdentifier);
            destinationColumn.taskIdentifiers = destNoDup;

            const task = draftState.board.tasks[taskIdentifier];
            if (task) task.columnId = destinationColumnIdentifier;
          }),

        setTaskSelection: (taskIdentifier, isSelected) =>
          setState((draftState) => {
            const newSelection = new Set(draftState.selectedTaskIdentifiers);
            if (isSelected) {
              newSelection.add(taskIdentifier);
            } else {
              newSelection.delete(taskIdentifier);
            }
            draftState.selectedTaskIdentifiers = newSelection;
          }),

        clearSelection: () =>
          setState((draftState) => {
            draftState.selectedTaskIdentifiers = new Set<string>();
          }),

        selectAllInColumn: (columnIdentifier, isSelected) =>
          setState((draftState) => {
            const column = draftState.board.columns[columnIdentifier];
            if (!column) return;

            const newSelection = new Set(draftState.selectedTaskIdentifiers);
            for (const taskIdentifier of column.taskIdentifiers) {
              if (isSelected) {
                newSelection.add(taskIdentifier);
              } else {
                newSelection.delete(taskIdentifier);
              }
            }
            draftState.selectedTaskIdentifiers = newSelection;
          }),

        bulkComplete: (taskIdentifiers, completed) =>
          setState((draftState) => {
            for (const taskIdentifier of taskIdentifiers) {
              const task = draftState.board.tasks[taskIdentifier];
              if (task) {
                task.isCompleted = completed;
              }
            }
          }),

        bulkDelete: (taskIdentifiers) =>
          setState((draftState) => {
            for (const taskIdentifier of taskIdentifiers) {
              const task = draftState.board.tasks[taskIdentifier];
              if (!task) continue;

              const column = draftState.board.columns[task.columnId];
              if (column) {
                column.taskIdentifiers = column.taskIdentifiers.filter(
                  (identifier) => identifier !== taskIdentifier,
                );
              }
              delete draftState.board.tasks[taskIdentifier];
              draftState.selectedTaskIdentifiers.delete(taskIdentifier);
            }
          }),

        bulkMove: (taskIdentifiers, destinationColumnIdentifier) =>
          setState((draftState) => {
            const destinationColumn = draftState.board.columns[destinationColumnIdentifier];
            if (!destinationColumn) return;

            for (const taskIdentifier of taskIdentifiers) {
              const task = draftState.board.tasks[taskIdentifier];
              if (!task) continue;

              const sourceColumn = draftState.board.columns[task.columnId];
              if (sourceColumn) {
                sourceColumn.taskIdentifiers = sourceColumn.taskIdentifiers.filter(
                  (identifier) => identifier !== taskIdentifier,
                );
              }
              task.columnId = destinationColumnIdentifier;
            }

            const finalDestinationList = destinationColumn.taskIdentifiers.filter(
              (identifier) => !taskIdentifiers.includes(identifier),
            );
            for (const taskIdentifier of taskIdentifiers) {
              if (!finalDestinationList.includes(taskIdentifier)) {
                finalDestinationList.push(taskIdentifier);
              }
            }
            destinationColumn.taskIdentifiers = finalDestinationList;
          }),

        setFilter: (filter) =>
          setState((draftState) => {
            draftState.filter = filter;
          }),

        setSearchQuery: (query) =>
          setState((draftState) => {
            draftState.searchQuery = query;
          }),

        getColumnTasks: (columnIdentifier) => {
          const currentState = getState();
          const column = currentState.board.columns[columnIdentifier];
          if (!column) return [];
          return column.taskIdentifiers
            .map((taskIdentifier) => currentState.board.tasks[taskIdentifier])
            .filter((task): task is Task => Boolean(task));
        },

        getFilteredTasks: (columnIdentifier) => {
          const currentState = getState();
          const allTasks = currentState.getColumnTasks(columnIdentifier);

          const statusFilteredTasks =
            currentState.filter === 'active'
              ? allTasks.filter((task) => !task.isCompleted)
              : currentState.filter === 'completed'
                ? allTasks.filter((task) => task.isCompleted)
                : allTasks;

          const finalTasks =
            currentState.searchQuery.trim().length === 0
              ? statusFilteredTasks
              : statusFilteredTasks.filter((task) =>
                  doesTextMatchQuery(task.title, currentState.searchQuery),
                );

          return finalTasks;
        },

        getDirectSearchMatchRanges: (sourceText) => {
          const currentState = getState();
          return computeDirectMatchRanges(sourceText, currentState.searchQuery);
        },
      })),
      {
        name: 'board-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: (fullState) => ({
          board: fullState.board,
          filter: fullState.filter,
          searchQuery: fullState.searchQuery,
        }),
      },
    ),
  ),
);

export const useBoard = () => useBoardStore((store) => store.board);
export const useBoardFilter = () => useBoardStore((store) => store.filter);
export const useBoardSearchQuery = () => useBoardStore((store) => store.searchQuery);
export const useSelectedTaskIdentifiers = () =>
  useBoardStore((store) => store.selectedTaskIdentifiers);
