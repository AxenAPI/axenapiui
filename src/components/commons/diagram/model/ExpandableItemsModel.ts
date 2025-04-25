import {createEvent, createStore} from 'effector';

import {getExpandableItems} from '@/helpers/diagram-helpers/event-graph-helpers';
import {$eventGraph} from '@/models/EventGraphModel';
import {NodeDTO} from '@/shared/api/event-graph-api';
import {type TExpandableItem} from '@/types/common';

export const setExpandableItem = createEvent<TExpandableItem[]>();
export const expandItemByTopicId = createEvent<NodeDTO['id']>();
export const shrinkItemByTopicId = createEvent<NodeDTO['id']>();

export const clearExpandableItems = createEvent();

export const $expandableItems = createStore<TExpandableItem[]>([])
  .on(setExpandableItem, (_, expandableItems) => expandableItems)
  .on(expandItemByTopicId, (expandableItems, topicId) =>
    expandableItems.map(el => (el.topicId === topicId ? {...el, isExpanded: true} : el))
  )
  .on(shrinkItemByTopicId, (expandableTopics, topicId) =>
    expandableTopics.map(el => (el.topicId === topicId ? {...el, isExpanded: false} : el))
  )
  .reset(clearExpandableItems);

// При любом изменении графа пересчитываем расширяемые элементы
$eventGraph.watch(data => {
  if (data) {
    const existingExpandableItems = $expandableItems.getState();
    setExpandableItem(getExpandableItems(data, existingExpandableItems));
  } else {
    clearExpandableItems();
  }
});
