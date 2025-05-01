import {createEvent, createStore} from 'effector';

export const openDrawerEditTopic = createEvent<string>();
export const closeDrawerEditTopic = createEvent();

export const $drawerEditTopic = createStore<{isOpen: boolean; itemId: string}>({
  isOpen: false,
  itemId: '',
})
  .on(openDrawerEditTopic, (_, payload) => ({
    isOpen: true,
    itemId: payload,
  }))
  .reset(closeDrawerEditTopic);
