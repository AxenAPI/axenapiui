import { createEvent, createStore } from 'effector';

const editModeEnabled = createEvent();
const editModeDisabled = createEvent();

const $isEditing = createStore(false)
  .on(editModeEnabled, () => true)
  .on(editModeDisabled, () => false);

export const editButtonModel = {
  stores: {
    $isEditing,
  },
  events: {
    editModeEnabled,
    editModeDisabled,
  },
};
