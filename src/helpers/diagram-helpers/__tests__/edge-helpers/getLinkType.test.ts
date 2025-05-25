import {EEdgeTypes} from '@/enums/common';
import {getLinkType} from '@/helpers/diagram-helpers/edge-helpers';
import {EventGraphDTO, LinkDTO, NodeDTO} from '@/shared/api/event-graph-api';

describe('/src/helpers/diagram-helpers/edge-helpers.tsx/getLinkType', () => {
  const mockNodes: NodeDTO[] = [
    {id: 'node1', name: 'Node 1', type: 'SERVICE', belongsToGraph: null},
    {id: 'node2', name: 'Node 2', type: 'TOPIC', belongsToGraph: null},
    {id: 'node3', name: 'Node 3', type: 'TOPIC', belongsToGraph: null},
  ];
  const mockLink: LinkDTO = {fromId: 'node1', toId: 'node2', eventId: '1'};

  test('should return DISCONNECTED when nodes do not exist', () => {
    const rawData: EventGraphDTO = {
      nodes: [],
      links: [mockLink],
    };
    expect(getLinkType(mockLink, rawData)).toBe(EEdgeTypes.DISCONNECTED);
  });

  test('should return EXPANDABLE when multiple links exist and not expanded', () => {
    const rawData: EventGraphDTO = {
      nodes: mockNodes,
      links: [
        mockLink,
        {fromId: 'node1', toId: 'node2', eventId: '1'}, // duplicate
      ],
    };
    expect(getLinkType(mockLink, rawData)).toBe(EEdgeTypes.EXPANDABLE);
  });

  test('should return EXPANDABLE when bidirectional link exists and not expanded', () => {
    const rawData: EventGraphDTO = {
      nodes: mockNodes,
      links: [
        mockLink,
        {fromId: 'node2', toId: 'node1', eventId: '1'}, // reverse
      ],
    };
    expect(getLinkType(mockLink, rawData)).toBe(EEdgeTypes.EXPANDABLE);
  });

  test('should return CUSTOM when expanded despite being expandable', () => {
    const rawData: EventGraphDTO = {
      nodes: mockNodes,
      links: [
        mockLink,
        {fromId: 'node1', toId: 'node2', eventId: '1'}, // duplicate
      ],
    };
    expect(getLinkType(mockLink, rawData, true)).toBe(EEdgeTypes.CUSTOM);
  });

  test('should return CUSTOM for simple non-expandable link', () => {
    const rawData: EventGraphDTO = {
      nodes: mockNodes,
      links: [mockLink],
    };
    expect(getLinkType(mockLink, rawData)).toBe(EEdgeTypes.CUSTOM);
  });
});
