import {getColorByType} from '@/helpers/json-editor';
import {TSchemaObjectType} from '@/types/common';

describe('/src/helpers/json-editor/helpers.ts/getColorByType', () => {
  test('should return correct color codes for known types', () => {
    // Arrange
    const testCases: Array<{type: TSchemaObjectType; expected: string}> = [
      {type: 'array', expected: '#008F3E'},
      {type: 'boolean', expected: '#D48806'},
      {type: 'integer', expected: '#CF1322'},
      {type: 'object', expected: '#0958D9'},
      {type: 'number', expected: '#C41D7F'},
      {type: 'string', expected: '#08979C'},
      {type: 'dictionary', expected: '#CC5012'},
    ];

    // Act & Assert
    testCases.forEach(({expected, type}) => {
      const result = getColorByType(type);
      expect(result).toBe(expected);
    });
  });

  test('should return black (#000000) for unknown types', () => {
    // Arrange
    const unknownType = 'unknown' as TSchemaObjectType;
    const expected = '#000000';

    // Act
    const result = getColorByType(unknownType);

    // Assert
    expect(result).toBe(expected);
  });

  test('should handle all defined TSchemaObjectType values without throwing', () => {
    // Arrange
    const allTypes: TSchemaObjectType[] = ['array', 'boolean', 'integer', 'object', 'number', 'string', 'dictionary'];

    // Act & Assert
    allTypes.forEach(type => {
      expect(() => getColorByType(type)).not.toThrow();
    });
  });
});
