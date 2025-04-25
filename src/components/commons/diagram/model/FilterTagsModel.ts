import {createEvent, createStore} from 'effector';

export const resetFilter = createEvent();
export const addTagToFilter = createEvent<string>();
export const removeTagFromFilter = createEvent<string>();
export const setTags = createEvent<string[]>();

// Стор состояния фильтра по тегу
export const $filterTags = createStore<string[]>([])
  .on(addTagToFilter, (tags, payload) => (tags.includes(payload) ? tags : [...tags, payload]))
  .on(removeTagFromFilter, (tags, payload) => tags.filter(item => item !== payload))
  .on(setTags, (_, payload) => [...payload])
  .reset(resetFilter);
