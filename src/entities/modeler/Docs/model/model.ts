import { createEvent, createStore } from 'effector';

// Стор списка идетификаторов документов
export const $docsIds = createStore<string[] | null>(null, {
  skipVoid: false,
});

// Event для запроса открытия drawer связывания документов
export const linkDocumentRequested = createEvent();
