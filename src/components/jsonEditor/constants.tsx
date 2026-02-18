import { RadioOption } from '@/components/commons/buttons/RadioGroupButton';
import { TSchemaObjectType } from '@/types/common';

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
  // 'dictionary',
];
export const typeRadioOptions: RadioOption[] = TYPE_OPTIONS.filter(type => type !== 'array').map(type => ({
  value: type,
  label: type,
}));

export const behaviorOptions = [
  { value: '', label: 'Read/Write' },
  { value: 'readOnly', label: 'Read only' },
  { value: 'writeOnly', label: 'Write only' },
];

export const defaultBooleanOptions = [
  { value: true, label: 'True' },
  { value: false, label: 'False' },
];

export const formatStringOptions = [
  { value: 'email', label: 'Email' },
  { value: 'idn-email', label: 'IDN Email' },
  { value: 'hostname', label: 'Hostname' },
  { value: 'idn-hostname', label: 'IDN Hostname' },
  { value: 'ipv4', label: 'IPv4 Address' },
  { value: 'ipv6', label: 'IPv6 Address' },
  { value: 'uri', label: 'URI' },
  { value: 'uri-reference', label: 'URI Reference' },
  { value: 'iri', label: 'IRI' },
  { value: 'iri-reference', label: 'IRI Reference' },
  { value: 'uuid', label: 'UUID' },
  { value: 'uri-template', label: 'URI Template' },
  { value: 'json-pointer', label: 'JSON Pointer' },
  { value: 'relative-json-pointer', label: 'Relative JSON Pointer' },
  { value: 'regex', label: 'Regular Expression' },
  { value: 'date-time', label: 'Date Time' },
  { value: 'date', label: 'Date' },
  { value: 'time', label: 'Time' },
  { value: 'duration', label: 'Duration' },
];

export const formatIntegerOptions = [
  { value: 'int32', label: 'Int32' },
  { value: 'int64', label: 'Int64' },
];

export const formatNumberOptions = [
  { value: 'float', label: 'Float' },
  { value: 'double', label: 'Double' },
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
