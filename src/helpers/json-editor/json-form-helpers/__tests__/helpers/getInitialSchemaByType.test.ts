import {getInitialSchemaByType} from '@/helpers/json-editor';
import {TSchema, TSchemaObjectType} from '@/types/common';

describe('/src/helpers/json-editor/helpers.ts/getInitialSchemaByType', () => {
  const testCases: Array<{
    type: TSchemaObjectType;
    expected: TSchema;
    description: string;
  }> = [
    {
      type: 'string',
      expected: {type: 'string'},
      description: 'string type',
    },
    {
      type: 'number',
      expected: {type: 'number'},
      description: 'number type',
    },
    {
      type: 'boolean',
      expected: {type: 'boolean'},
      description: 'boolean type',
    },
    {
      type: 'object',
      expected: {type: 'object'},
      description: 'object type',
    },
    {
      type: 'array',
      expected: {type: 'array', items: {type: 'string'}},
      description: 'array type',
    },
    {
      type: 'dictionary',
      expected: {type: 'object', additionalProperties: {type: 'string'}},
      description: 'dictionary type',
    },
  ];

  test.each(testCases)('should return correct schema for $description', ({expected, type}) => {
    // Arrange
    // (Test cases are already arranged above)

    // Act
    const result = getInitialSchemaByType(type);

    // Assert
    expect(result).toEqual(expected);
  });

  test('should return schema with unknown type as-is', () => {
    // Arrange
    const unknownType = 'unknown' as unknown as TSchemaObjectType;
    const expected = {type: unknownType};

    // Act
    const result = getInitialSchemaByType(unknownType);

    // Assert
    expect(result).toEqual(expected);
  });
});
