import { exportLexicalTreeToMdast } from '@mdxeditor/editor';
import { $getRoot, type LexicalEditor } from 'lexical';
import type * as Mdast from 'mdast';
import { RefObject, useCallback } from 'react';

import type { HtmlRawTableNode } from '../ui/HtmlRawTableNode';

interface UseCellSaveParams {
  colIndex: number;
  editor: LexicalEditor;
  exportVisitorsRef: RefObject<unknown>;
  jsxComponentDescriptorsRef: RefObject<unknown>;
  jsxIsAvailableRef: RefObject<boolean>;
  lexicalTable: HtmlRawTableNode;
  parentEditor: LexicalEditor;
  rowIndex: number;
}

/**
 * Hook that provides a function to save the current cell's content.
 * Separated from navigation to follow Single Responsibility Principle.
 */
export const useCellSave = ({
  colIndex,
  editor,
  exportVisitorsRef,
  jsxComponentDescriptorsRef,
  jsxIsAvailableRef,
  lexicalTable,
  parentEditor,
  rowIndex,
}: UseCellSaveParams) => {
  const saveCell = useCallback(() => {
    editor.getEditorState().read(() => {
      const mdast = exportLexicalTreeToMdast({
        jsxComponentDescriptors: jsxComponentDescriptorsRef.current,
        jsxIsAvailable: jsxIsAvailableRef.current,
        root: $getRoot(),
        visitors: exportVisitorsRef.current,
      });

      parentEditor.update(
        () => {
          const firstChild = mdast.children[0];
          const cellContent = firstChild?.type === 'paragraph' ? (firstChild as Mdast.Paragraph).children : [];
          lexicalTable.updateCellContents(colIndex, rowIndex, cellContent);
        },
        { discrete: true }
      );
    });
  }, [
    colIndex,
    editor,
    exportVisitorsRef,
    jsxComponentDescriptorsRef,
    jsxIsAvailableRef,
    lexicalTable,
    parentEditor,
    rowIndex,
  ]);

  return { saveCell };
};
