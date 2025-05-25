import {Edge} from '@xyflow/react';
import stc from 'string-to-color';

import {formatBaseLinks} from '@/helpers/diagram-helpers/edge-formatters';
import {getLinkType} from '@/helpers/diagram-helpers/edge-helpers';
import {EventGraphDTO} from '@/shared/api/event-graph-api';

jest.mock('@/helpers/diagram-helpers/edge-helpers', () => ({
  getLinkType: jest.fn().mockReturnValue('custom'),
}));

jest.mock('string-to-color', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(id => `color-${id}`),
}));

describe('/src/helpers/diagram-helpers/edge-formatters.tsx/formatBaseLinks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return empty array when links is undefined', () => {
    const input: EventGraphDTO = {nodes: []};
    const result = formatBaseLinks(input);
    expect(result).toEqual([]);
  });

  test('should return empty array when links is empty', () => {
    const input: EventGraphDTO = {nodes: [], links: []};
    const result = formatBaseLinks(input);
    expect(result).toEqual([]);
  });

  test('should transform links with all fields', () => {
    const input: EventGraphDTO = {
      nodes: [],
      links: [
        {
          id: 'link1',
          fromId: 'node1',
          toId: 'node2',
          eventId: 'event1',
        },
      ],
    };

    const expected: Edge[] = [
      {
        id: 'link1',
        source: 'node1',
        target: 'node2',
        type: 'custom',
        data: {
          color: 'color-event1',
          eventId: 'event1',
        },
      },
    ];

    const result = formatBaseLinks(input);
    expect(result).toEqual(expected);
  });

  test('should generate id when not provided', () => {
    const input: EventGraphDTO = {
      nodes: [],
      links: [
        {
          fromId: 'node1',
          toId: 'node2',
          eventId: 'event1',
        },
        {
          fromId: 'node3',
          toId: 'node4',
          eventId: 'event2',
        },
      ],
    };

    const result = formatBaseLinks(input);
    expect(result[0].id).toBe('node1->node2.0');
    expect(result[1].id).toBe('node3->node4.1');
  });

  test('should handle links without eventId', () => {
    const input: EventGraphDTO = {
      nodes: [],
      links: [
        {
          id: 'link1',
          fromId: 'node1',
          toId: 'node2',
          eventId: undefined,
        },
      ],
    };

    const expected: Edge[] = [
      {
        id: 'link1',
        source: 'node1',
        target: 'node2',
        type: 'custom',
        data: {
          color: 'color-',
          eventId: undefined,
        },
      },
    ];

    const result = formatBaseLinks(input);
    expect(result).toEqual(expected);
    expect(stc).toHaveBeenCalledWith('');
  });

  test('should handle multiple links', () => {
    const input: EventGraphDTO = {
      nodes: [],
      links: [
        {
          id: 'link1',
          fromId: 'node1',
          toId: 'node2',
          eventId: 'event1',
        },
        {
          id: 'link2',
          fromId: 'node2',
          toId: 'node3',
          eventId: 'event2',
        },
      ],
    };

    const expected: Edge[] = [
      {
        id: 'link1',
        source: 'node1',
        target: 'node2',
        type: 'custom',
        data: {
          color: 'color-event1',
          eventId: 'event1',
        },
      },
      {
        id: 'link2',
        source: 'node2',
        target: 'node3',
        type: 'custom',
        data: {
          color: 'color-event2',
          eventId: 'event2',
        },
      },
    ];

    const result = formatBaseLinks(input);
    expect(result).toEqual(expected);
  });

  test('should call getLinkType with correct parameters', () => {
    const link = {
      id: 'link1',
      fromId: 'node1',
      toId: 'node2',
      eventId: 'event1',
    };

    const input: EventGraphDTO = {
      nodes: [],
      links: [link],
    };

    formatBaseLinks(input);
    expect(getLinkType).toHaveBeenCalledWith(link, input);
  });

  test('should call stc with correct eventId', () => {
    const input: EventGraphDTO = {
      nodes: [],
      links: [
        {
          id: 'link1',
          fromId: 'node1',
          toId: 'node2',
          eventId: 'test-event',
        },
      ],
    };

    formatBaseLinks(input);
    expect(stc).toHaveBeenCalledWith('test-event');
  });
});
