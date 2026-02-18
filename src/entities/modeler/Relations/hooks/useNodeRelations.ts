import { useUnit } from 'effector-react';

import { getNodeRelations } from '../lib/getNodeRelations';
import { $graphItems, addRelationRequested } from '../model/model';
import { NodeRelations } from '../types/types';

/** Результат хука для работы со связями нода */
export interface UseNodeRelationsResult {
  relations: NodeRelations;
  onAddRelation: () => void;
}

/** Хук для получения связей нода */
export const useNodeRelations = (): UseNodeRelationsResult | undefined => {
  const items = useUnit($graphItems);

  return items
    ? {
        relations: getNodeRelations(items.nodeId, items.graphItems),
        onAddRelation: () => addRelationRequested(items.nodeId),
      }
    : undefined;
};
