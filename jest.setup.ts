import ELK, {ElkNode} from 'elkjs/lib/elk.bundled.js';

import {TextEncoder} from 'util';

import {mockReactFlow} from './src/__mocks__/react-flow';
import '@testing-library/jest-dom';

global.TextEncoder = TextEncoder;

mockReactFlow();

const elk = new ELK();

// @ts-ignore
window.elk = {
  layout: (graph: ElkNode): Promise<ElkNode> => elk.layout(graph),
};
