import {Icon as UIKitIcon} from '@axenix/ui-kit';
import {IconServerCog} from '@tabler/icons-react';
import clsx from 'clsx';
import {ElkNode} from 'elkjs/lib/elk.bundled.js';

import {EMPTY_ARRAY} from '@/constants/common';
import {GROUP_NODE_GAP, NODE_HEIGHT, NODE_WIDTH} from '@/constants/diagram';
import {IconMap, NodeColorMap, NodeSelectedColorMap} from '@/helpers/nodes-value-map';
import {EventGraphDTO, NodeDTO, NodeDTOBrokerTypeEnum, NodeDTOTypeEnum} from '@/shared/api/event-graph-api';
import {TCustomNodeData} from '@/types/common';

// TODO покрыть тестами
/**
 * Возвращает иконку для узла в зависимости от его типа
 *
 * @param {NodeDTOBrokerTypeEnum | NodeDTOTypeEnum} type - Тип узла, для которого нужно получить иконку
 */
export const getNodeIcon = (type: NodeDTOBrokerTypeEnum | NodeDTOTypeEnum) => {
  const icon = IconMap[type] || <IconServerCog />;

  return <UIKitIcon icon={icon} size={16} />;
};

/**
 * Классы tailwind для базового узла (CustomNode) на основе переданных данных.
 */
export const getCustomNodeClassName = (
  id: string,
  data: TCustomNodeData,
  isNodeSelected: boolean,
  hiddenItems: string[]
) =>
  clsx(
    'flex transition-all w-[11.688rem] items-center gap-2 border-2',
    'border-solid px-4 py-3 align-middle hover:cursor-pointer',
    data.nodeType === 'HTTP' ? 'rounded-[63px]' : 'rounded-sm',
    NodeColorMap[data.nodeType] || 'border-colorful-blue-border bg-white',
    isNodeSelected ? NodeSelectedColorMap[data.nodeType] : 'bg-white',
    hiddenItems.includes(id) && 'opacity-30'
  );

/**
 * Классы tailwind для ввода названия в базовом узле (CustomNode).
 */
export const getInputClassName = (isReadOnly: boolean) =>
  clsx(
    'w-full max-w-[7.688rem] p-0',
    'overflow-hidden border-none text-ellipsis whitespace-nowrap outline-none',
    'focus:border-none focus:outline-none',
    isReadOnly && 'cursor-pointer'
  );

/**
 * Создает уникальный идентификатор для расширенного узла события.
 * Не можем использовать просто eventId, т.к. может быть несколько узлов с одинаковыми событиями
 * Пример: '1+2'
 */
export function getExpandedEventNodeId(eventId: string, nodeId: string): string {
  return [eventId, nodeId].sort().join('+');
}

/**
 * Генерирует уникальный ID для базового группового узла.
 * Пример: '1-group'
 */
export const generateBaseGroupNodeId = (id: NodeDTO['id']) => `${id}-group`;

/**
 * Возвращает размеры узла группы на основе количества элементов внутри него
 */
export function calculateGroupDimensions(childNodesCount: number): {width: number; height: number} {
  return {
    width: NODE_WIDTH + GROUP_NODE_GAP,
    height: childNodesCount * (NODE_HEIGHT + GROUP_NODE_GAP),
  };
}

/**
 * Рекурсивно ищет узел (node) с указанным идентификатором (nodeId) в созданном layout.
 * Поиск выполняется сначала среди дочерних элементов первого уровня, затем среди вложенных дочерних элементов.
 * */
export function findElkNode(layout: ElkNode, nodeId: string): ElkNode {
  const rootNode = layout.children?.find(n => n.id === nodeId);
  if (rootNode) return rootNode;

  const nestedNode = layout.children?.flatMap(parent => parent.children || EMPTY_ARRAY).find(n => n.id === nodeId);

  return nestedNode || null;
}

/**
 * Проверяет, является ли узел с указанным ID топиком в графе событий.
 */
export function isNodeTopic(eventGraph: EventGraphDTO, nodeId: NodeDTO['id']): boolean {
  return eventGraph.nodes.find(node => node.id === nodeId)?.type === NodeDTOTypeEnum.Topic;
}

/**
 * Берет, тип ноды из графа событий.
 */
export function getNodeType(eventGraph: EventGraphDTO, nodeId: string) {
  const {nodes} = eventGraph;

  if (nodes) {
    return nodes.find(node => node.id === nodeId)?.type;
  }

  return '';
}
