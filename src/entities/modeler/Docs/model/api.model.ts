import { isAxiosError } from 'axios';
import { createEffect, createStore, sample } from 'effector';

import { DocumentationService } from '@shared/api/services';
import { DocumentationPageByUuidResponse } from '@shared/openapi';

import { $docsIds } from './model';

// Типы результата загрузки документа
export type DocFetchSuccess = {
  status: 'success';
  data: DocumentationPageByUuidResponse;
};

export type DocFetchError = {
  status: 'error';
  uuid: string;
  error: string;
};

export type DocFetchResult = DocFetchSuccess | DocFetchError;

// Стор с результатами загрузки
export const $docsResults = createStore<DocFetchResult[]>([]);

// Эффект параллельной загрузки документов
export const fetchDocsFx = createEffect(async (uuids: string[]): Promise<DocFetchResult[]> => {
  const promises = uuids.map(uuid => DocumentationService.getPageByUuid(uuid));
  const results = await Promise.allSettled(promises);

  return results.map((result, index): DocFetchResult => {
    if (result.status === 'fulfilled') {
      return { status: 'success', data: result.value };
    }

    const { reason } = result;
    let errorMessage: string;

    if (isAxiosError(reason)) {
      errorMessage = reason.response?.data?.message || reason.message;
    } else if (reason instanceof Error) {
      errorMessage = reason.message;
    } else {
      errorMessage = String(reason);
    }

    return {
      status: 'error',
      uuid: uuids[index],
      error: errorMessage,
    };
  });
});

// Запуск загрузки при изменении $docsIds
sample({
  clock: $docsIds,
  filter: (ids): ids is string[] => Array.isArray(ids) && ids.length > 0,
  target: fetchDocsFx,
});

// Сброс при изменении $docsIds (до начала загрузки)
sample({
  clock: $docsIds,
  fn: () => [],
  target: $docsResults,
});

// Сохраняем результат в стор
sample({
  clock: fetchDocsFx.doneData,
  target: $docsResults,
});

// Обработка критической ошибки эффекта (например, сетевая ошибка до отправки)
sample({
  clock: fetchDocsFx.fail,
  source: $docsIds,
  fn: (ids): DocFetchResult[] =>
    (ids ?? []).map(uuid => ({
      status: 'error',
      uuid,
      error: 'Failed to fetch documents',
    })),
  target: $docsResults,
});
