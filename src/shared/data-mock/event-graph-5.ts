import {EventGraphDTO} from '@/shared/api/event-graph-api';

export const EventGraph5: EventGraphDTO = {
  name: 'no_consumes_outgoing_with_broker_type_service_same_name',
  tags: [],
  nodes: [
    {
      id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
      belongsToGraph: ['a1b2c3d4-e5f6-7890-1234-567890abcdef'],
      name: 'no_consumes_outgoing_with_broker_type_service_same_name',
      type: 'SERVICE',
      brokerType: null,
    },
    {
      id: 'b2c3d4e5-f678-9012-3456-7890abcdef01',
      belongsToGraph: ['a1b2c3d4-e5f6-7890-1234-567890abcdef'],
      name: 'topic',
      type: 'TOPIC',
      brokerType: 'KAFKA',
    },
    {
      id: '567890ab-cdef-1234-5678-90abcde12345',
      belongsToGraph: ['a1b2c3d4-e5f6-7890-1234-567890abcdef'],
      name: 'topic',
      type: 'TOPIC',
      brokerType: 'RABBITMQ',
    },
    {
      id: '17c01075-92f4-4c03-b2e2-6e6e50240bc9',
      belongsToGraph: ['a1b2c3d4-e5f6-7890-1234-567890abcdef'],
      name: 'topic',
      type: 'TOPIC',
      brokerType: 'JMS',
    },
  ],
  links: [
    {
      fromId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
      toId: 'b2c3d4e5-f678-9012-3456-7890abcdef01',
      eventId: 'c3d4e5f6-7890-1234-5678-90abcdef0123',
    },
    {
      fromId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
      toId: '567890ab-cdef-1234-5678-90abcde12345',
      eventId: '12345678-90ab-cdef-1234-567890abcdef',
    },
    {
      fromId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
      toId: '17c01075-92f4-4c03-b2e2-6e6e50240bc9',
      eventId: 'a1b2c3d4-1234-5678-1234-567890abcdef',
    },
  ],
  events: [
    {
      id: 'c3d4e5f6-7890-1234-5678-90abcdef0123',
      name: 'EventOutgoingKafka',
      schema:
        '{\n        "type": "object",\n        "x-outgoing": {\n          "topics": [\n            "kafka/topic"\n          ]\n        }\n      }',
    },
    {
      id: '12345678-90ab-cdef-1234-567890abcdef',
      name: 'EventOutgoingRabbitMQ',
      schema:
        '{\n        "type": "object",\n        "x-outgoing": {\n          "topics": [\n            "rabbitmq/topic"\n          ]\n        }\n      }',
    },
    {
      id: 'a1b2c3d4-1234-5678-1234-567890abcdef',
      name: 'EventOutgoingJMS',
      schema:
        '{\n        "type": "object",\n        "x-outgoing": {\n          "topics": [\n            "jms/topic"\n          ]\n        }\n      }',
    },
  ],
  errors: [],
};
