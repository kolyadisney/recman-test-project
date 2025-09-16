import * as React from 'react';
import { createPortal } from 'react-dom';

import {
  Backdrop,
  Cancel,
  Item,
  List,
  Sheet,
  Title,
} from '@/components/common/mobile-action-sheet/mobile-action-sheet.styled.tsx';

import type { MobileActionSheetProps } from '@/components/common/mobile-action-sheet/types.ts';

export const MobileActionSheet: React.FC<MobileActionSheetProps> = ({
  isOpen,
  title,
  actions,
  onClose,
}) => {
  if (!isOpen) return null;
  return createPortal(
    <Backdrop onClick={onClose} aria-modal="true" role="dialog">
      <Sheet onClick={(e) => e.stopPropagation()}>
        {title && <Title>{title}</Title>}
        <List>
          {actions.map((action) => (
            <Item
              key={action.id}
              onClick={() => {
                if (action.disabled) return;
                action.onPress();
                onClose();
              }}
              $disabled={!!action.disabled}
            >
              {action.label}
            </Item>
          ))}
        </List>
        <Cancel onClick={onClose} variant="light" color="primary" fullWidth size="lg">
          Cancel
        </Cancel>
      </Sheet>
    </Backdrop>,
    document.body,
  );
};
