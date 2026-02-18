import { Button, Menu, Popover, TextArea } from '@axenix/ui-kit';
import { useCodeBlockEditorContext } from '@mdxeditor/editor';
import { FC, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { Dots, X } from 'tabler-icons-react';

import { DiagramEmpty, DiagramError } from '@/components/commons/editors/DiagramRenderer';
import { DEFAULT_MERMAID_CODE, DEFAULT_PLANTUML_CODE } from '@/constants/diagramTemplates';

interface DiagramBlockProps {
  code: string;
  isCanEdit?: boolean;
  renderDiagram: (code: string) => Promise<ReactNode>;
  setCode: (code: string) => void;
  type: 'mermaid' | 'plantuml';
}

/**
 * Компонент для отображения блока с диаграммой с функцией редактирования и удаления
 */
export const DiagramBlock: FC<DiagramBlockProps> = ({ code, isCanEdit = true, renderDiagram, setCode, type }) => {
  const [content, setContent] = useState<ReactNode>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editCode, setEditCode] = useState(code);
  const debouncedSave = useRef<NodeJS.Timeout | null>(null);

  // Синхронизация editCode при изменении внешнего code
  useEffect(() => {
    setEditCode(code);
  }, [code]);

  // Рендер диаграммы
  useEffect(() => {
    const text = code?.trim();
    if (!text) {
      const msg =
        type === 'mermaid'
          ? 'Для работы с диаграммой Mermaid нужно перейти в режим редактирования'
          : 'Для работы с диаграммой PlantUML нужно перейти в режим редактирования';
      setContent(<DiagramEmpty message={msg} />);
      return;
    }

    renderDiagram(text)
      .then(setContent)
      .catch(() =>
        setContent(
          <DiagramError
            message={`Ошибка валидации диаграммы, возможно из-за некорректного синтаксиса ${type.toUpperCase()}, попробуйте отредактировать`}
          />
        )
      );
  }, [code, type, renderDiagram]);

  const { lexicalNode, parentEditor } = useCodeBlockEditorContext();

  const handleEdit = () => {
    if (!isCanEdit) return;
    if (!code?.trim()) {
      const template = type === 'mermaid' ? DEFAULT_MERMAID_CODE : DEFAULT_PLANTUML_CODE;
      setCode(template);
      setEditCode(template);
    }
    setIsEditing(true);
  };

  const handleDelete = () => {
    parentEditor.update(() => {
      lexicalNode.remove();
    });
  };

  const handleCodeChange = useCallback(
    (newCode: string) => {
      setEditCode(newCode);
      if (debouncedSave.current) {
        clearTimeout(debouncedSave.current);
      }
      debouncedSave.current = setTimeout(() => {
        setCode(newCode);
      }, 300);
    },
    [setCode]
  );

  useEffect(
    () => () => {
      if (debouncedSave.current) {
        clearTimeout(debouncedSave.current);
      }
    },
    []
  );

  useEffect(() => {
    if (!isCanEdit && isEditing) {
      setIsEditing(false);
    }
  }, [isCanEdit, isEditing]);

  return (
    <div className="diagram-edit-container">
      {isCanEdit && !isEditing && (
        <Popover
          placement="bottomLeft"
          content={
            <Menu
              items={[
                {
                  key: 'edit',
                  label: 'Редактировать',
                  onClick: handleEdit,
                },
                {
                  key: 'del',
                  label: 'Удалить',
                  onClick: handleDelete,
                },
              ]}
              style={{ maxWidth: '100%', borderRight: 'none' }}
            />
          }
          trigger="click"
        >
          <Button icon={<Dots />} />
        </Popover>
      )}

      {isEditing && (
        <div className="diagram-content diagram-editor">
          <Button
            tooltip="Закрыть"
            style={{ position: 'absolute', top: '8px', right: '8px', zIndex: '1' }}
            onClick={() => setIsEditing(false)}
            icon={<X />}
          />
          <div className="diagram-content__area">
            <TextArea
              autoSize={{ minRows: 2, maxRows: 10 }}
              value={editCode}
              placeholder={`Введите код диаграммы ${type}...`}
              onChange={e => handleCodeChange(e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="diagram-content">{content}</div>
    </div>
  );
};
