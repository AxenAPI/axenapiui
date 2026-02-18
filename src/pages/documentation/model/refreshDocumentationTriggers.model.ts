import { sample } from 'effector';

import { repositoryModel } from '@app/models/repository';

import { branchSelectModel } from '@features/documentation/BranchSelect';
import { importButtonModel } from '@features/documentation/ImportButton';
import { documentStateModel } from '@features/documentation/MDXEditorWithMermaid';
import { newBranchDrawerModel } from '@features/documentation/NewBranchDrawer';

import { windowFocused } from '@shared/lib/visibilitychange';

import { refreshDocumentationRequested, RefreshSource } from './refreshDocumentation.model';

// === Trigger Wiring ===

// Window Focus → refresh
sample({
  clock: windowFocused,
  fn: (): RefreshSource => 'window-focus',
  target: refreshDocumentationRequested,
});

// Git Pull → refresh
sample({
  clock: repositoryModel.api.updateRepositoryApi.done,
  fn: (): RefreshSource => 'git-pull',
  target: refreshDocumentationRequested,
});

// Git Checkout → refresh
sample({
  clock: branchSelectModel.events.branchCheckedOut,
  fn: (): RefreshSource => 'git-checkout',
  target: refreshDocumentationRequested,
});

// Yandex Import → refresh
sample({
  clock: importButtonModel.events.yandexImportSuccess,
  fn: (): RefreshSource => 'yandex-import',
  target: refreshDocumentationRequested,
});

// New Branch → refresh
sample({
  clock: newBranchDrawerModel.api.branchCreateCheckoutApi.done,
  fn: (): RefreshSource => 'branch-create',
  target: refreshDocumentationRequested,
});

// New Branch → refresh
sample({
  clock: documentStateModel.events.internalLinkClicked,
  fn: (): RefreshSource => 'link',
  target: refreshDocumentationRequested,
});
