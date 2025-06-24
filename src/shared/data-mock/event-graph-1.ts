import {EventGraphDTO} from '@/shared/api/event-graph-api';

export const EventGraph1: EventGraphDTO = {
  name: 'consume_one_event_service',
  tags: [],
  nodes: [
    {
      id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
      belongsToGraph: ['a1b2c3d4-e5f6-7890-1234-567890abcdef'],
      name: 'consume_one_event_service',
      type: 'SERVICE',
      brokerType: null,
    },
    {
      id: 'b2c3d4e5-f678-9012-3456-7890abcdef01',
      belongsToGraph: ['a1b2c3d4-e5f6-7890-1234-567890abcdef'],
      name: 'topic1',
      type: 'TOPIC',
      brokerType: 'KAFKA',
    },
  ],
  links: [
    {
      toId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
      fromId: 'b2c3d4e5-f678-9012-3456-7890abcdef01',
      eventId: 'c3d4e5f6-7890-1234-5678-90abcdef0123',
      group: 'group1',
    },
  ],
  events: [
    {
      id: 'c3d4e5f6-7890-1234-5678-90abcdef0123',
      name: 'Event1',
      schema:
        '{\n        "type": "object",\n        "x-incoming": {\n          "topics": [\n            "topic1"\n          ]\n        }\n      }',
    },
  ],
  errors: [],
};
