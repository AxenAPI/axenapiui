import {Edge, EdgeChange, NodeChange, applyEdgeChanges, applyNodeChanges, type Node} from '@xyflow/react';
import {createEvent, createStore, sample} from 'effector';

import {
  $expandableItems,
  expandItemByTopicId,
  shrinkItemByTopicId,
} from '@/components/commons/diagram/model/ExpandableItemsModel';
import {adaptGhostNode, applyLayout} from '@/helpers/adapters';
import {getRelatedGhostNodeId} from '@/helpers/diagram-helpers/edge-helpers';
import {$eventGraph, clearEventGraph, removeLinks, removeNodes} from '@/models/EventGraphModel';
import {TNode} from '@/types/common';

// События для изменения состояния узлов и связей
export const setNodes = createEvent<TNode[]>();
export const setEdges = createEvent<Edge[]>();
export const setGhostNodes = createEvent<Node[]>();

export const clearNodes = createEvent();
export const clearEdges = createEvent();
export const clearGhostNodes = createEvent();
export const removeGhostNode = createEvent<string>();

// События для обработки изменений узлов и связей
export const onNodesChange = createEvent<NodeChange<TNode>[]>();
export const onEdgesChange = createEvent<EdgeChange<Edge>[]>();

// Сторы для хранения состояния
export const $nodes = createStore<TNode[]>([])
  .on(setNodes, (_, nodes) => nodes)
  .on(onNodesChange, (nodes, changes) =>
    // Применяем изменения узлов с помощью applyNodeChanges
    applyNodeChanges<TNode>(changes, nodes)
  )
  .reset(clearNodes);

/**
 * Стор для "призрачных" узлов — временных объектов,
 * которые остаются в графе после удаления оригинальных узлов.
 * Используются для отображения связей, сохранившихся после удаления узлов.
 */
export const $ghostNodes = createStore<Node[]>([])
  .on(setGhostNodes, (_, nodes) => nodes)
  .on(removeGhostNode, (nodes, id) => nodes.filter(node => node.id !== id))
  .reset(clearGhostNodes);

export const $edges = createStore<Edge[]>([])
  .on(setEdges, (_, edges) => edges)
  .on(onEdgesChange, (edges, changes) =>
    // Применяем изменения связей с помощью applyEdgeChanges
    applyEdgeChanges<Edge>(changes, edges)
  )
  .reset(clearEdges);

// Следим за изменениями в графе событий и обновляем узлы/связи соответственно
$eventGraph.watch(async data => {
  if (data) {
    const currentNodes = $nodes.getState();
    const ghostNodes = $ghostNodes.getState();
    const expandableItems = $expandableItems.getState();
    applyLayout(data, currentNodes, expandableItems, ghostNodes).then(result => {
      setNodes(result.nodes);
      setEdges(result.edges);
    });
  } else {
    clearNodes();
    clearEdges();
  }
});

// При удалении ноды, но сохранении связи записываем удаленные ноды в отдельный стор
sample({
  clock: removeNodes,
  source: $ghostNodes,
  fn: (ghostNodes, deletingNodeIds) => {
    const deletingNodes = $nodes.getState().filter(node => deletingNodeIds.includes(node.id));

    const adaptedNodes = deletingNodes.map(deletingNode => adaptGhostNode(deletingNode));

    return [...ghostNodes, ...adaptedNodes];
  },
  target: $ghostNodes,
});

// При удалении разорванной связи, удаляем и связанный с ней временный узел
sample({
  clock: removeLinks,
  source: {
    ghostNodes: $ghostNodes,
    allEdges: $edges,
  },
  fn: ({allEdges, ghostNodes}, deletingLinkIds) => {
    // Получаем связи, которые удаляются
    const deletingEdges = allEdges.filter(edge => deletingLinkIds.includes(edge.id));

    // Находим все "призрачные" узлы, связанные с удаляемыми связями
    const potentialGhostNodeIds = deletingEdges
      .map(edge => getRelatedGhostNodeId(ghostNodes, edge.source, edge.target))
      .filter(Boolean);

    // Оставляем только те "призрачные" узлы, которые больше нигде не используются
    const unusedGhostNodeIds = potentialGhostNodeIds.filter(
      ghostId =>
        !allEdges.some(
          edge =>
            !deletingLinkIds.includes(edge.id) && // Не среди удаляемых связей
            (edge.source === ghostId || edge.target === ghostId) // Используется в других связях
        )
    );

    return ghostNodes.filter(node => !unusedGhostNodeIds.includes(node.id));
  },
  target: $ghostNodes,
});

// Очистка призрачных узлов при очистке графа событий
sample({
  clock: clearEventGraph,
  target: clearGhostNodes,
});

sample({
  clock: [expandItemByTopicId, shrinkItemByTopicId],
  source: $eventGraph,
  fn: async eventGraph => {
    const currentNodes = $nodes.getState();
    const expandableItems = $expandableItems.getState();
    applyLayout(eventGraph, currentNodes, expandableItems).then(result => {
      setNodes(result.nodes);
      setEdges(result.edges);
    });
  },
});
