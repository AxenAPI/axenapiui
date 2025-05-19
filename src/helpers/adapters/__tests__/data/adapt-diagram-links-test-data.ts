import {Edge} from '@xyflow/react';
import stc from 'string-to-color';

import {EEdgeTypes} from '@/enums/common';

export const expectedEventGraphLinks1: Edge[] = [
  {
    id: 'b2c3d4e5-f678-9012-3456-7890abcdef01->a1b2c3d4-e5f6-7890-1234-567890abcdef.0',
    source: 'b2c3d4e5-f678-9012-3456-7890abcdef01',
    target: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    type: EEdgeTypes.CUSTOM,
    data: {
      color: stc('c3d4e5f6-7890-1234-5678-90abcdef0123'),
      eventId: 'c3d4e5f6-7890-1234-5678-90abcdef0123',
    },
  },
];

export const expectedEventGraphLinks2: Edge[] = [
  {
    id: 'b2c3d4e5-f678-9012-3456-7890abcdef01->a1b2c3d4-e5f6-7890-1234-567890abcdef.0',
    source: 'b2c3d4e5-f678-9012-3456-7890abcdef01',
    target: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    type: EEdgeTypes.CUSTOM,
    data: {
      color: stc('e5f67890-1234-5678-90ab-cdef01234567'),
      eventId: 'e5f67890-1234-5678-90ab-cdef01234567',
    },
  },
  {
    id: 'c3d4e5f6-7890-1234-5678-90abcdef0123->a1b2c3d4-e5f6-7890-1234-567890abcdef.1',
    source: 'c3d4e5f6-7890-1234-5678-90abcdef0123',
    target: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    type: EEdgeTypes.CUSTOM,
    data: {
      color: stc('f6789012-3456-7890-abcd-ef0123456789'),
      eventId: 'f6789012-3456-7890-abcd-ef0123456789',
    },
  },
  {
    id: 'd4e5f678-9012-3456-7890-abcdef012345->a1b2c3d4-e5f6-7890-1234-567890abcdef.2',
    source: 'd4e5f678-9012-3456-7890-abcdef012345',
    target: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    type: EEdgeTypes.CUSTOM,
    data: {
      color: stc('78901234-5678-90ab-cdef-0123456789ab'),
      eventId: '78901234-5678-90ab-cdef-0123456789ab',
    },
  },
];

export const expectedConsume_1: Edge[] = [
  {
    id: 'dd0d6793-427e-46da-8b48-a769dd07ab2d',
    source: 'b2c3d4e5-f678-9012-3456-7890abcdef01',
    target: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    type: EEdgeTypes.EXPANDABLE,
    data: {
      color: stc('c3d4e5f6-7890-1234-5678-90abcdef0123'),
      eventId: 'c3d4e5f6-7890-1234-5678-90abcdef0123',
    },
  },
  {
    id: 'adb82191-cca5-4a59-9c10-ea99cc4f0100',
    source: 'b2c3d4e5-f678-9012-3456-7890abcdef01',
    target: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    type: EEdgeTypes.EXPANDABLE,
    data: {
      color: stc('b61208c8-09d4-4e4d-89c0-b1da4e8b7d17'),
      eventId: 'b61208c8-09d4-4e4d-89c0-b1da4e8b7d17',
    },
  },
];

export const expectedConsume_2: Edge[] = [
  {
    id: '11f1588f-8e1c-4c14-b4dc-37465dbd5213',
    source: 'b2c3d4e5-f678-9012-3456-7890abcdef01',
    target: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    type: EEdgeTypes.EXPANDABLE,
    data: {
      color: stc('c3d4e5f6-7890-1234-5678-90abcdef0123'),
      eventId: 'c3d4e5f6-7890-1234-5678-90abcdef0123',
    },
  },
  {
    id: 'b5728f14-369e-413b-86ec-c44c37e9c963',
    source: 'b2c3d4e5-f678-9012-3456-7890abcdef01',
    target: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    type: EEdgeTypes.EXPANDABLE,
    data: {
      color: stc('b61208c8-09d4-4e4d-89c0-b1da4e8b7d17'),
      eventId: 'b61208c8-09d4-4e4d-89c0-b1da4e8b7d17',
    },
  },
];
