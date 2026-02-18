import { createEvent, createStore } from 'effector';

import { GitRepoDto } from '@shared/openapi';

// Events
export const closeDeleteModal = createEvent();
export const deleteGitRepositoryEvent = createEvent<string>();

// Stores
export const $isDeleteModalOpen = createStore<boolean>(false).reset(closeDeleteModal);
export const $deleteModalData = createStore<GitRepoDto | null>(null).reset(closeDeleteModal);
