import {createEvent, createStore} from 'effector';

export const openDeleteSelectedItemsModal = createEvent<string[]>();
export const closeDeleteSelectedItemsModal = createEvent();

export const $deleteSelectedItemsModal = createStore<{isOpen: boolean; selectedItemIds?: string[]}>({
  isOpen: false,
  selectedItemIds: [],
})
  .on(openDeleteSelectedItemsModal, (_, payload) => ({
    isOpen: true,
    selectedItemIds: [...payload],
  }))
  .reset(closeDeleteSelectedItemsModal);
