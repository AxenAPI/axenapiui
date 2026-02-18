import type { LexicalEditor } from 'lexical';
import { useCallback } from 'react';

import { HEADER_ROW_INDEX } from '../types/constants';
import type { HtmlRawTableNode } from '../ui/HtmlRawTableNode';

import type { TableCellStore } from './useTableCellStore';

const toBodyRowIndex = (rowIndex: number): number => rowIndex - HEADER_ROW_INDEX - 1;

export function useRowOperations(
  parentEditor: LexicalEditor,
  lexicalTable: HtmlRawTableNode,
  rowIndex: number,
  store: TableCellStore
) {
  const handleInsertAbove = useCallback(() => {
    parentEditor.update(() => {
      const bodyRowIndex = toBodyRowIndex(rowIndex);
      lexicalTable.insertRowAt(bodyRowIndex);
    });
    // Navigate after update - store will rebuild maps with new cell IDs
    queueMicrotask(() => {
      // CHECKME: опять вычисляем фокус, перенести в store
      store.navigateToCoords([0, rowIndex]);
    });
  }, [lexicalTable, parentEditor, rowIndex, store]);

  const handleInsertBelow = useCallback(() => {
    parentEditor.update(() => {
      const bodyRowIndex = toBodyRowIndex(rowIndex + 1);
      lexicalTable.insertRowAt(bodyRowIndex);
    });
    // Navigate after update - store will rebuild maps with new cell IDs
    queueMicrotask(() => {
      store.navigateToCoords([0, rowIndex + 1]);
    });
  }, [lexicalTable, parentEditor, rowIndex, store]);

  const handleDelete = useCallback(() => {
    parentEditor.update(() => {
      const bodyRowIndex = toBodyRowIndex(rowIndex);
      lexicalTable.deleteRowAt(bodyRowIndex);
    });
  }, [lexicalTable, parentEditor, rowIndex]);

  return { handleDelete, handleInsertAbove, handleInsertBelow };
}
