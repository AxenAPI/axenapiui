import {XYPosition} from '@xyflow/react';
import {v4 as uuidv4} from 'uuid';

import {EMPTY_ARRAY, EMPTY_CHAR} from '@/constants/common';
import {EConnectionType, EObjectToConnect} from '@/enums/common';
import {EventGraphDTO, NodeDTO} from '@/shared/api/event-graph-api';
import {ILinkForm} from '@/types/common';

/**
 * Фиксированная высота узла
 */
export const NODE_HEIGHT = 48;
/**
 * Фиксированная ширина узла
 */
export const NODE_WIDTH = 187;

export const GROUP_NODE_PADDING = 10;
export const GROUP_NODE_GAP = 20;
export const INITIAL_POSITION_INSIDE_GROUP: XYPosition = {x: 10, y: 10};

export const initialLinksForm: ILinkForm = {
  fromId: null,
  toId: null,
  eventId: null,
  connectionType: EConnectionType.PRODUCE,
  objectToConnect: EObjectToConnect.TOPIC,
};

export const elkLayoutOptions = {
  'elk.algorithm': 'layered',
  'elk.direction': 'RIGHT',
  'elk.position': 'free',
  'elk.spacing.nodeNode': '50',
  'elk.spacing.componentComponent': '100',
  'elk.layered.spacing.nodeNodeBetweenLayers': '400',
  'elk.hierarchyHandling': 'INCLUDE_CHILDREN',
  'elk.contentAlignment': 'H_CENTER',
  'elk.partitioning.activate': 'true',
  'elk.layered.nodePlacement.bk.fixedAlignment': 'BALANCED',
  'elk.layered.considerModelOrder.strategy': 'PREFER_NODES',
};

export const INITIAL_SERVICE_NODE: NodeDTO = {
  name: EMPTY_CHAR,
  belongsToGraph: EMPTY_ARRAY,
  type: 'SERVICE',
  nodeDescription: EMPTY_CHAR,
  nodeUrl: EMPTY_CHAR,
  requestBody: EMPTY_CHAR,
  responseBody: EMPTY_CHAR,
  methodType: 'GET',
};

export const INITIAL_EVENT_GRAPH: EventGraphDTO = {
  name: uuidv4(),
  nodes: [],
  events: [],
  links: [],
  errors: [],
  tags: [],
};
