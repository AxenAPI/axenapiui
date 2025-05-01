import {createEvent, createStore} from 'effector';

export const openDrawerCreateEvent = createEvent<string | null>();
export const closeDrawerCreateEvent = createEvent();

export const $drawerCreateEvent = createStore<{isOpen: boolean; eventId: string | null}>({
  isOpen: false,
  eventId: null,
})
  .on(openDrawerCreateEvent, (_, payload) => ({
    isOpen: true,
    eventId: payload,
  }))
  .reset(closeDrawerCreateEvent);
