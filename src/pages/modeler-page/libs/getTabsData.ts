import { GraphNodeManager, NewGraphNodeManager } from '@entities/modeler/Relations';
import { NodeTagsContext } from '@entities/modeler/Tags';

import { logger } from '@shared/lib/logger';
import { EventGraphDTO, NodeDTO } from '@shared/openapi';

/** Тип данных для модального окна деталей нода */
export type NodeModalData = {
  node: NodeDTO;
  tabs: {
    graphItems: {
      nodeId: string;
      graphItems: {
        nodes: GraphNodeManager;
        events: EventGraphDTO['events'];
        links: EventGraphDTO['links'];
      };
    };
    docsIds: string[] | null;
    status: string | null;
    tags: NodeTagsContext | null;
  };
};

// Данные для модального окна
export const getModalData = (graph: EventGraphDTO, elementId: string): NodeModalData | null => {
  const nodes = NewGraphNodeManager(graph.nodes ?? []);
  const node = nodes.getNode(elementId);
  if (!node) {
    logger.error(`Panic: node with ID ${elementId} not found`);
    return null;
  }

  const graphItems = {
    nodeId: elementId,
    graphItems: {
      nodes,
      events: graph.events,
      links: graph.links,
    },
  };
  const { nodeDescription: status = null, relatedPages: docsIds = null, tags = null } = node;

  return {
    node,
    tabs: {
      graphItems,
      docsIds,
      status,
      tags: tags
        ? {
            nodeId: elementId,
            tags,
          }
        : null,
    },
  };
};
