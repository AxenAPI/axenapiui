import {createEvent, createStore} from 'effector';

export const openDrawerAddLink = createEvent<string>();
export const closeDrawerAddLink = createEvent();

export const $drawerAddLink = createStore<{isOpen: boolean; itemId?: string}>({
  isOpen: false,
  itemId: '',
})
  .on(openDrawerAddLink, (_, payload) => ({
    isOpen: true,
    itemId: payload,
  }))
  .reset(closeDrawerAddLink);
