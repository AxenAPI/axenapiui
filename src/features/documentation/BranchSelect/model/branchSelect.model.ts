import { NNotification } from '@axenix/ui-kit';
import { combine, createEffect, createEvent, createStore, merge, sample } from 'effector';
import { createGate } from 'effector-react';

import { repositoryModel } from '@app/models/repository';

import { GitService } from '@shared/api/services';
import { globalBlockerModel } from '@shared/components/GlobalBlocker';
import { BranchInfo } from '@shared/openapi';

import { getCurrentBranchName } from '../utils/getCurrentBranchName';

const BranchSelectGate = createGate<NNotification.TNotificationInstance>('BranchSelectGate');

const openNewBranchDrawer = createEvent();
const branchCheckedOut = createEvent<string>();
const dataReset = createEvent();
const updateRepository = createEvent();
const gitActionSelected = createEvent<{ action: string; branch: string }>();
const branchSelected = createEvent<string>();
const selectOpened = createEvent<boolean>();

const $localBranches = createStore<BranchInfo[]>([]).reset(dataReset);
const $remoteBranches = createStore<BranchInfo[]>([]).reset(dataReset);

const $branchesData = combine($localBranches, $remoteBranches, (local, remote) => {
  const allBranches = [...local, ...remote];
  const uniqueBranches = [
    ...new Map(allBranches.map(branch => [`${branch.name}#${branch.remoteStatus}`, branch])).values(),
  ];

  return uniqueBranches;
});

const $currentBranchName = $branchesData.map(getCurrentBranchName);
const $isSelectOpen = createStore<boolean>(false);

const fetchBranchesApi = createEffect(async () => {
  try {
    return await GitService.getBranches();
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : 'Failed to fetch remote branches');
  }
});

const branchCheckoutApi = createEffect<string, void>(async branch => {
  try {
    await GitService.checkoutBranch(branch);
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : 'Failed to checkout branch');
  }
});

const NOTIFICATION_KEY = {
  checkoutBranch: 'checkoutBranch',
  checkoutError: 'checkoutError',
};

const checkoutSuccessFX = createEffect<NNotification.TNotificationInstance, void>(api => {
  const message = 'Checkout success';
  api.success({ key: NOTIFICATION_KEY.checkoutBranch, message, placement: 'bottomRight', duration: 1.5 });
});

const checkoutErrorFX = createEffect<NNotification.TNotificationInstance, void>(api => {
  const message = 'Checkout failed';
  api.error({ key: NOTIFICATION_KEY.checkoutError, message, placement: 'bottomRight', duration: 1.5 });
});

sample({
  clock: repositoryModel.stores.$documentationInfo,
  filter: Boolean,
  fn: repoInfo => repoInfo.branches || [],
  target: $localBranches,
});

sample({
  clock: fetchBranchesApi.doneData,
  fn: branches => branches || [],
  target: $remoteBranches,
});

const refreshAllBranchInfo = merge([branchCheckoutApi.done, repositoryModel.api.updateRepositoryApi.done]);

sample({
  clock: refreshAllBranchInfo,
  source: repositoryModel.stores.$repoPath,
  filter: (path): path is string => Boolean(path),
  target: repositoryModel.api.getDocumentationInfoApi,
});

sample({
  clock: refreshAllBranchInfo,
  target: fetchBranchesApi,
});

sample({
  clock: branchCheckoutApi.done,
  source: BranchSelectGate.state,
  filter: Boolean,
  target: checkoutSuccessFX,
});

sample({
  clock: branchCheckoutApi.fail,
  source: BranchSelectGate.state,
  filter: Boolean,
  target: checkoutErrorFX,
});

sample({
  clock: branchCheckoutApi.done,
  fn: ({ params }) => params,
  target: branchCheckedOut,
});

sample({
  clock: updateRepository,
  target: repositoryModel.api.updateRepositoryApi,
});

sample({
  clock: BranchSelectGate.close,
  target: dataReset,
});

sample({
  clock: selectOpened,
  target: $isSelectOpen,
});

sample({
  clock: [fetchBranchesApi, branchCheckoutApi],
  target: globalBlockerModel.events.blockUI,
});

sample({
  clock: [fetchBranchesApi.finally, branchCheckoutApi.finally],
  target: globalBlockerModel.events.unblockUI,
});

export const branchSelectModel = {
  gate: BranchSelectGate,
  events: {
    openNewBranchDrawer,
    branchCheckedOut,
    updateRepository,
    gitActionSelected,
    branchSelected,
    selectOpened,
  },
  stores: {
    $branchesData,
    $currentBranchName,
    $isSelectOpen,
  },
  api: {
    fetchBranchesApi,
    branchCheckoutApi,
  },
};
