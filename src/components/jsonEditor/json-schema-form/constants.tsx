import {TSchemaObjectType} from '@/types/common';

/**
 * Массив допустимых типов данных для OpenAPI схем.
 */
export const TYPE_OPTIONS: TSchemaObjectType[] = [
  'array',
  'boolean',
  'integer',
  'object',
  'number',
  'string',
  'dictionary',
];

/**
 * Маппинг цвета для типов данных OpenAPI.
 */
export const COLOR_BY_TYPE: Record<TSchemaObjectType, string> = {
  array: '#008F3E',
  boolean: '#D48806',
  integer: '#CF1322',
  object: '#0958D9',
  number: '#C41D7F',
  string: '#08979C',
  dictionary: '#CC5012',
};
