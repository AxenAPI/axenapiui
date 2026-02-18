import { MDXEditorMethods } from '@mdxeditor/editor';
import { useUnit } from 'effector-react';
import { useCallback, useEffect, useRef } from 'react';

import { editButtonModel } from '@features/documentation/EditButton';
import { CODE_BLOCK_LANGUAGES } from '@features/documentation/MDXEditorWithMermaid/constants/codeBlockLanguages';
import { normalizeCodeBlocks } from '@features/documentation/MDXEditorWithMermaid/utils/normalizeCodeBlocks';
import { normalizeHtmlTags } from '@features/documentation/MDXEditorWithMermaid/utils/normalizeHtmlTags';

import { ElectronService } from '@shared/electron/api';

import { CustomKitchenSinkToolbar } from '@/components/commons/editors/CustomKitchenSinkToolbar/CustomKitchenSinkToolbar';

import { documentStateModel } from '../model/documentState.model';
import { editorModel } from '../model/editor.model';

export const useEditor = () => {
  const { editorKey, isEditing, isLoading, markdownContent } = useUnit({
    markdownContent: documentStateModel.stores.$markdown,
    editorKey: documentStateModel.stores.$fullPath,
    isEditing: editButtonModel.stores.$isEditing,
    isLoading: documentStateModel.stores.$isLoading,
  });

  // Формируем стабильный ключ: используем путь только когда документ загружен
  const stableKey = isLoading ? 'loading' : editorKey;

  const editorRef = useRef<MDXEditorMethods | null>(null);
  const initializedKeyRef = useRef<string | null>(null);

  // Нормализуем один раз при инициализации (на каждый новый stableKey)
  useEffect(() => {
    if (!editorRef.current || isLoading || initializedKeyRef.current === stableKey) return;
    initializedKeyRef.current = stableKey;

    let normalized = normalizeHtmlTags(markdownContent);
    normalized = normalizeCodeBlocks(normalized, CODE_BLOCK_LANGUAGES);

    if (normalized !== markdownContent) {
      if (editorRef.current) editorRef.current.setMarkdown(normalized);
      documentStateModel.events.markdownChanged(normalized);
    }
  }, [stableKey, markdownContent, isLoading]);

  const handleMarkdownChange = useCallback((newMarkdown: string) => {
    documentStateModel.events.markdownChanged(newMarkdown);
    documentStateModel.events.dirtyChanged(true);
  }, []);

  const handleMarkdownBlur = useCallback(() => {
    editorModel.events.markdownBlurred();
    // Нормализуем только при потере фокуса (в т.ч. при переключении режима)
    const current = editorRef.current?.getMarkdown?.();
    if (current) {
      let normalized = normalizeHtmlTags(current);
      normalized = normalizeCodeBlocks(normalized, CODE_BLOCK_LANGUAGES);

      if (normalized !== current) {
        if (editorRef.current) editorRef.current.setMarkdown(normalized);
        documentStateModel.events.markdownChanged(normalized);
      }
    }
    documentStateModel.events.dirtyChanged(true);
  }, []);

  const toolbarContents = useCallback(
    () => <CustomKitchenSinkToolbar key={stableKey} editorRef={editorRef} />,
    [stableKey, editorRef]
  );

  const handleReadOnlyClickLinkCallback = (event: MouseEvent, url: string) => {
    event.preventDefault();

    if (url.startsWith('http')) {
      ElectronService.openUrl(url);
    } else {
      documentStateModel.events.internalLinkClicked(url);
    }
  };

  return {
    markdown: markdownContent,
    handleMarkdownChange,
    editorKey: stableKey,
    toolbarContents,
    editorRef,
    handleMarkdownBlur,
    isEditing,
    isLoading,
    handleReadOnlyClickLinkCallback,
  };
};
