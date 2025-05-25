import {EMPTY_ARRAY} from '@/constants/common';
import {formatExpandableNodes, formatSimpleNodes} from '@/helpers/diagram-helpers/node-formatters';
import {EventDTO, EventGraphDTO} from '@/shared/api/event-graph-api';
import {TExpandableItem, type TNode, TOptionalPosition} from '@/types/common';

/**
 * Адаптирует узлы графа для использования в диаграмме.
 */
export function adaptDiagramNodes(
  rawData: EventGraphDTO,
  expandableItems?: TExpandableItem[],
  existingNodes: TNode[] = EMPTY_ARRAY
): TOptionalPosition<TNode>[] {
  // Фильтруем расширяемые элементы, оставляя только те, которые "раскрыты" (isExpanded === true)
  const expandedItems = expandableItems?.filter(el => el.isExpanded);

  // Форматируем как обычные узлы если нет расширяемых элементов
  if (!expandableItems || !expandedItems.length) {
    return formatSimpleNodes(rawData.nodes);
  }

  // Маппинг id-топика и эвентов
  const eventsByTopicId: Record<string, EventDTO[]> = {};

  // Создаем маппинг id-топика и эвентов
  expandedItems.forEach(el => {
    const eventIds = el.relatedItems.map(item => item.eventId);
    eventsByTopicId[el.topicId] = eventIds
      .map(eventId => rawData.events.find(event => event.id === eventId))
      .filter(Boolean) as EventDTO[];
  });

  return formatExpandableNodes(rawData.nodes, eventsByTopicId, existingNodes);
}
