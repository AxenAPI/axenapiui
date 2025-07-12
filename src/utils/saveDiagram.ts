import {Edge} from '@xyflow/react';

import {TNode} from '@/types/common';

export const saveDiagram = (nodes: TNode[], edges: Edge[]) => {
  const data = {
    nodes,
    edges,
  };

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], {type: 'application/json'});
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'reactflow-diagram.json';
  link.click();

  URL.revokeObjectURL(url);
};
