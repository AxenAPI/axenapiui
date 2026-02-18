import { createEffect, createEvent, createStore, sample } from 'effector';

import { HttpService } from '@shared/api/services';
import { HttpContentTypeEnum, HttpContentTypeItem } from '@shared/openapi';

export const openEditHttpNodeModal = createEvent<string>();
export const closeEditHttpNodeModal = createEvent();

// Стор модального окна информационной панели. Содержит два поля:
// - isOpen: boolean - флаг открытия/закрытия модального окна
// - itemId: string - идентификатор элемента, для которого открыто окно
export const $editHttpNodeModal = createStore<{ isOpen: boolean; nodeId: string }>({
  isOpen: false,
  nodeId: '',
})
  .on(openEditHttpNodeModal, (_, payload) => ({
    isOpen: true,
    nodeId: payload,
  }))
  .reset(closeEditHttpNodeModal);

// Стор доступных типов media type
// Используется для отображения JSON редактора в поле Request
// Если выбранный тип отсутствует в массиве стора, то отображается JSON редактор
export const $availableHttpContentTypes = createStore<HttpContentTypeItem[]>([]);

export const fetchAvailableHttpContentTypesFX = createEffect(async () => {
  try {
    return await HttpService.getAvailableContentTypes();
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : 'Fetching available http content type failed');
  }
});

export const $selectedContentType = createStore<HttpContentTypeEnum | null>(null);

export const setSelectedContentType = createEvent<HttpContentTypeEnum | null>();

sample({
  source: setSelectedContentType,
  target: $selectedContentType,
});

sample({
  source: openEditHttpNodeModal,
  target: fetchAvailableHttpContentTypesFX,
});

sample({
  source: fetchAvailableHttpContentTypesFX.doneData,
  target: $availableHttpContentTypes,
});
