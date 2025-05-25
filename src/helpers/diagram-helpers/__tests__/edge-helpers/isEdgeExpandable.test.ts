import {isEdgeExpandable} from '@/helpers/diagram-helpers/edge-helpers';
import {EventGraphDTO, LinkDTO} from '@/shared/api/event-graph-api';

describe('/src/helpers/diagram-helpers/edge-helpers.tsx/isEdgeExpandable', () => {
  const mockLink: LinkDTO = {fromId: 'node1', toId: 'node2', eventId: '1'};

  test('should return false when no multiple links and no bidirectional link exists', () => {
    const rawData: EventGraphDTO = {
      nodes: [],
      links: [mockLink],
    };
    expect(isEdgeExpandable(mockLink, rawData)).toBe(false);
  });

  test('should return true when multiple links in same direction exist', () => {
    const rawData: EventGraphDTO = {
      nodes: [],
      links: [
        mockLink,
        {fromId: 'node1', toId: 'node2', eventId: '1'}, // duplicate link
        {fromId: 'node1', toId: 'node3', eventId: '2'}, // different link
      ],
    };
    expect(isEdgeExpandable(mockLink, rawData)).toBe(true);
  });

  test('should return true when bidirectional link exists', () => {
    const rawData: EventGraphDTO = {
      nodes: [],
      links: [
        mockLink,
        {fromId: 'node2', toId: 'node1', eventId: '2'}, // reverse link
      ],
    };
    expect(isEdgeExpandable(mockLink, rawData)).toBe(true);
  });

  test('should return true when both multiple and bidirectional links exist', () => {
    const rawData: EventGraphDTO = {
      nodes: [],
      links: [
        mockLink,
        {fromId: 'node1', toId: 'node2', eventId: '1'}, // duplicate
        {fromId: 'node2', toId: 'node1', eventId: '2'}, // reverse
      ],
    };
    expect(isEdgeExpandable(mockLink, rawData)).toBe(true);
  });

  test('should return false for empty links array', () => {
    const rawData: EventGraphDTO = {
      nodes: [],
      links: [],
    };
    expect(isEdgeExpandable(mockLink, rawData)).toBe(false);
  });

  test('should handle empty link IDs correctly', () => {
    const emptyLink: LinkDTO = {fromId: '', toId: '', eventId: null};
    const rawData: EventGraphDTO = {
      nodes: [],
      links: [
        {fromId: '', toId: '', eventId: ''},
        {fromId: '', toId: '', eventId: ''}, // duplicate empty link
      ],
    };
    expect(isEdgeExpandable(emptyLink, rawData)).toBe(true);
  });

  test('should return false when only different links exist', () => {
    const rawData: EventGraphDTO = {
      nodes: [],
      links: [
        {fromId: 'node3', toId: 'node4', eventId: '1'},
        {fromId: 'node5', toId: 'node6', eventId: '2'},
      ],
    };
    expect(isEdgeExpandable(mockLink, rawData)).toBe(false);
  });
});
