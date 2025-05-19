import {GROUP_NODE_PADDING, NODE_HEIGHT, NODE_WIDTH} from '@/constants/diagram';
import {ENodeTypes} from '@/enums/common';
import {
  expandableItemMockConsume2Events1Topic,
  expandedItemMockConsume2Events1Topic,
} from '@/helpers/adapters/__tests__/data';
import * as utils from '@/helpers/utils';
import {Consume2Events1Topic} from '@/shared/data-mock';
import {TNode} from '@/types/common';

import {applyLayout} from '../apply-layout';

const mockEventGraph = Consume2Events1Topic;
const mockNodeWidth = NODE_WIDTH;
const mockNodeHeight = NODE_HEIGHT;
const mockGroupNodePadding = GROUP_NODE_PADDING;

// Мокируем вспомогательные функции
jest.mock('@/helpers/node-helpers', () => {
  const originalModule = jest.requireActual('@/helpers/node-helpers');
  return {
    ...originalModule,
    getExpandedEventNodeId: jest.fn((eventId, nodeId) => [eventId, nodeId].sort().join('+')),
    generateBaseGroupNodeId: jest.fn(nodeId => `${nodeId}-group`),
    calculateGroupDimensions: jest.fn(childNodesCount => ({
      width: mockNodeWidth + mockGroupNodePadding,
      height: childNodesCount * (mockNodeHeight + mockGroupNodePadding),
    })),
  };
});

// Мокируем elkjs как модуль
jest.mock('elkjs/lib/elk.bundled.js', () => {
  const {calculateGroupDimensions, generateBaseGroupNodeId, getExpandedEventNodeId} =
    jest.requireMock('@/helpers/node-helpers');

  return class {
    layout = jest.fn().mockResolvedValue({
      children: [
        {
          id: mockEventGraph.nodes[0].id,
          x: 100,
          y: 100,
          width: mockNodeWidth,
          height: mockNodeHeight,
        },
        {
          id: mockEventGraph.nodes[1].id,
          x: 300,
          y: 200,
          width: mockNodeWidth,
          height: mockNodeHeight,
        },
        {
          id: getExpandedEventNodeId(mockEventGraph.events[0].id, mockEventGraph.nodes[1].id),
          x: 500,
          y: 300,
          width: mockNodeWidth,
          height: mockNodeHeight,
        },
        {
          id: getExpandedEventNodeId(mockEventGraph.events[1].id, mockEventGraph.nodes[1].id),
          x: 7,
          y: 4,
          width: mockNodeWidth,
          height: mockNodeHeight,
        },
        {
          id: generateBaseGroupNodeId(mockEventGraph.nodes[1].id),
          x: 9,
          y: 5,
          ...calculateGroupDimensions(3),
        },
      ],
      edges: [],
    });
  };
});

describe('/src/helpers/adapters/applyLayout.tsx', () => {
  beforeEach(() => {
    // Очищаем предыдущие моки window.elk
    delete window.elk;
  });

  test('should handle empty inputs', async () => {
    const result = await applyLayout({nodes: [], links: [], events: []});

    expect(result.nodes).toHaveLength(0);
    expect(result.edges).toHaveLength(0);
  });

  test('should return correct nodes with calculated position', async () => {
    // Проверям на графе с раскрывающимися элементами, но в закрытом состоянии
    const result = await applyLayout(Consume2Events1Topic, [], [expandableItemMockConsume2Events1Topic]);

    expect(result.nodes).toHaveLength(2);
    expect(result.edges).toHaveLength(1);

    expect(result.nodes[0].position).toEqual({x: 100, y: 100});
    expect(result.nodes[1].position).toEqual({x: 300, y: 200});
  });

  test('should return correct nodes with calculated position when expandable item is open', async () => {
    const existingExpandableTopic = {
      id: 'b2c3d4e5-f678-9012-3456-7890abcdef01',
      data: {
        name: 'topic1',
        nodeType: 'TOPIC',
        brokerType: 'KAFKA',
      },
      type: 'custom',
      position: {x: 300, y: 200},
    } as TNode;

    // Проверям на графе с раскрывающимися элементами, но в открытом состоянии
    const resultExpanded = await applyLayout(
      Consume2Events1Topic,
      [existingExpandableTopic],
      [expandedItemMockConsume2Events1Topic]
    );

    expect(resultExpanded.nodes).toHaveLength(5);
    expect(resultExpanded.edges).toHaveLength(3);

    const customNodes = resultExpanded.nodes.filter(el => el.type === ENodeTypes.CUSTOM);
    const groupNode = resultExpanded.nodes.find(el => el.type === ENodeTypes.GROUP);
    const expandedEvents = resultExpanded.nodes.filter(el => el.type === ENodeTypes.EXPANDED_EVENT);

    expect(customNodes[0].position).toEqual({x: 100, y: 100});
    expect(groupNode.position).toEqual({
      x: existingExpandableTopic.position.x - GROUP_NODE_PADDING,
      y: existingExpandableTopic.position.y - GROUP_NODE_PADDING,
    });
    expect(customNodes[1].position).toEqual({x: 10, y: 10});
    expect(expandedEvents[0].position).toEqual({x: 10, y: 78});
    expect(expandedEvents[1].position).toEqual({x: 10, y: 146});
  });

  test('should save existing nodes position', async () => {
    const existingNodes: TNode[] = [
      {
        id: Consume2Events1Topic.nodes[0].id,
        position: {x: 50, y: 50},
        data: {name: 'existing node', nodeType: 'SERVICE'},
      },
    ];

    const result = await applyLayout(Consume2Events1Topic, existingNodes, [expandableItemMockConsume2Events1Topic]);

    expect(result.nodes[0].position).toEqual({x: 50, y: 50});
  });

  test('should use window.elk in desktop mode', async () => {
    jest.spyOn(utils, 'checkIsDesktopMode').mockReturnValue(true);

    const mockElkLayout = jest.fn().mockResolvedValue({
      children: [
        {
          id: Consume2Events1Topic.nodes[0].id,
          x: 100,
          y: 100,
          width: NODE_WIDTH,
          height: NODE_HEIGHT,
        },
        {
          id: Consume2Events1Topic.nodes[1].id,
          x: 300,
          y: 200,
          width: NODE_WIDTH,
          height: NODE_HEIGHT,
        },
      ],
      edges: [],
    });

    window.elk = {
      layout: mockElkLayout,
    };

    const result = await applyLayout(Consume2Events1Topic, [], [expandableItemMockConsume2Events1Topic]);

    expect(mockElkLayout).toHaveBeenCalled();
    expect(result.nodes[0].position).toEqual({x: 100, y: 100});
    expect(result.nodes[1].position).toEqual({x: 300, y: 200});
  });
});
