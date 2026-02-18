/** *************************************************************************************************
 * FIXME
 * ВНИМАНИЕ! ЭТА МОДЕЛЬ УСТАРЕЛА И ПОДЛЕЖИТ РЕФАКТОРИНГУ!
 *
 * ВЕСЬ КОД В ЭТОМ ФАЙЛЕ ДОЛЖЕН БЫТЬ ПЕРЕПИСАН В СООТВЕТСТВИИ С ПРАВИЛАМИ,
 * ОПИСАННЫМИ В ДОКУМЕНТАЦИИ.
 *
 ************************************************************************************************** */

import { NFileInput } from '@axenix/ui-kit';
import { createEffect, createEvent, createStore, sample } from 'effector';
import { debounce } from 'patronum/debounce';
import { v4 as uuidv4 } from 'uuid';

import { EventGraphService } from '@shared/api/services';
import {
  EventDTO,
  EventGraphApiAddServiceToGraphPostRequest,
  EventGraphDTO,
  LinkDTO,
  NodeDTO,
  NodeDTOTypeEnum,
} from '@shared/openapi';

import { NodeFormData } from '@/components/commons/diagram/modals/lib/nodeToFormData';
import { EMPTY_ARRAY, EMPTY_CHAR } from '@/constants/common';
import { INITIAL_EVENT_GRAPH } from '@/constants/diagram';
import { Capitalize } from '@/helpers/utils';
import { MenuItem } from '@/types/common';

// Создание событий для изменения состояния
export const setEventGraph = createEvent<EventGraphDTO>();
const clearEventGraph = createEvent();

// Событие для добавления новых узлов
export const addNode = createEvent<NodeDTOTypeEnum>();
// Событие для добавления новых узлов
export const addEvent = createEvent<EventDTO>();
// Событие для добавления новых узлов
export const addTag = createEvent<string>();
// Событие для добавления новых узлов
export const addTagToEvent = createEvent<{ id: string; newTag: string }>();
// Событие для редактирования узлов
export const editNode = createEvent<{ id: string; updates: Partial<NodeFormData> }>();
// Событие для редактирования событий
export const editEvent = createEvent<{ id: string; updates: Partial<EventDTO> }>();
// Debounce версия для автосейва эдитора
export const triggerDebounceEdit = createEvent<{ id: string; updates: Partial<EventDTO> }>();
// TODO: Не используется, вероятнее всего нужно будет использовать, пока висит ошибка, отправил к комент
// export const debouncedEditEvent = debounce({source: triggerDebounceEdit, timeout: 3000, target: editEvent});
// Событие для создания связей
export const addLink = createEvent<LinkDTO>();
export const addLinks = createEvent<LinkDTO[]>();
export const addLinksError = createEvent();
export const editLink = createEvent<{ id: string; updates: LinkDTO }>();
export const removeLinks = createEvent<LinkDTO['id'][]>();
export const removeLink = createEvent<string>();
// События для удаления узлов, но с сохранением принадлежащих ему связей
export const removeNode = createEvent<string>();
export const removeNodes = createEvent<string[]>(); // Нужен для предотвращения визуальных багов
// Событие для удаления узла и связанных с ним связей
export const removeNodeWithConnectedLinks = createEvent<NodeDTO['id']>();
// Событие для удаления эвентов
export const removeEvent = createEvent<string>();
// Событие для удаления всех эвентов
export const removeAllEvents = createEvent<MenuItem[]>();

// Стор хранящий данные графа
const $eventGraph = createStore<EventGraphDTO>(INITIAL_EVENT_GRAPH)
  .on(setEventGraph, (_, payload) => payload)
  .on(addNode, (eventGraph, payload) => {
    const countNode = eventGraph.nodes.filter(node => node.type === payload).length;

    const newService: NodeDTO = {
      id: uuidv4(),
      belongsToGraph: EMPTY_ARRAY,
      httpParameters: {
        pathParameters: [
          {
            key: uuidv4(),
            name: EMPTY_CHAR,
            description: EMPTY_CHAR,
            required: false,
            type: 'string',
            schema: EMPTY_CHAR,
          },
        ],
        queryParameters: [
          {
            key: uuidv4(),
            name: EMPTY_CHAR,
            description: EMPTY_CHAR,
            required: false,
            type: 'string',
            schema: EMPTY_CHAR,
          },
        ],
        headerParameters: [
          {
            key: uuidv4(),
            name: EMPTY_CHAR,
            description: EMPTY_CHAR,
            required: false,
            type: 'string',
            schema: EMPTY_CHAR,
          },
        ],
      },
      httpRequestBody: {
        content: EMPTY_ARRAY,
        required: false,
        description: EMPTY_CHAR,
      },
      httpResponses: EMPTY_ARRAY,
      name: `${Capitalize(payload)}_${countNode}`,
      type: payload,
      brokerType: undefined,
    };

    return { ...eventGraph, nodes: [...eventGraph.nodes, newService] }; //  Возвращаем обновленный граф
  })
  .on(addEvent, (eventGraph, payload) => {
    const newEvent: EventDTO = {
      id: uuidv4(),
      name: payload.name,
      schema: payload.schema || '{"type": "object"}',
      eventDescription: payload.eventDescription,
      tags: payload.tags,
    };

    return { ...eventGraph, events: [...(eventGraph.events || []), newEvent] };
  })
  .on(removeNode, (eventGraph, payload) => ({
    ...eventGraph,
    nodes: eventGraph.nodes.filter(node => node.id !== payload),
  }))
  .on(editNode, (eventGraph, { id, updates }) => {
    const updatedNodes = eventGraph.nodes.map(node => (node.id === id ? { ...node, ...updates } : node));

    return { ...eventGraph, nodes: updatedNodes };
  })
  .on(editEvent, (eventGraph, { id, updates }) => {
    const updatedEvents = eventGraph.events.map(event => (event.id === id ? { ...event, ...updates } : event));

    return { ...eventGraph, events: updatedEvents };
  })
  .on(removeEvent, (eventGraph, payload) => {
    const filteredEvents = eventGraph.events.filter(event => event.id !== payload);
    const filteredLinks = eventGraph.links.filter(link => link.eventId !== payload);

    return { ...eventGraph, events: filteredEvents, links: filteredLinks };
  })
  .on(removeAllEvents, eventGraph => ({ ...eventGraph, events: [], links: eventGraph.links }))
  .on(addLink, (eventGraph, payload) => {
    const updatedLinks = [...(eventGraph.links || []), payload];

    return {
      ...eventGraph,
      links: updatedLinks,
    };
  })
  .on(addLinks, (eventGraph, payload) => {
    const updatedLinks = [...(eventGraph.links || []), ...payload];

    return {
      ...eventGraph,
      links: updatedLinks,
    };
  })
  .on(addLinksError, () => {})
  .on(editLink, (eventGraph, { id, updates }) => {
    const updatedLinks = eventGraph.links.map(
      link => (link.id === id ? { ...link, ...updates } : link) //  Сравниваем по ID
    );

    return {
      ...eventGraph,
      links: updatedLinks,
    };
  })
  .on(removeLinks, (eventGraph, payload) => ({
    ...eventGraph,
    links: eventGraph.links.filter(link => link.id && !payload.includes(link.id)),
  }))
  .on(removeLink, (eventGraph, payload) => ({
    ...eventGraph,
    links: eventGraph.links.filter(link => link.id && !payload.includes(link.id)),
  }))
  .on(addTag, (eventGraph, payload) => {
    //  Если tags не существует, инициализируем пустым массивом
    const currentTags = eventGraph.tags || [];

    //  Если тег уже есть, возвращаем исходный объект без изменений
    if (currentTags.includes(payload)) {
      return eventGraph;
    }

    //  Добавляем новый тег
    return {
      ...eventGraph,
      tags: [...currentTags, payload],
    };
  })
  .on(addTagToEvent, (eventGraph, payload) => {
    const { id, newTag } = payload; //  Извлекаем id события и новый тег
    return {
      ...eventGraph,
      events: eventGraph.events.map(event => {
        if (event.id === id) {
          //  Если id совпадает, добавляем новый тег к событию
          return {
            ...event,
            tags: [...(event.tags || []), String(newTag)], //  Убедимся, что newTag - строка
          };
        }
        return event; //  Возвращаем событие без изменений
      }),
    };
  })
  .on(removeNodeWithConnectedLinks, (eventGraph, payload) => ({
    ...eventGraph,
    nodes: eventGraph.nodes.filter(node => node.id !== payload),
    links: eventGraph.links.filter(link => link.fromId !== payload && link.toId !== payload),
  }))
  .on(removeNodes, (eventGraph, payload) => ({
    ...eventGraph,
    nodes: eventGraph.nodes.filter(node => node.id && !payload.includes(node.id)),
  }))
  .reset(clearEventGraph);

// Событие изменения графа с дебаунсом
export const eventGraphChanged = debounce($eventGraph.updates, 1500);

// Асинхронный эффект для получения данных графа
export const fetchEventGraphDataFx = createEffect(async ({ fileList }: { fileList: NFileInput.TUploadFile[] }) => {
  try {
    const files = fileList?.map(el => el.originFileObj) || [];

    const request = {
      files,
      eventGraph: $eventGraph.getState(),
    } as EventGraphApiAddServiceToGraphPostRequest;

    return await EventGraphService.addServiceToGraph(request);
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : 'Failed to fetch event graph data');
  }
});

// Асинхронный эффект для сохранения данных графа
export const saveEventGraphDataFx = createEffect(async (eventGraph: EventGraphDTO) => {
  try {
    const response = await EventGraphService.saveEventGraph({ eventGraphDTO: eventGraph });

    return response;
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : 'Failed to save event graph data');
  }
});

//  Обработка данных из эффекта
sample({
  clock: fetchEventGraphDataFx.doneData,
  fn: dto =>
    ({
      ...dto,
      nodes: dto.nodes ?? [],
      links: dto.links ?? [],
      events: dto.events ?? [],
      tags: dto.tags ?? [],
    }) as EventGraphDTO,
  target: $eventGraph,
});

sample({
  clock: eventGraphChanged,
  source: $eventGraph,
  target: saveEventGraphDataFx,
});

export { $eventGraph, clearEventGraph };
