import { createEvent, createStore, merge, sample } from 'effector';

import { $ghostNodes, removeGhostNodes } from '@/components/commons/diagram/model/DiagramModel';
import { HISTORY_DEPTH, INITIAL_HISTORY_INDEX } from '@/constants/diagram';
import { $eventGraph, addLinks, addNode, removeNodes, removeNodeWithConnectedLinks } from '@/models/EventGraphModel';
import type { THistory } from '@/types/common';

const addToHistory = createEvent<THistory>();
// На все эти события добавляем запись в историю.
const addToHistoryMergedEvent = merge([addNode, addLinks, removeNodes, removeNodeWithConnectedLinks]);
// Назад по истории.
export const undo = createEvent();
// Вперёд по истории.
export const redo = createEvent();
const clearHistory = createEvent<number>();
// Объединённое событие очистки истории.
const clearHistoryMergedEvent = merge([addNode, addLinks]);
const clearHistoryIndex = createEvent();

// Стор для хранения истории состояния графа.
const $history = createStore<THistory[]>([])
  .on(addToHistory, (history, newState) => {
    const newHistory = [...history, newState];

    return newHistory.slice(HISTORY_DEPTH);
  })
  /*
   * При очистке истории, например, когда пользователь сделал `undo`, а затем добавил новый узел,
   * мы обрезаем "будущее" (все, что было после точки `undo`).
   * Текущее состояние графа (`currentGraph`) становится единственной записью в новой истории.
   *
   * `$history` хранит состояние в виде массива кортежей `THistory[]`, где `THistory` это `[graph, index]`.
   * Поэтому мы возвращаем массив, содержащий один элемент-кортеж: `[[currentGraph, INITIAL_HISTORY_INDEX]]`.
   */
  .on(clearHistory, (history, historyIndex) => {
    const lastHistoryItem = history.at(history.length - 1 - historyIndex);

    if (lastHistoryItem) {
      const [currentGraph] = lastHistoryItem;
      return [[currentGraph, INITIAL_HISTORY_INDEX]];
    }

    return [];
  });

// Стор для хранения индекса текущего положения в истории.
const $historyIndex = createStore<number>(INITIAL_HISTORY_INDEX).reset(clearHistoryIndex);

// Инкрементируем historyIndex на событие undo.
sample({
  clock: undo,
  source: {
    history: $history,
    historyIndex: $historyIndex,
  },
  filter: ({ history, historyIndex }) => history.length - 1 > historyIndex,
  fn: ({ historyIndex }) => historyIndex + 1,
  target: $historyIndex,
});

// Декрементируем historyIndex на событие redo.
sample({
  clock: redo,
  source: $historyIndex,
  filter: historyIndex => historyIndex > INITIAL_HISTORY_INDEX,
  fn: historyIndex => historyIndex - 1,
  target: $historyIndex,
});

// Если при добавлении ноды/связи было перемещение по истории, очищаем историю.
sample({
  clock: clearHistoryMergedEvent,
  source: $historyIndex,
  filter: historyIndex => historyIndex !== INITIAL_HISTORY_INDEX,
  fn: historyIndex => historyIndex,
  target: clearHistory,
});

// При очистке history также обнуляем historyIndex.
sample({
  clock: clearHistory,
  target: clearHistoryIndex,
});

// На событие addToHistoryMergedEvent добавляем граф в history.
sample({
  clock: addToHistoryMergedEvent,
  source: {
    eventGraph: $eventGraph,
    history: $history,
  },
  fn: ({ eventGraph, history }): THistory => [eventGraph, history.length],
  target: addToHistory,
});

// При событии undo устанавливаем соответствующий historyIndex граф из истории.
sample({
  clock: undo,
  source: {
    historyIndex: $historyIndex,
    history: $history,
  },
  filter: ({ history, historyIndex }) => !!history.length && history.length > historyIndex,
  fn: ({ history, historyIndex }) => {
    const [graphToRender] = history[history.length - 1 - historyIndex];

    return graphToRender;
  },
  target: $eventGraph,
});

// При событии redo устанавливаем соответствующий historyIndex граф из истории.
sample({
  clock: redo,
  source: {
    historyIndex: $historyIndex,
    history: $history,
  },
  fn: ({ history, historyIndex }) => {
    const [graphToRender] = history[history.length - 1 - historyIndex];

    return graphToRender;
  },
  target: $eventGraph,
});

// Если undo отменяет удаление ноды, помимо возвращении ноды в граф, удаляем её из призраков.
sample({
  clock: undo,
  source: {
    ghostNodes: $ghostNodes,
    eventGraph: $eventGraph,
  },
  filter: ({ ghostNodes }) => !!ghostNodes.length,
  fn: ({ eventGraph, ghostNodes }) => {
    const nodesIds = eventGraph.nodes.map(({ id }) => id);

    return ghostNodes.filter(({ id }) => nodesIds.includes(id)).map(({ id }) => id);
  },
  target: removeGhostNodes,
});
