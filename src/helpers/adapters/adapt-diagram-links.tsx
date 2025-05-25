import {Edge} from '@xyflow/react';
import stc from 'string-to-color';

import {EEdgeTypes} from '@/enums/common';
import {formatBaseLinks} from '@/helpers/diagram-helpers/edge-formatters';
import {generateDirectionString, getExpandableLinkId, getLinkType} from '@/helpers/diagram-helpers/edge-helpers';
import {getExpandedEventNodeId} from '@/helpers/node-helpers';
import {EventGraphDTO, LinkDTO} from '@/shared/api/event-graph-api';
import {TExpandableItem} from '@/types/common';

/**
 * Проверяет, была ли уже обработана пара (fromId, toId) или обратная (toId, fromId)
 */
export function isPairProcessed(seenPairs: Set<string>, key1: string, key2: string): boolean {
  return seenPairs.has(key1) && seenPairs.has(key2);
}

/**
 * Возвращает значение поля data для "обычных" связей
 */
function getLinkData(link: LinkDTO) {
  const eventId = link.eventId ?? '';

  return {
    eventId,
    color: stc(eventId),
  };
}

export function adaptDiagramLinks(rawData: EventGraphDTO, expandableItems?: TExpandableItem[]): Edge[] {
  if (!expandableItems || !expandableItems.length) return formatBaseLinks(rawData);

  const seenPairs = new Set<string>(); // Множество для отслеживания уникальных пар (fromId, toId)
  const edges: Edge[] = [];

  rawData.links?.forEach(el => {
    const currentExpandedItem = expandableItems?.find(item => getExpandableLinkId(el) === item.compoundLinkId);
    const isExpanded = currentExpandedItem?.isExpanded;
    const linkType = getLinkType(el, rawData, currentExpandedItem?.isExpanded);

    const key1 = generateDirectionString(el.fromId, el.toId); // Ключ для пары (fromId, toId)
    const key2 = generateDirectionString(el.toId, el.fromId); // Обратный ключ

    // Проверяем, была ли уже обработана эта пара или её обратная версия
    if (!isPairProcessed(seenPairs, key1, key2)) {
      // Помечаем оба ключа как обработанные
      seenPairs.add(key1);
      seenPairs.add(key2);

      if (linkType === EEdgeTypes.EXPANDABLE) {
        // Здесь id === currentExpandedItem.compoundLinkId
        edges.push({
          id: getExpandableLinkId(el),
          source: el.fromId,
          target: el.toId,
          type: linkType,
          data: {...currentExpandedItem},
        });
      } else {
        const data = !isExpanded ? getLinkData(el) : {...currentExpandedItem};

        edges.push({
          id: !isExpanded ? el.id : getExpandableLinkId(el),
          source: el.fromId,
          target: el.toId,
          type: isExpanded ? EEdgeTypes.SIMPLE : linkType,
          data: {...data},
        });
      }
    }

    if (isExpanded) {
      const relatedItem = currentExpandedItem.relatedItems.find(item => item.linkId === el.id);
      const getNodeId = (id: string) =>
        currentExpandedItem.topicId === id
          ? getExpandedEventNodeId(relatedItem.eventId, currentExpandedItem.topicId)
          : id;

      edges.push({
        id: el.id,
        source: getNodeId(el.fromId),
        target: getNodeId(el.toId),
        type: linkType,
        data: getLinkData(el),
      });
    }
  });

  return edges;
}
