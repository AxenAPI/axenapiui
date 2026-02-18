import { Edge } from '@xyflow/react';

import { Consume2Events1Topic, Consume2Events1TopicNoGroup, EventGraph1, EventGraph2 } from '@shared/data-mock';
import { EventGraphDTO, NodeDTOTypeEnum } from '@shared/openapi';

import { EEdgeTypes } from '@/enums/common';
import { adaptDiagramLinks } from '@/helpers/adapters';
import { getExpandableLinkId } from '@/helpers/diagram-helpers/edge-helpers';
import { getExpandableItems } from '@/helpers/diagram-helpers/event-graph-helpers';
import { getExpandedEventNodeId } from '@/helpers/node-helpers';

import {
  expandableItemMockConsume2Events1Topic,
  expandedItemMockConsume2Events1Topic,
  expectedConsume1,
  expectedConsume2,
  expectedEventGraphLinks1,
  expectedEventGraphLinks2,
} from './data';

const TEST_DATA: EventGraphDTO = {
  tags: [],
  nodes: [
    { id: 'a', type: NodeDTOTypeEnum.Service, belongsToGraph: [], name: 'Service' },
    { id: 'b', type: NodeDTOTypeEnum.Topic, belongsToGraph: [], name: 'Topic' },
  ],
  links: [
    { fromId: 'a', toId: 'b', id: '1', eventId: '1' },
    { fromId: 'b', toId: 'a', id: '2', eventId: '1' },
  ],
  events: [{ id: '1', schema: '', name: 'Event1' }],
};

describe('/src/helpers/adapters/adapt-diagram-links.tsx', () => {
  test.each([
    { name: 'EventGraph1', input: EventGraph1, expected: expectedEventGraphLinks1 },
    { name: 'EventGraph2', input: EventGraph2, expected: expectedEventGraphLinks2 },
    { name: 'ConsumeTwoEventsInOneTopic', input: Consume2Events1Topic, expected: expectedConsume1 },
    { name: 'ConsumeTwoEventsInOneTopicNoGroup', input: Consume2Events1TopicNoGroup, expected: expectedConsume2 },
  ])('should correctly transform links into Edge array', ({ expected, input }) => {
    const result: Edge[] = adaptDiagramLinks(input);
    expect(result).toEqual(expected);
  });

  test('should return an empty array if the links array is empty', () => {
    const graphWithEmptyLinks: EventGraphDTO = {
      name: 'empty-links-graph',
      nodes: [],
      events: [],
      tags: [],
      errors: [],
      links: [],
    };
    expect(adaptDiagramLinks(graphWithEmptyLinks)).toEqual([]);
  });

  test('should return an empty array if links are empty, even with expandableItems', () => {
    const graphWithEmptyLinks: EventGraphDTO = {
      name: 'empty-links-graph',
      nodes: [],
      events: [],
      tags: [],
      errors: [],
      links: [],
    };
    const expandableItems = getExpandableItems(TEST_DATA);

    expect(adaptDiagramLinks(graphWithEmptyLinks, expandableItems)).toEqual([]);
  });

  test('should collapse grouped links into single expandable edge', () => {
    const result = adaptDiagramLinks(Consume2Events1Topic, [expandableItemMockConsume2Events1Topic]);

    expect(result).toHaveLength(1);
    expect(result[0].type).toBe(EEdgeTypes.EXPANDABLE);
    expect(result[0].id).toBe(getExpandableLinkId(Consume2Events1Topic.links[0]));
  });

  test('should expand grouped links when isExpanded=true with correct link types', () => {
    const result = adaptDiagramLinks(Consume2Events1Topic, [expandedItemMockConsume2Events1Topic]);

    expect(result).toHaveLength(3); // 1 основной + 2 развернутых
    expect(result[0].type).toBe(EEdgeTypes.SIMPLE);
    expect(result[1].source).toContain(
      getExpandedEventNodeId(Consume2Events1Topic.links[0].eventId, Consume2Events1Topic.links[0].fromId)
    );
    expect(result[2].source).toContain(
      getExpandedEventNodeId(Consume2Events1Topic.links[1].eventId, Consume2Events1Topic.links[0].fromId)
    );

    expect(result.some(edge => edge.type === EEdgeTypes.CUSTOM)).toBeTruthy();
    expect(result.some(edge => edge.type === EEdgeTypes.SIMPLE)).toBeTruthy();
  });

  test('should handle empty expandableItems array', () => {
    const result = adaptDiagramLinks(Consume2Events1Topic, []);
    expect(result).toEqual(expectedConsume1); // Должен вести себя как без expandableItems
  });

  test('should merge bidirectional edges between same nodes into one', () => {
    const expandableItems = getExpandableItems(TEST_DATA);
    const result = adaptDiagramLinks(TEST_DATA, expandableItems);

    expect(result).toHaveLength(1);
  });

  test('should handle empty links array and not call forEach when expandableItems exist', () => {
    const expandableItems = getExpandableItems(TEST_DATA);
    const graphWithEmptyLinks: EventGraphDTO = {
      nodes: [],
      events: [],
      tags: [],
      links: [],
    };
    expect(adaptDiagramLinks(graphWithEmptyLinks, expandableItems)).toEqual([]);
  });
});
