import { EventGraphDTO, LinkDTO } from '@shared/openapi';

import { isEdgeExpandable } from '@/helpers/diagram-helpers/edge-helpers';

const createMinimalGraph = (links: LinkDTO[] = []): EventGraphDTO => ({
  name: 'test-graph',
  nodes: [],
  links,
  events: [],
  tags: [],
  errors: [],
});

describe('/src/helpers/diagram-helpers/edge-helpers.tsx/isEdgeExpandable', () => {
  const mockLink: LinkDTO = { id: 'link1', fromId: 'node1', toId: 'node2', eventId: '1' };

  test('should return false when no multiple links and no bidirectional link exists', () => {
    const rawData = createMinimalGraph([mockLink]);
    expect(isEdgeExpandable(mockLink, rawData)).toBe(false);
  });

  test('should return true when multiple links in same direction exist', () => {
    const rawData = createMinimalGraph([
      mockLink,
      { id: 'link2', fromId: 'node1', toId: 'node2', eventId: '1' }, // duplicate link
      { id: 'link3', fromId: 'node1', toId: 'node3', eventId: '2' }, // different link
    ]);
    expect(isEdgeExpandable(mockLink, rawData)).toBe(true);
  });

  test('should return true when bidirectional link exists', () => {
    const rawData = createMinimalGraph([
      mockLink,
      { id: 'link2', fromId: 'node2', toId: 'node1', eventId: '2' }, // reverse link
    ]);
    expect(isEdgeExpandable(mockLink, rawData)).toBe(true);
  });

  test('should return true when both multiple and bidirectional links exist', () => {
    const rawData = createMinimalGraph([
      mockLink,
      { id: 'link2', fromId: 'node1', toId: 'node2', eventId: '1' }, // duplicate
      { id: 'link3', fromId: 'node2', toId: 'node1', eventId: '2' }, // reverse
    ]);
    expect(isEdgeExpandable(mockLink, rawData)).toBe(true);
  });

  test('should return false for empty links array', () => {
    const rawData = createMinimalGraph([]);
    expect(isEdgeExpandable(mockLink, rawData)).toBe(false);
  });

  test('should handle empty link IDs correctly', () => {
    const emptyLink: LinkDTO = { id: 'empty', fromId: '', toId: '', eventId: '' };
    const rawData = createMinimalGraph([
      { id: 'l1', fromId: '', toId: '', eventId: '' },
      { id: 'l2', fromId: '', toId: '', eventId: '' }, // duplicate empty link
    ]);
    expect(isEdgeExpandable(emptyLink, rawData)).toBe(true);
  });

  test('should return false when only different links exist', () => {
    const rawData = createMinimalGraph([
      { id: 'link-a', fromId: 'node3', toId: 'node4', eventId: '1' },
      { id: 'link-b', fromId: 'node5', toId: 'node6', eventId: '2' },
    ]);
    expect(isEdgeExpandable(mockLink, rawData)).toBe(false);
  });
});
