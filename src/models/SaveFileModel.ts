import {createStore, createEvent} from 'effector';

// Сторы для путей и контента
export const $fullPath = createStore<string>('');
export const $relativePathForMR = createStore<string>('');
export const $markdown = createStore<string>('');

export const $dirty = createStore<boolean>(false);

// События для обновления значений
export const fullPathChanged = createEvent<string>();
export const relativePathForMRChanged = createEvent<string>();
export const markdownChanged = createEvent<string>();
export const dirtyChanged = createEvent<boolean>();

// Обработка событий
$fullPath.on(fullPathChanged, (_, fullPath) => fullPath);
$relativePathForMR.on(relativePathForMRChanged, (_, relativePath) => relativePath);
$markdown.on(markdownChanged, (_, markdown) => markdown);
$dirty.on(dirtyChanged, (_, dirty) => dirty);
