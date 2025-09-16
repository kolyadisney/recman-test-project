import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export type ModalName = 'confirm' | 'taskEdit' | 'taskDelete' | string;

export type ModalPublicParams = Record<string, unknown>;

export type ModalForwardProps = Record<string, unknown>;

export interface ModalPrivateParams {
  isOpen: boolean;
}

export interface ModalState<
  F extends ModalForwardProps = ModalForwardProps,
  P extends ModalPublicParams = ModalPublicParams,
> {
  name: ModalName | null;
  forwardProps: F;
  publicParams: P;
  privateParams: ModalPrivateParams;
}

export interface ModalOpenPayload<
  F extends ModalForwardProps = ModalForwardProps,
  P extends ModalPublicParams = ModalPublicParams,
> {
  name: ModalName;
  forwardProps?: F;
  publicParams?: P;
}

export interface ModalStore<
  F extends ModalForwardProps = ModalForwardProps,
  P extends ModalPublicParams = ModalPublicParams,
> {
  modal: ModalState<F, P>;

  openModal: (payload: ModalOpenPayload<F, P>) => void;
  closeModal: (keepName?: boolean) => void;

  setForwardProps: (patch: Partial<F>) => void;
  setPublicParams: (patch: Partial<P>) => void;

  isModalOpen: () => boolean;
  isSpecificModalOpen: (name: ModalName) => boolean;
}

const initialModalState: ModalState = {
  name: null,
  forwardProps: {},
  publicParams: {},
  privateParams: { isOpen: false },
};

export const useModalStore = create<ModalStore>()(
  devtools(
    immer<ModalStore>((setState, getState) => ({
      modal: initialModalState,

      openModal: ({ name, forwardProps, publicParams }) =>
        setState((draftState) => {
          draftState.modal.name = name;
          draftState.modal.forwardProps = (forwardProps ?? {}) as ModalForwardProps;
          draftState.modal.publicParams = (publicParams ?? {}) as ModalPublicParams;
          draftState.modal.privateParams.isOpen = true;
        }, false),

      closeModal: (keepName = false) =>
        setState((draftState) => {
          const previousName = draftState.modal.name;
          draftState.modal = {
            ...initialModalState,
            name: keepName ? previousName : null,
          };
        }, false),

      setForwardProps: (patch) =>
        setState((draftState) => {
          draftState.modal.forwardProps = {
            ...(draftState.modal.forwardProps as ModalForwardProps),
            ...(patch as ModalForwardProps),
          };
        }, false),

      setPublicParams: (patch) =>
        setState((draftState) => {
          draftState.modal.publicParams = {
            ...(draftState.modal.publicParams as ModalPublicParams),
            ...(patch as ModalPublicParams),
          };
        }, false),

      isModalOpen: () => getState().modal.privateParams.isOpen,

      isSpecificModalOpen: (name) => {
        const { modal } = getState();
        return modal.privateParams.isOpen && modal.name === name;
      },
    })),
    { name: 'modal-store' },
  ),
);

export const useIsModalOpen = () => useModalStore((state) => state.modal.privateParams.isOpen);

export const useModalName = () => useModalStore((state) => state.modal.name);

export const useModalForwardProps = <T extends ModalForwardProps = ModalForwardProps>() =>
  useModalStore((state) => state.modal.forwardProps as T);

export const useModalPublicParams = <T extends ModalPublicParams = ModalPublicParams>() =>
  useModalStore((state) => state.modal.publicParams as T);
