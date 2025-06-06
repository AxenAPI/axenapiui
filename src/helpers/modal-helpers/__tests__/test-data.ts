import {EventGraph1, EventGraph2, EventGraph3, EventGraph4, EventGraph5} from '@/shared/data-mock';
import {InfoPanelData} from '@/types/common';

export const expectedEventGraph1DataMap: {[key: string]: InfoPanelData} = {
  [EventGraph1.nodes[0].id]: {
    producingData: [],
    consumingData: [
      {
        ...EventGraph1.nodes[1],
        events: [...EventGraph1.events],
      },
    ],
  },
  [EventGraph1.nodes[1].id]: {
    consumingData: [],
    producingData: [
      {
        ...EventGraph1.nodes[0],
        events: [...EventGraph1.events],
      },
    ],
  },
};

export const expectedEventGraph2DataMap: {[key: string]: InfoPanelData} = {
  [EventGraph2.nodes[0].id]: {
    producingData: [],
    consumingData: [
      {
        ...EventGraph2.nodes.find(node => node.id === 'b2c3d4e5-f678-9012-3456-7890abcdef01'),
        events: [...EventGraph2.events.filter(event => event.id === 'e5f67890-1234-5678-90ab-cdef01234567')],
      },
      {
        ...EventGraph2.nodes.find(node => node.id === 'c3d4e5f6-7890-1234-5678-90abcdef0123'),
        events: [...EventGraph2.events.filter(event => event.id === 'f6789012-3456-7890-abcd-ef0123456789')],
      },
      {
        ...EventGraph2.nodes.find(node => node.id === 'd4e5f678-9012-3456-7890-abcdef012345'),
        events: [...EventGraph2.events.filter(event => event.id === '78901234-5678-90ab-cdef-0123456789ab')],
      },
    ],
  },
  [EventGraph2.nodes[1].id]: {
    producingData: [
      {
        ...EventGraph2.nodes.find(node => node.id === 'a1b2c3d4-e5f6-7890-1234-567890abcdef'),
        events: [EventGraph2.events.find(event => event.id === 'e5f67890-1234-5678-90ab-cdef01234567')],
      },
    ],
    consumingData: [],
  },
  [EventGraph2.nodes[2].id]: {
    producingData: [
      {
        ...EventGraph2.nodes.find(node => node.id === 'a1b2c3d4-e5f6-7890-1234-567890abcdef'),
        events: [EventGraph2.events.find(event => event.id === 'f6789012-3456-7890-abcd-ef0123456789')],
      },
    ],
    consumingData: [],
  },
  [EventGraph2.nodes[3].id]: {
    producingData: [
      {
        ...EventGraph2.nodes.find(node => node.id === 'a1b2c3d4-e5f6-7890-1234-567890abcdef'),
        events: [EventGraph2.events.find(event => event.id === '78901234-5678-90ab-cdef-0123456789ab')],
      },
    ],
    consumingData: [],
  },
};

export const expectedEventGraph3DataMap: {[key: string]: InfoPanelData} = {
  [EventGraph3.nodes[0].id]: {
    producingData: [],
    consumingData: [],
  },
};

export const expectedEventGraph4DataMap: {[key: string]: InfoPanelData} = {
  [EventGraph4.nodes[0].id]: {
    producingData: [
      {
        ...EventGraph4.nodes.find(node => node.id === 'b2c3d4e5-f678-9012-3456-7890abcdef01'),
        events: [...EventGraph4.events.filter(event => event.id === 'c3d4e5f6-7890-1234-5678-90abcdef0123')],
      },
    ],
    consumingData: [],
  },
  [EventGraph4.nodes[1].id]: {
    producingData: [],
    consumingData: [
      {
        ...EventGraph4.nodes.find(node => node.id === 'a1b2c3d4-e5f6-7890-1234-567890abcdef'),
        events: [...EventGraph4.events.filter(event => event.id === 'c3d4e5f6-7890-1234-5678-90abcdef0123')],
      },
    ],
  },
};

export const expectedEventGraph5DataMap: {[key: string]: InfoPanelData} = {
  [EventGraph5.nodes[0].id]: {
    producingData: [
      {
        ...EventGraph5.nodes.find(node => node.id === 'b2c3d4e5-f678-9012-3456-7890abcdef01'),
        events: [...EventGraph5.events.filter(event => event.id === 'c3d4e5f6-7890-1234-5678-90abcdef0123')],
      },
      {
        ...EventGraph5.nodes.find(node => node.id === '567890ab-cdef-1234-5678-90abcde12345'),
        events: [...EventGraph5.events.filter(event => event.id === '12345678-90ab-cdef-1234-567890abcdef')],
      },
      {
        ...EventGraph5.nodes.find(node => node.id === '17c01075-92f4-4c03-b2e2-6e6e50240bc9'),
        events: [...EventGraph5.events.filter(event => event.id === 'a1b2c3d4-1234-5678-1234-567890abcdef')],
      },
    ],
    consumingData: [],
  },
  [EventGraph5.nodes[1].id]: {
    producingData: [],
    consumingData: [
      {
        ...EventGraph5.nodes.find(node => node.id === 'a1b2c3d4-e5f6-7890-1234-567890abcdef'),
        events: [...EventGraph5.events.filter(event => event.id === 'c3d4e5f6-7890-1234-5678-90abcdef0123')],
      },
    ],
  },
  [EventGraph5.nodes[2].id]: {
    producingData: [],
    consumingData: [
      {
        ...EventGraph5.nodes.find(node => node.id === 'a1b2c3d4-e5f6-7890-1234-567890abcdef'),
        events: [...EventGraph5.events.filter(event => event.id === '12345678-90ab-cdef-1234-567890abcdef')],
      },
    ],
  },
  [EventGraph5.nodes[3].id]: {
    producingData: [],
    consumingData: [
      {
        ...EventGraph5.nodes.find(node => node.id === 'a1b2c3d4-e5f6-7890-1234-567890abcdef'),
        events: [...EventGraph5.events.filter(event => event.id === 'a1b2c3d4-1234-5678-1234-567890abcdef')],
      },
    ],
  },
};
