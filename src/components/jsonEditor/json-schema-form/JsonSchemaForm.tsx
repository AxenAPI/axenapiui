// Импорт из antd, т.к. с tabler-icons-react не работает поворот
import {CaretDownOutlined} from '@ant-design/icons';
import {NodeSkeleton, Tree} from '@axenix/ui-kit';
import {useUnit} from 'effector-react';
import React, {useEffect, useState} from 'react';

import './JsonSchemaForm.css';
import {JsonSchemaFormRow} from '@/components/jsonEditor/json-schema-form/JsonSchemaFormRow';
import {isSchemaObject, parseOpenapi} from '@/helpers/json-editor';
import {$eventGraph, editEvent} from '@/models/EventGraphModel';
import {$selectedMenuItem} from '@/models/JsonEditorModel';
import {TSchema} from '@/types/common';

interface IJsonSchemaFormProps {
  schema: string;
}

interface ITreeNode {
  title: React.ReactNode;
  key: string;
  children?: ITreeNode[];
}

export const JsonSchemaForm = ({schema}: IJsonSchemaFormProps) => {
  const currentEvent = useUnit($selectedMenuItem);
  const eventGraph = useUnit($eventGraph);
  // Отобранный эвент из графа на основе выбранного эвента.
  const selectedEventData = eventGraph?.events?.find(el => el?.id === currentEvent?.id);

  const [jsonSchema, setJsonSchema] = useState<TSchema | null>(null);

  const handleSchemaUpdate = (updatedSchema: TSchema) => {
    console.log('updatedSchema', updatedSchema);
    editEvent({id: selectedEventData?.id, updates: {schema: JSON.stringify(updatedSchema, null, 2)}});
  };

  const renderTreeNodes = (schemaObj: TSchema, parentPath = ''): ITreeNode[] | null => {
    if (!schemaObj || !isSchemaObject(schemaObj) || !schemaObj.properties) {
      return null;
    }

    return Object.entries(schemaObj.properties).map(([propertyKey, propertySchema]) => {
      const currentPath = parentPath ? `${parentPath}.properties.${propertyKey}` : `properties.${propertyKey}`;

      const hasChildren =
        isSchemaObject(propertySchema) &&
        propertySchema.type === 'object' &&
        propertySchema.properties &&
        Object.keys(propertySchema.properties).length > 0;

      return {
        title: (
          <JsonSchemaFormRow
            jsonSchema={propertySchema}
            mainSchema={jsonSchema}
            propertyKey={propertyKey}
            parentPath={`${currentPath}`}
            onUpdateJsonSchema={handleSchemaUpdate}
          />
        ),
        key: currentPath,
        children: hasChildren ? renderTreeNodes(propertySchema, currentPath) : undefined,
      };
    });
  };

  const treeData: ITreeNode[] = [
    {
      title: (
        <JsonSchemaFormRow mainSchema={jsonSchema} jsonSchema={jsonSchema} onUpdateJsonSchema={handleSchemaUpdate} />
      ),
      key: 'root',
      children: isSchemaObject(jsonSchema) ? renderTreeNodes(jsonSchema) : undefined,
    },
  ];

  useEffect(() => {
    if (schema) {
      setJsonSchema(parseOpenapi(schema));
    }
  }, [schema]);

  return jsonSchema ? (
    <Tree
      isSelectable={false}
      defaultExpandedKeys={['root']}
      treeData={treeData}
      isBlockNode
      switcherIcon={<CaretDownOutlined />}
    />
  ) : (
    <NodeSkeleton data-testid="json-tree-loading" className="h-[100px] w-full" isActive />
  );
};
