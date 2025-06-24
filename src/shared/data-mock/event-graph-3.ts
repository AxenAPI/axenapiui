import {EventGraphDTO} from '@/shared/api/event-graph-api';

export const EventGraph3: EventGraphDTO = {
  name: 'empty_service',
  tags: [],
  nodes: [
    {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'empty_service',
      type: 'SERVICE',
      brokerType: null,
      belongsToGraph: ['123e4567-e89b-12d3-a456-426614174000'],
    },
  ],
  links: [],
  events: [],
  errors: [],
};
