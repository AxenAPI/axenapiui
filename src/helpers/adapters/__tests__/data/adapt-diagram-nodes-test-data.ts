import {TCustomNode, TNode, TOptionalPosition} from '@/types/common';

export const expectedEventGraphNodes1: TOptionalPosition<TCustomNode>[] = [
  {
    id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    data: {
      name: 'consume_one_event_service',
      nodeType: 'SERVICE',
      brokerType: null,
    },
    type: 'custom',
  },
  {
    id: 'b2c3d4e5-f678-9012-3456-7890abcdef01',
    data: {
      name: 'topic1',
      nodeType: 'TOPIC',
      brokerType: 'KAFKA',
    },
    type: 'custom',
  },
];

export const expectedEventGraphNodes2: TOptionalPosition<TCustomNode>[] = [
  {
    id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    data: {
      name: 'consume_three_events_from_different_brokers_service',
      nodeType: 'SERVICE',
      brokerType: null,
    },
    type: 'custom',
  },
  {
    id: 'b2c3d4e5-f678-9012-3456-7890abcdef01',
    data: {
      name: 'topicKafka',
      nodeType: 'TOPIC',
      brokerType: 'KAFKA',
    },
    type: 'custom',
  },
  {
    id: 'c3d4e5f6-7890-1234-5678-90abcdef0123',
    data: {
      name: 'topicRabbitMQ',
      nodeType: 'TOPIC',
      brokerType: 'RABBITMQ',
    },
    type: 'custom',
  },
  {
    id: 'd4e5f678-9012-3456-7890-abcdef012345',
    data: {
      name: 'topicJMS',
      nodeType: 'TOPIC',
      brokerType: 'JMS',
    },
    type: 'custom',
  },
];

export const expectedConsume2Events1TopicNodes: TOptionalPosition<TNode>[] = [
  {
    id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    data: {
      name: 'consume_one_event_service',
      nodeType: 'SERVICE',
      brokerType: null,
    },
    type: 'custom',
  },
  {
    id: 'b2c3d4e5-f678-9012-3456-7890abcdef01',
    data: {
      name: 'topic1',
      nodeType: 'TOPIC',
      brokerType: 'KAFKA',
    },
    type: 'custom',
  },
];
