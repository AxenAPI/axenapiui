import type {EdgeTypes, NodeTypes} from '@xyflow/react';

import {CustomEdge} from '@/components/commons/diagram/edges/CustomEdge';
import {DisconnectedEdge} from '@/components/commons/diagram/edges/DisconnectedEdge';
import {ExpandableEdge} from '@/components/commons/diagram/edges/ExpandableEdge';
import {SimpleEdge} from '@/components/commons/diagram/edges/SimpleEdge';
import {CustomNode} from '@/components/commons/diagram/nodes/CustomNode';
import {ExpandedEventNode} from '@/components/commons/diagram/nodes/ExpandedEventNode';
import {GhostNode} from '@/components/commons/diagram/nodes/GhostNode';
import {EEdgeTypes, ENodeTypes} from '@/enums/common';

export const edgeTypes: EdgeTypes = {
  [EEdgeTypes.CUSTOM]: CustomEdge,
  [EEdgeTypes.DISCONNECTED]: DisconnectedEdge,
  [EEdgeTypes.EXPANDABLE]: ExpandableEdge,
  [EEdgeTypes.SIMPLE]: SimpleEdge,
};

export const nodeTypes: NodeTypes = {
  [ENodeTypes.CUSTOM]: CustomNode,
  [ENodeTypes.GHOST]: GhostNode,
  [ENodeTypes.EXPANDED_EVENT]: ExpandedEventNode,
};

export const edgeColors = [
  '#FF0000',
  '#FF6A00',
  '#99851F',
  '#47991F',
  '#00AAFF',
  '#0040FF',
  '#331F99',
  '#661F99',
  '#991F99',
  '#991F66',
  '#991F1F',
  '#99521F',
  '#7A991F',
  '#1F998F',
  '#1F7099',
  '#1F3D99',
  '#2B00FF',
  '#9500FF',
  '#FF00FF',
  '#FF0095',
];
