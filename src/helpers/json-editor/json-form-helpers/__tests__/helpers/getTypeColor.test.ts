import {COLOR_BY_TYPE} from '@/components/jsonEditor/json-schema-form/constants';
import {getTypeColor} from '@/helpers/json-editor';
import {TSchema} from '@/types/common';

describe('/src/helpers/json-editor/helpers.ts/getTypeColor', () => {
  test('should return correct color for each schema type', () => {
    // Arrange
    const testCases = [
      {schema: {type: 'string'}, expected: COLOR_BY_TYPE.string},
      {schema: {type: 'number'}, expected: COLOR_BY_TYPE.number},
      {schema: {type: 'boolean'}, expected: COLOR_BY_TYPE.boolean},
      {schema: {type: 'object'}, expected: COLOR_BY_TYPE.object},
      {schema: {type: 'array'}, expected: COLOR_BY_TYPE.array},
      {schema: {type: 'null'}, expected: '#000000'},
      {schema: {type: 'unknown'}, expected: '#000000'},
      {schema: {}, expected: '#000000'},
    ];

    // Act & Assert
    testCases.forEach(({expected, schema}) => {
      expect(getTypeColor(schema as TSchema)).toBe(expected);
    });
  });

  test('should handle null/undefined schema', () => {
    // Arrange
    const defaultColor = '#000000';

    // Act & Assert
    expect(getTypeColor(null as unknown as TSchema)).toBe(defaultColor);
    expect(getTypeColor(undefined as unknown as TSchema)).toBe(defaultColor);
  });
});
