import {type Node} from '@xyflow/react';

import {ENodeTypes} from '@/enums/common';
import {TNode} from '@/types/common';

/**
 * Функция адаптирует узел для использования в качестве "призрачного" (удаленного) узла
 * @param node
 */
export function adaptGhostNode(node: TNode): Node {
  return {
    ...node,
    type: ENodeTypes.GHOST,
    data: {},
  };
}
