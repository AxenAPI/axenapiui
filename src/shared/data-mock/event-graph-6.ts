import {EventGraphDTO} from '@/shared/api/event-graph-api';

export const EventGraph6: EventGraphDTO = {
  name: 'service_no_common_consume_topics_common_events_common_outgoing_topics_2&service_no_common_consume_topics_common_events_common_outgoing_topics_1',
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
      id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
      belongsToGraph: ['a1b2c3d4-e5f6-7890-1234-567890abcdef'],
      name: 'service_no_common_consume_topics_common_events_common_outgoing_topics_2',
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
      id: 'b2c3d4e5-f678-9012-3456-7890abcdef04',
      belongsToGraph: ['a1b2c3d4-e5f6-7890-1234-567890abcdef'],
      name: 'topicConsumeKafka_2',
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
      id: 'b2c3d4e5-f678-9012-3456-7890abcdef06',
      belongsToGraph: ['a1b2c3d4-e5f6-7890-1234-567890abcdef'],
      name: 'topicConsumeRabbitMQ_2',
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
      id: 'b2c3d4e5-f678-9012-3456-7890abcdef08',
      belongsToGraph: ['a1b2c3d4-e5f6-7890-1234-567890abcdef'],
      name: 'topicConsumeJMS_2',
      type: 'TOPIC',
      brokerType: 'JMS',
    },
    {
      id: 'b2c3d4e5-f678-9012-3456-7890abcdef09',
      belongsToGraph: ['12345678-90ab-cdef-1234-567890abcdef', 'a1b2c3d4-e5f6-7890-1234-567890abcdef'],
      name: 'topicOutKafka',
      type: 'TOPIC',
      brokerType: 'KAFKA',
    },
    {
      id: 'b2c3d4e5-f678-9012-3456-7890abcdef10',
      belongsToGraph: ['12345678-90ab-cdef-1234-567890abcdef', 'a1b2c3d4-e5f6-7890-1234-567890abcdef'],
      name: 'topicOutRabbitMQ',
      type: 'TOPIC',
      brokerType: 'RABBITMQ',
    },
    {
      id: 'b2c3d4e5-f678-9012-3456-7890abcdef11',
      belongsToGraph: ['12345678-90ab-cdef-1234-567890abcdef', 'a1b2c3d4-e5f6-7890-1234-567890abcdef'],
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
      eventId: 'bdc6803e-5395-45f2-aece-c359de3d3f0b',
    },
    {
      fromId: '12345678-90ab-cdef-1234-567890abcdef',
      toId: 'b2c3d4e5-f678-9012-3456-7890abcdef11',
      eventId: 'a1b2c3d4-1234-5678-1234-567890abcde1',
    },
    {
      fromId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
      toId: 'b2c3d4e5-f678-9012-3456-7890abcdef09',
      eventId: 'c3d4e5f6-7890-1234-5678-90abcdef012a',
    },
    {
      fromId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
      toId: 'b2c3d4e5-f678-9012-3456-7890abcdef10',
      eventId: 'bdc6803e-5395-45f2-aece-c359de3d3f0b',
    },
    {
      fromId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
      toId: 'b2c3d4e5-f678-9012-3456-7890abcdef11',
      eventId: 'a1b2c3d4-1234-5678-1234-567890abcde1',
    },
    {
      toId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
      fromId: 'b2c3d4e5-f678-9012-3456-7890abcdef04',
      eventId: 'a1b2c3d4-1234-5678-1234-567890abcde2',
      group: 'group1',
    },
    {
      toId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
      fromId: 'b2c3d4e5-f678-9012-3456-7890abcdef06',
      eventId: 'a1b2c3d4-1234-5678-1234-567890abcde3',
    },
    {
      toId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
      fromId: 'b2c3d4e5-f678-9012-3456-7890abcdef08',
      eventId: 'a1b2c3d4-1234-5678-1234-567890abcde4',
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
      schema: '{"type":"object","x-outgoing":{"topics":["kafka/topicOutKafka"]}}',
    },
    {
      id: 'bdc6803e-5395-45f2-aece-c359de3d3f0b',
      name: 'EventOutgoingRabbitMQ',
      schema: '{"type":"object","x-outgoing":{"topics":["rabbitmq/topicOutRabbitMQ"]}}',
    },
    {
      id: 'a1b2c3d4-1234-5678-1234-567890abcde1',
      name: 'EventOutgoingJMS',
      schema: '{"type":"object","x-outgoing":{"topics":["jms/topicOutJMS"]}}',
    },
    {
      id: 'a1b2c3d4-1234-5678-1234-567890abcde2',
      name: 'EventConsumeKafka',
      schema: '{"type":"object","x-incoming":{"topics":["kafka/topicConsumeKafka_2"]}}',
    },
    {
      id: 'a1b2c3d4-1234-5678-1234-567890abcde3',
      name: 'EventConsumeRabbitMQ',
      schema: '{"type":"object","x-incoming":{"topics":["rabbitmq/topicConsumeRabbitMQ_2"]}}',
    },
    {
      id: 'a1b2c3d4-1234-5678-1234-567890abcde4',
      name: 'EventConsumeJMS',
      schema: '{"type":"object","x-incoming":{"topics":["jms/topicConsumeJMS_2"]}}',
    },
  ],
  errors: [],
};
