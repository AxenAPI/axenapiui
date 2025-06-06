import {getRefName} from '@/helpers/json-editor';

describe('/src/helpers/json-editor/helpers.ts/getRefName', () => {
  test('should extract model name from standard OpenAPI reference path', () => {
    // Arrange
    const schemaRef = '#/components/schemas/ModelName';
    const paramRef = '#/components/parameters/ParamName';
    const responseRef = '#/components/responses/ResponseName';

    // Act & Assert
    expect(getRefName(schemaRef)).toBe('ModelName');
    expect(getRefName(paramRef)).toBe('ParamName');
    expect(getRefName(responseRef)).toBe('ResponseName');
  });

  test('should work with paths without hash symbol', () => {
    // Arrange
    const refPath = '/components/schemas/ModelName';

    // Act & Assert
    expect(getRefName(refPath)).toBe('ModelName');
  });

  test('should work with minimal path', () => {
    // Arrange
    const bareName = 'ModelName';
    const slashPrefix = '/ModelName';
    const hashPrefix = '#ModelName';

    // Act & Assert
    expect(getRefName(bareName)).toBe('ModelName');
    expect(getRefName(slashPrefix)).toBe('ModelName');
    expect(getRefName(hashPrefix)).toBe('ModelName');
  });

  test('should throw error for empty path', () => {
    // Arrange
    const emptyPath = '';
    const hashSlash = '#/';
    const multipleSlashes = '///';

    // Act & Assert
    expect(() => getRefName(emptyPath)).toThrow('Invalid reference path: ');
    expect(() => getRefName(hashSlash)).toThrow('Invalid reference path: #/');
    expect(() => getRefName(multipleSlashes)).toThrow('Invalid reference path: ///');
  });

  test('should handle paths with multiple slashes', () => {
    // Arrange
    const messySchemaRef = '#//components//schemas//ModelName';
    const messyBareRef = '////ModelName';

    // Act & Assert
    expect(getRefName(messySchemaRef)).toBe('ModelName');
    expect(getRefName(messyBareRef)).toBe('ModelName');
  });
});
