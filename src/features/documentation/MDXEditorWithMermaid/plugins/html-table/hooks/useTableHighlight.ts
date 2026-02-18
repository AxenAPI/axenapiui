import { MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { throttle } from '../helpers/utils';
import { CELL_TYPE_DATA, CELL_TYPE_HEADER, INACTIVE_CELL_COORDINATES, THROTTLE_DELAY } from '../types/constants';
import type { CellCoordinates } from '../types/types';

/** Filter out tool cells (cells with data-tool-cell attribute) */
const getDataCellIndex = (cell: HTMLElement, row: HTMLElement): number => {
  const allCells = Array.from(row.children) as HTMLElement[];
  const dataCells = allCells.filter(c => !c.hasAttribute('data-tool-cell'));
  return dataCells.indexOf(cell);
};

/** Optimized table highlight hook with memoized selectors and DOM manipulation */
export function useTableHighlight() {
  const [highlightedCoordinates, setHighlightedCoordinates] = useState<CellCoordinates>(INACTIVE_CELL_COORDINATES);

  const tableRef = useRef<HTMLTableElement>(null);

  // Memoized selectors to prevent unnecessary re-renders
  const selectors = useMemo(
    () => ({
      isColumnActive: (colIndex: number) => highlightedCoordinates[0] === colIndex,
      isRowActive: (rowIndex: number) => highlightedCoordinates[1] === rowIndex,
    }),
    [highlightedCoordinates]
  );

  // Direct DOM manipulation for editor highlights
  const updateEditorHighlights = useCallback((colIndex: number, rowIndex: number) => {
    if (!tableRef.current) return;

    // Update column editors in thead - they correspond to table columns
    const columnEditorCells = tableRef.current.querySelectorAll('thead th[data-tool-cell]');
    columnEditorCells.forEach((cell, index) => {
      const trigger = cell.querySelector('.tableColumnEditorTrigger');
      if (trigger) {
        trigger.setAttribute('data-active', (index === colIndex).toString());
      }
    });

    // Update row editors in tbody - first cell of each row contains the row editor
    const rowEditorCells = tableRef.current.querySelectorAll('tbody .toolCell');
    rowEditorCells.forEach((cell, index) => {
      const trigger = cell.querySelector('.tableColumnEditorTrigger');
      if (trigger) {
        trigger.setAttribute('data-active', (index === rowIndex).toString());
      }
    });

    // Also update header row editor (index 0)
    const headerRowEditor = tableRef.current.querySelector('tbody tr:first-child .toolCell .tableColumnEditorTrigger');
    if (headerRowEditor) {
      headerRowEditor.setAttribute('data-active', (rowIndex === 0).toString());
    }
  }, []);

  const onTableMouseOver = useMemo(
    () =>
      throttle((e: MouseEvent<HTMLTableElement>) => {
        let tableCell = e.target as HTMLElement | null;

        while (
          tableCell &&
          ![CELL_TYPE_HEADER.toUpperCase(), CELL_TYPE_DATA.toUpperCase()].includes(tableCell.tagName)
        ) {
          if (tableCell === e.currentTarget) {
            return;
          }
          tableCell = tableCell.parentElement;
        }

        if (tableCell === null) {
          return;
        }

        // Skip tool cells - they are not data cells
        if (tableCell.hasAttribute('data-tool-cell')) {
          return;
        }

        const tableRow = tableCell.parentElement!;
        const tableContainer = tableRow.parentElement!;

        // Skip thead and tfoot - they contain tool cells, not data cells
        if (tableContainer.tagName === 'THEAD' || tableContainer.tagName === 'TFOOT') {
          return;
        }

        // Use filtered index to exclude tool cells from column count
        const colIndex = getDataCellIndex(tableCell, tableRow);
        // Get row index within tbody
        const rowIndex = Array.from(tableContainer.children).indexOf(tableRow);

        const newCoordinates: CellCoordinates = [colIndex, rowIndex];
        setHighlightedCoordinates(newCoordinates);
        updateEditorHighlights(colIndex, rowIndex);
      }, THROTTLE_DELAY),
    [updateEditorHighlights]
  );

  useEffect(() => () => onTableMouseOver.cancel(), [onTableMouseOver]);

  const onTableMouseLeave = useCallback(() => {
    setHighlightedCoordinates(INACTIVE_CELL_COORDINATES);
    updateEditorHighlights(-1, -1);
  }, [updateEditorHighlights]);

  return {
    highlightedCoordinates,
    onTableMouseLeave,
    onTableMouseOver,
    selectors,
    tableRef,
  };
}
