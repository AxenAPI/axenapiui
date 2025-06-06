import {COLOR_BY_TYPE} from '@/components/jsonEditor/json-schema-form/constants';
import {TSchema, type TSchemaObject, TSchemaObjectType} from '@/types/common';

/**
 * Проверяет, является ли объект схемой (TSchemaObject), а не ссылочным объектом (TReferenceObject).
 */
export function isSchemaObject(obj: TSchema): obj is TSchemaObject {
  if (!obj) return;

  return !('$ref' in obj);
}

/**
 * Извлекает имя ссылки (reference name) из пути ссылки OpenAPI/Swagger.
 * Ожидает путь в формате '#/components/schemas/ModelName' или аналогичном
 * и возвращает последний сегмент пути (например, 'ModelName').
 */
export const getRefName = (refPath: string): string => {
  const segments = refPath.split(/[/#]/).filter(Boolean);

  if (segments.length === 0) {
    throw new Error(`Invalid reference path: ${refPath}`);
  }

  return segments[segments.length - 1];
};

/**
 * Возвращает тип свойства из JSON-схемы по ключу свойства.
 * Может вернуть как базовый тип (TSchemaObjectType), так и имя ссылки (string), если свойство является ссылкой ($ref).
 */
export const getSchemaType = (jsonSchema: TSchema): TSchemaObjectType | string => {
  if (!jsonSchema) return;

  if (isSchemaObject(jsonSchema) && jsonSchema.type) {
    return jsonSchema.type;
  }

  if ('$ref' in jsonSchema && jsonSchema.$ref) {
    return getRefName(jsonSchema.$ref);
  }
};

/**
 * Возвращает цветовой код (HEX) для заданного типа схемы.
 * Используется для визуального выделения различных типов данных в интерфейсе.
 */
export const getColorByType = (type: TSchemaObjectType): string => COLOR_BY_TYPE[type] || '#000000';

/**
 * Возвращает количество свойств в объекте JSON-схемы.
 */
export const getPropertiesLength = (jsonSchema: TSchema) => {
  if (!isSchemaObject(jsonSchema) || !jsonSchema?.properties) return null;

  return Object.keys(jsonSchema?.properties).length;
};

/**
 * Возвращает цвет для типа схемы или конкретного свойства схемы.
 * Если указан propertyKey - возвращает цвет типа этого свойства.
 * Если propertyKey не указан - возвращает цвет типа самой схемы.
 */
export const getTypeColor = (jsonSchema: TSchema): string => {
  if (isSchemaObject(jsonSchema)) {
    return getColorByType(jsonSchema.type);
  }

  return '#000000';
};

/**
 *  Возвращает начальную схему JSON Schema в зависимости от указанного типа
 */
export const getInitialSchemaByType = (type: TSchemaObjectType): TSchema => {
  switch (type) {
    case 'array':
      return {type: 'array', items: {type: 'string'}};
    case 'dictionary':
      return {type: 'object', additionalProperties: {type: 'string'}};
    default:
      return {type};
  }
};
