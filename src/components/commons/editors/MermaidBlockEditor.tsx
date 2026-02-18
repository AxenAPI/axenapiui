import { CodeBlockEditorProps, useCodeBlockEditorContext } from '@mdxeditor/editor';
import mermaid from 'mermaid';
import { FC, ReactNode, useEffect, useRef } from 'react';

import { DiagramBlock } from '@/components/commons/editors/DiagramBlock';
import { DEFAULT_MERMAID_CODE } from '@/constants/diagramTemplates';

import { SafeSVG } from './SafeSVG';

type MermaidBlockEditorProps = CodeBlockEditorProps & {
  isCanEdit?: boolean;
};

const renderMermaid = async (code: string): Promise<ReactNode> => {
  const id = `mermaid-${Date.now()}`;
  const { svg } = await mermaid.render(id, code);
  return <SafeSVG svgString={svg} />;
};

export const MermaidBlockEditor: FC<MermaidBlockEditorProps> = ({ isCanEdit = false, ...props }) => {
  const { setCode } = useCodeBlockEditorContext();
  const isInitRef = useRef(true);
  // Применяем шаблон, если code пустой в новом блоке
  useEffect(() => {
    if (!props.code?.trim() && isInitRef.current) {
      setCode(DEFAULT_MERMAID_CODE);
    }
    isInitRef.current = false;
  }, [props.code, setCode, isInitRef]);

  return (
    <DiagramBlock
      code={props.code}
      type="mermaid"
      renderDiagram={renderMermaid}
      setCode={setCode}
      isCanEdit={isCanEdit}
    />
  );
};
