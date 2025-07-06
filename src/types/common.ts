import {type Node} from '@xyflow/react';
import {OpenAPIV3} from 'openapi-types';

import {EConnectionType, EObjectToConnect} from '@/enums/common';
import {EventDTO, LinkDTO, NodeDTO, NodeDTOBrokerTypeEnum, NodeDTOTypeEnum} from '@/shared/api/event-graph-api';

export type TCustomNodeData = {
  name: string;
  nodeType: NodeDTOTypeEnum;
  brokerType?: NodeDTOBrokerTypeEnum;
};

export type TCustomNode = Node<TCustomNodeData>;

export type TExpandedEventNodeData = Omit<TCustomNodeData, 'nodeType'>;
export type TExpandedEventNode = Node<TExpandedEventNodeData>;

/**
 * relatedNodeId - Id элемента, который "раскрылся" и создал узел группы
 */
export type TGroupNodeData = {
  relatedNodeId: NodeDTO['id'];
};
export type TGroupNode = Node<TGroupNodeData>;

export type TNodeData = TCustomNodeData | TExpandedEventNodeData | TGroupNodeData;
export type TNode = TCustomNode | TExpandedEventNode | TGroupNode;
export type TOptionalPosition<T extends TNode> = Omit<T, 'position'> & {
  position?: {x: number; y: number};
};
export type MenuItem = {
  name: string;
  id?: string;
  type: 'EVENT' | NodeDTOTypeEnum;
};

export type SidebarItems = {
  services: MenuItem[];
  topics: MenuItem[];
  events: MenuItem[];
  https: MenuItem[];
};

export type InfoPanelItem = NodeDTO & {events: EventDTO[]};
export type InfoPanelData = {
  consumingData: InfoPanelItem[];
  producingData: InfoPanelItem[];
};

export interface ILinkForm extends LinkDTO {
  connectionType: EConnectionType;
  objectToConnect: EObjectToConnect;
}

export interface ILinksForm {
  links: ILinkForm[];
}

export type TSelectOptions = {label: string; value: string}[];

/**
 * isExpanded - Флаг, указывающий, находится ли элемент в раскрытом состоянии.
 * topicId - Id топика, который может быть раскрыт.
 * compoundLinkId - Id свернутой связи.
 * relatedItems - Массив элементов, которые должны быть развернуты, если isExpanded === true.
 */
export type TExpandableItem = {
  isExpanded: boolean;
  topicId: NodeDTO['id'];
  compoundLinkId: string;
  relatedItems: {
    linkId: LinkDTO['id'];
    eventId: LinkDTO['eventId'];
  }[];
};

export type TDownloadItem = {
  filename: string;
  url: string;
};

export type TSchemaObject = OpenAPIV3.SchemaObject;
export type TReferenceObject = OpenAPIV3.ReferenceObject;

export type TSchema = TSchemaObject | TReferenceObject;
export type TSchemaObjectType = OpenAPIV3.ArraySchemaObjectType | OpenAPIV3.NonArraySchemaObjectType | 'dictionary';

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

export type DocNodes = {
  id: string;
  title: string;
  url?: string;
  children?: DocNodes[];
};
