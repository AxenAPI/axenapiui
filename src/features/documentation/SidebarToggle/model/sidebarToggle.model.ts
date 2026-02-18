import { createEvent, createStore } from 'effector';

const toggleSidebar = createEvent();

const $isSidebarCollapsed = createStore(false).on(toggleSidebar, state => !state);

export const sidebarToggleModel = {
  events: {
    toggleSidebar,
  },
  stores: {
    $isSidebarCollapsed,
  },
};
