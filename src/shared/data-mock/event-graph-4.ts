import { EventGraphDTO } from '@shared/openapi';

export const EventGraph4: EventGraphDTO = {
  name: 'no_consumes_one_outgoing_no_broker_type_service',
  tags: [],
  nodes: [
    {
      id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
      belongsToGraph: ['a1b2c3d4-e5f6-7890-1234-567890abcdef'],
      name: 'no_consumes_one_outgoing_no_broker_type_service',
      type: 'SERVICE',
      brokerType: undefined,
    },
    {
      id: 'b2c3d4e5-f678-9012-3456-7890abcdef01',
      belongsToGraph: ['a1b2c3d4-e5f6-7890-1234-567890abcdef'],
      name: 'topic',
      type: 'HTTP',
      brokerType: undefined,
    },
  ],
  links: [
    {
      id: 'l1',
      fromId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
      toId: 'b2c3d4e5-f678-9012-3456-7890abcdef01',
      eventId: 'c3d4e5f6-7890-1234-5678-90abcdef0123',
    },
  ],
  events: [
    {
      id: 'c3d4e5f6-7890-1234-5678-90abcdef0123',
      name: 'EventOutgoing',
      schema:
        '{\n        "type": "object",\n        "x-outgoing": {\n          "topics": [\n            "topic"\n          ]\n        }\n      }',
    },
  ],
  errors: [],
};
