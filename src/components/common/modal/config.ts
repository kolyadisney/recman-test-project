import React from 'react';

import { AddEditTaskModal, type AddEditTaskModalProps } from '@/components/common/modal/components';
import {
  AddEditColumnModal,
  type AddEditColumnModalProps,
} from '@/components/common/modal/components/add-edit-column-modal';
import {
  ConfirmationModal,
  type ConfirmationModalProps,
} from '@/components/common/modal/components/confirmation-modal';

export type PlainObject<Value = any> = {
  [p: string]: Value;
};

export enum EModalsMaps {
  ADD_EDIT_TASK = 'ADD_EDIT_TASK',
  ADD_EDIT_COLUMN = 'ADD_EDIT_COLUMN',
  CONFIRMATION = 'CONFIRMATION',
}

export interface IModalsMapTree extends PlainObject {
  ADD_EDIT_TASK: React.FC<AddEditTaskModalProps>;
  ADD_EDIT_COLUMN: React.FC<AddEditColumnModalProps>;
  CONFIRMATION: React.FC<ConfirmationModalProps>;
}

export const getModalsMap = (): IModalsMapTree => {
  return {
    [EModalsMaps.ADD_EDIT_TASK]: AddEditTaskModal,
    [EModalsMaps.ADD_EDIT_COLUMN]: AddEditColumnModal,
    [EModalsMaps.CONFIRMATION]: ConfirmationModal,
  };
};
