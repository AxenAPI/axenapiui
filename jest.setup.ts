/// <reference lib="dom" />

import { TextEncoder } from 'util';

import ELK, { ElkNode } from 'elkjs/lib/elk.bundled.js';

import '@testing-library/jest-dom';

// --- Содержимое из __mocks__/react-flow.ts ---
class ResizeObserver {
  callback: globalThis.ResizeObserverCallback;

  constructor(callback: globalThis.ResizeObserverCallback) {
    this.callback = callback;
  }

  observe(target: Element) {
    this.callback([{ target } as globalThis.ResizeObserverEntry], this);
  }

  unobserve() {}

  disconnect() {}
}

class DOMMatrixReadOnly {
  m22: number;

  constructor(transform: string) {
    const scale = transform?.match(/scale\(([1-9.])\)/)?.[1];
    this.m22 = scale !== undefined ? +scale : 1;
  }
}

let init = false;

const mockReactFlow = () => {
  if (init) return;
  init = true;

  global.ResizeObserver = ResizeObserver;

  // @ts-expect-error JSDOM doesn't have DOMMatrixReadOnly
  global.DOMMatrixReadOnly = DOMMatrixReadOnly;

  Object.defineProperties(global.HTMLElement.prototype, {
    offsetHeight: {
      get() {
        return parseFloat(this.style.height) || 1;
      },
    },
    offsetWidth: {
      get() {
        return parseFloat(this.style.width) || 1;
      },
    },
  });

  global.SVGElement.prototype.getBBox = () => ({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
};
// --- Конец содержимого ---

global.TextEncoder = TextEncoder;

mockReactFlow();

const elk = new ELK();

window.elk = {
  layout: (graph: ElkNode): Promise<ElkNode> => elk.layout(graph),
};

Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => '',
  }),
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Mock mermaid
jest.mock('mermaid', () => ({
  __esModule: true,
  default: {
    initialize: jest.fn(),
    run: jest.fn(),
    render: jest.fn(() => Promise.resolve({ svg: '<svg></svg>' })),
  },
}));
