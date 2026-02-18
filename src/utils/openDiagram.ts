import { logger } from '@shared/lib/logger';

import { clearGhostNodes, setEdges } from '@/components/commons/diagram/model/DiagramModel';
import { setEventGraph } from '@/models/EventGraphModel';
import { ImportData } from '@/types/common';

export const openDiagram = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';

  input.onchange = () => {
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result as string) as ImportData;
        if (json.nodes && json.edges) {
          const { edges, ...eventGraph } = json;
          clearGhostNodes();
          setEventGraph(eventGraph);
          setEdges(edges);
        }
      } catch (err) {
        logger.log(err);
      }
    };
    reader.readAsText(file);
  };
  input.click();
};
