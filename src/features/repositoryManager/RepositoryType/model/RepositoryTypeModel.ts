import { createEvent, createStore, sample } from 'effector';

import { GitRepoDtoTypeEnum } from '@shared/openapi';

// Events
export const setRepositoryTypeEvent = createEvent<GitRepoDtoTypeEnum>();

// Stores временно базовый - документации.
export const $repositoryType = createStore<GitRepoDtoTypeEnum>(GitRepoDtoTypeEnum.Documentation);

// Logic
sample({
  clock: setRepositoryTypeEvent,
  target: [$repositoryType],
});
