import {render, screen, waitFor} from '@testing-library/react';
import {fork} from 'effector';
import {Provider} from 'effector-react';

import {parseOpenapi} from '@/helpers/json-editor';
import {$eventGraph} from '@/models/EventGraphModel';
import {$selectedMenuItem} from '@/models/JsonEditorModel';

import {JsonSchemaForm} from '../JsonSchemaForm';

jest.mock('@/helpers/json-editor', () => {
  const actual = jest.requireActual('@/helpers/json-editor');
  return {
    ...actual,
    parseOpenapi: jest.fn(),
  };
});

describe('/src/components/jsonEditor/json-schema-form/JsonSchemaForm.tsx', () => {
  const mockSelectedMenuItem = {id: 'event-1'};
  const mockEventGraph = {
    events: [
      {
        id: 'event-1',
        schema: JSON.stringify({type: 'object', properties: {name: {type: 'string'}}}),
      },
    ],
  };

  const renderJsonSchemaForm = async (schema = '') => {
    const scope = fork({
      values: [
        [$selectedMenuItem, mockSelectedMenuItem],
        [$eventGraph, mockEventGraph],
      ],
    });

    return render(
      <Provider value={scope}>
        <JsonSchemaForm schema={schema} />
      </Provider>
    );
  };

  beforeEach(() => {
    (parseOpenapi as jest.Mock).mockImplementation(schema => {
      if (!schema) return null;
      try {
        return JSON.parse(schema);
      } catch {
        return null;
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should render skeleton when schema is empty', async () => {
    // Arrange
    const emptySchema = '';

    // Act
    await renderJsonSchemaForm(emptySchema);

    // Assert
    expect(document.querySelector('.ant-skeleton')).toBeInTheDocument();
  });

  test('should parse and render schema when provided', async () => {
    // Arrange
    const validSchema = JSON.stringify({type: 'object', properties: {name: {type: 'string'}}});

    // Act
    await renderJsonSchemaForm(validSchema);

    // Assert
    await waitFor(() => {
      expect(parseOpenapi).toHaveBeenCalledWith(validSchema);
      expect(screen.getByRole('tree')).toBeInTheDocument();
    });
  });

  test('should render correct tree structure for object schema', async () => {
    // Arrange
    const objectSchema = JSON.stringify({
      type: 'object',
      properties: {
        name: {type: 'string'},
        age: {type: 'number'},
      },
    });

    // Act
    await renderJsonSchemaForm(objectSchema);

    // Assert
    await waitFor(() => {
      const treeItems = screen.getAllByRole('treeitem');
      expect(treeItems).toHaveLength(3);

      const nodeInputs = screen.getAllByPlaceholderText('name');
      expect(nodeInputs).toHaveLength(2);

      expect(treeItems[0].textContent).toContain('object{2}');
      expect(nodeInputs[0]).toHaveValue('name');
      expect(treeItems[1].textContent).toContain(':string');
      expect(nodeInputs[1]).toHaveValue('age');
      expect(treeItems[2].textContent).toContain(':number');
    });
  });

  test('should handle invalid schema gracefully', async () => {
    // Arrange
    const invalidSchema = 'invalid';

    // Act
    await renderJsonSchemaForm(invalidSchema);

    // Assert
    expect(document.querySelector('.ant-skeleton')).toBeInTheDocument();
  });
});
