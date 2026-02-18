import { createEffect, createEvent, createStore, sample } from 'effector';

import { GitService } from '@shared/api/services';
import { notificationModel } from '@shared/notification/notification.model';
import { GitRepoDto } from '@shared/openapi';

const NOTIFICATION_KEY = {
  activeRepositoryExists: 'activeRepositoryExists',
};

// Events
export const setFilterValue = createEvent<string>();

export const openRepositoryDrawer = createEvent();
export const editRepositoryDrawer = createEvent<GitRepoDto>();
export const openDeleteModal = createEvent<GitRepoDto>();
export const cleanupRepository = createEvent();

export const activeRepositoryExists = createEvent(); /* Уже есть активный репозиторий */

// Stores

export const $filterValue = createStore<string>('');

export const $tableData = createStore<GitRepoDto[]>([]);

// Effects
export const activateGitRepositoryFX = createEffect(async (params: { id: string; enabled: boolean }) => {
  try {
    await GitService.toggleRepoEnabled(params.id, params.enabled);
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : 'Failed to toggle repository status');
  }
});

// --- Internal Logic ---
// Updates filter value on input
sample({
  clock: setFilterValue,
  target: $filterValue,
});

sample({
  clock: activeRepositoryExists,
  fn: () => {
    const message = 'Active repository already exists';
    return { key: NOTIFICATION_KEY.activeRepositoryExists, message };
  },
  target: notificationModel.events.showError,
});
