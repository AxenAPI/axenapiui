import type { ElkNode } from 'elkjs/lib/elk.bundled';

import { ElectronApi } from '../types';

declare global {
  interface Window {
    elk?: {
      layout: (graph: ElkNode) => Promise<ElkNode>;
    };
    electronAPI: ElectronApi;
  }

  interface SVGElement {
    getBBox(): {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }
}

export {};
