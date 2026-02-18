import {
  AdmonitionDirectiveDescriptor,
  codeBlockPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
  directivesPlugin,
  frontmatterPlugin,
  headingsPlugin,
  imagePlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
} from '@mdxeditor/editor';
import { useUnit } from 'effector-react';
import mermaid from 'mermaid';
import { useEffect } from 'react';

import { emptyCodeBlockDescriptor } from '@/components/commons/editors/EmptyBlockEditor';
import '@mdxeditor/editor/style.css';

import { CODE_BLOCK_LANGUAGES } from '../constants/codeBlockLanguages';
import { getDiagramCodeBlockDescriptors } from '../helpers/getDiagramCodeBlockDescriptors';
import { useEditor } from '../hooks/useEditor';
import { editorModel } from '../model/editor.model';
import { htmlTablePlugin } from '../plugins/html-table';
import { formatParseError, isAutoFixableError } from '../utils/formatParseError';
import { normalizeCodeBlocks } from '../utils/normalizeCodeBlocks';
import { normalizeHtmlTags } from '../utils/normalizeHtmlTags';

import { ParseErrorNotification } from './ParseErrorNotification';

mermaid.initialize({ startOnLoad: false });

export const MDXEditorWithMermaid = () => {
  const {
    editorKey,
    editorRef,
    handleMarkdownBlur,
    handleMarkdownChange,
    handleReadOnlyClickLinkCallback,
    isEditing,
    isLoading,
    markdown,
    toolbarContents,
  } = useEditor();
  const parseError = useUnit(editorModel.stores.$parseError);

  const handleCloseError = () => {
    editorModel.events.errorReset();
  };

  // Скрываем встроенное сообщение об ошибке парсинга внутри редактора
  useEffect(() => {
    const hideBuiltInError = () => {
      const errorElements = document.querySelectorAll<HTMLElement>('[class*="markdownParseError"]');
      Array.from(errorElements).forEach(element => {
        element.setAttribute('style', 'display: none');
      });
    };

    hideBuiltInError();

    // MutationObserver для отслеживания динамического добавления элементов ошибок
    const observer = new MutationObserver(hideBuiltInError);

    const editorContainer = document.querySelector('.mdxeditor');
    if (editorContainer) {
      observer.observe(editorContainer, {
        childList: true,
        subtree: true,
      });
    }

    return () => observer.disconnect();
  }, [parseError]);

  if (isLoading) {
    return (
      <div className="flex w-full flex-col px-6 pb-6">
        <div className="flex h-64 items-center justify-center">
          <div className="text-gray-500">Загрузка документа...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col px-6 pb-6">
      {parseError && (
        <ParseErrorNotification message={parseError.message} type={parseError.type} onClose={handleCloseError} />
      )}
      <MDXEditor
        // Список плагинов зависит от режима редактирования и формируется при монтировании, так что меняем ключ
        key={`${editorKey}-${isEditing ? 'edit' : 'readonly'}`}
        readOnly={!isEditing}
        className="prose dark:prose-invert w-full flex-1 overflow-y-auto border-none"
        ref={editorRef}
        plugins={[
          ...(!isEditing
            ? []
            : [
                toolbarPlugin({
                  toolbarContents,
                }),
              ]),
          directivesPlugin({ directiveDescriptors: [AdmonitionDirectiveDescriptor] }),
          listsPlugin(),
          quotePlugin(),
          headingsPlugin({ allowedHeadingLevels: [1, 2, 3] }),
          linkPlugin(),
          linkDialogPlugin({
            onReadOnlyClickLinkCallback: (event, _, url) => {
              handleReadOnlyClickLinkCallback(event, url);
            },
          }),
          imagePlugin({
            imageAutocompleteSuggestions: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
          }),
          tablePlugin(),
          thematicBreakPlugin(),
          frontmatterPlugin(),
          codeBlockPlugin({
            defaultCodeBlockLanguage: CODE_BLOCK_LANGUAGES.text,
            codeBlockEditorDescriptors: [emptyCodeBlockDescriptor, ...getDiagramCodeBlockDescriptors(isEditing)],
          }),
          codeMirrorPlugin({
            codeBlockLanguages: CODE_BLOCK_LANGUAGES,
          }),
          diffSourcePlugin({ viewMode: 'rich-text', diffMarkdown: 'boo' }),
          markdownShortcutPlugin(),
          htmlTablePlugin(),
        ]}
        markdown={markdown}
        onChange={handleMarkdownChange}
        onBlur={handleMarkdownBlur}
        onError={({ error, source }) => {
          // --- Автоматическое исправление ---
          let fixed = normalizeHtmlTags(source);
          fixed = normalizeCodeBlocks(fixed, CODE_BLOCK_LANGUAGES);

          // Если нам удалось исправить контент (он изменился), применяем фикс.
          if (fixed !== source) {
            if (editorRef.current) {
              editorRef.current.setMarkdown(fixed);
            }
            // ВАЖНО: Мы НЕ показываем уведомление пользователю, если смогли исправить ошибку.
            // Пользователь просто увидит, что документ загрузился (возможно, с небольшими изменениями).
            return;
          }

          // Если исправить не удалось (или ошибка не в структуре), показываем оригинальную ошибку.
          const localizedError = formatParseError(error);
          const isAutoFixable = isAutoFixableError(error);

          editorModel.events.parseErrorOccurred({
            message: localizedError,
            type: isAutoFixable ? 'info' : 'error',
          });
        }}
      />
    </div>
  );
};
