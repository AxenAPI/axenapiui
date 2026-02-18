import { createEvent, sample } from 'effector';

import { documentTreeModel } from '@entities/documentation/DocumentTree';

import { navigationModel } from './navigation.model';

/**
 * Feature: SelectDocumentForView
 *
 * Координирует логику выбора документа для просмотра.
 * Связывает Widget (DocViewDrawer) и Entity (DocumentTree).
 *
 * Ответственность:
 * - Валидация существования документа
 * - Синхронизация выбранного файла с Entity
 * - Навигация к документам через lazy-loaded дерево
 */

// Events
const selectDocument = createEvent<string>();

// Logic

// Валидация и выбор документа из дерева (для случаев когда документ точно загружен)
sample({
  clock: selectDocument,
  source: documentTreeModel.stores.$nodesById,
  filter: (nodesById, uuid) => {
    // Отобразить ошибки
    if (!uuid) return false;
    return Boolean(nodesById[uuid]);
  },
  fn: (nodesById, uuid) => nodesById[uuid].info,
  target: documentTreeModel.events.fileSelected,
});

export const selectDocumentForViewModel = {
  events: {
    selectDocument,
    /** Програмная навигация к документу */
    navigateToDocument: navigationModel.events.navigateToDocument,
  },
};
