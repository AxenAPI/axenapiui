import {createEvent, createStore} from 'effector';

export const openDrawerEditLink = createEvent<string>();
export const closeDrawerEditLink = createEvent();

export const $drawerEditLink = createStore<{isOpen: boolean; linkId?: string}>({
  isOpen: false,
  linkId: '',
})
  .on(openDrawerEditLink, (_, payload) => ({
    isOpen: true,
    linkId: payload,
  }))
  .reset(closeDrawerEditLink);
