import { createEvent, createStore } from 'effector';

/** Контекст нода с тегами (объединяет nodeId + tags) */
export type NodeTagsContext = {
  nodeId: string;
  tags: string[];
};

/** Контекст текущего редактируемого нода */
export const $nodeTagsContext = createStore<NodeTagsContext | null>(null, {
  skipVoid: false,
});

/** Справочник тегов (заполняется из page через sample) */
export const $availableTags = createStore<string[]>([]);

// API события для UI
/** Изменить теги нода */
export const setTagToNode = createEvent<string[]>();
/** Создать новый тег в справочнике */
export const addNewTag = createEvent<string>();
