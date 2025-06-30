import {EventGraphDTO} from '@/shared/api/event-graph-api';

export const EventGraph7: EventGraphDTO = {
  name: 'service_no_common_consume_topics_common_events_common_outgoing_topics_1',
  tags: [],
  nodes: [
    {
      id: '12345678-90ab-cdef-1234-567890abcdef',
      belongsToGraph: ['12345678-90ab-cdef-1234-567890abcdef'],
      name: 'service_no_common_consume_topics_common_events_common_outgoing_topics_1',
      type: 'SERVICE',
      brokerType: null,
    },
    {
      id: 'b2c3d4e5-f678-9012-3456-7890abcdef03',
      belongsToGraph: ['12345678-90ab-cdef-1234-567890abcdef'],
      name: 'topicConsumeKafka_1',
      type: 'TOPIC',
      brokerType: 'KAFKA',
    },
    {
      id: 'b2c3d4e5-f678-9012-3456-7890abcdef05',
      belongsToGraph: ['12345678-90ab-cdef-1234-567890abcdef'],
      name: 'topicConsumeRabbitMQ_1',
      type: 'TOPIC',
      brokerType: 'RABBITMQ',
    },
    {
      id: 'b2c3d4e5-f678-9012-3456-7890abcdef07',
      belongsToGraph: ['12345678-90ab-cdef-1234-567890abcdef'],
      name: 'topicConsumeJMS_1',
      type: 'TOPIC',
      brokerType: 'JMS',
    },
    {
      id: 'b2c3d4e5-f678-9012-3456-7890abcdef09',
      belongsToGraph: ['12345678-90ab-cdef-1234-567890abcdef'],
      name: 'topicOutKafka',
      type: 'TOPIC',
      brokerType: 'KAFKA',
    },
    {
      id: 'b2c3d4e5-f678-9012-3456-7890abcdef10',
      belongsToGraph: ['12345678-90ab-cdef-1234-567890abcdef'],
      name: 'topicOutRabbitMQ',
      type: 'TOPIC',
      brokerType: 'RABBITMQ',
    },
    {
      id: 'b2c3d4e5-f678-9012-3456-7890abcdef11',
      belongsToGraph: ['12345678-90ab-cdef-1234-567890abcdef'],
      name: 'topicOutJMS',
      type: 'TOPIC',
      brokerType: 'JMS',
    },
  ],
  links: [
    {
      fromId: '12345678-90ab-cdef-1234-567890abcdef',
      toId: 'b2c3d4e5-f678-9012-3456-7890abcdef09',
      eventId: 'c3d4e5f6-7890-1234-5678-90abcdef012a',
    },
    {
      fromId: '12345678-90ab-cdef-1234-567890abcdef',
      toId: 'b2c3d4e5-f678-9012-3456-7890abcdef10',
      eventId: 'ee6e6872-671b-4a4e-ace8-6f12a01bcbec',
    },
    {
      fromId: '12345678-90ab-cdef-1234-567890abcdef',
      toId: 'b2c3d4e5-f678-9012-3456-7890abcdef11',
      eventId: 'a1b2c3d4-1234-5678-1234-567890abcde1',
    },
    {
      toId: '12345678-90ab-cdef-1234-567890abcdef',
      fromId: 'b2c3d4e5-f678-9012-3456-7890abcdef03',
      eventId: 'a1b2c3d4-1234-5678-1234-567890abcde2',
      group: 'group1',
    },
    {
      toId: '12345678-90ab-cdef-1234-567890abcdef',
      fromId: 'b2c3d4e5-f678-9012-3456-7890abcdef05',
      eventId: 'a1b2c3d4-1234-5678-1234-567890abcde3',
    },
    {
      toId: '12345678-90ab-cdef-1234-567890abcdef',
      fromId: 'b2c3d4e5-f678-9012-3456-7890abcdef07',
      eventId: 'a1b2c3d4-1234-5678-1234-567890abcde4',
    },
  ],
  events: [
    {
      id: 'c3d4e5f6-7890-1234-5678-90abcdef012a',
      name: 'EventOutgoingKafka',
      schema:
        '{\n        "type": "object",\n        "x-outgoing": {\n          "topics": [\n            "kafka/topicOutKafka"\n          ]\n        }\n      }',
    },
    {
      id: 'ee6e6872-671b-4a4e-ace8-6f12a01bcbec',
      name: 'EventOutgoingRabbitMQ',
      schema:
        '{\n        "type": "object",\n        "x-outgoing": {\n          "topics": [\n            "rabbitmq/topicOutRabbitMQ"\n          ]\n        }\n      }',
    },
    {
      id: 'a1b2c3d4-1234-5678-1234-567890abcde1',
      name: 'EventOutgoingJMS',
      schema:
        '{\n        "type": "object",\n        "x-outgoing": {\n          "topics": [\n            "jms/topicOutJMS"\n          ]\n        }\n      }',
    },
    {
      id: 'a1b2c3d4-1234-5678-1234-567890abcde2',
      name: 'EventConsumeKafka',
      schema:
        ' {\n        "type": "object",\n        "x-incoming": {\n          "topics": [\n            "topicConsumeKafka_1"\n          ]\n        }\n      }',
    },
    {
      id: 'a1b2c3d4-1234-5678-1234-567890abcde3',
      name: 'EventConsumeRabbitMQ',
      schema:
        '{\n        "type": "object",\n        "x-incoming": {\n          "topics": [\n            "topicConsumeRabbitMQ_1"\n          ]\n        }\n      }',
    },
    {
      id: 'a1b2c3d4-1234-5678-1234-567890abcde4',
      name: 'EventConsumeJMS',
      schema:
        '{\n        "type": "object",\n        "x-incoming": {\n          "topics": [\n            "topicConsumeJMS_1"\n          ]\n        }\n      }',
    },
  ],
  errors: [],
};
