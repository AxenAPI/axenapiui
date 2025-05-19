import {ENodeTypes} from '@/enums/common';
import {adaptDiagramNodes} from '@/helpers/adapters';
import {formatSimpleNodes} from '@/helpers/diagram-helpers/node-formatters';
import {getExpandedEventNodeId} from '@/helpers/node-helpers';
import {Consume2Events1Topic, EventGraph1, EventGraph2} from '@/shared/data-mock';
import {TNode, TOptionalPosition} from '@/types/common';

import {
  expandableItemMockConsume2Events1Topic,
  expandedItemMockConsume2Events1Topic,
  expectedConsume2Events1TopicNodes,
  expectedEventGraphNodes1,
  expectedEventGraphNodes2,
} from './data';

describe('/src/helpers/adapters/adapt-diagram-nodes.tsx', () => {
  test.each([
    {name: 'EventGraph1', input: EventGraph1, expected: expectedEventGraphNodes1},
    {name: 'EventGraph2', input: EventGraph2, expected: expectedEventGraphNodes2},
    {name: 'Consume2Events1Topic', input: Consume2Events1Topic, expected: expectedConsume2Events1TopicNodes},
  ])('should correctly transform nodes into TCustomNode array', ({expected, input}) => {
    const result: TOptionalPosition<TNode>[] = adaptDiagramNodes(input);
    expect(result).toEqual(expected);
  });

  test('should return an empty array if no nodes are provided', () => {
    expect(adaptDiagramNodes({nodes: []})).toEqual([]);
    expect(adaptDiagramNodes({nodes: null})).toEqual([]);
    expect(adaptDiagramNodes({nodes: undefined})).toEqual([]);
  });

  test('should handle expandable items correctly', () => {
    const result = adaptDiagramNodes(Consume2Events1Topic, [expandableItemMockConsume2Events1Topic]);
    expect(result.length).toBeGreaterThan(0);

    // Если нет раскрытых элементов, то все элементы форматируются как обычные
    expect(result).toEqual(formatSimpleNodes(Consume2Events1Topic.nodes));
  });

  test('should handle existing nodes parameter', () => {
    const existingNodes: TNode[] = [
      {
        id: '3606d96d-1397-4421-ae61-b4f92e172170',
        data: {
          name: 'Already existing node',
          nodeType: 'SERVICE',
          brokerType: null,
        },
        type: 'custom',
        position: {
          x: 12,
          y: 31.2,
        },
        style: {
          width: 187,
          height: 48,
        },
        measured: {
          width: 187,
          height: 48,
        },
      },
    ];

    const result = adaptDiagramNodes(Consume2Events1Topic, undefined, existingNodes);
    // К существующим узлам должны добавиться новые
    expect(result.length).toBeGreaterThan(existingNodes.length);
  });

  test('should add expanded nodes for event correctly', () => {
    const result = adaptDiagramNodes(Consume2Events1Topic, [expandedItemMockConsume2Events1Topic]);
    const eventNodes = result.filter(node => node.type === ENodeTypes.EXPANDED_EVENT);

    expect(eventNodes.length).toBe(2);
    expect(eventNodes[0].id).toBe(
      getExpandedEventNodeId(
        expandedItemMockConsume2Events1Topic.relatedItems[0].eventId,
        expandedItemMockConsume2Events1Topic.topicId
      )
    );
    expect(eventNodes[1].id).toBe(
      getExpandedEventNodeId(
        expandedItemMockConsume2Events1Topic.relatedItems[1].eventId,
        expandedItemMockConsume2Events1Topic.topicId
      )
    );
  });
});
