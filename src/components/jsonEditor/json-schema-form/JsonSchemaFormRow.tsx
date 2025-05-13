import {Button, Input, Space, Text} from '@axenix/ui-kit';
import clsx from 'clsx';
import React, {useEffect, useState} from 'react';
import {ArrowDown, ArrowUp, Copy, Edit, Plus, Trash} from 'tabler-icons-react';

import {JsonSchemaType} from '@/components/jsonEditor/json-schema-form/JsonSchemaType';
import {getPropertiesLength, getSchemaType, isSchemaObject} from '@/helpers/json-editor';
import {addOrUpdateNestedSchema} from '@/helpers/json-editor/json-form-helpers/addOrUpdateNestedSchema';
import {TSchema} from '@/types/common';

interface IJsonSchemaFormRowProps {
  jsonSchema: TSchema;
  mainSchema: TSchema;
  parentPath?: string;
  propertyKey?: string;
  onUpdateJsonSchema: (jsonSchema: TSchema) => void;
  className?: string;
}

export const JsonSchemaFormRow = ({
  className,
  jsonSchema,
  mainSchema,
  onUpdateJsonSchema,
  parentPath,
  propertyKey,
}: IJsonSchemaFormRowProps) => {
  const [keyName, setPropertyKeyName] = useState<string>(propertyKey ?? '');
  const isSchema = isSchemaObject(jsonSchema);
  const isObjectType = isSchema && getSchemaType(jsonSchema) === 'object';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPropertyKeyName(e.target.value);
  };

  const handleUpdate = () => {
    if (!isSchema) return;

    // Создаем обновленную вложенную схему с новым свойством
    const tempKey = `newProperty_${Date.now()}`;
    const updatedNestedSchema: TSchema = {
      ...jsonSchema,
      properties: {
        ...jsonSchema.properties,
        [tempKey]: {type: 'string'},
      },
    };

    // Если нет пути - обновляем корневую схему
    if (!parentPath) {
      onUpdateJsonSchema(updatedNestedSchema);
      return;
    }

    // Обновляем главную схему по указанному пути
    const pathParts = parentPath.split('.');
    const updatedMainSchema = addOrUpdateNestedSchema(mainSchema, updatedNestedSchema, pathParts);

    onUpdateJsonSchema(updatedMainSchema);
  };

  const handleSave = () => {
    if (keyName === propertyKey || !keyName || !propertyKey || !mainSchema || !parentPath) return;

    const pathParts = parentPath.split('.');
    if (pathParts.length === 0) return;

    // Рекурсивная функция для неизменяемого обновления
    const updateSchema = (current: Record<string, unknown>, path: string[], index = 0): TSchema => {
      if (index === path.length - 1) {
        const currentKey = path[index];
        if (!current[currentKey]) {
          console.warn(`Property "${propertyKey}" not found`);
          return current;
        }

        // Создаем копию с обновленным ключом
        const {[propertyKey]: value, ...rest} = current;
        return {
          ...rest,
          [keyName]: value,
        };
      }

      const part = path[index];
      return {
        ...current,
        [part]: updateSchema({...(current[part] as Record<string, unknown>)}, path, index + 1),
      };
    };

    const updatedSchema: TSchema = updateSchema({...mainSchema}, pathParts);
    onUpdateJsonSchema(updatedSchema);
  };

  const renderField = () => {
    if (propertyKey !== undefined) {
      return (
        <div className="flex h-[2.5rem] items-center gap-1">
          <Input
            value={keyName}
            onChange={handleChange}
            onBlur={handleSave}
            variant="borderless"
            className="field-sizing-content w-fit p-0"
            placeholder="name"
          />
          :
          <JsonSchemaType
            jsonSchema={jsonSchema}
            mainSchema={mainSchema}
            parentPath={parentPath}
            propertyKey={propertyKey}
            onUpdateJsonSchema={onUpdateJsonSchema}
          />
          {isObjectType && (
            <Button
              data-testid="property-add-btn"
              size="small"
              icon={<Plus size={16} />}
              type="text"
              className="min-h-4 min-w-4 !px-0"
              onClick={handleUpdate}
            />
          )}
        </div>
      );
    }

    return (
      <div className="flex h-[2.5rem] items-center gap-2">
        <div className="flex items-center gap-1">
          <JsonSchemaType
            jsonSchema={jsonSchema}
            mainSchema={mainSchema}
            parentPath={parentPath}
            propertyKey={propertyKey}
            onUpdateJsonSchema={onUpdateJsonSchema}
          />
          {isObjectType && <Text type="secondary">{`{${getPropertiesLength(jsonSchema)}}`}</Text>}
        </div>

        {isObjectType && (
          <Button
            data-testid="property-add-btn"
            size="small"
            icon={<Plus size={16} />}
            type="text"
            className="min-h-4 min-w-4 !px-0"
            onClick={handleUpdate}
          />
        )}
      </div>
    );
  };

  useEffect(() => {
    setPropertyKeyName(propertyKey);
  }, [propertyKey]);

  return (
    <div className={clsx(className, 'hover-container flex justify-between')}>
      {renderField()}
      <Space className="hover-buttons flex">
        {/* TODO добавить события на клик */}
        <Button size="small" icon={<ArrowDown size={14} />} type="text" className="!px-0" name="down" />
        <Button size="small" icon={<ArrowUp size={14} />} type="text" className="!px-0" name="up" />
        <Button size="small" icon={<Copy size={14} />} type="text" className="!px-0" name="copy" />
        <Button size="small" icon={<Edit size={14} />} type="text" className="!px-0" name="edit" />
        <Button size="small" icon={<Trash size={14} />} type="text" className="!px-0" name="delete" />
      </Space>
    </div>
  );
};
