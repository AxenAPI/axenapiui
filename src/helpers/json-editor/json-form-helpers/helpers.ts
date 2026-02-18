import get from 'lodash/get';
import set from 'lodash/set';

import { logger } from '@shared/lib/logger';

import { COLOR_BY_TYPE } from '@/components/jsonEditor/constants';
import { TSchema, type TSchemaObject, TSchemaObjectType } from '@/types/common';

/**
 * Проверяет, является ли объект схемой (TSchemaObject), а не ссылочным объектом (TReferenceObject).
 */
export function isSchemaObject(obj: TSchema): obj is TSchemaObject {
  if (!obj) return false;

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
 * TODO: "схема может не прийти, или кривой быть" - лучше вынести валидацию и обработку ошибок на уровень выше
 */
export const getSchemaType = (jsonSchema: TSchema | undefined | null): TSchemaObjectType | string | undefined => {
  if (!jsonSchema) {
    return undefined;
  }

  if (isSchemaObject(jsonSchema) && jsonSchema.type) {
    return jsonSchema.type;
  }

  if ('$ref' in jsonSchema && jsonSchema.$ref) {
    return getRefName(jsonSchema.$ref);
  }

  return undefined;
};

/**
 * Возвращает цветовой код (HEX) для заданного типа схемы.
 * Используется для визуального выделения различных типов данных в интерфейсе.
 */
export const getColorByType = (type: TSchemaObjectType): string => COLOR_BY_TYPE[type] || '#000000';

/**
 * Возвращает количество свойств в объекте JSON-схемы.
 */
export const getPropertiesLength = (jsonSchema: TSchema | null | undefined) => {
  if (!jsonSchema) return null;

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
    return getColorByType(jsonSchema.type as TSchemaObjectType);
  }

  return '#000000';
};

/**
 *  Возвращает начальную схему JSON Schema в зависимости от указанного типа
 */
export const getInitialSchemaByType = (type: TSchemaObjectType): TSchema => {
  switch (type) {
    case 'array':
      return { type: 'array', items: { type: 'string' } };
    case 'dictionary':
      return { type: 'object', additionalProperties: { type: 'string' } };
    default:
      return { type };
  }
};

/**
 * Функция для глубокого обновления схемы. Рекурсивно проходится по исходной схеме по указанному пути
 * и применяетколлбек функцию обновления элемента к объекту последнего набора свойств.
 * Не изменяет изначальную схему, но возвращает обновленную копию.
 *
 * @param {TSchema} schema Начальная схема
 * @param {string} path Путь к целевому свойству, которое требует изменений
 * @param {(current: Record<string, unknown>) => TSchema} getUpdatedElement Коллбек на изменение требуемого элемента
 */
export const getDeepUpdatedSchema = (
  schema: TSchema,
  path: string,
  getUpdatedElement: (current: Record<string, unknown>) => TSchema
): TSchema => {
  const pathParts = path.split('.');

  const updateSchema = (current: Record<string, unknown>, index = 0): TSchema => {
    if (index === pathParts.length - 1) {
      const currentKey = pathParts[index];
      if (!current[currentKey]) {
        logger.warn(`Property "${currentKey}" not found`);
        return current;
      }

      return getUpdatedElement(current);
    }

    const part = pathParts[index];
    return {
      ...current,
      [part]: updateSchema({ ...(current[part] as Record<string, unknown>) }, index + 1),
    };
  };

  return updateSchema({ ...schema });
};

/**
 * Возвращает путь до родительского элемента
 */
const getParentElementPath = (path: string) =>
  path
    .split('.')
    .toSpliced(path.split('.').length - 2)
    .join('.');

/**
 * Возвращает схему родительского элемента
 */
const getParentElement = (schema: TSchemaObject, path: string) => {
  const parentElementPath = getParentElementPath(path);

  return parentElementPath ? (get(schema, parentElementPath) as TSchemaObject) : schema;
};

export const getIsFieldRequired = (schema: TSchemaObject, path: string, propertyKey: string) => {
  // Обязательностью могут обладать только не корневые элементы схемы
  if (!path || !propertyKey) {
    return false;
  }

  const parentElement = getParentElement(schema, path);

  return parentElement.required && parentElement.required.includes(propertyKey);
};

export const getUpdatedSchemaWithEnabledRequirement = (schema: TSchemaObject, path: string, propertyKey: string) => {
  const parentElementPath = getParentElementPath(path);

  const parentElement = getParentElement(schema, path);

  // Формируем новый массив обязательных полей, если его еще не было, то создаем
  const newRequiredArray = parentElement.required ? [...parentElement.required, propertyKey] : [propertyKey];

  // Если поле и так уже обязательное, то возвращаем начальную схему
  if (getIsFieldRequired(schema, path, propertyKey)) {
    return schema;
  }

  // Если нет родительского пути, значит родитель - root. Обновляем его напрямую
  if (!parentElementPath) {
    return { ...schema, required: newRequiredArray };
  }

  // В других случаях обновляем нужный нам элемент.
  return set({ ...schema }, parentElementPath, { ...parentElement, required: newRequiredArray });
};

export const getUpdatedSchemaWithDisabledRequirement = (schema: TSchemaObject, path: string, propertyKey: string) => {
  const parentElementPath = getParentElementPath(path);

  const parentElement = getParentElement(schema, path);

  // Вспомогательная функция для получения обновленного элемента
  // Если в списке обязательности осталось только одно поле, то удаляем весь ключ required
  // В противном случае фильтруем список обязательных полей
  const getNewElement = () => {
    const newElement = { ...parentElement };

    if (parentElement.required?.length === 1) {
      delete newElement.required;
    } else {
      newElement.required = newElement.required?.filter(key => key !== propertyKey);
    }

    return newElement;
  };

  // Если поле и так уже не обязательное, то возвращаем начальную схему
  if (!getIsFieldRequired(schema, path, propertyKey)) {
    return schema;
  }

  // Если нет родительского пути, значит родитель - root. Обновляем его напрямую
  if (!parentElementPath) {
    return getNewElement();
  }

  // В других случаях обновляем нужный нам элемент.
  return set({ ...schema }, parentElementPath, getNewElement());
};

export const getSchemaWithUpdatedRequirement = (
  schema: TSchemaObject,
  path: string,
  oldKey: string,
  newKey: string
) => {
  const shemaWithAddedRequirement = getUpdatedSchemaWithEnabledRequirement(schema, path, newKey);

  return getUpdatedSchemaWithDisabledRequirement(shemaWithAddedRequirement, path, oldKey);
};
