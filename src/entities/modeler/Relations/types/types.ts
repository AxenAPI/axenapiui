import { EventDTO, EventGraphDTO, NodeDTO } from '@shared/openapi';

import { GraphNodeManager } from './managersTypes';

export interface NodeTitleProps {
  element: NodeDTO;
  size?: 'default' | 'small';
}

export interface EventTitleProps {
  element: EventDTO;
}

/** Модификаторы заголовка нода */
export const Modifiers: {
  Size: Record<
    'default' | 'small',
    {
      heading: string;
      iconSize: number;
    }
  >;
} = {
  Size: {
    default: {
      heading: 'heading-4',
      iconSize: 24,
    },
    small: {
      heading: '',
      iconSize: 18,
    },
  },
};

/** Группа связей от одного нода к другому (когда от одного надо к другому ноду идут много связей) */
export type LinkGroup = { node: NodeDTO; events: EventDTO[] };

/** У каждого нода могут быть свои связи */
export interface NodeRelations {
  consuming: LinkGroup[];
  producing: LinkGroup[];
}

/** Списки элементов графа */
export type GraphItems = Pick<EventGraphDTO, 'events' | 'links'> & { nodes: GraphNodeManager };

/** Параметры для получения связей нода */
export type NodeRelationsParams = {
  nodeId: string;
  graphItems: GraphItems;
};
