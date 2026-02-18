import { createEvent, createStore, sample } from 'effector';

import { documentTreeModel } from '@entities/documentation/DocumentTree';

/**
 * Navigation Logic
 *
 * Инкапсулирует логику навигации к документу, который может быть
 * ещё не загружен в дерево (lazy loading).
 *
 * Сценарии:
 * 1. Документ уже в $nodesById → сразу fileSelected
 * 2. Документа нет → getTreeApi(pagePath) → после загрузки fileSelected
 */

export interface NavigateParams {
  id: string;
  pagePath: string;
}

// Events
const navigateToDocument = createEvent<NavigateParams>();

// Stores
// Храним ID документа, ожидающего загрузки дерева
const $pendingDocumentId = createStore<string | null>(null);

// Case 1: Документ уже загружен в дерево → выбрать сразу
sample({
  clock: navigateToDocument,
  source: documentTreeModel.stores.$nodesById,
  filter: (nodesById, { id }) => Boolean(nodesById[id]),
  fn: (nodesById, { id }) => nodesById[id].info,
  target: documentTreeModel.events.fileSelected,
});

// Case 2: Документа нет в дереве → запомнить ID и загрузить путь
sample({
  clock: navigateToDocument,
  source: documentTreeModel.stores.$nodesById,
  filter: (nodesById, { id }) => !nodesById[id],
  fn: (_, { id }) => id,
  target: $pendingDocumentId,
});

sample({
  clock: navigateToDocument,
  source: documentTreeModel.stores.$nodesById,
  filter: (nodesById, { id }) => !nodesById[id],
  fn: (_, { pagePath }) => pagePath,
  target: documentTreeModel.api.getTreeApi,
});

// После загрузки дерева → выбрать ожидаемый документ
sample({
  clock: documentTreeModel.api.getTreeApi.done,
  source: {
    pendingId: $pendingDocumentId,
    nodesById: documentTreeModel.stores.$nodesById,
  },
  filter: ({ nodesById, pendingId }) => Boolean(pendingId && nodesById[pendingId]),
  fn: ({ nodesById, pendingId }) => nodesById[pendingId!].info,
  target: documentTreeModel.events.fileSelected,
});

// Очистить pending после выбора
sample({
  clock: documentTreeModel.events.fileSelected,
  fn: () => null,
  target: $pendingDocumentId,
});

export const navigationModel = {
  events: {
    navigateToDocument,
  },
  stores: {
    $pendingDocumentId,
  },
};
