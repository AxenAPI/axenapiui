import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  ChangeAdmonitionType,
  ChangeCodeMirrorLanguage,
  CodeToggle,
  ConditionalContents,
  ConditionalContentsOption,
  CreateLink,
  DirectiveNode,
  EditorInFocus,
  FallbackOption,
  InsertAdmonition,
  InsertFrontmatter,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
  MDXEditorMethods,
  Separator,
  ShowSandpackInfo,
  StrikeThroughSupSubToggles,
  UndoRedo,
} from '@mdxeditor/editor';
import { RefObject } from 'react';

import { InsertCodeBlockWithSelection } from '../InsertCodeBlockWithTextPlugin';

// Helper function moved from the main component
export function whenInAdmonition(editorInFocus: EditorInFocus | null): boolean {
  const node = editorInFocus?.rootNode;
  if (node?.getType() !== 'directive') {
    return false;
  }
  return ['note', 'tip', 'danger', 'info', 'caution'].includes((node as DirectiveNode).getMdastNode().name);
}

export const options = (editorRef: RefObject<MDXEditorMethods>): (ConditionalContentsOption | FallbackOption)[] => [
  { when: editor => editor?.editorType === 'codeblock', contents: () => <ChangeCodeMirrorLanguage /> },
  { when: editor => editor?.editorType === 'sandpack', contents: () => <ShowSandpackInfo /> },
  {
    fallback: () => (
      <>
        <UndoRedo />
        <Separator />
        <BoldItalicUnderlineToggles />
        <CodeToggle />
        <Separator />
        <StrikeThroughSupSubToggles />
        <Separator />
        <ListsToggle />
        <Separator />
        <ConditionalContents
          options={[
            { when: whenInAdmonition, contents: () => <ChangeAdmonitionType /> },
            { fallback: () => <BlockTypeSelect /> },
          ]}
        />
        <Separator />
        <CreateLink />
        <Separator />
        <InsertTable />
        <InsertThematicBreak />
        <Separator />
        <InsertCodeBlockWithSelection editorRef={editorRef} />
        <ConditionalContents
          options={[
            {
              when: editorInFocus => !whenInAdmonition(editorInFocus),
              contents: () => (
                <>
                  <Separator />
                  <InsertAdmonition />
                </>
              ),
            },
          ]}
        />
        <Separator />
        <InsertFrontmatter />
      </>
    ),
  },
];
