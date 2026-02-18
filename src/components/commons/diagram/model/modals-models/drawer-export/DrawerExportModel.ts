import { createEffect, createEvent, createStore } from 'effector';

import { DocumentationService } from '@shared/api/services';
import { EventGraphDTO } from '@shared/openapi';

export const openDrawerExport = createEvent();
export const closeDrawerExport = createEvent();

export const $drawerExport = createStore<{ isOpen: boolean }>({
  isOpen: false,
})
  .on(openDrawerExport, () => ({
    isOpen: true,
  }))
  .reset(closeDrawerExport);

// Асинхронный эффект для получения ссылок для скачивания спецификаций
export const fetchExportLinksFx = createEffect(async (eventGraphDTO: EventGraphDTO) => {
  try {
    return await DocumentationService.generateSpec(eventGraphDTO);
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : 'An unknown error occurred');
  }
});
