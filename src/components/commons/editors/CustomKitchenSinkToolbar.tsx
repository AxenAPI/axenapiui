/* eslint-disable react/no-unstable-nested-components */
import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  ChangeAdmonitionType,
  ChangeCodeMirrorLanguage,
  CodeToggle,
  ConditionalContents,
  CreateLink,
  DiffSourceToggleWrapper,
  DirectiveNode,
  EditorInFocus,
  InsertAdmonition,
  InsertCodeBlock,
  InsertFrontmatter,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
  Separator,
  ShowSandpackInfo,
  StrikeThroughSupSubToggles,
  UndoRedo,
} from '@mdxeditor/editor';
import React from 'react';

function whenInAdmonition(editorInFocus: EditorInFocus | null) {
  const node = editorInFocus?.rootNode;
  if (!node || node.getType() !== 'directive') {
    return false;
  }

  return ['note', 'tip', 'danger', 'info', 'caution'].includes((node as DirectiveNode).getMdastNode().name);
}

/**
    Компонент настройка над KitchenSinkToolbar. Из панели были исключены InsertImage и InsertSandpack
 */
export const CustomKitchenSinkToolbar: React.FC = () => (
  <DiffSourceToggleWrapper>
    <ConditionalContents
      options={[
        {when: editor => editor?.editorType === 'codeblock', contents: () => <ChangeCodeMirrorLanguage />},
        {when: editor => editor?.editorType === 'sandpack', contents: () => <ShowSandpackInfo />},
        {
          fallback: () => (
            <React.Fragment>
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
                  {when: whenInAdmonition, contents: () => <ChangeAdmonitionType />},
                  {fallback: () => <BlockTypeSelect />},
                ]}
              />

              <Separator />

              <CreateLink />

              <Separator />

              <InsertTable />
              <InsertThematicBreak />

              <Separator />
              <InsertCodeBlock />

              <ConditionalContents
                options={[
                  {
                    when: editorInFocus => !whenInAdmonition(editorInFocus),
                    contents: () => (
                      <React.Fragment>
                        <Separator />
                        <InsertAdmonition />
                      </React.Fragment>
                    ),
                  },
                ]}
              />

              <Separator />
              <InsertFrontmatter />
            </React.Fragment>
          ),
        },
      ]}
    />
  </DiffSourceToggleWrapper>
);
