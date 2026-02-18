import { $createParagraphNode, type LexicalEditor } from 'lexical';
import { useSyncExternalStore } from 'react';

import { logger } from '@shared/lib/logger';

import type { CellCoordinates, HtmlTableData, NavigationDirection } from '../types/types';
import type { HtmlRawTableNode } from '../ui/HtmlRawTableNode';

type Listener = () => void;

/** Key for coordinate lookup: "col,row" */
type CoordsKey = string;

const coordsToKey = (coords: CellCoordinates): CoordsKey => `${coords[0]},${coords[1]}`;

export interface TableStoreConfig {
  lexicalTable: HtmlRawTableNode;
  parentEditor: LexicalEditor;
  tableData: HtmlTableData;
}

export interface TableCellStore {
  /** Clear active cell */
  clearActiveCell: () => void;
  /** Get current active cell ID */
  getActiveCellId: () => string | null;
  /** Get active cell as monadic wrapper */
  getActive: () => {
    move: (direction: NavigationDirection) => void;
  } | null;
  /** Move from current active cell in a direction */
  move: (direction: NavigationDirection) => void;
  /** Navigate to specific cell by ID */
  navigateTo: (cellId: string | null) => void;
  /** Navigate to cell by coordinates (for external focus requests) */
  navigateToCoords: (coords: CellCoordinates | null) => void;
  /** Subscribe to store changes */
  subscribe: (listener: Listener) => () => void;
  /** Update table config (call when tableData changes) */
  updateConfig: (config: TableStoreConfig) => void;
}

/**
 * Builds lookup maps from tableData for cell navigation.
 */
function buildCellMaps(tableData: HtmlTableData) {
  const cellIdToCoords = new Map<string, CellCoordinates>();
  const coordsToCellId = new Map<CoordsKey, string>();

  // Header row (rowIndex = 0)
  tableData.headerRow.cells.forEach((cell, colIndex) => {
    const coords: CellCoordinates = [colIndex, 0];
    cellIdToCoords.set(cell.id, coords);
    coordsToCellId.set(coordsToKey(coords), cell.id);
  });

  // Body rows (rowIndex = 1, 2, ...)
  tableData.bodyRows.forEach((row, bodyRowIndex) => {
    const rowIndex = bodyRowIndex + 1;
    row.cells.forEach((cell, colIndex) => {
      const coords: CellCoordinates = [colIndex, rowIndex];
      cellIdToCoords.set(cell.id, coords);
      coordsToCellId.set(coordsToKey(coords), cell.id);
    });
  });

  return { cellIdToCoords, coordsToCellId };
}

/**
 * Creates a store for managing active cell state.
 * Each table instance should have its own store.
 */
export function createTableCellStore(initialConfig: TableStoreConfig): TableCellStore {
  let activeCellId: string | null = null;
  let config = initialConfig;
  let { cellIdToCoords, coordsToCellId } = buildCellMaps(initialConfig.tableData);
  const listeners = new Set<Listener>();

  const getColCount = () => config.tableData.columns.length;
  const getRowCount = () => config.tableData.bodyRows.length + 1;

  const emitChange = () => {
    listeners.forEach(listener => listener());
  };

  const exitTableDown = () => {
    config.parentEditor.update(() => {
      const nextSibling = config.lexicalTable.getLatest().getNextSibling();
      if (nextSibling) {
        config.lexicalTable.getLatest().selectNext();
      } else {
        const newParagraph = $createParagraphNode();
        config.lexicalTable.insertAfter(newParagraph);
        newParagraph.select();
      }
    });
  };

  const exitTableUp = () => {
    config.parentEditor.update(() => {
      config.lexicalTable.getLatest().selectPrevious();
    });
  };

  const navigateToCoords = (coords: CellCoordinates | null) => {
    if (coords === null) {
      activeCellId = null;
      emitChange();
      return;
    }

    let [colIndex, rowIndex] = coords;
    const colCount = getColCount();
    const rowCount = getRowCount();

    // Horizontal overflow: wrap to next/previous row
    if (colIndex >= colCount) {
      colIndex = 0;
      rowIndex += 1;
    } else if (colIndex < 0) {
      colIndex = colCount - 1;
      rowIndex -= 1;
    }

    // Vertical overflow: exit table
    if (rowIndex >= rowCount) {
      activeCellId = null;
      emitChange();
      exitTableDown();
      return;
    }

    if (rowIndex < 0) {
      activeCellId = null;
      emitChange();
      exitTableUp();
      return;
    }

    const cellId = coordsToCellId.get(coordsToKey([colIndex, rowIndex]));
    if (cellId) {
      activeCellId = cellId;
      emitChange();
    }
  };

  const getNextCellCoordinates = (direction: string, colIndex: number, rowIndex: number) => {
    let nextCoords: CellCoordinates;

    switch (direction) {
      case 'left':
        nextCoords = [colIndex - 1, rowIndex];
        break;
      case 'right':
        nextCoords = [colIndex + 1, rowIndex];
        break;
      case 'up':
        nextCoords = [colIndex, rowIndex - 1];
        break;
      case 'down':
        nextCoords = [colIndex, rowIndex + 1];
        break;
      default:
        nextCoords = [0, 0];
        logger.warn(`Unknown navigation direction: ${direction}`);
    }
    return nextCoords;
  };

  const move = (direction: NavigationDirection) => {
    if (activeCellId === null) {
      return;
    }

    const coords = cellIdToCoords.get(activeCellId);
    if (!coords) {
      return;
    }

    const [colIndex, rowIndex] = coords;
    const nextCoords: CellCoordinates = getNextCellCoordinates(direction, colIndex, rowIndex);

    navigateToCoords(nextCoords);
  };

  const navigateTo = (cellId: string | null) => {
    if (cellId === null) {
      activeCellId = null;
      emitChange();
      return;
    }

    // Verify cellId exists in current table
    if (cellIdToCoords.has(cellId)) {
      activeCellId = cellId;
      emitChange();
    }
  };

  return {
    clearActiveCell: () => {
      activeCellId = null;
      emitChange();
    },

    getActiveCellId: () => activeCellId,

    getActive: () => {
      const cellId = activeCellId;
      if (cellId === null) {
        return null;
      }
      return {
        move: (direction: NavigationDirection) => {
          const coords = cellIdToCoords.get(cellId);
          if (!coords) {
            return;
          }
          const [colIndex, rowIndex] = coords;
          const nextCoords: CellCoordinates = getNextCellCoordinates(direction, colIndex, rowIndex);
          navigateToCoords(nextCoords);
        },
      };
    },

    move,

    navigateTo,

    navigateToCoords,

    subscribe: (listener: Listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    updateConfig: (newConfig: TableStoreConfig) => {
      config = newConfig;
      // Rebuild maps when table structure changes
      const maps = buildCellMaps(newConfig.tableData);
      cellIdToCoords = maps.cellIdToCoords;
      coordsToCellId = maps.coordsToCellId;

      // If active cell was deleted, clear it
      if (activeCellId && !cellIdToCoords.has(activeCellId)) {
        activeCellId = null;
        emitChange();
      }
    },
  };
}

/**
 * Hook to check if a specific cell is active by ID.
 * Uses useSyncExternalStore with a selector - only re-renders when THIS cell's active state changes.
 */
export function useIsCellActive(store: TableCellStore, cellId: string): boolean {
  return useSyncExternalStore(
    store.subscribe,
    () => store.getActiveCellId() === cellId,
    () => false // Server snapshot for SSR
  );
}

/**
 * Hook to get active cell ID.
 * Re-renders on any activeCell change - use sparingly.
 */
export function useActiveCellId(store: TableCellStore): string | null {
  return useSyncExternalStore(
    store.subscribe,
    store.getActiveCellId,
    () => null // Server snapshot for SSR
  );
}
