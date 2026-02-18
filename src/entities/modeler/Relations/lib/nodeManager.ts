import { logger } from '@shared/lib/logger';
import { NodeDTO } from '@shared/openapi';

import { GraphNodeManager } from '../types/managersTypes';

/** Конструктор менеджера нодов графа */
export const NewGraphNodeManager = (nodes: NodeDTO[]): GraphNodeManager => {
  const nodesMap = new Map<string, NodeDTO>();
  for (const node of nodes) {
    if (node.id) {
      nodesMap.set(node.id, node);
    } else {
      // TODO: Уточнить, возможно это не ошибка
      logger.error('Node without ID found in graph nodes:', node);
    }
  }
  return { getNode: (id: string) => nodesMap.get(id) };
};
