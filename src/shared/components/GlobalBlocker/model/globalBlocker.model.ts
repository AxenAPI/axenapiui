import { createEvent, createStore } from 'effector';

const $isUIBlocked = createStore(false);
const blockUI = createEvent();
const unblockUI = createEvent();

$isUIBlocked.on(blockUI, () => true).on(unblockUI, () => false);

export const globalBlockerModel = {
  stores: {
    $isUIBlocked,
  },
  events: {
    blockUI,
    unblockUI,
  },
};
