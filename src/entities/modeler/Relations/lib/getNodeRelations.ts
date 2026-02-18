import { logger } from '@shared/lib/logger';
import { EventDTO, LinkDTO } from '@shared/openapi';

import { GraphNodeEventManager, GraphNodeManager } from '../types/managersTypes';
import { GraphItems, LinkGroup, NodeRelations } from '../types/types';

import { NewGraphNodeEventManager } from './eventManager';

/**
 * Получить связи нода в графе
 * @param itemId - ID нода, для которого нужно получить связи
 * @param graphItems - Объект с данными графа (nodes, links, events)
 * @returns Объект с массивами входящих (consuming) и исходящих (producing) связей
 */
export const getNodeRelations = (itemId: string, graphItems: GraphItems): NodeRelations => {
  const result: NodeRelations = {
    consuming: [],
    producing: [],
  };

  // Проверка полноты данных графа
  if (!graphItems.links || !graphItems.nodes || !graphItems.events) {
    logger.error('Graph data incomplete: missing links, nodes, or events');
    return result;
  }

  // Группируем линки по продюсерам и консюмерам
  const groupedLinks = groupLinks(graphItems.links);
  const { consuming, producing } = groupedLinks(itemId);

  // Если нет ни входящих, ни исходящих связей - возвращаем пустой результат
  if (!consuming && !producing) {
    return result;
  }

  // Создаем менеджер для работы с событиями
  const events = NewGraphNodeEventManager(graphItems.events);
  // Обрабатываем входящие связи (consuming)
  for (const [nodeId, links] of consuming ?? []) {
    if (!links.length) {
      logger.warn(`Node with ID ${nodeId} has no consuming links.`);
    } else {
      result.consuming.push(toLinkGroup({ itemId: nodeId, links }, graphItems.nodes, events));
    }
  }

  // Обрабатываем исходящие связи (producing)
  for (const [nodeId, links] of producing ?? []) {
    if (!links.length) {
      logger.warn(`Node with ID ${nodeId} has no producing links.`);
    } else {
      result.producing.push(toLinkGroup({ itemId: nodeId, links }, graphItems.nodes, events));
    }
  }

  return result;
};

/**
 * Группировка линков по продюсерам и консюмерам
 * Создает двунаправленный индекс для быстрого поиска связей между нодами
 * @param links - Массив всех линков в графе
 * @returns Функция, которая по ID нода возвращает его входящие и исходящие связи
 */
const groupLinks = (links: LinkDTO[]) => {
  // Группы слушателей с линками, сгруппированными по производителям
  // Map<consumerId, Map<producerId, LinkDTO[]>>
  const consumers = new Map<string, Map<string, LinkDTO[]>>();

  // Группы производителей с линками, сгруппированными по слушателям
  // Map<producerId, Map<consumerId, LinkDTO[]>>
  const producers = new Map<string, Map<string, LinkDTO[]>>();

  // Обходим все линки и строим двунаправленный индекс
  for (const link of links) {
    // --- Обработка исходящих связей (producer -> consumer) ---

    // Находим группу продюсера (или создаем новую)
    const producersLinks = producers.get(link.fromId) || new Map<string, LinkDTO[]>();
    // Получаем группу линков к конкретному слушателю
    const consumerLinks: LinkDTO[] = producersLinks.get(link.toId) || [];
    // Добавляем новый линк в группу
    producersLinks.set(link.toId, (consumerLinks ?? []).concat(link));
    // Сохраняем обновленную группу продюсера
    producers.set(link.fromId, producersLinks);

    // --- Обработка входящих связей (consumer <- producer) ---

    // Находим группу слушателя (или создаем новую)
    const consumersLinks = consumers.get(link.toId) || new Map<string, LinkDTO[]>();
    // Получаем группу линков от конкретного продюсера
    const producerLinks: LinkDTO[] = consumersLinks.get(link.fromId) || [];
    // Добавляем новый линк в группу
    consumersLinks.set(link.fromId, (producerLinks ?? []).concat(link));
    // Сохраняем обновленную группу слушателя
    consumers.set(link.toId, consumersLinks);
  }

  // Возвращаем функцию для получения связей конкретного нода
  return (itemId: string) => ({
    consuming: consumers.get(itemId), // Входящие связи (кто производит для этого нода)
    producing: producers.get(itemId), // Исходящие связи (для кого этот нод производит)
  });
};

/**
 * Преобразовать группу линков в LinkGroup
 * Соединяет информацию о ноде с событиями, которые связывают его с другими нодами
 * @param group - Объект с ID нода и массивом линков
 * @param nodes - Менеджер для работы с нодами
 * @param events - Менеджер для работы с событиями
 * @returns LinkGroup с нодом и связанными событиями
 * @throws Error если нод не найден
 */
const toLinkGroup = (
  group: {
    itemId: string;
    links: LinkDTO[];
  },
  nodes: GraphNodeManager,
  events: GraphNodeEventManager
): LinkGroup => {
  // Получаем нод по ID
  const node = nodes.getNode(group.itemId);
  if (!node) {
    throw new Error(`Node with ID ${group.itemId} not found`);
  }

  let eventsGroup: EventDTO[] = [];

  // Собираем события для всех линков в группе
  for (const link of group.links) {
    const event = events.getEvent(link.eventId);
    if (!event) {
      logger.error(`Event with ID ${link.eventId} not found for link:`, link);
    } else {
      eventsGroup = eventsGroup.concat(event);
    }
  }

  return {
    node,
    events: eventsGroup,
  };
};
