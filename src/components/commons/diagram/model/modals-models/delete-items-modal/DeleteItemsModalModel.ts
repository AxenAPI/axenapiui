import {createEvent, createStore} from 'effector';

export const openDeleteItemsModal = createEvent();
export const closeDeleteItemsModal = createEvent();

export const $deleteItemsModal = createStore<{isOpen: boolean}>({
  isOpen: false,
})
  .on(openDeleteItemsModal, () => ({
    isOpen: true,
  }))
  .reset(closeDeleteItemsModal);
