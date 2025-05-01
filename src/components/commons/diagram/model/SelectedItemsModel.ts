import {createEvent, createStore, sample} from 'effector';

import {clearEventGraph, removeNode, removeNodes, removeNodeWithConnectedLinks} from '@/models/EventGraphModel';
import {NodeDTO} from '@/shared/api/event-graph-api';

export const removeAllSelection = createEvent();
export const toggleItemSelection = createEvent<NodeDTO['id']>();
export const addMultipleSelection = createEvent<NodeDTO['id']>();

export const $selectedItems = createStore<string[]>([])
  .on(toggleItemSelection, (selectedItems, payload) => (selectedItems.includes(payload) ? [] : [payload]))
  .on(addMultipleSelection, (selectedItems, payload) =>
    selectedItems.includes(payload) ? selectedItems.filter(item => item !== payload) : [...selectedItems, payload]
  )
  .reset(removeAllSelection);

sample({
  clock: removeNode,
  target: removeAllSelection,
});

sample({
  clock: removeNodes,
  target: removeAllSelection,
});

sample({
  clock: removeNodeWithConnectedLinks,
  target: removeAllSelection,
});

sample({
  clock: clearEventGraph,
  target: removeAllSelection,
});
