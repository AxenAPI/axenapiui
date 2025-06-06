import {isSchemaObject} from '@/helpers/json-editor';
import {TSchema} from '@/types/common';

// TODO добавить тест
/**
 * // Функция для добавления или обновления вложенной схемы
 * @param schema - исходная рутовая схема
 * @param nestedSchema - новая вложенная схема
 * @param path - путь до обновления
 */
export function addOrUpdateNestedSchema(schema: TSchema, nestedSchema: TSchema, path: string[]): TSchema {
  if (!isSchemaObject(schema) || !isSchemaObject(nestedSchema)) {
    throw new Error('Root schema must be a SchemaObject, not a ReferenceObject');
  }

  // Рекурсивная функция для обхода и обновления схемы
  const updateSchema = (currentSchema: Record<string, unknown>, remainingPath: string[]): Record<string, unknown> => {
    if (remainingPath.length === 1) {
      const key = remainingPath[0];
      const existingValue = currentSchema[key];

      return {
        ...currentSchema, // Копируем текущий уровень
        [key]: existingValue
          ? {
              ...(existingValue as Record<string, unknown>), // Если значение есть - мерджим с новой схемой
              ...nestedSchema,
              properties: {
                // Мерджим свойства, чтобы не потерять существующие
                ...((existingValue as Record<string, unknown>)?.properties as Record<string, unknown>),
                ...nestedSchema?.properties,
              },
            }
          : nestedSchema,
      };
    }

    // Разбираем путь на текущий ключ и остаток
    const [currentKey, ...restPath] = remainingPath;
    const nextSchema = currentSchema[currentKey] || {}; // Берем следующую вложенность или пустой объект

    return {
      ...currentSchema,
      [currentKey]: updateSchema({...(nextSchema as Record<string, unknown>)}, restPath),
    };
  };

  return updateSchema({...schema}, path) as TSchema;
}
