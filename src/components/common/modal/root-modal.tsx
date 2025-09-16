import React from 'react';

import {
  useIsModalOpen,
  useModalName,
  useModalForwardProps,
  useModalPublicParams,
  useModalStore,
} from '@/store/useModalStore';

import { getModalsMap } from './config';

import type { ModalCommonProps } from './types';

export const RootModal: React.FC = () => {
  const isModalOpen = useIsModalOpen();
  const modalName = useModalName();
  const modalForwardProps = useModalForwardProps();
  const modalPublicParams = useModalPublicParams();
  const closeModal = useModalStore((state) => state.closeModal);

  const modalsMap = getModalsMap();

  if (!isModalOpen || !modalName) return null;

  const Content = modalsMap[String(modalName)] as React.FC<ModalCommonProps>;

  const modalProps: ModalCommonProps = {
    forwardedProps: modalForwardProps,
    publicParams: modalPublicParams,
    modalParams: {
      isOpen: isModalOpen,
      onClose: () => closeModal(),
    },
  };

  return Content ? <Content {...modalProps} /> : null;
};
