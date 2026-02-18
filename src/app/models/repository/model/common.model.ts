import { createEvent, createStore } from 'effector';

import { GitRepoDto, GitRepoDtoTypeEnum, GitRepositoryInfo } from '@shared/openapi';

import { EMPTY_CHAR } from '@/constants/common';

import { getReposByType } from '../lib';

// State
export const $repoPath = createStore<string>(EMPTY_CHAR);
export const $hasRepository = $repoPath.map(path => path !== EMPTY_CHAR);
export const $gitReposList = createStore<GitRepoDto[]>([]);
export const $documentationInfo = createStore<GitRepositoryInfo | null>(null);

export const $hasDocumentation = $gitReposList.map(
  repoList => getReposByType(repoList, GitRepoDtoTypeEnum.Documentation, false).length > 0
);

export const $hasDocumentationActive = $gitReposList.map(
  repoList => getReposByType(repoList, GitRepoDtoTypeEnum.Documentation, true).length > 0
);

export const $hasCode = $gitReposList.map(
  repoList => getReposByType(repoList, GitRepoDtoTypeEnum.Code, false).length > 0
);

export const $hasCodeActive = $gitReposList.map(
  repoList => getReposByType(repoList, GitRepoDtoTypeEnum.Code, true).length > 0
);

// Events
export const checkStoredRepository = createEvent(); // Event to trigger the initial check
export const repositoryPathSet = createEvent<string>(); // Event to manually set the path
export const dataReset = createEvent();
