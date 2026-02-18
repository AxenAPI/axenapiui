import { CodeBlockEditorProps, useCodeBlockEditorContext } from '@mdxeditor/editor';
import { FC, ReactNode, useEffect, useRef } from 'react';

import { DiagramBlock } from '@/components/commons/editors/DiagramBlock';
import { DEFAULT_PLANTUML_CODE } from '@/constants/diagramTemplates';
import { encodePlantUML } from '@/utils/plantumlEncode';

type PlantUMLBlockEditorProps = CodeBlockEditorProps & {
  isCanEdit?: boolean;
};

const renderPlantUML = async (code: string): Promise<ReactNode> => {
  const encoded = await encodePlantUML(code);
  const txtUrl = `https://www.plantuml.com/plantuml/txt/~1${encoded}`;
  const txtRes = await fetch(txtUrl);
  const txt = await txtRes.text();

  if (txt.includes('Error') || txt.includes('Syntax Error')) {
    throw new Error('Invalid syntax');
  }

  const svgUrl = `https://www.plantuml.com/plantuml/svg/~1${encoded}`;
  return <img src={svgUrl} alt="PlantUML Diagram" style={{ maxWidth: '100%', display: 'block' }} />;
};

export const PlantUMLBlockEditor: FC<PlantUMLBlockEditorProps> = ({ isCanEdit = false, ...props }) => {
  const { setCode } = useCodeBlockEditorContext();
  const isInitRef = useRef(true);
  // Применяем шаблон, если code пустой в новом блоке
  useEffect(() => {
    if (!props.code?.trim() && isInitRef.current) {
      setCode(DEFAULT_PLANTUML_CODE);
    }
    isInitRef.current = false;
  }, [props.code, setCode, isInitRef]);

  return (
    <DiagramBlock
      code={props.code}
      type="plantuml"
      renderDiagram={renderPlantUML}
      setCode={setCode}
      isCanEdit={isCanEdit}
    />
  );
};
