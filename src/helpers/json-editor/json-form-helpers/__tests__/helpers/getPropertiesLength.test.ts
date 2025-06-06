import {getPropertiesLength} from '@/helpers/json-editor';
import {TSchema} from '@/types/common';

describe('/src/helpers/json-editor/helpers.ts/getPropertiesLength', () => {
  test('should return null for undefined/null input', () => {
    // Arrange
    // (No specific arrangement needed for simple cases)

    // Act & Assert
    expect(getPropertiesLength(undefined)).toBeNull();
    expect(getPropertiesLength(null)).toBeNull();
  });

  test('should return null for non-object schemas', () => {
    // Arrange
    const refSchema = {$ref: '#/components/schemas/User'};
    const stringSchema: TSchema = {type: 'string'};
    const numberSchema: TSchema = {type: 'number'};

    // Act & Assert
    expect(getPropertiesLength(refSchema)).toBeNull();
    expect(getPropertiesLength(stringSchema)).toBeNull();
    expect(getPropertiesLength(numberSchema)).toBeNull();
  });

  test('should return null for schema objects without properties', () => {
    // Arrange
    const emptyObjectSchema: TSchema = {type: 'object'};
    const additionalPropsSchema: TSchema = {type: 'object', additionalProperties: true};

    // Act & Assert
    expect(getPropertiesLength(emptyObjectSchema)).toBeNull();
    expect(getPropertiesLength(additionalPropsSchema)).toBeNull();
  });

  test('should return correct count for schema objects with properties', () => {
    // Arrange
    const singlePropSchema: TSchema = {
      type: 'object',
      properties: {name: {type: 'string'}},
    };
    const multiPropSchema: TSchema = {
      type: 'object',
      properties: {
        id: {type: 'number'},
        name: {type: 'string'},
        active: {type: 'boolean'},
      },
    };

    // Act & Assert
    expect(getPropertiesLength(singlePropSchema)).toBe(1);
    expect(getPropertiesLength(multiPropSchema)).toBe(3);
  });

  test('should handle empty properties object', () => {
    // Arrange
    const emptyPropertiesSchema: TSchema = {
      type: 'object',
      properties: {},
    };

    // Act & Assert
    expect(getPropertiesLength(emptyPropertiesSchema)).toBe(0);
  });

  test('should ignore additionalProperties when counting', () => {
    // Arrange
    const schemaWithAdditionalProps: TSchema = {
      type: 'object',
      properties: {id: {type: 'number'}},
      additionalProperties: true,
    };

    // Act & Assert
    expect(getPropertiesLength(schemaWithAdditionalProps)).toBe(1);
  });

  test('should handle complex nested schemas correctly', () => {
    // Arrange
    const nestedSchema: TSchema = {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {name: {type: 'string'}},
        },
      },
    };

    // Act & Assert
    expect(getPropertiesLength(nestedSchema)).toBe(1);
  });
});
