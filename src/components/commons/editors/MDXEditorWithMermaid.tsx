import {
  codeBlockPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
  frontmatterPlugin,
  headingsPlugin,
  imagePlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  MDXEditorMethods,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
} from '@mdxeditor/editor';
import {useUnit} from 'effector-react';
import mermaid from 'mermaid';
import {useCallback, useEffect, useRef} from 'react';

import '@mdxeditor/editor/style.css';

import {emptyCodeBlockDescriptor} from '@/components/commons/editors/EmptyBlockEditor';
import {mermaidCodeBlockDescriptor, plantumlCodeBlockDescriptor} from '@/constants/mermaid';
import {useDebouncedSave} from '@/hocs/useDebounceSave';
import {$documentationBreadcrumbs, $repoPath} from '@/models/DocumentationModel';
import {
  $dirty,
  $fullPath,
  $markdown,
  $relativePathForMR,
  dirtyChanged,
  fullPathChanged,
  markdownChanged,
  relativePathForMRChanged,
} from '@/models/SaveFileModel';

import {CustomKitchenSinkToolbar} from './CustomKitchenSinkToolbar';

mermaid.initialize({startOnLoad: false});

export const MDXEditorWithMermaid = () => {
  const repoPath = useUnit($repoPath);
  const breadcrumbs = useUnit($documentationBreadcrumbs);
  const relativePathForDownload = useUnit($relativePathForMR);
  const fullPath = useUnit($fullPath);
  const markdown = useUnit($markdown);
  const isDirty = useUnit($dirty);
  const editorRef = useRef<MDXEditorMethods | null>(null);

  const relativePath = breadcrumbs.map(crumb => crumb.title).join('\\');
  relativePathForMRChanged(breadcrumbs.map(crumb => crumb.title).join('/'));
  fullPathChanged(`${repoPath + relativePath}.md`);

  const handleMarkdownChange = useCallback((newMarkdown: string) => {
    markdownChanged(newMarkdown);
    dirtyChanged(true);
  }, []);

  useEffect(() => {
    async function loadFileFromBreadcrumbs() {
      if (!breadcrumbs.length) return;
      if (!relativePath) return;
      try {
        const result = await window.electronAPI.readFile(fullPath);
        if (result.success) {
          markdownChanged(result.content || '');
          editorRef.current?.setMarkdown(result.content || '');
        }
      } catch (error) {
        console.error('Ошибка вызова IPC:', error);
      }
    }
    loadFileFromBreadcrumbs();
  }, [breadcrumbs, fullPath, relativePath, repoPath]);

  useDebouncedSave(fullPath, relativePathForDownload, markdown, isDirty);

  return (
    <div className="flex h-[600px] w-full flex-col px-6 pb-6">
      <MDXEditor
        className="prose dark:prose-invert w-full flex-1 overflow-y-auto border-none"
        ref={editorRef}
        plugins={[
          // eslint-disable-next-line react/no-unstable-nested-components
          toolbarPlugin({toolbarContents: () => <CustomKitchenSinkToolbar />}),
          listsPlugin(),
          quotePlugin(),
          headingsPlugin({allowedHeadingLevels: [1, 2, 3]}),
          linkPlugin(),
          linkDialogPlugin(),
          imagePlugin({
            imageAutocompleteSuggestions: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
          }),
          tablePlugin(),
          thematicBreakPlugin(),
          frontmatterPlugin(),
          codeBlockPlugin({
            defaultCodeBlockLanguage: 'text',
            codeBlockEditorDescriptors: [
              emptyCodeBlockDescriptor,
              mermaidCodeBlockDescriptor,
              plantumlCodeBlockDescriptor,
            ],
          }),
          codeMirrorPlugin({
            codeBlockLanguages: {
              js: 'JavaScript',
              css: 'CSS',
              txt: 'text',
              tsx: 'TypeScript',
              mermaid: 'Mermaid',
              plantuml: 'PlantUML',
              empty: '',
            },
          }),
          diffSourcePlugin({viewMode: 'rich-text', diffMarkdown: 'boo'}),
          markdownShortcutPlugin(),
        ]}
        markdown={markdown}
        onChange={newMarkdown => handleMarkdownChange(newMarkdown)}
      />
    </div>
  );
};
