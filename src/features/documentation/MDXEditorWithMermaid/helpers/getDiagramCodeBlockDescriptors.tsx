import { CodeBlockEditorDescriptor, CodeBlockEditorProps } from '@mdxeditor/editor';
import { ReactElement } from 'react';

import { MermaidBlockEditor } from '@/components/commons/editors/MermaidBlockEditor';
import { PlantUMLBlockEditor } from '@/components/commons/editors/PlantumlBlockEditor';

const MERMAID_LANGUAGE = 'mermaid';
const PLANTUML_LANGUAGE = 'plantuml';

type DiagramEditorComponent = (props: CodeBlockEditorProps & { isCanEdit?: boolean }) => ReactElement;

export const getDiagramCodeBlockDescriptors = (isCanEdit: boolean): CodeBlockEditorDescriptor[] => {
  const withPermission = (EditorComponent: DiagramEditorComponent) => (props: CodeBlockEditorProps) => (
    <EditorComponent {...props} isCanEdit={isCanEdit} />
  );

  return [
    {
      priority: 100,
      match: language => language === MERMAID_LANGUAGE,
      Editor: withPermission(props => <MermaidBlockEditor {...props} />),
    },
    {
      priority: 100,
      match: language => language === PLANTUML_LANGUAGE,
      Editor: withPermission(props => <PlantUMLBlockEditor {...props} />),
    },
  ];
};
