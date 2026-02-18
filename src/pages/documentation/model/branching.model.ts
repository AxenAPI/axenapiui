import { sample } from 'effector';

import { repositoryModel } from '@app/models/repository';

import { branchSelectModel } from '@features/documentation/BranchSelect';
import { newBranchDrawerModel } from '@features/documentation/NewBranchDrawer';

import { windowFocused } from '@shared/lib/visibilitychange';

sample({
  clock: repositoryModel.stores.$hasDocumentationActive,
  filter: Boolean,
  target: branchSelectModel.api.fetchBranchesApi,
});

// Refresh branches when user returns focus to the app (e.g. after switching branch in terminal)
sample({
  clock: windowFocused,
  source: repositoryModel.stores.$hasDocumentationActive,
  filter: Boolean,
  target: branchSelectModel.api.fetchBranchesApi,
});

// When openNewBranchDrawer event is fired, open the NewBranchDrawer
sample({
  clock: branchSelectModel.events.openNewBranchDrawer,
  fn: () => true,
  target: newBranchDrawerModel.stores.$isNewBranchDrawerOpen,
});

// After a new branch is created and checked out, refetch branches and the document folder
sample({
  clock: newBranchDrawerModel.api.branchCreateCheckoutApi.done,
  source: repositoryModel.stores.$repoPath,
  filter: Boolean,
  target: branchSelectModel.api.fetchBranchesApi,
});
