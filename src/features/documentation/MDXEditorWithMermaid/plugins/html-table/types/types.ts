import type { LexicalEditor } from 'lexical';
import type * as Mdast from 'mdast';
import type { ElementType } from 'react';

import type { TableCellStore } from '../hooks/useTableCellStore';
import type { HtmlRawTableNode } from '../ui/HtmlRawTableNode';

/** Alignment type for table cells and columns */
export type HtmlAlignType = 'center' | 'justify' | 'left' | 'right';

/** Cell coordinates: [columnIndex, rowIndex], both 0-based */
// CHECKME: почему не объект?
export type CellCoordinates = [number, number];

/** Direction for cell navigation */
export type NavigationDirection = 'down' | 'left' | 'right' | 'up';

/** Valid alignment values for runtime validation */
export const VALID_ALIGNMENTS: readonly HtmlAlignType[] = ['center', 'justify', 'left', 'right'] as const;

/** Type guard to check if a value is a valid alignment */
export function isValidAlignment(value: string): value is HtmlAlignType {
  return VALID_ALIGNMENTS.includes(value as HtmlAlignType);
}

/** Single cell in an HTML table */
export interface HtmlTableCell {
  /** Unique identifier for stable React keys (survives content updates) */
  id: string;
  /** Cell content as MDAST phrasing nodes */
  content: Mdast.PhrasingContent[];
  /** Cell type: 'th' for header, 'td' for data */
  type: 'td' | 'th';
  /** Text alignment for the cell */
  align?: HtmlAlignType;
}

/** Single row in an HTML table */
export interface HtmlTableRow {
  /** Unique identifier for stable React keys */
  id: string;
  cells: HtmlTableCell[];
}

/** Single column metadata in an HTML table */
export interface HtmlTableColumn {
  /** Unique identifier for stable React keys */
  id: string;
  /** Text alignment for the column */
  align: HtmlAlignType;
}

/** Complete HTML table structure */
export interface HtmlTableData {
  /** Body rows (multiple rows in tbody) */
  bodyRows: HtmlTableRow[];
  /** Column metadata (object-reference for stable React keys) */
  columns: HtmlTableColumn[];
  /** Header row (single row in thead) */
  headerRow: HtmlTableRow;
}

/**
 * Props for the Cell component
 */
export interface CellProps {
  /** HTML element type for the cell (th or td) */
  CellElement: ElementType;
  /** Unique cell identifier */
  cellId: string;
  /** Column index (0-based) - for saving cell content */
  colIndex: number;
  /** Cell content as MDAST phrasing nodes */
  contents: Mdast.PhrasingContent[];
  /** The table node being edited */
  lexicalTable: HtmlRawTableNode;
  /** Parent Lexical editor instance */
  parentEditor: LexicalEditor;
  /** Row index (0-based, 0 is header) - for saving cell content */
  rowIndex: number;
  /** Table cell store for state management */
  store: TableCellStore;
  /** Text alignment for the cell */
  align?: HtmlAlignType;
}

/** Props for the ColumnEditor component */
export interface ColumnEditorProps {
  /** Current alignment of the column */
  align: HtmlAlignType;
  /** Index of the column being edited (0-based) */
  colIndex: number;
  /** Currently highlighted cell coordinates */
  highlightedCoordinates: CellCoordinates;
  /** The table node being edited */
  lexicalTable: HtmlRawTableNode;
  /** Parent Lexical editor instance */
  parentEditor: LexicalEditor;
  /** Table cell store for state management */
  store: TableCellStore;
}

/** Props for the RowEditor component */
export interface RowEditorProps {
  /** Currently highlighted cell coordinates */
  highlightedCoordinates: CellCoordinates;
  /** The table node being edited */
  lexicalTable: HtmlRawTableNode;
  /** Parent Lexical editor instance */
  parentEditor: LexicalEditor;
  /** Index of the row being edited (0-based, 0 is header) */
  rowIndex: number;
  /** Table cell store for state management */
  store: TableCellStore;
}

/** Props for the HtmlTableEditor component */
export interface HtmlTableEditorProps {
  /** The table node being edited */
  lexicalTable: HtmlRawTableNode;
  /** Parent Lexical editor instance */
  parentEditor: LexicalEditor;
  /** Parsed table data structure */
  tableData: HtmlTableData;
}
