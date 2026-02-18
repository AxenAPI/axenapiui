import { Button, Input, Space, Text } from '@axenix/ui-kit';
import { IconSquareRoundedLetterRFilled } from '@tabler/icons-react';
import clsx from 'clsx';
import { ChangeEvent, useEffect, useState } from 'react';
import { Copy, Edit, Plus, SquareRoundedLetterR, Trash } from 'tabler-icons-react';

import { JsonSchemaType } from '@/components/jsonEditor/ui/elements/json-schema-form/JsonSchemaType';
import { IS_READ_ONLY } from '@/constants/common';
import {
  getDeepUpdatedSchema,
  getIsFieldRequired,
  getPropertiesLength,
  getSchemaType,
  getSchemaWithUpdatedRequirement,
  getUpdatedSchemaWithDisabledRequirement,
  getUpdatedSchemaWithEnabledRequirement,
  isSchemaObject,
} from '@/helpers/json-editor';
import { TSchema, TSchemaObject } from '@/types/common';

import { $subTypeValue, passData, toggleDrawer } from '../../../model/EditFormRowModel';

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

  const isRequiredField = getIsFieldRequired(mainSchema as TSchemaObject, parentPath ?? '', propertyKey ?? '');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (IS_READ_ONLY) return;
    setPropertyKeyName(e.target.value);
  };

  const handleDelete = () => {
    if (!propertyKey || !parentPath) return;
    const newUpdated = getDeepUpdatedSchema(mainSchema, parentPath, element => {
      const tempElement = { ...element };
      delete tempElement[propertyKey];

      return { ...tempElement };
    });

    // Если поле было обязательным, то надо убрать его из списка обязательных
    const withDisabledRequirement = !isRequiredField
      ? newUpdated
      : getUpdatedSchemaWithDisabledRequirement(newUpdated as TSchemaObject, parentPath, propertyKey);

    onUpdateJsonSchema(withDisabledRequirement);
  };

  // Переключатель обязательности поля
  const handleToggleRequirement = () => {
    if (!propertyKey || !parentPath) return;
    if (isRequiredField) {
      onUpdateJsonSchema(getUpdatedSchemaWithDisabledRequirement(mainSchema as TSchemaObject, parentPath, propertyKey));
    } else {
      onUpdateJsonSchema(getUpdatedSchemaWithEnabledRequirement(mainSchema as TSchemaObject, parentPath, propertyKey));
    }
  };

  const handleUpdate = () => {
    if (!isSchema || IS_READ_ONLY) return;

    // Создаем обновленную вложенную схему с новым свойством
    const tempKey = `newProperty_${Date.now()}`;
    const updatedNestedSchema: TSchema = {
      ...jsonSchema,
      properties: {
        ...jsonSchema.properties,
        [tempKey]: { type: 'string' },
      },
    };

    // Если нет пути - обновляем корневую схему
    if (!parentPath) {
      onUpdateJsonSchema(updatedNestedSchema);
      return;
    }

    if (!propertyKey) return;

    // Обновляем главную схему по указанному пути
    const updatedMainSchema = getDeepUpdatedSchema(mainSchema, parentPath, element => ({
      ...element,
      [propertyKey]: updatedNestedSchema,
    }));

    onUpdateJsonSchema(updatedMainSchema);
  };

  const handleSave = () => {
    if (keyName === propertyKey || !keyName || !propertyKey || !mainSchema || !parentPath || IS_READ_ONLY) return;

    const getUpdatedElement = (element: Record<string, unknown>) => {
      // Создаем копию с обновленным ключом
      const { [propertyKey]: value, ...rest } = element;
      return {
        ...rest,
        [keyName]: value,
      };
    };

    const newUpdated = getDeepUpdatedSchema(mainSchema, parentPath, getUpdatedElement);

    // Если поле было обязательным, то надо также поменять его ключ в списке обязательных полей
    const schemaWithUpdatedRequirement = !isRequiredField
      ? newUpdated
      : getSchemaWithUpdatedRequirement(newUpdated as TSchemaObject, parentPath, propertyKey, keyName);

    onUpdateJsonSchema(schemaWithUpdatedRequirement);
  };

  const handleSaveDrawer = (formData: Record<string, string | undefined | boolean | unknown>) => {
    if (!jsonSchema || !mainSchema || IS_READ_ONLY) return;

    const { behavior, exclusiveMax, exclusiveMin, ...schemaProperties } = formData;
    const subTypeValue = $subTypeValue.getState();

    // 1. Начинаем с копии исходной схемы, чтобы безопасно ее изменять.
    const newSchemaState = { ...jsonSchema };
    // 2. Принудительно удаляем старые свойства поведения, чтобы избежать бага,
    // когда, например, readOnly: true остается в схеме после переключения на Read/Write.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (newSchemaState as Record<string, any>).readOnly;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (newSchemaState as Record<string, any>).writeOnly;

    // 3. Собираем остальные обновления из формы.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const schemaUpdate: Record<string, any> = { ...schemaProperties };

    if (subTypeValue && 'items' in schemaUpdate && typeof schemaUpdate.items === 'object' && schemaUpdate.items) {
      (schemaUpdate.items as { type: string }).type = subTypeValue;
    }

    // 4. Накатываем обновления из формы на очищенную схему.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updatedSchema: Record<string, any> = {
      ...newSchemaState,
      ...schemaUpdate,
    };

    // 5. Устанавливаем новое поведение, если оно не является дефолтным (пустой строкой).
    if (typeof behavior === 'string' && behavior) {
      updatedSchema[behavior] = true;
    }

    // Обрабатываем exclusiveMinimum
    if (exclusiveMin) {
      updatedSchema.exclusiveMinimum = updatedSchema.minimum;
      delete updatedSchema?.minimum;
    } else {
      delete updatedSchema.exclusiveMinimum;
    }

    if (exclusiveMax) {
      updatedSchema.exclusiveMaximum = updatedSchema.maximum;
      delete updatedSchema?.maximum;
    } else {
      delete updatedSchema.exclusiveMaximum;
    }

    // Очищаем undefined значения
    Object.keys(updatedSchema).forEach(key => {
      const item = updatedSchema[key];
      if (item !== 0 && !item) {
        delete updatedSchema[key];
      }
    });

    // Update the main schema
    if (parentPath && propertyKey) {
      const updatedMainSchema = getDeepUpdatedSchema(mainSchema, parentPath, element => ({
        ...element,
        [propertyKey]: updatedSchema,
      }));

      onUpdateJsonSchema(updatedMainSchema);
    } else {
      onUpdateJsonSchema(updatedSchema);
    }
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
    if (propertyKey) {
      setPropertyKeyName(propertyKey);
    }
  }, [propertyKey]);

  return (
    <div className={clsx(className, 'hover-container flex justify-between')}>
      {renderField()}
      <Space className="hover-buttons flex">
        {/* TODO добавить события на клик */}
        <Button size="small" icon={<Copy size={14} />} type="text" className="hover-only !px-0" name="copy" />
        {!IS_READ_ONLY && (
          <Button
            size="small"
            icon={<Edit size={14} />}
            type="text"
            className="hover-only !px-0"
            name="edit"
            onClick={() => {
              passData({ property: propertyKey, onSave: handleSaveDrawer, ...jsonSchema });
              toggleDrawer();
            }}
          />
        )}
        {propertyKey && !IS_READ_ONLY && (
          <>
            <Button
              size="small"
              icon={isRequiredField ? <IconSquareRoundedLetterRFilled size={14} /> : <SquareRoundedLetterR size={14} />}
              type="text"
              className="!px-0"
              name="up"
              onClick={handleToggleRequirement}
            />

            <Button
              size="small"
              icon={<Trash size={14} />}
              type="text"
              className="!px-0"
              name="delete"
              onClick={handleDelete}
            />
          </>
        )}
      </Space>
    </div>
  );
};
