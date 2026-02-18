import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalNestedComposer } from '@lexical/react/LexicalNestedComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { mergeRegister } from '@lexical/utils';
import {
  codeBlockEditorDescriptors$,
  directiveDescriptors$,
  exportVisitors$,
  importMdastTreeToLexical,
  importVisitors$,
  jsxComponentDescriptors$,
  jsxIsAvailable$,
  lexicalTheme,
  nestedEditorChildren$,
  useCellValues,
  usedLexicalNodes$,
} from '@mdxeditor/editor';
import {
  $getRoot,
  BLUR_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_EDITOR,
  createEditor,
  KEY_ENTER_COMMAND,
  KEY_TAB_COMMAND,
} from 'lexical';
import { FC, memo, useEffect, useRef, useState } from 'react';

import { useCellSave } from '../hooks/useCellSave';
import type { CellProps } from '../types/types';

const CellEditor: FC<
  Pick<CellProps, 'colIndex' | 'contents' | 'lexicalTable' | 'parentEditor' | 'rowIndex' | 'store'>
> = ({ colIndex, contents, lexicalTable, parentEditor, rowIndex, store }) => {
  const [
    importVisitors,
    exportVisitors,
    usedLexicalNodes,
    jsxComponentDescriptors,
    directiveDescriptors,
    codeBlockEditorDescriptors,
    jsxIsAvailable,
    nestedEditorChildren,
  ] = useCellValues(
    importVisitors$,
    exportVisitors$,
    usedLexicalNodes$,
    jsxComponentDescriptors$,
    directiveDescriptors$,
    codeBlockEditorDescriptors$,
    jsxIsAvailable$,
    nestedEditorChildren$
  );

  const exportVisitorsRef = useRef(exportVisitors);
  const jsxComponentDescriptorsRef = useRef(jsxComponentDescriptors);
  const jsxIsAvailableRef = useRef(jsxIsAvailable);

  useEffect(() => {
    exportVisitorsRef.current = exportVisitors;
    jsxComponentDescriptorsRef.current = jsxComponentDescriptors;
    jsxIsAvailableRef.current = jsxIsAvailable;
  }, [exportVisitors, jsxComponentDescriptors, jsxIsAvailable]);

  // Clean state initialization - только создание editor без side effects
  // FIX: Убрал side effects из useState initializer для совместимости с React Strict Mode
  const [editor] = useState(() =>
    createEditor({
      namespace: 'HtmlTableCellEditor',
      nodes: usedLexicalNodes,
      theme: lexicalTheme,
    })
  );

  // Ref для отслеживания импорта содержимого (предотвращение повторного импорта)
  const contentImportedRef = useRef(false);

  // Отдельный useEffect для импорта содержимого - proper separation of concerns
  useEffect(() => {
    if (contentImportedRef.current) {
      return;
    }

    editor.update(() => {
      importMdastTreeToLexical({
        codeBlockEditorDescriptors,
        directiveDescriptors,
        jsxComponentDescriptors,
        mdastRoot: { children: [{ children: contents, type: 'paragraph' }], type: 'root' },
        root: $getRoot(),
        visitors: importVisitors,
      });
    });

    contentImportedRef.current = true;
  }, [editor, contents, codeBlockEditorDescriptors, directiveDescriptors, jsxComponentDescriptors, importVisitors]);

  // CHECKME:
  // 1. возможно, имеет смысл передавать store в useCellSave и вызывать saveCell внутри него,
  // не вызовет ли нарушение ответственности
  // 2. передавать ID вместо индексов (чтобы не полагаться на то, что индексы не изменятся)

  const { saveCell } = useCellSave({
    colIndex,
    editor,
    exportVisitorsRef,
    jsxComponentDescriptorsRef,
    jsxIsAvailableRef,
    lexicalTable,
    parentEditor,
    rowIndex,
  });

  // CHECKME: Надо ли вынести регистрируемые команды в хук useCellCommands?
  useEffect(
    () =>
      mergeRegister(
        // Navigation: Tab moves horizontally
        editor.registerCommand(
          KEY_TAB_COMMAND,
          payload => {
            payload.preventDefault();
            const activeCell = store.getActive();
            if (activeCell) {
              saveCell();
              activeCell.move(payload.shiftKey ? 'left' : 'right');
            }
            // // CHECKME: возвращать результат вызова?
            // store.move(payload.shiftKey ? 'left' : 'right');
            return true;
          },
          COMMAND_PRIORITY_CRITICAL
        ),

        // Navigation: Enter moves vertically
        editor.registerCommand(
          KEY_ENTER_COMMAND,
          payload => {
            const activeCell = store.getActive();
            if (activeCell && payload) {
              saveCell();
              activeCell.move(payload.shiftKey ? 'left' : 'right');
            }

            // payload?.preventDefault();
            // saveCell();
            // store.move(payload?.shiftKey ? 'up' : 'down');
            return true;
          },
          COMMAND_PRIORITY_CRITICAL
        ),

        // Blur: save content (deactivation handled at table level)
        editor.registerCommand(
          BLUR_COMMAND,
          () => {
            saveCell();
            return true;
          },
          COMMAND_PRIORITY_EDITOR
        )
      ),
    [editor, saveCell, store]
  );

  useEffect(() => {
    // CellEditor рендерится только когда ячейка активна, поэтому всегда фокусируем
    editor.focus();
  }, [editor]);

  return (
    <LexicalNestedComposer initialEditor={editor}>
      <RichTextPlugin
        contentEditable={<ContentEditable />}
        ErrorBoundary={LexicalErrorBoundary}
        placeholder={<div />}
      />
      {nestedEditorChildren.map((Child, index) => (
        <Child key={Child.name || `nested-editor-${index}`} />
      ))}
      <HistoryPlugin />
    </LexicalNestedComposer>
  );
};

const MemoizedCellEditor = memo(CellEditor);
MemoizedCellEditor.displayName = 'CellEditor';

export default MemoizedCellEditor;
