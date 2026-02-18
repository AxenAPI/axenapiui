import type { ELK, ElkNode } from 'elkjs/lib/elk.bundled.js';

import { checkIsDesktopMode } from '@/helpers/utils';

let elkInstance: ELK | null = null;

export async function getElk() {
  if (!elkInstance) {
    const ELK = (await import('elkjs/lib/elk.bundled.js')).default;
    elkInstance = new ELK();
  }

  return elkInstance;
}

export async function layoutGraph(graph: ElkNode): Promise<ElkNode> {
  if (checkIsDesktopMode() && window.elk) {
    return window.elk.layout(graph);
  }

  const elk = await getElk();
  return elk.layout(graph);
}
