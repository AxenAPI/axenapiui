import {EMPTY_ARRAY} from '@/constants/common';
import {getExpandableLinkId} from '@/helpers/diagram-helpers/edge-helpers';
import {EventGraphDTO} from '@/shared/api/event-graph-api';
import type {TExpandableItem} from '@/types/common';

// TODO покрыть тестом
export function getExpandableItems(
  eventGraph: EventGraphDTO,
  existingItems: TExpandableItem[] = EMPTY_ARRAY // Уже созданные расщиряемые элементы
): TExpandableItem[] {
  // Извлекаем ID узлов типа 'TOPIC'
  const topicNodeIds = eventGraph.nodes?.filter(node => node.type === 'TOPIC').map(node => node.id);

  // Создаем карту связей, обрабатывая обратные связи как одинаковые
  const connectionsMap = eventGraph.links?.reduce((map, link) => {
    const key = getExpandableLinkId(link); // Создаем уникальный ключ

    if (map.has(key)) {
      const entry = map.get(key); // Получаем текущее значение
      entry.count += 1; // Обновляем счетчик
      entry.relatedItems = [...entry.relatedItems, {linkId: link.id, eventId: link.eventId}]; // Обновляем массив связей
      map.set(key, entry); // Обновляем запись в Map
    } else {
      map.set(key, {count: 1, relatedItems: [{linkId: link.id, eventId: link.eventId}]}); // Инициализируем новую запись
    }

    return map;
  }, new Map());

  // Фильтруем связи с count > 1 и извлекаем ID узлов-топиков
  return Array.from(connectionsMap.entries())
    .filter(([, value]) => value.count > 1) // Оставляем только связи с count > 1
    .flatMap(([key, {relatedItems}]) =>
      key
        .split('&') // Разделяем ключи на отдельные ID
        .filter((id: string) => topicNodeIds.includes(id)) // Оставляем только ID, которые являются узлами-топиками
        // Форматируем результат
        .map((topicId: string) => {
          // Находим существующий элемент по topicId и compoundLinkId
          const existingItem = existingItems.find(item => item.topicId === topicId && item.compoundLinkId === key);

          // Если элемент существует, берем его isExpanded, иначе устанавливаем false
          const isExpanded = existingItem ? existingItem.isExpanded : false;

          return {
            isExpanded,
            topicId,
            relatedItems,
            compoundLinkId: key,
          };
        })
    );
}
