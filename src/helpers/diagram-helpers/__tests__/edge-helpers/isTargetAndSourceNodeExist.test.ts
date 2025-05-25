import {isTargetAndSourceNodeExist} from '@/helpers/diagram-helpers/edge-helpers';
import {EventGraphDTO, LinkDTO, NodeDTO} from '@/shared/api/event-graph-api';

describe('/src/helpers/diagram-helpers/edge-helpers.tsx/isTargetAndSourceNodeExist', () => {
  const mockNodes: NodeDTO[] = [
    {id: 'node1', name: 'Node 1', type: 'SERVICE', belongsToGraph: null},
    {id: 'node2', name: 'Node 2', type: 'TOPIC', belongsToGraph: null},
    {id: 'node3', name: 'Node 3', type: 'TOPIC', belongsToGraph: null},
  ];

  const mockRawData: EventGraphDTO = {
    nodes: mockNodes,
    links: [],
  };

  test('should return true when both source and target nodes exist', () => {
    const link: LinkDTO = {fromId: 'node1', toId: 'node2', eventId: '1'};
    expect(isTargetAndSourceNodeExist(link, mockRawData)).toBe(true);
  });

  test('should return false when source node does not exist', () => {
    const link: LinkDTO = {fromId: 'non-existent', toId: 'node2', eventId: '1'};
    expect(isTargetAndSourceNodeExist(link, mockRawData)).toBe(false);
  });

  test('should return false when target node does not exist', () => {
    const link: LinkDTO = {fromId: 'node1', toId: 'non-existent', eventId: '1'};
    expect(isTargetAndSourceNodeExist(link, mockRawData)).toBe(false);
  });

  test('should return false when neither source nor target nodes exist', () => {
    const link: LinkDTO = {fromId: 'non-existent-1', toId: 'non-existent-2', eventId: '1'};
    expect(isTargetAndSourceNodeExist(link, mockRawData)).toBe(false);
  });

  test('should return false when nodes array is empty', () => {
    const link: LinkDTO = {fromId: 'node1', toId: 'node2', eventId: '1'};
    const emptyRawData: EventGraphDTO = {nodes: [], links: []};
    expect(isTargetAndSourceNodeExist(link, emptyRawData)).toBe(false);
  });

  test('should handle empty link IDs', () => {
    const link: LinkDTO = {fromId: '', toId: '', eventId: '1'};
    expect(isTargetAndSourceNodeExist(link, mockRawData)).toBe(false);
  });
});
