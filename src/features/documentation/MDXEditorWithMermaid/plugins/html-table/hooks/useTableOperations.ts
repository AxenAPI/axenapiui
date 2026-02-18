import type { LexicalEditor } from 'lexical';
import { MouseEvent, useCallback } from 'react';

import { HEADER_ROW_INDEX } from '../types/constants';
import type { HtmlRawTableNode } from '../ui/HtmlRawTableNode';

import type { TableCellStore } from './useTableCellStore';

export function useTableOperations(parentEditor: LexicalEditor, lexicalTable: HtmlRawTableNode, store: TableCellStore) {
  const addColumnToRight = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      parentEditor.update(() => {
        lexicalTable.addColumnToRight();
      });
      // Navigate after update - store will rebuild maps with new cell IDs
      queueMicrotask(() => {
        // CHECKME: опять вычисляем фокус, перенести в store
        store.navigateToCoords([lexicalTable.getColCount() - 1, HEADER_ROW_INDEX]);
      });
    },
    [lexicalTable, parentEditor, store]
  );

  const addRowToBottom = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      parentEditor.update(() => {
        lexicalTable.addRowToBottom();
      });
      // Navigate after update - store will rebuild maps with new cell IDs
      queueMicrotask(() => {
        store.navigateToCoords([0, lexicalTable.getRowCount()]);
      });
    },
    [lexicalTable, parentEditor, store]
  );

  const deleteTable = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      parentEditor.update(() => {
        lexicalTable.selectNext();
        lexicalTable.remove();
      });
    },
    [lexicalTable, parentEditor]
  );

  return { addColumnToRight, addRowToBottom, deleteTable };
}
