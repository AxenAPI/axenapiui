import { NNotification } from '@axenix/ui-kit';
import { createEffect, createEvent, createStore, sample } from 'effector';
import { createGate } from 'effector-react';
import { reset } from 'patronum';

import { GitService } from '@shared/api/services';
import { globalBlockerModel } from '@shared/components/GlobalBlocker';

const NOTIFICATION_KEY = {
  checkoutCreateBranch: 'checkoutCreateBranch',
  checkoutCreateError: 'checkoutCreateError',
};

// Gate

const NewBranchDrawerGate = createGate<NNotification.TNotificationInstance>('NewBranchDrawerGate');

// Events

const closeNewBranchDrawer = createEvent();
const setNewBranchName = createEvent<string>();
const submitNewBranchName = createEvent();

// Stores

const $newBranchName = createStore<string>('');
const $isNewBranchDrawerOpen = createStore<boolean>(false);

// Api

const branchCreateCheckoutApi = createEffect(GitService.createAndCheckoutBranch);

// Effects

const createCheckoutSuccessFX = createEffect<NNotification.TNotificationInstance, void>(api => {
  const message = 'Branch creation and checkout success';
  api.success({ key: NOTIFICATION_KEY.checkoutCreateBranch, message, placement: 'bottomRight', duration: 1.5 });
});

const createCheckoutErrorFX = createEffect<NNotification.TNotificationInstance, void>(api => {
  const message = 'Branch creation and checkout error';
  api.error({ key: NOTIFICATION_KEY.checkoutCreateError, message, placement: 'bottomRight', duration: 1.5 });
});

// Logics

sample({
  clock: setNewBranchName,
  target: $newBranchName,
});

sample({
  clock: submitNewBranchName,
  source: $newBranchName,
  filter: Boolean,
  target: branchCreateCheckoutApi,
});

sample({
  clock: branchCreateCheckoutApi.done,
  source: NewBranchDrawerGate.state,
  filter: Boolean,
  target: createCheckoutSuccessFX,
});

sample({
  clock: createCheckoutSuccessFX.done,
  fn: () => false,
  target: $isNewBranchDrawerOpen,
});

sample({
  clock: branchCreateCheckoutApi.fail,
  source: NewBranchDrawerGate.state,
  filter: Boolean,
  target: createCheckoutErrorFX,
});

reset({
  clock: closeNewBranchDrawer,
  target: [$isNewBranchDrawerOpen, $newBranchName],
});

sample({
  clock: branchCreateCheckoutApi,
  target: globalBlockerModel.events.blockUI,
});

sample({
  clock: branchCreateCheckoutApi.finally,
  target: globalBlockerModel.events.unblockUI,
});

// Public api

export const newBranchDrawerModel = {
  gate: NewBranchDrawerGate,
  events: {
    closeNewBranchDrawer,
    setNewBranchName,
    submitNewBranchName,
  },
  stores: {
    $newBranchName,
    $isNewBranchDrawerOpen,
  },
  api: {
    branchCreateCheckoutApi,
  },
};
