import {Edge, type Node, XYPosition} from '@xyflow/react';
import {type ElkNode} from 'elkjs/lib/elk.bundled.js';

import {EMPTY_ARRAY} from '@/constants/common';
import {elkLayoutOptions, GROUP_NODE_PADDING, NODE_HEIGHT, NODE_WIDTH} from '@/constants/diagram';
import {calculateGroupDimensions, findElkNode} from '@/helpers/node-helpers';
import {checkIsDesktopMode} from '@/helpers/utils';
import {EventGraphDTO} from '@/shared/api/event-graph-api';
import {TExpandableItem, TGroupNode, type TNode} from '@/types/common';

import {adaptDiagramLinks} from './adapt-diagram-links';
import {adaptDiagramNodes} from './adapt-diagram-nodes';

/**
 * Применение ELK для автоматического позиционирования с учетом типов узлов
 */
export async function applyLayout(
  eventGraph: EventGraphDTO,
  existingNodes: TNode[] = EMPTY_ARRAY,
  expandableItems: TExpandableItem[] = EMPTY_ARRAY,
  ghostNodes: Node[] = EMPTY_ARRAY
): Promise<{
  nodes: TNode[];
  edges: Edge[];
}> {
  const nodes = [...adaptDiagramNodes(eventGraph, expandableItems, existingNodes), ...ghostNodes];
  const edges = adaptDiagramLinks(eventGraph, expandableItems);

  // Создаем мапу дочерних элементов для каждого родительского элемента
  const parentChildrenMap = nodes.reduce<Record<string, {children: string[]; childCount: number}>>((acc, node) => {
    if (node.parentId) {
      if (!acc[node.parentId]) {
        acc[node.parentId] = {children: [], childCount: 0};
      }

      acc[node.parentId].children.push(node.id);
      acc[node.parentId].childCount++;
    }
    return acc;
  }, {});

  const elkGraph: ElkNode = {
    id: 'root',
    layoutOptions: elkLayoutOptions,
    children: nodes.map(node => {
      const isParent = parentChildrenMap[node.id]?.children?.length > 0;

      const dimensions = isParent
        ? calculateGroupDimensions(parentChildrenMap[node.id]?.childCount || 0)
        : {
            width: NODE_WIDTH,
            height: NODE_HEIGHT,
          };

      const elkNode: ElkNode = {
        id: node.id,
        width: dimensions.width,
        height: dimensions.height,
        layoutOptions: {
          // Распределяем сервисы слева, а все остальные узлы справа
          'partitioning.partition': 'nodeType' in node.data && node.data.nodeType === 'SERVICE' ? '0' : '1',
        },
      };

      return elkNode;
    }),
    edges: edges.map(edge => ({
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target],
    })),
  };

  let layout: ElkNode = null;

  // для десктопа elk инитим в preload.ts, для веба здесь.
  if (checkIsDesktopMode()) {
    try {
      layout = await window.elk.layout(elkGraph);
    } catch {
      throw new Error('ELK is not properly initialized');
    }
  } else {
    const ELK = (await import('elkjs/lib/elk.bundled.js')).default;
    const elk = new ELK();

    layout = await elk.layout(elkGraph);
  }

  const existingGroups = existingNodes.filter(el => el.type === 'group') as TGroupNode[];
  const formattedNodes = nodes.map(node => {
    const elkNode = findElkNode(layout, node.id);
    const currentNode = existingNodes.find(n => n.id === node.id);

    let position: XYPosition = {
      x: elkNode?.x ?? 0,
      y: elkNode?.y ?? 0,
    };

    // Сохраняем позиции для уже созданных узлов
    if (currentNode && !currentNode.parentId) {
      position = currentNode.position;
    }

    // Для раскрывающихся элементов подсчитываем положение заранее
    if ((node.parentId || node.type === 'group') && 'position' in node) {
      position = node.position;
    }

    const isExpandedTopic = expandableItems.find(item => item.topicId === node.id)?.isExpanded;
    // Необходимо, чтобы оставить группу на месте топика
    if (existingGroups.length > 0 && !isExpandedTopic) {
      const relatedToNodeGroup = existingGroups.find(group => group.data.relatedNodeId === node.id);

      if (relatedToNodeGroup) {
        // Прибавляем отступы 10px, чтобы нода была визуально на месте
        position = {
          x: relatedToNodeGroup.position.x + GROUP_NODE_PADDING,
          y: relatedToNodeGroup.position.y + GROUP_NODE_PADDING,
        };
      }
    }

    return {
      ...node,
      position,
      style: {
        ...node.style,
        width: elkNode.width,
        height: elkNode.height,
      },
    };
  }) as TNode[];

  return {
    nodes: formattedNodes,
    edges,
  };
}
