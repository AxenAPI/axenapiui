import { createEffect, createEvent, createStore, sample } from 'effector';

// TODO: исправить Такое комбинирование на page делаем
import { repositoryModel } from '@app/models/repository';

import { documentTreeModel } from '@entities/documentation/DocumentTree';

import { DocumentationService } from '@shared/api/services/documentation.service';
import { logger } from '@shared/lib/logger';
import { EventGraphDTO } from '@shared/openapi';

// TODO: исправить Такое комбинирование на page делаем
import { EMPTY_CHAR } from '@/constants/common';
import { $eventGraph } from '@/models/EventGraphModel';

import { selectionModel } from './selectionModel';

/**
 * TECH DEBT: Текущий API требует от клиента предварительно модифицировать eventGraph
 * перед отправкой запроса на линковку. Это нарушает принцип SRP — клиент берёт на себя
 * ответственность бэкенда. Правильное решение: бэкенд должен сам обновлять
 * documentationFileLinks и relatedPages по переданным objectId/pageId.
 *
 * Данная реализация копирует логику из useDocumentationMeta.tsx для совместимости.
 * При исправлении API этот код нужно будет упростить.
 */

// Types

export interface OpenDrawerPayload {
  nodeId: string;
  nodeType: string;
  currentDocIds: string[];
}

interface NodeInfo {
  nodeId: string;
  nodeType: string;
}

type NodesById = Record<string, { info: { id?: string; pagePath?: string } }>;

interface NodeDocLinks {
  relatedPages: string[];
  documentationFileLinks: string[];
}

interface ModifyLinkResult {
  graph: EventGraphDTO;
  pagePath: string;
}

interface SaveLinksParams {
  nodeInfo: NodeInfo;
  toAdd: Set<string>;
  toRemove: Set<string>;
  eventGraph: EventGraphDTO;
  nodesById: NodesById;
}

// Events

const openDrawer = createEvent<OpenDrawerPayload>();
const closeDrawer = createEvent();
const saveLinks = createEvent();

// Stores

const $isOpen = createStore(false);
const $nodeInfo = createStore<NodeInfo | null>(null);

// Helpers

/**
 * Строит консистентные массивы relatedPages и documentationFileLinks из списка pageId.
 *
 * Гарантирует Single Source of Truth:
 * - relatedPages содержит только те pageId, которые существуют в nodesById
 * - documentationFileLinks содержит соответствующие pagePath
 * - Оба массива всегда синхронизированы по индексам
 *
 * Несуществующие pageId пропускаются (документ мог быть удалён).
 */
function buildNodeDocLinks(pageIds: string[], nodesById: NodesById): NodeDocLinks {
  const relatedPages: string[] = [];
  const documentationFileLinks: string[] = [];

  for (const pageId of pageIds) {
    const pagePath = nodesById[pageId]?.info?.pagePath;
    if (pagePath) {
      relatedPages.push(pageId);
      documentationFileLinks.push(pagePath);
    }
  }

  return { relatedPages, documentationFileLinks };
}

/**
 * TECH DEBT: Добавляет связь документа с нодой в eventGraph.
 *
 * Использует buildNodeDocLinks для гарантии консистентности:
 * relatedPages и documentationFileLinks всегда синхронизированы.
 *
 * @returns ModifyLinkResult с обновлённым графом и pagePath для API, или null если документ не найден.
 */
function addLinkToGraph(
  graph: EventGraphDTO,
  nodeId: string,
  pageId: string,
  nodesById: NodesById
): ModifyLinkResult | null {
  const pagePath = nodesById[pageId]?.info?.pagePath;
  if (!pagePath) {
    logger.warn(`[LinkDocumentDrawer] Document ${pageId} not found, skipping add`);
    return null;
  }

  const updatedGraph: EventGraphDTO = {
    ...graph,
    nodes: graph.nodes?.map(node => {
      if (node.id !== nodeId) return node;

      const currentRelatedPages = node.relatedPages || [];
      const { documentationFileLinks, relatedPages } = buildNodeDocLinks([...currentRelatedPages, pageId], nodesById);

      return { ...node, relatedPages, documentationFileLinks };
    }),
  };

  return { graph: updatedGraph, pagePath };
}

/**
 * TECH DEBT: Удаляет связь документа с нодой из eventGraph.
 *
 * Использует buildNodeDocLinks для гарантии консистентности.
 * При удалении pagePath берётся из текущих documentationFileLinks ноды
 * (документ мог быть удалён из дерева, но связь ещё есть).
 *
 * @returns ModifyLinkResult с обновлённым графом и pagePath для API, или null если связи нет.
 */
function removeLinkFromGraph(
  graph: EventGraphDTO,
  nodeId: string,
  pageId: string,
  nodesById: NodesById
): ModifyLinkResult | null {
  const node = graph.nodes?.find(n => n.id === nodeId);
  const pageIndex = node?.relatedPages?.indexOf(pageId) ?? -1;

  if (pageIndex === -1) {
    logger.warn(`[LinkDocumentDrawer] Document ${pageId} not linked to node ${nodeId}, skipping remove`);
    return null;
  }

  // pagePath берём из текущих данных ноды (документ мог быть удалён из дерева)
  const pagePath = node?.documentationFileLinks?.[pageIndex] || nodesById[pageId]?.info?.pagePath || pageId;

  const updatedGraph: EventGraphDTO = {
    ...graph,
    nodes: graph.nodes?.map(n => {
      if (n.id !== nodeId) return n;

      const { documentationFileLinks, relatedPages } = buildNodeDocLinks(
        (n.relatedPages || []).filter(id => id !== pageId),
        nodesById
      );

      return { ...n, relatedPages, documentationFileLinks };
    }),
  };

  return { graph: updatedGraph, pagePath };
}

// Effects

/**
 * Сохраняет изменения связей документов с нодой.
 *
 * TECH DEBT: Почему последовательная обработка, а не Promise.allSettled?
 *
 * API требует передавать eventGraph с КАЖДЫМ запросом, и каждый следующий запрос
 * должен использовать граф из ОТВЕТА предыдущего. При параллельных запросах:
 *
 *   Promise.allSettled([
 *     api(eventGraph_v0, link_A) → eventGraph_v1a,
 *     api(eventGraph_v0, link_B) → eventGraph_v1b,  // ← Потеря link_A!
 *     api(eventGraph_v0, link_C) → eventGraph_v1c,  // ← Потеря link_A, link_B!
 *   ])
 *
 * Все запросы отправляются с одной версией графа, каждый ответ содержит только
 * свою связь. Последний ответ перезаписывает предыдущие — данные теряются.
 *
 * Правильное решение: batch endpoint на бэкенде, принимающий массив изменений.
 */
const saveLinksFx = createEffect(async (params: SaveLinksParams) => {
  const { eventGraph, nodeInfo, nodesById, toAdd, toRemove } = params;
  const { nodeId, nodeType } = nodeInfo;

  let currentGraph = eventGraph;
  let linkedCount = 0;
  let unlinkedCount = 0;
  let failCount = 0;
  let skippedCount = 0;

  // Link — добавляем связи ПОСЛЕДОВАТЕЛЬНО (см. комментарий выше про TECH DEBT)
  for (const pageId of toAdd) {
    const result = addLinkToGraph(currentGraph, nodeId, pageId, nodesById);

    if (result === null) {
      skippedCount++;
    } else {
      try {
        const response = await DocumentationService.linkDocumentationPage({
          addPageLinkRequest: {
            objectId: nodeId,
            objectType: nodeType,
            pagePath: result.pagePath,
            eventGraph: result.graph,
          },
        });

        // Критично: используем граф из ОТВЕТА для следующей итерации
        currentGraph = response;
        linkedCount++;
      } catch (error) {
        logger.error('[LinkDocumentDrawer] Failed to link document:', pageId, error);
        failCount++;
      }
    }
  }

  // Unlink — удаляем связи ПОСЛЕДОВАТЕЛЬНО (та же причина)
  for (const pageId of toRemove) {
    const result = removeLinkFromGraph(currentGraph, nodeId, pageId, nodesById);

    if (result === null) {
      skippedCount++;
    } else {
      try {
        const response = await DocumentationService.linkDocumentationPage({
          addPageLinkRequest: {
            objectId: nodeId,
            objectType: nodeType,
            pagePath: result.pagePath,
            eventGraph: result.graph,
          },
        });

        // Критично: используем граф из ОТВЕТА для следующей итерации
        // ПРОБЛЕМА: в ответе пейджа удаляется только из documentationFileLinks
        currentGraph = response;
        unlinkedCount++;
      } catch (error) {
        logger.error('[LinkDocumentDrawer] Failed to unlink document:', pageId, error);
        failCount++;
      }
    }
  }

  return {
    eventGraph: currentGraph,
    stats: {
      linked: linkedCount,
      unlinked: unlinkedCount,
      failed: failCount,
      skipped: skippedCount,
    },
  };
});

// Logic

// Open drawer: save node info and init selection
sample({
  clock: openDrawer,
  fn: ({ nodeId, nodeType }) => ({ nodeId, nodeType }),
  target: $nodeInfo,
});

sample({
  clock: openDrawer,
  fn: () => true,
  target: $isOpen,
});

sample({
  clock: openDrawer,
  fn: payload => payload.currentDocIds,
  target: selectionModel.events.initSelection,
});

// Load document tree when drawer opens
sample({
  clock: openDrawer,
  source: repositoryModel.stores.$hasDocumentationActive,
  filter: Boolean,
  fn: () => EMPTY_CHAR,
  target: documentTreeModel.api.getTreeApi,
});

// Close drawer: reset state
sample({
  clock: closeDrawer,
  fn: () => false,
  target: $isOpen,
});

sample({
  clock: closeDrawer,
  fn: () => null,
  target: $nodeInfo,
});

sample({
  clock: closeDrawer,
  target: selectionModel.events.resetSelection,
});

// Save links — с логированием ошибки при отсутствии nodeInfo
sample({
  clock: saveLinks,
  source: {
    nodeInfo: $nodeInfo,
    toAdd: selectionModel.stores.$toAdd,
    toRemove: selectionModel.stores.$toRemove,
    eventGraph: $eventGraph,
    nodesById: documentTreeModel.stores.$nodesById,
  },
  filter: ({ nodeInfo }) => {
    // nodeInfo должен быть установлен при открытии drawer.
    // Если null — это баг в логике, не пользовательская ошибка.
    if (nodeInfo === null) {
      logger.error('[LinkDocumentDrawer] saveLinks called but nodeInfo is null — this should not happen');
      return false;
    }
    return true;
  },
  fn: ({ eventGraph, nodeInfo, nodesById, toAdd, toRemove }) => ({
    nodeInfo: nodeInfo!,
    toAdd,
    toRemove,
    eventGraph,
    nodesById,
  }),
  target: saveLinksFx,
});

// Update $eventGraph after successful save
sample({
  clock: saveLinksFx.doneData,
  fn: result => result.eventGraph,
  target: $eventGraph,
});

// Close drawer after successful save
sample({
  clock: saveLinksFx.done,
  target: closeDrawer,
});

// Public API

export const linkDocumentDrawerModel = {
  stores: {
    $isOpen,
    $nodeInfo,
    $isSaving: saveLinksFx.pending,
    // Selection stores (proxied from selectionModel)
    $selectedIds: selectionModel.stores.$selectedIds,
    $hasChanges: selectionModel.stores.$hasChanges,
  },
  events: {
    openDrawer,
    closeDrawer,
    saveLinks,
    // Selection events (proxied from selectionModel)
    toggleSelection: selectionModel.events.toggleSelection,
  },
  effects: {
    saveLinksFx,
  },
};
