import { createEvent, createStore, sample } from 'effector';

// Events
export const toggleIsAboutModalOpen = createEvent();

// Stores
export const $isAboutModalOpen = createStore(false);

// Logic
sample({
  clock: toggleIsAboutModalOpen,
  source: $isAboutModalOpen,
  fn: isOpen => !isOpen,
  target: $isAboutModalOpen,
});
