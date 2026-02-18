import { createEvent, createStore } from 'effector';

import { NodeRelationsParams } from '../types/types';

// Публичные события (API entity)
/** Запрос на добавление связи для узла */
export const addRelationRequested = createEvent<string>();

/** Запрос на редактирование события */
export const editEventRequested = createEvent<string | null>();

// События для обновления элементов графа
export const $graphItems = createStore<NodeRelationsParams | null>(null, {
  skipVoid: false,
});
