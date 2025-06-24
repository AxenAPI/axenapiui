import {EventGraphDTO} from '@/shared/api/event-graph-api';

export const EventGraph2: EventGraphDTO = {
  name: 'consume_three_events_from_different_brokers_service',
  tags: [],
  nodes: [
    {
      id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
      belongsToGraph: ['a1b2c3d4-e5f6-7890-1234-567890abcdef'],
      name: 'consume_three_events_from_different_brokers_service',
      type: 'SERVICE',
      brokerType: null,
    },
    {
      id: 'b2c3d4e5-f678-9012-3456-7890abcdef01',
      belongsToGraph: ['a1b2c3d4-e5f6-7890-1234-567890abcdef'],
      name: 'topicKafka',
      type: 'TOPIC',
      brokerType: 'KAFKA',
    },
    {
      id: 'c3d4e5f6-7890-1234-5678-90abcdef0123',
      belongsToGraph: ['a1b2c3d4-e5f6-7890-1234-567890abcdef'],
      name: 'topicRabbitMQ',
      type: 'TOPIC',
      brokerType: 'RABBITMQ',
    },
    {
      id: 'd4e5f678-9012-3456-7890-abcdef012345',
      belongsToGraph: ['a1b2c3d4-e5f6-7890-1234-567890abcdef'],
      name: 'topicJMS',
      type: 'TOPIC',
      brokerType: 'JMS',
    },
  ],
  links: [
    {
      toId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
      fromId: 'b2c3d4e5-f678-9012-3456-7890abcdef01',
      eventId: 'e5f67890-1234-5678-90ab-cdef01234567',
      group: 'group1',
    },
    {
      toId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
      fromId: 'c3d4e5f6-7890-1234-5678-90abcdef0123',
      eventId: 'f6789012-3456-7890-abcd-ef0123456789',
    },
    {
      toId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
      fromId: 'd4e5f678-9012-3456-7890-abcdef012345',
      eventId: '78901234-5678-90ab-cdef-0123456789ab',
    },
  ],
  events: [
    {
      id: 'e5f67890-1234-5678-90ab-cdef01234567',
      name: 'EventKafka',
      schema:
        '{\n        "type": "object",\n        "x-incoming": {\n          "topics": [\n            "topicKafka"\n          ]\n        }\n      }',
    },
    {
      id: 'f6789012-3456-7890-abcd-ef0123456789',
      name: 'EventRabbitMQ',
      schema:
        '{\n        "type": "object",\n        "x-incoming": {\n          "topics": [\n            "topicRabbitMQ"\n            ]\n        }\n      }',
    },
    {
      id: '78901234-5678-90ab-cdef-0123456789ab',
      name: 'EventJMS',
      schema:
        '{\n        "type": "object",\n        "x-incoming": {\n          "topics": [\n            "topicJMS"\n            ]\n        }\n      }',
    },
  ],
  errors: [],
};
