import {EventGraphDTO} from '@/shared/api/event-graph-api';

export const Consume2Events1Topic: EventGraphDTO = {
  name: 'consume_one_event_service',
  tags: ['event1', 'event2'],
  nodes: [
    {
      id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
      belongsToGraph: ['a1b2c3d4-e5f6-7890-1234-567890abcdef'],
      name: 'consume_one_event_service',
      type: 'SERVICE',
      brokerType: null,
      tags: ['event1', 'event2'],
    },
    {
      id: 'b2c3d4e5-f678-9012-3456-7890abcdef01',
      belongsToGraph: ['a1b2c3d4-e5f6-7890-1234-567890abcdef'],
      name: 'topic1',
      type: 'TOPIC',
      brokerType: 'KAFKA',
      tags: ['event1', 'event2'],
    },
  ],
  links: [
    {
      id: 'dd0d6793-427e-46da-8b48-a769dd07ab2d', // добавлен вручную
      toId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
      fromId: 'b2c3d4e5-f678-9012-3456-7890abcdef01',
      eventId: 'c3d4e5f6-7890-1234-5678-90abcdef0123',
      group: 'group1',
      tags: ['event1'],
    },
    {
      id: 'adb82191-cca5-4a59-9c10-ea99cc4f0100', // добавлен вручную
      toId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
      fromId: 'b2c3d4e5-f678-9012-3456-7890abcdef01',
      eventId: 'b61208c8-09d4-4e4d-89c0-b1da4e8b7d17',
      group: 'group1',
      tags: ['event2'],
    },
  ],
  events: [
    {
      id: 'c3d4e5f6-7890-1234-5678-90abcdef0123',
      name: 'Event1',
      schema:
        '{\n        "type": "object",\n        "x-incoming": {\n          "topics": [\n            "topic1"\n          ]\n        }\n      }',
      tags: ['event1'],
    },
    {
      id: 'b61208c8-09d4-4e4d-89c0-b1da4e8b7d17',
      name: 'Event2',
      schema:
        ' {\n        "type": "object",\n        "x-incoming": {\n          "topics": [\n            "topic1"\n          ]\n        }\n      }',
      tags: ['event2'],
    },
  ],
  errors: [],
};
