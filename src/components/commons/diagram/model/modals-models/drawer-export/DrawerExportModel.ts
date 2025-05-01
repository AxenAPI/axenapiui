import {createEffect, createEvent, createStore} from 'effector';

import {apiClient} from '@/shared/api/client';
import {EventGraphDTO} from '@/shared/api/event-graph-api';

export const openDrawerExport = createEvent();
export const closeDrawerExport = createEvent();

export const $drawerExport = createStore<{isOpen: boolean}>({
  isOpen: false,
})
  .on(openDrawerExport, () => ({
    isOpen: true,
  }))
  .reset(closeDrawerExport);

// Асинхронный эффект для получения ссылок для скачивания спецификаций
export const fetchExportLinksFx = createEffect(async (eventGraphDTO: EventGraphDTO) => {
  try {
    const response = await apiClient.generateSpecPost({eventGraphDTO});

    return response.data;
  } catch (e) {
    throw new Error(e);
  }
});
