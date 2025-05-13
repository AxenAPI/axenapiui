import {render, screen, fireEvent} from '@testing-library/react';

import {TSchema, TSchemaObject} from '@/types/common';

import {JsonSchemaFormRow} from '../JsonSchemaFormRow';

describe('/src/components/jsonEditor/json-schema-form/JsonSchemaFormRow', () => {
  const mockUpdateSchema = jest.fn();
  const mockMainSchema: TSchema = {type: 'object', properties: {}};

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should render basic type display for non-object root schema', () => {
    // Arrange
    const schema: TSchema = {type: 'string'};

    // Act
    render(<JsonSchemaFormRow jsonSchema={schema} mainSchema={mockMainSchema} onUpdateJsonSchema={mockUpdateSchema} />);

    // Assert
    expect(screen.getByText('string')).toBeInTheDocument();
    expect(screen.queryByText(/{.*}/)).not.toBeInTheDocument();
    expect(screen.queryByTestId('property-add-btn')).not.toBeInTheDocument();
  });

  test('should show type selector when type is clicked for root element', () => {
    // Arrange
    const schema: TSchema = {type: 'string'};

    // Act
    render(<JsonSchemaFormRow jsonSchema={schema} mainSchema={mockMainSchema} onUpdateJsonSchema={mockUpdateSchema} />);
    fireEvent.click(screen.getByText('string'));

    // Assert
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getAllByRole('menuitem')).toHaveLength(7);
  });

  test('should render object type with properties count and add button for root object', () => {
    // Arrange
    const schema: TSchemaObject = {
      type: 'object',
      properties: {prop1: {type: 'string'}},
    };

    // Act
    render(<JsonSchemaFormRow jsonSchema={schema} mainSchema={mockMainSchema} onUpdateJsonSchema={mockUpdateSchema} />);

    // Assert
    expect(screen.getByText('object')).toBeInTheDocument();
    expect(screen.getByText('{1}')).toBeInTheDocument();
    expect(screen.getByTestId('property-add-btn')).toBeInTheDocument();
  });

  test('should call onUpdateJsonSchema with new property when adding to root object', () => {
    // Arrange
    const schema: TSchemaObject = {type: 'object', properties: {}};

    // Act
    render(<JsonSchemaFormRow jsonSchema={schema} mainSchema={mockMainSchema} onUpdateJsonSchema={mockUpdateSchema} />);
    fireEvent.click(screen.getByTestId('property-add-btn'));

    // Assert
    expect(mockUpdateSchema).toHaveBeenCalled();
    const updatedSchema = mockUpdateSchema.mock.calls[0][0];
    expect(updatedSchema.type).toBe('object');
    expect(Object.keys(updatedSchema.properties || {})[0]).toMatch(/newProperty_\d+/);
    expect(updatedSchema.properties[Object.keys(updatedSchema.properties)[0]].type).toBe('string');
  });

  test('should render property name input and type display for nested property', () => {
    // Arrange
    const schema: TSchema = {type: 'string'};
    const parentSchema: TSchemaObject = {
      type: 'object',
      properties: {prop1: schema},
    };

    // Act
    render(
      <JsonSchemaFormRow
        jsonSchema={schema}
        mainSchema={parentSchema}
        propertyKey="prop1"
        parentPath="properties"
        onUpdateJsonSchema={mockUpdateSchema}
      />
    );

    // Assert
    expect(screen.getByDisplayValue('prop1')).toBeInTheDocument();
    expect(screen.getByText('string')).toBeInTheDocument();
    expect(screen.queryByTestId('property-add-btn')).not.toBeInTheDocument();
  });

  test('should update property name on blur for nested property', () => {
    // Arrange
    const schema: TSchema = {type: 'string'};
    const initialMainSchema: TSchemaObject = {
      type: 'object',
      properties: {
        parentObj: {
          type: 'object',
          properties: {prop1: schema},
          required: ['prop1'],
        },
      },
    };
    const finalMainSchema: TSchemaObject = {
      type: 'object',
      properties: {
        parentObj: {
          type: 'object',
          properties: {newName: schema},
          required: ['prop1'],
        },
      },
    };

    // Act
    render(
      <JsonSchemaFormRow
        jsonSchema={schema}
        mainSchema={initialMainSchema}
        propertyKey="prop1"
        parentPath="properties.parentObj.properties.prop1"
        onUpdateJsonSchema={mockUpdateSchema}
      />
    );

    const input = screen.getByDisplayValue('prop1');
    fireEvent.change(input, {target: {value: 'newName'}});
    fireEvent.blur(input);

    // Assert
    expect(mockUpdateSchema).toHaveBeenCalledWith(finalMainSchema);
  });

  test('should not update property name if unchanged or empty', () => {
    // Arrange
    const schema: TSchema = {type: 'string'};
    const parentSchema: TSchemaObject = {
      type: 'object',
      properties: {prop1: schema},
    };

    // Act & Assert - Unchanged case
    render(
      <JsonSchemaFormRow
        jsonSchema={schema}
        mainSchema={parentSchema}
        propertyKey="prop1"
        parentPath="properties"
        onUpdateJsonSchema={mockUpdateSchema}
      />
    );
    const input = screen.getByDisplayValue('prop1');
    fireEvent.change(input, {target: {value: 'prop1'}});
    fireEvent.blur(input);
    expect(mockUpdateSchema).not.toHaveBeenCalled();

    // Act & Assert - Empty case
    fireEvent.change(input, {target: {value: ''}});
    fireEvent.blur(input);
    expect(mockUpdateSchema).not.toHaveBeenCalled();
  });

  test('should update displayed property key when prop changes', () => {
    // Arrange
    const schema: TSchema = {type: 'string'};
    const parentSchema: TSchemaObject = {
      type: 'object',
      properties: {prop1: schema},
    };

    // Act
    const {rerender} = render(
      <JsonSchemaFormRow
        jsonSchema={schema}
        mainSchema={parentSchema}
        propertyKey="prop1"
        parentPath="properties"
        onUpdateJsonSchema={mockUpdateSchema}
      />
    );

    rerender(
      <JsonSchemaFormRow
        jsonSchema={schema}
        mainSchema={parentSchema}
        propertyKey="newName"
        parentPath="properties"
        onUpdateJsonSchema={mockUpdateSchema}
      />
    );

    // Assert
    expect(screen.getByDisplayValue('newName')).toBeInTheDocument();
  });

  test('should add new property to nested object schema', () => {
    // Arrange
    const nestedSchema: TSchemaObject = {
      type: 'object',
      properties: {},
    };
    const parentSchema: TSchemaObject = {
      type: 'object',
      properties: {nested: nestedSchema},
    };

    // Act
    render(
      <JsonSchemaFormRow
        jsonSchema={nestedSchema}
        mainSchema={parentSchema}
        parentPath="properties.nested"
        onUpdateJsonSchema={mockUpdateSchema}
      />
    );

    fireEvent.click(screen.getByTestId('property-add-btn'));

    // Assert
    expect(mockUpdateSchema).toHaveBeenCalled();
    const updatedSchema = mockUpdateSchema.mock.calls[0][0];
    expect(updatedSchema.properties.nested.type).toBe('object');
    expect(Object.keys(updatedSchema.properties.nested.properties || {})[0]).toMatch(/newProperty_\d+/);
  });

  test('should render action buttons on row hover', () => {
    // Arrange
    const schema: TSchema = {type: 'string'};

    // Act
    render(<JsonSchemaFormRow jsonSchema={schema} mainSchema={mockMainSchema} onUpdateJsonSchema={mockUpdateSchema} />);
    const rowHoverContainer = document.querySelector('.hover-container');
    fireEvent.mouseEnter(rowHoverContainer!);

    // Assert
    const buttons = document.querySelector('.hover-buttons')?.querySelectorAll('button');
    expect(buttons?.length).toBe(5);
  });

  test('should apply custom className prop', () => {
    // Arrange
    const schema: TSchema = {type: 'string'};

    // Act
    const {container} = render(
      <JsonSchemaFormRow
        jsonSchema={schema}
        mainSchema={mockMainSchema}
        onUpdateJsonSchema={mockUpdateSchema}
        className="test-class"
      />
    );

    // Assert
    expect(container.querySelector('.hover-container')).toHaveClass('test-class');
  });
});
