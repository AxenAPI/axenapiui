import {createEffect, createEvent, createStore, sample} from 'effector';

import {EExportTypes} from '@/enums/common';
import {$eventGraph} from '@/models/EventGraphModel';
import {apiClient} from '@/shared/api/client';
import {EventGraphDTO, NodeDTOTypeEnum} from '@/shared/api/event-graph-api';

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
  fn: eventGraph => eventGraph.nodes.filter(node => node.type === NodeDTOTypeEnum.Service).map(node => node.id),
  target: setSelectedServices,
});

export const generatePdfFx = createEffect(async (params: {eventGraphDTO: EventGraphDTO; serviceIds: string[]}) => {
  try {
    const {eventGraphDTO, serviceIds} = params;
    return await apiClient.generatePdfPost({eventGraphDTO, serviceIds});
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : 'PDF generation failed');
  }
});

export const generateDocFx = createEffect(async (params: {eventGraphDTO: EventGraphDTO; serviceIds: string[]}) => {
  try {
    const {eventGraphDTO, serviceIds} = params;
    return await apiClient.generateDocxPost({eventGraphDTO, serviceIds});
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : 'Docx generation failed');
  }
});
