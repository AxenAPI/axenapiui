import {type Node} from '@xyflow/react';

import {removeGhostNode, setEdges, setNodes} from '@/components/commons/diagram/model/DiagramModel';

export const openDiagram = (ghostNodes: Node[]) => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';

  input.onchange = () => {
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result as string);
        if (json.nodes && json.edges) {
          ghostNodes.forEach(ghostNode => {
            removeGhostNode(ghostNode.id);
          });
          setNodes(json.nodes);
          setEdges(json.edges);
        }
      } catch (err) {
        console.log(err);
      }
    };
    reader.readAsText(file);
  };
  input.click();
};
