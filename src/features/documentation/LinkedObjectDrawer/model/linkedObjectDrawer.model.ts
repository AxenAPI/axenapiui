import { createEvent, createStore, sample } from 'effector';

import { EventDTO, NodeDTO } from '@shared/openapi';

// Events

const closeLinkedObjectDrawer = createEvent();

// Stores

const $isLinkedObjectDrawerOpen = createStore<boolean>(false);
const $drawerData = createStore<NodeDTO | EventDTO | null>(null);

// Logic

sample({
  clock: closeLinkedObjectDrawer,
  source: $isLinkedObjectDrawerOpen,
  fn: isOpen => !isOpen,
  target: [$isLinkedObjectDrawerOpen],
});

// Public api

export const linkedObjectDrawerModel = {
  events: {
    closeLinkedObjectDrawer,
  },
  stores: {
    $isLinkedObjectDrawerOpen,
    $drawerData,
  },
};
