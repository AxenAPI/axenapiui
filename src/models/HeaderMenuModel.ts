/** *************************************************************************************************
 * FIXME
 * ВНИМАНИЕ! ЭТА МОДЕЛЬ УСТАРЕЛА И ПОДЛЕЖИТ РЕФАКТОРИНГУ!
 *
 * ВЕСЬ КОД В ЭТОМ ФАЙЛЕ ДОЛЖЕН БЫТЬ ПЕРЕПИСАН В СООТВЕТСТВИИ С ПРАВИЛАМИ,
 * ОПИСАННЫМИ В ДОКУМЕНТАЦИИ.
 *
 ************************************************************************************************** */

import { createEffect, createEvent, createStore, sample } from 'effector';

import { DocumentationService } from '@shared/api/services';
import { EventGraphDTO, NodeDTOTypeEnum } from '@shared/openapi';

import { EExportTypes } from '@/enums/common';
import { $eventGraph } from '@/models/EventGraphModel';

export const openDrawerExportAs = createEvent();
export const closeDrawerExportAs = createEvent();
export const setExportType = createEvent<EExportTypes>();
export const setSelectedServices = createEvent<string[]>();
export const setSelectedPage = createEvent<string>();

export const $headerModel = createStore<{
  isOpen: boolean;
  selectedType: string;
  selectedServices: string[];
  selectedPage: string;
}>({
  isOpen: false,
  selectedType: 'JSON',
  selectedServices: [],
  selectedPage: 'Modeler',
})
  // Обработка открытия
  .on(openDrawerExportAs, state => ({
    ...state,
    isOpen: true,
  }))
  // Обработка закрытия
  .on(closeDrawerExportAs, state => ({
    ...state,
    isOpen: false,
  }))
  // Обработка изменения типа
  .on(setExportType, (state, selectedType) => ({
    ...state,
    selectedType,
  }))
  // Обработка изменения списка сервисов
  .on(setSelectedServices, (state, selectedServices) => ({
    ...state,
    selectedServices,
  }))
  // Обработка изменения страницы
  .on(setSelectedPage, (state, selectedPage) => ({
    ...state,
    selectedPage,
  }));

sample({
  clock: openDrawerExportAs,
  source: $eventGraph,
  fn: eventGraph => eventGraph.nodes.filter(node => node.type === NodeDTOTypeEnum.Service).map(node => node.id ?? ''),
  target: setSelectedServices,
});

export const generatePdfFx = createEffect(async (params: { eventGraphDTO: EventGraphDTO; serviceIds: string[] }) => {
  try {
    const { eventGraphDTO, serviceIds } = params;
    return await DocumentationService.generatePdf(eventGraphDTO, serviceIds);
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : 'PDF generation failed');
  }
});

export const generateDocFx = createEffect(async (params: { eventGraphDTO: EventGraphDTO; serviceIds: string[] }) => {
  try {
    const { eventGraphDTO, serviceIds } = params;
    return await DocumentationService.generateDocx(eventGraphDTO, serviceIds);
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : 'Docx generation failed');
  }
});
