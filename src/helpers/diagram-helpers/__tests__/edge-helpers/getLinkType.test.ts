import { EventGraphDTO, LinkDTO, NodeDTO } from '@shared/openapi';

import { EEdgeTypes } from '@/enums/common';
import { getLinkType } from '@/helpers/diagram-helpers/edge-helpers';

const createMinimalGraph = (nodes: NodeDTO[], links: LinkDTO[]): EventGraphDTO => ({
  name: 'test-graph',
  nodes,
  links,
  events: [],
  tags: [],
  errors: [],
});

describe('/src/helpers/diagram-helpers/edge-helpers.tsx/getLinkType', () => {
  const mockNodes: NodeDTO[] = [
    { id: 'node1', name: 'Node 1', type: 'SERVICE', belongsToGraph: [] },
    { id: 'node2', name: 'Node 2', type: 'TOPIC', belongsToGraph: [] },
    { id: 'node3', name: 'Node 3', type: 'TOPIC', belongsToGraph: [] },
  ];
  const mockLink: LinkDTO = { id: 'link1', fromId: 'node1', toId: 'node2', eventId: '1' };

  test('should return DISCONNECTED when nodes do not exist', () => {
    const rawData = createMinimalGraph([], [mockLink]);
    expect(getLinkType(mockLink, rawData)).toBe(EEdgeTypes.DISCONNECTED);
  });

  test('should return EXPANDABLE when multiple links exist and not expanded', () => {
    const rawData = createMinimalGraph(mockNodes, [
      mockLink,
      { id: 'link2', fromId: 'node1', toId: 'node2', eventId: '1' }, // duplicate
    ]);
    expect(getLinkType(mockLink, rawData)).toBe(EEdgeTypes.EXPANDABLE);
  });

  test('should return EXPANDABLE when bidirectional link exists and not expanded', () => {
    const rawData = createMinimalGraph(mockNodes, [
      mockLink,
      { id: 'link2', fromId: 'node2', toId: 'node1', eventId: '1' }, // reverse
    ]);
    expect(getLinkType(mockLink, rawData)).toBe(EEdgeTypes.EXPANDABLE);
  });

  test('should return CUSTOM when expanded despite being expandable', () => {
    const rawData = createMinimalGraph(mockNodes, [
      mockLink,
      { id: 'link2', fromId: 'node1', toId: 'node2', eventId: '1' }, // duplicate
    ]);
    expect(getLinkType(mockLink, rawData, true)).toBe(EEdgeTypes.CUSTOM);
  });

  test('should return CUSTOM for simple non-expandable link', () => {
    const rawData = createMinimalGraph(mockNodes, [mockLink]);
    expect(getLinkType(mockLink, rawData)).toBe(EEdgeTypes.CUSTOM);
  });
});
