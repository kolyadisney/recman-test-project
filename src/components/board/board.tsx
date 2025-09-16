import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { PlusIcon } from '@heroicons/react/24/solid';
import React, { useCallback } from 'react';

import { Button } from '@/components';
import { Column } from '@/components/board/components/column/column';
import { EModalsMaps } from '@/components/common/modal/config.ts';
import { useBoardStore } from '@/store/useBoardStore';
import { useModalStore } from '@/store/useModalStore.ts';

import { BoardStyled } from './board.styled';

export const Board: React.FC = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const columnOrder = useBoardStore((s) => s.board.columnOrder);
  const { openModal } = useModalStore();

  React.useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const cleanup = dropTargetForElements({
      element,
      getData: () => ({ type: 'board' }),
    });

    return () => cleanup();
  }, []);

  const handleAddColumn = useCallback(() => {
    openModal({
      name: EModalsMaps.ADD_EDIT_COLUMN,
    });
  }, [openModal]);

  return (
    <BoardStyled ref={containerRef}>
      {columnOrder.map((columnId, index) => (
        <Column key={columnId} columnId={columnId} index={index} />
      ))}
      <Button onClick={handleAddColumn}>
        <PlusIcon width={16} height={16} /> Add column
      </Button>
    </BoardStyled>
  );
};
