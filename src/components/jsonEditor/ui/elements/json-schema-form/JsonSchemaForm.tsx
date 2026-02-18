import { CaretDownOutlined } from '@ant-design/icons';
import { NodeSkeleton, Tree } from '@axenix/ui-kit';
import { useUnit } from 'effector-react';
import { ReactNode, useEffect, useState } from 'react';

import './JsonSchemaForm.css';
import { JsonSchemaFormRow } from '@/components/jsonEditor/ui/elements/json-schema-form/JsonSchemaFormRow';
import { isSchemaObject, parseOpenapi } from '@/helpers/json-editor';
import { $eventGraph, editEvent } from '@/models/EventGraphModel';
import { $selectedMenuItem } from '@/models/JsonEditorModel';
import { TSchema } from '@/types/common';

import { DrawerEditFormRow } from '../modals/DrawerEditFormRow/DrawerEditFormRow';

interface IJsonSchemaFormProps {
  schema: string;
}

interface ITreeNode {
  title: ReactNode;
  key: string;
  children?: ITreeNode[];
}

export const JsonSchemaForm = ({ schema }: IJsonSchemaFormProps) => {
  const currentEvent = useUnit($selectedMenuItem);
  const eventGraph = useUnit($eventGraph);
  const selectedEventData = eventGraph?.events?.find(el => el?.id === currentEvent?.id);

  const [jsonSchema, setJsonSchema] = useState<TSchema | null>(null);

  useEffect(() => {
    if (schema) {
      const parsedSchema = parseOpenapi(schema);
      if (parsedSchema) {
        setJsonSchema(parsedSchema);
      }
    }
  }, [schema]);

  if (!jsonSchema) {
    return (
      <>
        <NodeSkeleton data-testid="json-tree-loading" className="h-[100px] w-full" isActive />
        <DrawerEditFormRow />
      </>
    );
  }

  const handleSchemaUpdate = (updatedSchema: TSchema) => {
    const eventId = selectedEventData?.id;
    if (eventId) {
      editEvent({ id: eventId, updates: { schema: JSON.stringify(updatedSchema, null, 2) } });
    }
  };

  const renderTreeNodes = (schemaObj: TSchema, parentPath = ''): ITreeNode[] => {
    if (!schemaObj || !isSchemaObject(schemaObj) || !schemaObj.properties) {
      return [];
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

  return (
    <>
      <Tree
        isSelectable={false}
        defaultExpandedKeys={['root']}
        treeData={treeData}
        isBlockNode
        switcherIcon={<CaretDownOutlined />}
      />

      <DrawerEditFormRow />
    </>
  );
};
