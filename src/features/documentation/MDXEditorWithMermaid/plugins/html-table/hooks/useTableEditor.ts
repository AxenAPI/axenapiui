import { iconComponentFor$, useCellValues, useTranslation } from '@mdxeditor/editor';
import { FocusEvent, useCallback, useEffect, useMemo } from 'react';

import type { HtmlTableEditorProps } from '../types/types';

import { createTableCellStore } from './useTableCellStore';
import { useTableHighlight } from './useTableHighlight';
import { useTableOperations } from './useTableOperations';

/**
 * Single responsibility hook that coordinates all table editor logic.
 * Follows Uncle Bob's "Clean Code" principles - simple, focused, testable.
 */
export function useTableEditor({ lexicalTable, parentEditor, tableData }: HtmlTableEditorProps) {
  const [iconComponentFor] = useCellValues(iconComponentFor$);
  const t = useTranslation();

  // The store is memoized and recreated if tableData changes.
  const store = useMemo(
    () =>
      createTableCellStore({
        lexicalTable,
        parentEditor,
        tableData,
      }),
    [lexicalTable, parentEditor, tableData]
  );

  // Update store config when any dependency changes
  useEffect(() => {
    store.updateConfig({
      lexicalTable,
      parentEditor,
      tableData,
    });
  }, [lexicalTable, parentEditor, store, tableData]);

  // Subscribe to focusEmitter for external focus requests (coordinates-based)
  useEffect(() => {
    lexicalTable.focusEmitter.subscribe(store.navigateToCoords);
    return () => {
      lexicalTable.focusEmitter.unsubscribe();
    };
  }, [lexicalTable, store]);

  // Table highlight functionality
  const highlight = useTableHighlight();

  // Table operations (add/delete columns/rows)
  const operations = useTableOperations(parentEditor, lexicalTable, store);

  // Focus management
  const handleTableBlur = useCallback(
    (event: FocusEvent<HTMLTableElement>) => {
      const relatedTarget = event.relatedTarget as HTMLElement | null;

      // If focus moved to another element inside the table, ignore
      if (relatedTarget && highlight.tableRef.current?.contains(relatedTarget)) {
        return;
      }

      // Real focus loss - deactivate cell
      store.clearActiveCell();
    },
    [store, highlight.tableRef]
  );

  // Event handlers for table
  const tableHandlers = useMemo(
    () => ({
      onBlur: handleTableBlur,
      onMouseLeave: highlight.onTableMouseLeave,
      onMouseOver: highlight.onTableMouseOver,
    }),
    [handleTableBlur, highlight.onTableMouseLeave, highlight.onTableMouseOver]
  );

  return {
    // State
    store: {
      ...store,
      lexicalTable,
      parentEditor,
    },
    highlightedCoordinates: highlight.highlightedCoordinates,
    tableRef: highlight.tableRef,

    // Operations
    ...operations,

    // Handlers
    tableHandlers,

    // Utils
    iconComponentFor,
    t,
  };
}

export type TableEditorLogic = ReturnType<typeof useTableEditor>;
