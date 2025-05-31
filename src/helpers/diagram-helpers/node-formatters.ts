import {EMPTY_ARRAY} from '@/constants/common';
import {GROUP_NODE_GAP, GROUP_NODE_PADDING, INITIAL_POSITION_INSIDE_GROUP, NODE_HEIGHT} from '@/constants/diagram';
import {ENodeTypes} from '@/enums/common';
import {generateBaseGroupNodeId, getExpandedEventNodeId} from '@/helpers/node-helpers';
import {EventDTO, NodeDTO} from '@/shared/api/event-graph-api';
import {TCustomNode, TGroupNode, TNode, TOptionalPosition} from '@/types/common';

// TODO покрыть тестами
/**
 * Форматирует простой узел
 */
export function formatSimpleNode(rawNode: NodeDTO): TOptionalPosition<TCustomNode> {
  return {
    id: rawNode.id,
    data: {
      name: rawNode.name,
      nodeType: rawNode.type,
      brokerType: rawNode.brokerType,
    },
    type: ENodeTypes.CUSTOM,
  };
}

/**
 * Форматирует массив простых узлов.
 */
export function formatSimpleNodes(rawData: NodeDTO[]): TOptionalPosition<TCustomNode>[] {
  if (!rawData || !rawData.length) return [];

  return rawData.map(node => formatSimpleNode(node));
}

/**
 * Форматирует базовый групповой узел.
 */
export function formatBaseGroupNode(rawNode: NodeDTO): TOptionalPosition<TGroupNode> {
  return {
    id: generateBaseGroupNodeId(rawNode.id),
    data: {
      relatedNodeId: rawNode.id,
    },
    type: ENodeTypes.GROUP,
    style: {
      backgroundColor: 'rgb(77, 102, 139, 0.1)',
      borderColor: '#4D668B',
    },
  };
}

/**
 * Форматирует массив расширяемых узлов.
 */
export function formatExpandableNodes(
  nodes: NodeDTO[],
  expandedEvents: Record<string, EventDTO[]>,
  existingNodes: TNode[]
): TOptionalPosition<TNode>[] {
  let result: TOptionalPosition<TNode>[] = EMPTY_ARRAY;

  nodes.forEach(node => {
    const relatedExpandedEvents = expandedEvents[node.id];

    if (!relatedExpandedEvents?.length) {
      result = [...result, formatSimpleNode(node)];
      return;
    }

    const relatedNode = existingNodes.find(n => n.id === node.id);
    // Существующий узел группы
    const existingGroup = existingNodes
      .filter(el => el.type === 'group')
      .find(group => group.id === generateBaseGroupNodeId(node.id));

    const parentNode = existingGroup || {
      ...formatBaseGroupNode(node),
      position: {
        // Отнимаем отступы 10px, чтобы нода была визуально на месте
        x: relatedNode?.position?.x != null ? relatedNode.position.x - GROUP_NODE_PADDING : 0,
        y: relatedNode?.position?.y != null ? relatedNode.position.y - GROUP_NODE_PADDING : 0,
      },
    };

    const expandedTopicNode = {
      ...formatSimpleNode(node),
      position: INITIAL_POSITION_INSIDE_GROUP,
      parentId: generateBaseGroupNodeId(node.id),
      draggable: false,
    };

    const expandedEventsNodes = relatedExpandedEvents.map((event, index) => {
      // Существующие узлы событий
      const existingExpandedEvent = existingNodes.find(
        eventNode => eventNode.id === getExpandedEventNodeId(event.id, node.id)
      );

      return (
        existingExpandedEvent || {
          id: getExpandedEventNodeId(event.id, node.id),
          data: {
            name: event.name,
            brokerType: node.brokerType,
          },
          type: ENodeTypes.EXPANDED_EVENT,
          parentId: generateBaseGroupNodeId(node.id),
          position: {
            x: INITIAL_POSITION_INSIDE_GROUP.x,
            y: INITIAL_POSITION_INSIDE_GROUP.y + NODE_HEIGHT + GROUP_NODE_GAP + index * (NODE_HEIGHT + GROUP_NODE_GAP),
          },
          draggable: false,
        }
      );
    });

    result = [...result, parentNode, expandedTopicNode, ...expandedEventsNodes];
  });

  return result;
}
