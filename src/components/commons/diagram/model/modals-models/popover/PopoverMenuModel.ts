import {createEvent, createStore} from 'effector';

export const openPopoverMenu = createEvent<string>();
export const closePopoverMenu = createEvent();

export const $popoverMenu = createStore<{isOpen: boolean; itemId?: string}>({
  isOpen: false,
  itemId: '',
})
  .on(openPopoverMenu, (_, payload) => ({
    isOpen: true,
    itemId: payload,
  }))
  .reset(closePopoverMenu);
