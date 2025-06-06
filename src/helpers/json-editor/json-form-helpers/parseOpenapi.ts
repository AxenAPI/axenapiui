import {TSchema, TSchemaObject} from '@/types/common';

// Функция для удаления структур oneOf, anyOf, allOf
export function removeUnionSchemas(schema: TSchema): TSchema {
  if ('$ref' in schema) {
    return schema;
  }

  // Создаём поверхностную копию, чтобы не изменять оригинальный объект
  const {anyOf, oneOf, ...schemaObject} = schema;

  // Обрабатываем элементы массива
  if ('items' in schemaObject && schemaObject.items) {
    schemaObject.items = removeUnionSchemas(schemaObject.items);
  }

  // Обрабатываем свойства объекта (заменили for на Object.fromEntries)
  if ('properties' in schemaObject && schemaObject.properties) {
    schemaObject.properties = Object.fromEntries(
      Object.entries(schemaObject.properties).map(([key, value]) => [key, removeUnionSchemas(value)])
    );
  }

  // Обрабатываем дополнительные свойства
  if (
    'additionalProperties' in schemaObject &&
    typeof schemaObject.additionalProperties === 'object' &&
    schemaObject.additionalProperties !== null
  ) {
    schemaObject.additionalProperties = removeUnionSchemas(schemaObject.additionalProperties);
  }

  // Обрабатываем allOf путём объединения схем (заменили for на reduce)
  if ('allOf' in schemaObject && schemaObject.allOf) {
    const mergedSchema = schemaObject.allOf.reduce((acc, subSchema) => {
      const processed = removeUnionSchemas(subSchema);
      if (!('$ref' in processed)) {
        Object.assign(acc, processed);
      }
      return acc;
    }, {} as TSchemaObject);

    // Объединяем с родительской схемой (исключая allOf)
    const {...rest} = schemaObject;
    return {...mergedSchema, ...rest};
  }

  // Обрабатываем объединённые схемы (anyOf/oneOf), беря первый вариант
  const unionOptions = anyOf || oneOf;
  if (unionOptions && unionOptions.length > 0) {
    const firstOption = removeUnionSchemas(unionOptions[0]);

    if ('$ref' in firstOption) {
      return firstOption;
    }

    return {
      ...firstOption,
      ...schemaObject,
    };
  }

  return schemaObject;
}

export function parseOpenapi(schema: string): TSchema {
  try {
    // Код на случай если будет необходимость парсить $ref в схеме
    // import SwaggerParser from '@apidevtools/swagger-parser';
    // NOTE: Библиотека swagger-parser кидает ошибку если нет поля paths
    // const parsedSchema = JSON.parse(schema);
    // const hasPaths = Object.prototype.hasOwnProperty.call(parsedSchema, 'paths');
    // const fileWithPaths = hasPaths ? parsedSchema : {...parsedSchema, paths: {}};
    // const options = {
    //   resolve: {
    //     http: false,
    //     file: false,
    //     external: false
    //   }
    // };
    // const schema = await SwaggerParser.dereference(fileWithPaths, options);
    // const cleanSchema = removeUnionSchemas(schema);
    // return cleanSchema;

    const parsedSchema = JSON.parse(schema);

    return removeUnionSchemas(parsedSchema);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error parsing OpenAPI schema:', err);
  }
}
