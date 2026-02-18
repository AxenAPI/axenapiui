import { sample } from 'effector';
import { createGate } from 'effector-react';

import { getReposByType, repositoryModel } from '@app/models/repository';

import { $repositoryType } from '@features/repositoryManager/RepositoryType';

import { integrationsModel } from '@widgets/integrations';

import { notificationModel } from '@shared/notification/notification.model';

import {
  $deleteModalData,
  $isDeleteModalOpen,
  deleteGitRepositoryEvent,
} from '@/components/repositoryManager/RepositoryDeleteModal/model/deleteRepositoryModalModel';
import { getFilteredRepos } from '@/components/repositoryManager/RepositoryTable/lib/utils';
import {
  $filterValue,
  $tableData,
  activateGitRepositoryFX,
  cleanupRepository,
  editRepositoryDrawer,
  openDeleteModal,
  openRepositoryDrawer,
} from '@/components/repositoryManager/RepositoryTable/model/tableModel';
import { EMPTY_CHAR } from '@/constants/common';

const NOTIFICATION_KEY = {
  repositoryDeleted: 'repositoryDeleted',
  repositoryDeleteError: 'repositoryDeleteError',
};

// Gate
export const RepositoryManagerPageGate = createGate('RepositoryManagerPageGate');

// --- Internal Logic ---
// When repository is deactivated or deleted local storage is cleared and repoPath cleared as well
sample({
  clock: cleanupRepository,
  source: repositoryModel.stores.$repoPath,
  filter: Boolean,
  fn: () => EMPTY_CHAR,
  target: repositoryModel.stores.$repoPath,
});

// When delete is pressed, trigger folder deletion
sample({
  clock: deleteGitRepositoryEvent,
  target: repositoryModel.api.deleteGitRepositoryApi,
});

// Show success notification after repository deleted
sample({
  clock: repositoryModel.api.deleteGitRepositoryApi.done,
  fn: () => ({
    key: NOTIFICATION_KEY.repositoryDeleted,
    message: 'Repository deleted successfully',
  }),
  target: notificationModel.events.showSuccess,
});

// Show error notification when delete fails
sample({
  clock: repositoryModel.api.deleteGitRepositoryApi.failData,
  fn: error => ({
    key: NOTIFICATION_KEY.repositoryDeleteError,
    message: error?.message || 'Failed to delete repository',
  }),
  target: notificationModel.events.showError,
});

// When component mounts fetch git repositories
sample({
  clock: RepositoryManagerPageGate.open,
  target: repositoryModel.api.fetchGitRepositoriesApi,
});

// When we get repos and type for them, we filter repos by type
sample({
  source: { repos: repositoryModel.stores.$gitReposList, type: $repositoryType },
  fn: ({ repos, type }) => getReposByType(repos, type),
  target: $tableData,
});

// When filter value updates, filter the table
sample({
  clock: $filterValue,
  source: { repos: repositoryModel.stores.$gitReposList, filterValue: $filterValue, type: $repositoryType },
  fn: ({ filterValue, repos, type }) => getFilteredRepos(repos, filterValue, type),
  target: $tableData,
});

// Refresh repos list after successful save or delete
sample({
  clock: [
    integrationsModel.api.saveGitRepoFx.doneData,
    repositoryModel.api.deleteGitRepositoryApi.doneData,
    activateGitRepositoryFX.doneData,
  ],
  target: repositoryModel.api.fetchGitRepositoriesApi,
});

// Connect table events to integrations drawer
sample({
  clock: openRepositoryDrawer,
  target: integrationsModel.events.openDrawer,
});

sample({
  clock: editRepositoryDrawer,
  target: integrationsModel.events.openDrawerForEdit,
});

sample({
  clock: openDeleteModal,
  fn: () => true,
  target: $isDeleteModalOpen,
});

sample({
  clock: openDeleteModal,
  target: $deleteModalData,
});
