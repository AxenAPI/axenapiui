import { CELL_TYPE_DATA, CELL_TYPE_HEADER, DEFAULT_CELL_ALIGNMENT } from '../types/constants';
import type { HtmlTableCell, HtmlTableColumn, HtmlTableData } from '../types/types';

import { generateCellId, generateColumnId, generateRowId } from './utils';

/** Creates an empty table cell with a unique ID */
export function createEmptyCell(isHeader: boolean): HtmlTableCell {
  return {
    content: [],
    id: generateCellId(),
    type: isHeader ? CELL_TYPE_HEADER : CELL_TYPE_DATA,
  };
}

/** Creates an empty column with default alignment and a unique ID */
export function createEmptyColumn(): HtmlTableColumn {
  return { align: DEFAULT_CELL_ALIGNMENT, id: generateColumnId() };
}

/** Pads an array to the target length with generated items */
export function padArray<T>(arr: T[], targetLength: number, createItem: () => T): T[] {
  if (arr.length >= targetLength) return arr;
  const padding = Array.from({ length: targetLength - arr.length }, createItem);
  return [...arr, ...padding];
}

/** Ensures a cell has an ID, generating one if missing */
function ensureCellId(cell: HtmlTableCell): HtmlTableCell {
  if (cell.id) return cell;
  return { ...cell, id: generateCellId() };
}

/** Ensures a column has an ID, generating one if missing */
function ensureColumnId(column: HtmlTableColumn): HtmlTableColumn {
  if (column.id) return column;
  return { ...column, id: generateColumnId() };
}

/** Normalizes table structure to ensure consistency and stable IDs */
export function normalizeTableStructure(data: HtmlTableData): HtmlTableData {
  const maxColumns = Math.max(
    data.headerRow.cells.length,
    ...data.bodyRows.map(row => row.cells.length),
    data.columns.length,
    1
  );

  const normalizedColumns = padArray(data.columns.map(ensureColumnId), maxColumns, createEmptyColumn);

  const normalizedHeaderCells = padArray(
    data.headerRow.cells.map(c => ensureCellId({ ...c, content: [...c.content] })),
    maxColumns,
    () => createEmptyCell(true)
  );

  let normalizedBodyRows = data.bodyRows.map(row => ({
    id: row.id || generateRowId(),
    cells: padArray(
      row.cells.map(c => ensureCellId({ ...c, content: [...c.content] })),
      maxColumns,
      () => createEmptyCell(false)
    ),
  }));

  if (normalizedBodyRows.length === 0) {
    normalizedBodyRows = [
      {
        id: generateRowId(),
        cells: Array.from({ length: maxColumns }, () => createEmptyCell(false)),
      },
    ];
  }

  return {
    bodyRows: normalizedBodyRows,
    columns: normalizedColumns,
    headerRow: {
      id: data.headerRow.id || generateRowId(),
      cells: normalizedHeaderCells,
    },
  };
}
