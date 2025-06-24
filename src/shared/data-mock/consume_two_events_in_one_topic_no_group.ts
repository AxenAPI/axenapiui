import {EventGraphDTO} from '@/shared/api/event-graph-api';

export const Consume2Events1TopicNoGroup: EventGraphDTO = {
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
      id: '11f1588f-8e1c-4c14-b4dc-37465dbd5213', // добавлен вручную
      toId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
      fromId: 'b2c3d4e5-f678-9012-3456-7890abcdef01',
      eventId: 'c3d4e5f6-7890-1234-5678-90abcdef0123',
      group: null,
      tags: ['event1'],
    },
    {
      id: 'b5728f14-369e-413b-86ec-c44c37e9c963', // добавлен вручную
      toId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
      fromId: 'b2c3d4e5-f678-9012-3456-7890abcdef01',
      eventId: 'b61208c8-09d4-4e4d-89c0-b1da4e8b7d17',
      group: null,
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
