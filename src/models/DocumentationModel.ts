import {createStore, createEvent, createEffect} from 'effector';

import {EMPTY_CHAR} from '@/constants/common';
import {apiClient} from '@/shared/api/client';
import {DocNodes} from '@/types/common';

export interface Breadcrumb {
  title: string;
}

// Стор для хранения хлебных крошек документации
export const selectDocumentation = createEvent<{mainLabel: string; childLabel: string}>();
export const editSelectedDocumentationChild = createEvent<{childLabel: string}>();
export const closeDocumentation = createEvent<object>();
export const $documentationBreadcrumbs = createStore<Breadcrumb[]>([])
  .on(selectDocumentation, (_state, payload) => Object.values(payload).map(label => ({title: label})))
  .on(editSelectedDocumentationChild, (state, payload) => {
    if (state.length < 2) return state;
    return [state[0], {title: payload.childLabel}, ...state.slice(2)];
  })
  .on(closeDocumentation, () => []);

// Стор для хранения пути локального репозитория
export const setRepoPath = createEvent<string>();
export const $repoPath = createStore<string>(EMPTY_CHAR).on(setRepoPath, (_state, path) => path);

// Стор для хранения дерева документации
export const setDocNodesTree = createEvent<DocNodes[]>();
export const $docNodesTree = createStore<DocNodes[]>([]).on(setDocNodesTree, (_state, nodesTree) => nodesTree);

// Запрос на получение репозитория документаций из гита
export const cloneDocumentationPostFx = createEffect(async () => {
  try {
    return await apiClient.cloneDocumentationPost();
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : 'Clone documentation failed');
  }
});

// Запрос на добавления в коммит
export const addDocumentationPostFx = createEffect(async (body: string) => {
  try {
    return await apiClient.addDocumentationPost({body});
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : 'Add documentation failed');
  }
});

// Запрос на создание коммита
export const commitDocumentationPostFx = createEffect(async () => {
  try {
    return await apiClient.commitDocumentationPost();
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : 'Clone documentation failed');
  }
});

// Запрос на создание МР-а
export const createMRDocumentationPostFx = createEffect(async () => {
  try {
    return await apiClient.createMRDocumentationPost();
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : 'Clone documentation failed');
  }
});
