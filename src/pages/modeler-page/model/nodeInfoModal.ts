import { createEvent, createStore, sample } from 'effector';
import { createGate } from 'effector-react';

import { repositoryModel } from '@app/models/repository/model';

import { $docsIds, linkDocumentRequested } from '@entities/modeler/Docs/model/model';
import { $graphItems, addRelationRequested, editEventRequested } from '@entities/modeler/Relations/model/model';
import { $status } from '@entities/modeler/Status/model/model';
import { $availableTags, $nodeTagsContext, addNewTag, setTagToNode } from '@entities/modeler/Tags';

import { linkDocumentDrawerModel } from '@features/modeler/LinkDocumentDrawer';

import { openDrawerAddLink } from '@/components/commons/diagram/model/modals-models/drawer-add-link/DrawerAddLinkModel';
import { openDrawerCreateEvent } from '@/components/commons/diagram/model/modals-models/drawer-create-event/DrawerCreateEventModel';
import { $eventGraph, addTag, editNode } from '@/models/EventGraphModel';

import { getModalData } from '../libs/getTabsData';

// Models moved to @features/documentation/MDXEditorWithMermaid
import '@features/documentation/MDXEditorWithMermaid/model/editorPage.model';
import '@features/documentation/MDXEditorWithMermaid/model/selection.model';

// Gate
export const NodeDetailsModalGate = createGate('NodeDetailsModal');

// Logics

// When the page is opened, trigger a fetch for repo list
sample({
  //TODO: сменить на event, запускается раньше открытия модалки
  clock: NodeDetailsModalGate.open,
  target: repositoryModel.api.fetchGitRepositoriesApi,
});

// Модальное окно: события
export const nodeDetailsModalOpened = createEvent<string>(); // принимает ID элемента
export const nodeDetailsModalClosed = createEvent();

// Стор с ID выбранного элемента
export const $selectedElementId = createStore<string | null>(null, {
  skipVoid: false,
})
  .on(nodeDetailsModalOpened, (_, id) => id)
  .reset(nodeDetailsModalClosed);

// Стор с данными табов модального окна
export const $data = createStore<ReturnType<typeof getModalData>>(null);

// Обновляем данные табов при изменении selectedElementId ИЛИ eventGraph.
sample({
  clock: [$selectedElementId, $eventGraph],
  source: { graph: $eventGraph, elementId: $selectedElementId },
  filter: ({ elementId }) => elementId !== null,
  fn: ({ elementId, graph }) => {
    if (!graph) return null;
    return getModalData(graph, elementId!);
  },
  target: $data,
});

/* Заполнение данных модального окна деталей нода */
sample({
  source: $data,
  filter: Boolean,
  fn: data => data.tabs.graphItems,
  target: $graphItems,
});

sample({
  source: $data,
  filter: Boolean,
  fn: data => data.tabs.docsIds,
  target: $docsIds,
});

sample({
  source: $data,
  filter: Boolean,
  fn: data => data.tabs.status,
  target: $status,
});

/* Обработка событий из entity Relations */
// При клике "Add relation" открываем drawer и закрываем модальное окно деталей нода
sample({
  clock: addRelationRequested,
  target: [openDrawerAddLink, nodeDetailsModalClosed],
});

// При клике на редактирование события открываем drawer
sample({
  clock: editEventRequested,
  target: openDrawerCreateEvent,
});

// При клике "Link document" открываем drawer связывания документов
sample({
  clock: linkDocumentRequested,
  source: {
    nodeId: $selectedElementId,
    data: $data,
    currentDocIds: $docsIds,
  },
  filter: ({ data, nodeId }) => nodeId !== null && data !== null,
  fn: ({ currentDocIds, data, nodeId }) => ({
    nodeId: nodeId!,
    nodeType: data!.node.type,
    currentDocIds: currentDocIds ?? [],
  }),
  target: linkDocumentDrawerModel.events.openDrawer,
});

/* Связывание модели тегов с EventGraphModel */

// Заполнение контекста нода (nodeId + tags вместе) — начальное и при изменении графа
sample({
  clock: [$data, $eventGraph],
  source: { elementId: $selectedElementId, graph: $eventGraph },
  filter: ({ elementId, graph }) => Boolean(elementId) && Boolean(graph),
  fn: ({ elementId, graph }) => {
    const node = graph!.nodes?.find(n => n.id === elementId);
    return {
      nodeId: elementId!,
      tags: node?.tags ?? [],
    };
  },
  target: $nodeTagsContext,
});

// Прокидываем справочник тегов из EventGraphModel
sample({
  source: $eventGraph,
  fn: graph => graph?.tags ?? [],
  target: $availableTags,
});

// Изменение тегов нода -> editNode
sample({
  clock: setTagToNode,
  source: $nodeTagsContext,
  filter: Boolean,
  fn: (ctx, tags) => ({
    id: ctx.nodeId,
    updates: { tags },
  }),
  target: editNode,
});

// Создание нового тега в справочнике -> addTag (из EventGraphModel)
sample({
  clock: addNewTag,
  target: addTag,
});

export const NodeDetailsModalModel = {
  gate: NodeDetailsModalGate,
};
