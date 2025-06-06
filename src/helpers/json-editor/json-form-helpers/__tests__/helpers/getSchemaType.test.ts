import {getSchemaType} from '@/helpers/json-editor';
import {TSchema} from '@/types/common';

describe('/src/helpers/json-editor/helpers.ts/getSchemaType', () => {
  test('should return undefined for undefined/null schema', () => {
    // Act & Assert
    expect(getSchemaType(undefined)).toBeUndefined();
    expect(getSchemaType(null)).toBeUndefined();
  });

  test('should return undefined for empty schema object', () => {
    // Arrange
    const emptySchema = {};

    // Act & Assert
    expect(getSchemaType(emptySchema)).toBeUndefined();
  });

  test('should return type for schema object without $ref', () => {
    // Arrange
    const stringSchema: TSchema = {type: 'string'};
    const numberSchema: TSchema = {type: 'number'};
    const objectSchema: TSchema = {type: 'object', properties: {}};
    const arraySchema: TSchema = {type: 'array', items: {type: 'string'}};
    const booleanSchema: TSchema = {type: 'boolean'};

    // Act & Assert
    expect(getSchemaType(stringSchema)).toBe('string');
    expect(getSchemaType(numberSchema)).toBe('number');
    expect(getSchemaType(objectSchema)).toBe('object');
    expect(getSchemaType(arraySchema)).toBe('array');
    expect(getSchemaType(booleanSchema)).toBe('boolean');
  });

  test('should return ref name for schema with $ref property', () => {
    // Arrange
    const refSchema = {$ref: '#/components/schemas/User'};
    const refWithTypeSchema = {$ref: '#/components/schemas/User', type: 'object'};

    // Act & Assert
    expect(getSchemaType(refSchema)).toBe('User');
    expect(getSchemaType(refWithTypeSchema)).toBe('User');
  });

  test('should return undefined when schema has neither type nor $ref', () => {
    // Arrange
    const noTypeSchema = {description: 'Some schema'};

    // Act & Assert
    expect(getSchemaType(noTypeSchema)).toBeUndefined();
  });

  test('should handle edge cases for $ref values', () => {
    // Arrange
    // @ts-expect-error - testing invalid case
    const undefinedRefSchema = {$ref: undefined};
    // @ts-expect-error - testing invalid case
    const nullRefSchema = {$ref: null};
    const emptyRefSchema = {$ref: '', type: 'string'};

    // Act & Assert
    expect(getSchemaType(undefinedRefSchema)).toBeUndefined();
    expect(getSchemaType(nullRefSchema)).toBeUndefined();
    expect(getSchemaType(emptyRefSchema)).toBeUndefined();
  });
});
