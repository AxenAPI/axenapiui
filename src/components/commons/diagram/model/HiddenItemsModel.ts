import {createEvent, createStore, sample} from 'effector';

import {$filterTags} from '@/components/commons/diagram/model/FilterTagsModel';
import {$eventGraph} from '@/models/EventGraphModel';
import {EventDTO, NodeDTO} from '@/shared/api/event-graph-api';

// Создание событий для управления видимостью элементов
export const showAll = createEvent(); // Сбрасываем хранилище (очищаем скрытые элементы)
export const showItem = createEvent<string>(); // Удаляет элемент из скрытых
export const hideItem = createEvent<string>(); // Добавляет элемент в скрытые
export const hideItems = createEvent<string[]>(); // Устанавливает новый массив скрытых элементов
export const hideNodes = createEvent<string[]>(); // Добавляет раздел нод в скрытые
export const showNodes = createEvent<string[]>(); // Убирает скрытый раздел нод

// Стор для отслеживания скрытых элементов. Является массивом id элементов
export const $hiddenItems = createStore<string[]>([])
  .on(hideItem, (hiddenItems, payload) => [...hiddenItems, payload])
  .on(showItem, (hiddenItems, payload) => hiddenItems.filter(item => item !== payload))
  .on(hideItems, (_, payload) => [...payload])
  .on(hideNodes, (hiddenItems, payload) => [...hiddenItems, ...payload])
  .on(showNodes, (hiddenItems, payload) => hiddenItems.filter(item => !payload.includes(item)))
  .reset(showAll);

// Вспомогательная функция для проверки совпадения тегов
const hasMatchingTag = (item: EventDTO | NodeDTO | null, tags: string[]): boolean => {
  if (!item?.tags) return false;

  // Проверяем, есть ли хотя бы один общий тег между элементом и переданными тегами
  return item.tags.some(tag => tags.includes(tag));
};

// Эффект для скрытия элементов по тегам
sample({
  clock: $filterTags, // Триггерится при изменении фильтра тегов
  source: $eventGraph,
  fn: (graph, tags) => {
    if (tags.length === 0) return [];

    const filterItems = (items: (NodeDTO | EventDTO | null)[]) =>
      items.filter(item => item && !hasMatchingTag(item, tags));

    // Фильтруем узлы и события, оставляя только те, у которых нет нужных тегов
    const nodesWithoutTag = filterItems(graph.nodes);
    const eventsWithoutTag = filterItems(graph.events);

    return [...nodesWithoutTag.map(node => node.id), ...eventsWithoutTag.map(event => event.id)];
  },
  target: hideItems,
});

// Эффект для показа всех элементов, когда нет выбранных тегов
sample({
  clock: $filterTags, // Триггерится при изменении фильтра тегов
  filter: tags => tags.length === 0,
  target: showAll,
});
