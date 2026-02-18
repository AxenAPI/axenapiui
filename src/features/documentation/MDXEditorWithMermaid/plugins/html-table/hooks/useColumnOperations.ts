import type { LexicalEditor } from 'lexical';
import { useCallback } from 'react';

import { logger } from '@shared/lib/logger';

import { HEADER_ROW_INDEX } from '../types/constants';
import type { HtmlAlignType } from '../types/types';
import { isValidAlignment } from '../types/types';
import type { HtmlRawTableNode } from '../ui/HtmlRawTableNode';

import type { TableCellStore } from './useTableCellStore';

export function useColumnOperations(
  parentEditor: LexicalEditor,
  lexicalTable: HtmlRawTableNode,
  colIndex: number,
  store: TableCellStore
) {
  const handleInsertLeft = useCallback(() => {
    parentEditor.update(() => {
      lexicalTable.insertColumnAt(colIndex);
    });
    // Navigate after update - store will rebuild maps with new cell IDs
    queueMicrotask(() => {
      // CHECKME: опять вычисляем фокус, перенести в store
      store.navigateToCoords([colIndex, HEADER_ROW_INDEX]);
    });
  }, [colIndex, lexicalTable, parentEditor, store]);

  const handleInsertRight = useCallback(() => {
    parentEditor.update(() => {
      lexicalTable.insertColumnAt(colIndex + 1);
    });
    // Navigate after update - store will rebuild maps with new cell IDs
    queueMicrotask(() => {
      store.navigateToCoords([colIndex + 1, HEADER_ROW_INDEX]);
    });
  }, [colIndex, lexicalTable, parentEditor, store]);

  const handleDelete = useCallback(() => {
    parentEditor.update(() => {
      lexicalTable.deleteColumnAt(colIndex);
    });
  }, [colIndex, lexicalTable, parentEditor]);

  const handleAlignChange = useCallback(
    (value: string) => {
      if (!isValidAlignment(value)) {
        // CHECKME: возможность unset ?
        logger.warn(`Invalid alignment value: ${value}`);
        return;
      }
      parentEditor.update(() => {
        lexicalTable.setColumnAlign(colIndex, value as HtmlAlignType);
      });
    },
    [colIndex, lexicalTable, parentEditor]
  );

  return { handleAlignChange, handleDelete, handleInsertLeft, handleInsertRight };
}
