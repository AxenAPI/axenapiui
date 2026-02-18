import type {
  DOMConversionMap,
  DOMConversionOutput,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from 'lexical';
import { DecoratorNode } from 'lexical';
import type * as Mdast from 'mdast';
import type { JSX } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { parseHtmlTable } from '../helpers/parsing';
import { serializeHtmlTable } from '../helpers/serialization';
import { generateCellId, generateColumnId, generateRowId } from '../helpers/utils';
import {
  CELL_TYPE_DATA,
  CELL_TYPE_HEADER,
  DEFAULT_CELL_ALIGNMENT,
  HEADER_ROW_INDEX,
  LEXICAL_CONVERSION_PRIORITY,
  TABLE_NODE_VERSION,
} from '../types/constants';
import type { HtmlAlignType, HtmlTableData } from '../types/types';

import { HtmlRawTableViewer } from './HtmlRawTableViewer';
import HtmlTableEditor from './HtmlTableEditor';
import { InvalidTableFallback } from './InvalidTableFallback';

const noop = () => {};

type CoordinatesSubscription = (coords: [colIndex: number, rowIndex: number] | null) => void;

function coordinatesEmitter() {
  let subscription: CoordinatesSubscription = noop;
  return {
    destroy: () => {
      subscription = noop;
    },
    publish: (coords: [colIndex: number, rowIndex: number] | null) => {
      subscription(coords);
    },
    subscribe: (cb: CoordinatesSubscription) => {
      subscription = cb;
    },
    unsubscribe: () => {
      subscription = noop;
    },
  };
}

/** Regex pattern for allowed URL protocols (same as in sanitizeHtmlTable.ts) */
const ALLOWED_URI_REGEXP = /^(?:(?:(?:f|ht)tps?|mailto|tel):|[^a-z]|[a-z+.-]+(?:[^a-z+.-:]|$))/i;

/**
 * Validates a URL against allowed protocols.
 * Returns empty string for invalid/dangerous URLs.
 */
function sanitizeUrl(url: string): string {
  if (!url) {
    return '';
  }
  const trimmedUrl = url.trim();
  if (ALLOWED_URI_REGEXP.test(trimmedUrl)) {
    return trimmedUrl;
  }
  return '';
}

/**
 * Recursively sanitizes URLs in link nodes within MDAST phrasing content.
 */
function sanitizeContentUrls(content: Mdast.PhrasingContent[]): Mdast.PhrasingContent[] {
  return content.map(node => {
    if (node.type === 'link') {
      return {
        ...node,
        url: sanitizeUrl(node.url),
        children: sanitizeContentUrls(node.children as Mdast.PhrasingContent[]),
      };
    }
    if ('children' in node && Array.isArray(node.children)) {
      return {
        ...node,
        children: sanitizeContentUrls(node.children as Mdast.PhrasingContent[]),
      } as Mdast.PhrasingContent;
    }
    return node;
  });
}

export type SerializedHtmlRawTableNode = Spread<
  {
    tableData: HtmlTableData;
    version: typeof TABLE_NODE_VERSION;
  },
  SerializedLexicalNode
>;

export class HtmlRawTableNode extends DecoratorNode<JSX.Element> {
  __tableData: HtmlTableData;

  focusEmitter = coordinatesEmitter();

  constructor(tableDataOrHtml: HtmlTableData | string, key?: NodeKey) {
    super(key);
    this.__tableData = typeof tableDataOrHtml === 'string' ? parseHtmlTable(tableDataOrHtml) : tableDataOrHtml;
  }

  static getType(): string {
    return 'html-raw-table';
  }

  static clone(node: HtmlRawTableNode): HtmlRawTableNode {
    return new HtmlRawTableNode(node.__tableData, node.__key);
  }

  static importJSON(serializedNode: SerializedHtmlRawTableNode): HtmlRawTableNode {
    // eslint-disable-next-line no-use-before-define
    return $createHtmlRawTableNode(serializedNode.tableData);
  }

  static importDOM(): DOMConversionMap | null {
    return {
      table: (domNode: HTMLElement) => {
        if (domNode.tagName === 'TABLE') {
          return {
            // eslint-disable-next-line no-use-before-define
            conversion: $convertHtmlTableElement,
            priority: LEXICAL_CONVERSION_PRIORITY,
          };
        }
        return null;
      },
    };
  }

  static createDOM(): HTMLDivElement {
    return document.createElement('div');
  }

  static updateDOM(): false {
    return false;
  }

  static isInline(): false {
    return false;
  }

  static isKeyboardSelectable(): boolean {
    return true;
  }

  exportJSON(): SerializedHtmlRawTableNode {
    return {
      tableData: this.__tableData,
      type: 'html-raw-table',
      version: TABLE_NODE_VERSION,
    };
  }

  getTableData(): HtmlTableData {
    return this.getLatest().__tableData;
  }

  setTableData(tableData: HtmlTableData): void {
    this.getWritable().__tableData = tableData;
  }

  getHtmlContent(): string {
    return serializeHtmlTable(this.getLatest().__tableData);
  }

  setHtmlContent(htmlContent: string): void {
    this.getWritable().__tableData = parseHtmlTable(htmlContent);
  }

  getRowCount(): number {
    return this.getLatest().__tableData.bodyRows.length;
  }

  getColCount(): number {
    return this.getLatest().__tableData.columns.length;
  }

  /**
   * Updates the contents of a specific cell in the table.
   *
   * @param colIndex - Column index (0-based). Valid range: 0 to columnCount-1.
   * @param rowIndex - Row index where 0 is the header row and 1+ are body rows.
   *                   Valid range: 0 (header) to bodyRows.length (last body row).
   *                   Note: This differs from insertRowAt/deleteRowAt which use body-relative indexing.
   * @param content - MDAST phrasing content to set as the cell's content.
   *                  URLs in link nodes will be sanitized for security.
   */
  updateCellContents(colIndex: number, rowIndex: number, content: Mdast.PhrasingContent[]): void {
    const self = this.getWritable();
    const tableData = structuredClone(self.__tableData);

    if (colIndex < 0 || colIndex >= tableData.columns.length) {
      throw new Error(`Invalid column index: ${colIndex}. Table has ${tableData.columns.length} columns.`);
    }
    if (rowIndex < 0 || rowIndex > tableData.bodyRows.length) {
      throw new Error(
        `Invalid row index: ${rowIndex}. Table has ${tableData.bodyRows.length + 1} rows (including header).`
      );
    }

    // Sanitize URLs in links before saving content
    const sanitizedContent = sanitizeContentUrls(content);

    if (rowIndex === HEADER_ROW_INDEX) {
      if (tableData.headerRow.cells[colIndex]) {
        tableData.headerRow.cells[colIndex].content = sanitizedContent;
      }
    } else {
      const bodyRowIndex = rowIndex - 1;
      if (tableData.bodyRows[bodyRowIndex]?.cells[colIndex]) {
        tableData.bodyRows[bodyRowIndex].cells[colIndex].content = sanitizedContent;
      }
    }

    self.__tableData = tableData;
  }

  /**
   * Inserts a new empty row at the specified index in the body rows.
   *
   * @param rowIndex - Index in the body rows array (0-based, body-relative).
   *                   0 inserts at the beginning of body rows (after header).
   *                   Note: This is body-relative indexing, NOT absolute table indexing.
   *                   Use getRowCount() to get the valid range.
   */
  insertRowAt(rowIndex: number): void {
    const self = this.getWritable();
    const tableData = structuredClone(self.__tableData);
    const colCount = tableData.columns.length;

    if (rowIndex < 0 || rowIndex > tableData.bodyRows.length) {
      throw new Error(`Invalid row index: ${rowIndex}. Valid range: 0-${tableData.bodyRows.length}`);
    }

    const newRow = {
      id: generateRowId(),
      cells: Array.from({ length: colCount }, () => ({
        id: generateCellId(),
        content: [] as Mdast.PhrasingContent[],
        type: CELL_TYPE_DATA,
      })),
    };

    tableData.bodyRows.splice(rowIndex, 0, newRow);
    self.__tableData = tableData;
  }

  /**
   * Deletes a row at the specified index in the body rows.
   * If the last body row is deleted, the entire table node is removed.
   *
   * @param rowIndex - Index in the body rows array (0-based, body-relative).
   *                   Note: This is body-relative indexing, NOT absolute table indexing.
   *                   Valid range: 0 to bodyRows.length-1.
   */
  deleteRowAt(rowIndex: number): void {
    const self = this.getWritable();
    const tableData = structuredClone(self.__tableData);

    if (rowIndex < 0 || rowIndex >= tableData.bodyRows.length) {
      throw new Error(`Invalid row index: ${rowIndex}. Table has ${tableData.bodyRows.length} body rows.`);
    }

    if (tableData.bodyRows.length === 1) {
      this.selectNext();
      this.remove();
    } else {
      tableData.bodyRows.splice(rowIndex, 1);
      self.__tableData = tableData;
    }
  }

  addRowToBottom(): void {
    this.insertRowAt(this.getRowCount());
  }

  /**
   * Inserts a new empty column at the specified index.
   *
   * @param colIndex - Column index (0-based). Valid range: 0 to columnCount.
   */
  insertColumnAt(colIndex: number): void {
    const self = this.getWritable();
    const tableData = structuredClone(self.__tableData);

    if (colIndex < 0 || colIndex > tableData.columns.length) {
      throw new Error(`Invalid column index: ${colIndex}. Valid range: 0-${tableData.columns.length}`);
    }

    tableData.columns.splice(colIndex, 0, { id: generateColumnId(), align: DEFAULT_CELL_ALIGNMENT });
    tableData.headerRow.cells.splice(colIndex, 0, { id: generateCellId(), content: [], type: CELL_TYPE_HEADER });

    for (const row of tableData.bodyRows) {
      row.cells.splice(colIndex, 0, { id: generateCellId(), content: [], type: CELL_TYPE_DATA });
    }

    self.__tableData = tableData;
  }

  /**
   * Deletes a column at the specified index.
   * If the last column is deleted, the entire table node is removed.
   *
   * @param colIndex - Column index (0-based). Valid range: 0 to columnCount-1.
   */
  deleteColumnAt(colIndex: number): void {
    const self = this.getWritable();
    const tableData = structuredClone(self.__tableData);

    if (colIndex < 0 || colIndex >= tableData.columns.length) {
      throw new Error(`Invalid column index: ${colIndex}. Table has ${tableData.columns.length} columns.`);
    }

    if (tableData.columns.length === 1) {
      this.selectNext();
      this.remove();
    } else {
      tableData.columns.splice(colIndex, 1);
      tableData.headerRow.cells.splice(colIndex, 1);

      for (const row of tableData.bodyRows) {
        row.cells.splice(colIndex, 1);
      }

      self.__tableData = tableData;
    }
  }

  addColumnToRight(): void {
    this.insertColumnAt(this.getColCount());
  }

  /**
   * Sets the alignment for a specific column.
   * Updates the column alignment and all cells in that column.
   *
   * @param colIndex - Column index (0-based). Valid range: 0 to columnCount-1.
   * @param align - Alignment type: 'left', 'center', 'right', or 'justify'.
   */
  setColumnAlign(colIndex: number, align: HtmlAlignType): void {
    const self = this.getWritable();
    const tableData = structuredClone(self.__tableData);

    if (colIndex < 0 || colIndex >= tableData.columns.length) {
      throw new Error(`Invalid column index: ${colIndex}. Table has ${tableData.columns.length} columns.`);
    }

    tableData.columns[colIndex].align = align;
    tableData.headerRow.cells[colIndex].align = align;

    for (const row of tableData.bodyRows) {
      if (row.cells[colIndex]) {
        row.cells[colIndex].align = align;
      }
    }

    self.__tableData = tableData;
  }

  select(coords?: [colIndex: number, rowIndex: number] | null): void {
    this.focusEmitter.publish(coords ?? null);
  }

  decorate(editor: LexicalEditor): JSX.Element {
    if (!editor.isEditable()) {
      return <HtmlRawTableViewer htmlContent={this.getHtmlContent()} />;
    }

    return (
      <ErrorBoundary fallback={<InvalidTableFallback />}>
        <HtmlTableEditor lexicalTable={this} parentEditor={editor} tableData={this.getTableData()} />
      </ErrorBoundary>
    );
  }

  destroy(): void {
    this.focusEmitter.destroy();
  }
}

export function $createHtmlRawTableNode(tableDataOrHtml: HtmlTableData | string): HtmlRawTableNode {
  return new HtmlRawTableNode(tableDataOrHtml);
}

export function $isHtmlRawTableNode(node: LexicalNode | null | undefined): node is HtmlRawTableNode {
  return node instanceof HtmlRawTableNode;
}

export function $convertHtmlTableElement(element: HTMLElement): DOMConversionOutput {
  return { node: new HtmlRawTableNode(element.outerHTML) };
}
