import { createEvent, createStore, sample } from 'effector';
import { debounce } from 'patronum';

import { repositoryModel } from '@app/models/repository';

import { documentTreeModel } from '@entities/documentation/DocumentTree';

import { fileValidationModel, FileValidationResult } from '@features/documentation/FileValidation';
import { documentStateModel } from '@features/documentation/MDXEditorWithMermaid';
import { selectDocumentForViewModel } from '@features/modeler/SelectDocumentForView';

import { notificationModel } from '@shared/notification/notification.model';

import { EMPTY_CHAR } from '@/constants/common';

/**
 * Refresh Documentation Model
 *
 * Координирует обновление дерева документации:
 * 1. Принимает refreshDocumentationRequested от триггеров
 * 2. Debounce для защиты от множественных вызовов
 * 3. Сбрасывает дерево и загружает заново
 * 4. Вызывает валидацию файла (feature)
 * 5. Реагирует на результат валидации
 */

// === Constants ===
const REFRESH_DEBOUNCE_MS = 300;

// === Types ===
export type RefreshSource = 'window-focus' | 'git-pull' | 'git-checkout' | 'yandex-import' | 'branch-create' | 'link';

// === Events ===
export const refreshDocumentationRequested = createEvent<RefreshSource>();

// === Stores ===
const $pathToRestore = createStore<string | null>(null);
export const $lastRefreshSource = createStore<RefreshSource | null>(null);

// === Debounce ===
const refreshDebounced = debounce({
  source: refreshDocumentationRequested,
  timeout: REFRESH_DEBOUNCE_MS,
});

sample({
  clock: refreshDebounced,
  target: $lastRefreshSource,
});

// === Main Flow ===

// 1-0. Сохраняем путь текущего документа ДО сброса
sample({
  clock: refreshDebounced,
  source: documentTreeModel.stores.$selectedFile,
  fn: file => file?.pagePath ?? null,
  target: $pathToRestore,
});

// 1-1. Ссылаемся на другой документ
sample({
  clock: refreshDebounced,
  source: documentStateModel.stores.$internalLink,
  filter: (link, refreshType) => Boolean(link) && refreshType === 'link',
  target: $pathToRestore,
});

// 2. Сбрасываем состояние дерева
sample({
  clock: refreshDebounced,
  target: documentTreeModel.events.dataReset,
});

// 3. Загружаем корень нового дерева
sample({
  clock: refreshDebounced,
  source: repositoryModel.stores.$hasDocumentationActive,
  filter: Boolean,
  fn: () => EMPTY_CHAR,
  target: documentTreeModel.api.getTreeApi,
});

// 4. После загрузки дерева — запускаем валидацию файла (если был открыт)
sample({
  clock: documentTreeModel.api.getTreeApi.done,
  source: $pathToRestore,
  filter: (path: string | null): path is string => path !== null,
  fn: (pagePath: string) => ({ pagePath }),
  target: fileValidationModel.api.validateFileExistenceFx,
});

// === Реакция на результат валидации ===

const { validateFileExistenceFx } = fileValidationModel.api;

// 5a. Файл найден → навигируем к нему
sample({
  clock: validateFileExistenceFx.doneData,
  filter: (result: FileValidationResult) => result.found,
  fn: result => ({ id: result.pageInfo!.id, pagePath: result.pageInfo!.pagePath }),
  target: selectDocumentForViewModel.events.navigateToDocument,
});

// 5b. Файл НЕ найден → очищаем выбор и показываем уведомление
sample({
  clock: validateFileExistenceFx.doneData,
  filter: (result: FileValidationResult) => !result.found,
  fn: () => null,
  target: documentTreeModel.events.fileSelected,
});

sample({
  clock: validateFileExistenceFx.doneData,
  filter: (result: FileValidationResult) => !result.found,
  fn: () => ({
    message: 'Файл не найден',
    description: 'Файл был удалён или не существует в текущей ветке',
    key: 'file-not-found',
  }),
  target: notificationModel.events.showWarning,
});

// 6. Очищаем сохранённый путь после валидации
sample({
  clock: validateFileExistenceFx.finally,
  fn: () => null,
  target: $pathToRestore,
});

// === Exports ===
export const refreshDocumentationModel = {
  events: {
    refreshDocumentationRequested,
  },
  stores: {
    $lastRefreshSource,
  },
};
